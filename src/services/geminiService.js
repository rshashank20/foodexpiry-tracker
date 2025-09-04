// Gemini API service using direct fetch approach
export const sendToGemini = async (file) => {
  try {
    // Check if API key is available
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    console.log('Processing file:', file.name, 'Type:', file.type);
    
    // Convert file to base64
    const imageData = await fileToBase64(file);
    console.log('Image converted to base64, length:', imageData.length);
    
    // Create the request payload
    const payload = {
      contents: [{
        parts: [
          {
            text: `Analyze this image and extract food items with the following information:
            1. Item name
            2. Quantity/amount
            3. Expiry date (if visible)
            
            Return the data in JSON format as an array of objects with these EXACT fields:
            - item_name: string (the name of the food item)
            - quantity: string (amount/quantity of the item)
            - expiry_date: string (format: YYYY-MM-DD, or "unknown" if not visible)
            
            If no expiry date is visible, estimate based on the food type and typical shelf life.
            Be as accurate as possible with the information you can see.
            
            Example response:
            [
              {
                "item_name": "Milk",
                "quantity": "1 liter",
                "expiry_date": "2024-01-15"
              }
            ]`
          },
          {
            inlineData: {
              data: imageData,
              mimeType: file.type
            }
          }
        ]
      }]
    };

    console.log('Sending request to Gemini API...');
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Raw API response:', data);
    
    const result = parseGeminiResponse(data);
    console.log('Parsed result:', result);
    
    return result;
    
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    // If API is not enabled, show clear instructions
    if (error.message.includes('403') || error.message.includes('PERMISSION_DENIED')) {
      const errorMessage = `Generative Language API is not enabled. Please enable it at: https://console.developers.google.com/apis/api/generativelanguage.googleapis.com/overview?project=900968441092`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
    
    throw new Error(`Failed to extract food items from image: ${error.message}`);
  }
};

// Parse the response from Gemini API
const parseGeminiResponse = (data) => {
  try {
    console.log('=== PARSING GEMINI RESPONSE ===');
    console.log('Full response data:', JSON.stringify(data, null, 2));

    // Check for errors in the response
    if (data.error) {
      console.error('Gemini API returned an error:', data.error);
      throw new Error(data.error.message || 'API returned an error');
    }

    // Check if we have candidates
    if (!data.candidates || data.candidates.length === 0) {
      console.error('No candidates in response:', data);
      return [{
        item_name: 'Unknown Item',
        quantity: '1',
        expiry_date: 'unknown'
      }];
    }

    // Extract text from Gemini API response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error('No text found in Gemini response. Full structure:', data);
      console.error('Candidates structure:', data.candidates[0]);
      return [{
        item_name: 'Unknown Item',
        quantity: '1',
        expiry_date: 'unknown'
      }];
    }

    console.log('Extracted text from response:', text);
    console.log('Text length:', text.length);

    // Try to parse as JSON
    try {
      // Clean the text to extract JSON
      let jsonText = text.trim();
      console.log('Cleaned text for JSON parsing:', jsonText);

      // Look for JSON array or object in the text
      const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
        console.log('Found JSON array match:', jsonText);
      }

      const parsed = JSON.parse(jsonText);
      const items = Array.isArray(parsed) ? parsed : [parsed];

      console.log('Successfully parsed JSON:', items);
      console.log('Number of items found:', items.length);

      // Transform items to match the expected format
      const transformedItems = items.map(item => ({
        item_name: item.item_name || item.name || 'Unknown Item',
        quantity: item.quantity || '1',
        expiry_date: item.expiry_date || item.expiryDate || item.expiry || estimateExpiry(item.item_name || item.name)
      }));

      console.log('Transformed items:', transformedItems);
      console.log('=== PARSING COMPLETE ===');
      return transformedItems;

    } catch (parseError) {
      console.error('Error parsing Gemini JSON response:', parseError);
      console.log('Raw text that failed to parse:', text);

      // Fallback: try to extract items from text response
      const fallbackItems = extractItemsFromText(text);
      console.log('Fallback extraction result:', fallbackItems);
      console.log('=== FALLBACK PARSING COMPLETE ===');
      return fallbackItems;
    }

  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    console.log('=== PARSING FAILED ===');
    return [{
      item_name: 'Unknown Item',
      quantity: '1',
      expiry_date: 'unknown'
    }];
  }
};

// Estimate expiry date based on item name
const estimateExpiry = (itemName) => {
  const shelfLife = {
    "bread": 3,
    "milk": 5,
    "eggs": 21,
    "yogurt": 7,
    "cheese": 14,
    "chicken": 3,
    "beef": 3,
    "fish": 2,
    "bananas": 5,
    "apples": 14,
    "lettuce": 7,
    "tomatoes": 5,
    "carrots": 14,
    "onions": 30,
    "potatoes": 30
  };
  
  const today = new Date();
  const daysToAdd = shelfLife[itemName?.toLowerCase()] || 7;
  today.setDate(today.getDate() + daysToAdd);
  return today.toISOString().split('T')[0]; // YYYY-MM-DD
};

// Alias for backward compatibility
export const extractFoodItemsFromImage = async (imageFile) => {
  return await sendToGemini(imageFile);
};

// Helper function to convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]; // Remove data:image/...;base64, prefix
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

// Fallback function to extract items from text if JSON parsing fails
const extractItemsFromText = (text) => {
  // This is a simple fallback - you might want to improve this
  const lines = text.split('\n').filter(line => line.trim());
  const items = [];
  
  lines.forEach(line => {
    if (line.includes('name:') || line.includes('item:')) {
      items.push({
        item_name: line.split(':')[1]?.trim() || 'Unknown Item',
        quantity: '1',
        expiry_date: 'unknown'
      });
    }
  });
  
  return items.length > 0 ? items : [{
    item_name: 'Unknown Item',
    quantity: '1',
    expiry_date: 'unknown'
  }];
};
