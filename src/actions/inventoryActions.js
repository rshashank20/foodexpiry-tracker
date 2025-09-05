import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";

// Helper function to get user-specific collection path
const getUserInventoryPath = (userId) => `users/${userId}/inventory`;

/**
 * GetInventory Action
 * Fetches all items from user's Firebase inventory collection
 * Returns an array of items with fields: item_name, quantity, expiry_date
 */
export const GetInventory = async (userId) => {
  if (!userId) {
    throw new Error("User must be authenticated to get inventory");
  }
  
  try {
    // Get reference to the user's inventory collection
    const inventoryRef = collection(db, getUserInventoryPath(userId));
    
    // Fetch all documents from the collection
    const querySnapshot = await getDocs(inventoryRef);
    
    // Transform the data to match the required format
    const items = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      items.push({
        id: doc.id, // Include document ID for reference
        item_name: data.name || data.item_name || 'Unknown Item',
        quantity: data.quantity || '1',
        expiry_date: data.expiryDate || data.expiry_date || 'unknown'
      });
    });
    
    console.log(`GetInventory: Retrieved ${items.length} items from Firebase for user ${userId}`);
    return items;
    
  } catch (error) {
    console.error('GetInventory Error:', error);
    throw new Error('Failed to fetch inventory items');
  }
};

/**
 * GetInventoryWithMetadata Action
 * Enhanced version that includes additional metadata for UI display
 */
export const GetInventoryWithMetadata = async (userId) => {
  if (!userId) {
    throw new Error("User must be authenticated to get inventory");
  }
  
  try {
    const inventoryRef = collection(db, getUserInventoryPath(userId));
    const querySnapshot = await getDocs(inventoryRef);
    
    const items = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      items.push({
        id: doc.id,
        item_name: data.name || data.item_name || 'Unknown Item',
        quantity: data.quantity || '1',
        expiry_date: data.expiryDate || data.expiry_date || 'unknown',
        category: data.category || 'unknown',
        added_at: data.addedAt || data.added_at,
        status: data.status || 'active'
      });
    });
    
    // Calculate daysLeft for each item using your exact formula
    items.forEach(item => {
      const today = new Date();
      const expiry = new Date(item.expiry_date);
      item.daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    });
    
    console.log(`GetInventoryWithMetadata: Retrieved ${items.length} items with metadata for user ${userId}`);
    return items;
    
  } catch (error) {
    console.error('GetInventoryWithMetadata Error:', error);
    throw new Error('Failed to fetch inventory items with metadata');
  }
};
