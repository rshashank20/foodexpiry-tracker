const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Get Firestore instance
const db = admin.firestore();

/**
 * Test HTTP function to verify deployment works
 */
exports.testFunction = functions.https.onRequest((req, res) => {
  res.json({ message: 'Firebase Functions are working!', timestamp: new Date().toISOString() });
});

/**
 * Scheduled function that runs daily to check for items expiring within 1 day
 * Function name: checkExpiringItems
 * Schedule: Every 24 hours
 */
exports.checkExpiringItems = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  console.log('Starting daily expiry check...');
  
  try {
    // Calculate tomorrow's date in YYYY-MM-DD format
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];
    
    console.log(`Checking for items expiring on: ${tomorrowString}`);
    
    // Query Firestore for items expiring tomorrow
    const inventoryRef = db.collection('inventory');
    const snapshot = await inventoryRef.where('expiry_date', '==', tomorrowString).get();
    
    if (snapshot.empty) {
      console.log('No items expiring tomorrow found.');
      return null;
    }
    
    // Log reminders for each expiring item
    const reminders = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const itemName = data.item_name || data.name || 'Unknown Item';
      const reminder = `Reminder: ${itemName} expires tomorrow`;
      
      console.log(reminder);
      reminders.push({
        itemId: doc.id,
        itemName: itemName,
        expiryDate: data.expiry_date,
        quantity: data.quantity || 'Unknown quantity'
      });
    });
    
    console.log(`Found ${reminders.length} items expiring tomorrow:`);
    reminders.forEach(reminder => {
      console.log(`- ${reminder.itemName} (${reminder.quantity}) expires on ${reminder.expiryDate}`);
    });
    
    // Return summary for logging
    return {
      success: true,
      expiringItemsCount: reminders.length,
      expiringItems: reminders,
      checkDate: tomorrowString
    };
    
  } catch (error) {
    console.error('Error checking expiring items:', error);
    throw new functions.https.HttpsError('internal', 'Failed to check expiring items', error);
  }
});

/**
 * Optional: Function to check items expiring within a custom number of days
 * Can be called manually or scheduled differently
 */
exports.checkExpiringItemsCustom = functions.https.onCall(async (data, context) => {
  const daysAhead = data.daysAhead || 1; // Default to 1 day
  
  try {
    // Calculate target date
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);
    const targetDateString = targetDate.toISOString().split('T')[0];
    
    console.log(`Checking for items expiring in ${daysAhead} day(s) on: ${targetDateString}`);
    
    // Query Firestore
    const inventoryRef = db.collection('inventory');
    const snapshot = await inventoryRef.where('expiry_date', '==', targetDateString).get();
    
    const reminders = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const itemName = data.item_name || data.name || 'Unknown Item';
      reminders.push({
        itemId: doc.id,
        itemName: itemName,
        expiryDate: data.expiry_date,
        quantity: data.quantity || 'Unknown quantity'
      });
    });
    
    return {
      success: true,
      expiringItemsCount: reminders.length,
      expiringItems: reminders,
      checkDate: targetDateString,
      daysAhead: daysAhead
    };
    
  } catch (error) {
    console.error('Error in custom expiry check:', error);
    throw new functions.https.HttpsError('internal', 'Failed to check expiring items', error);
  }
});
