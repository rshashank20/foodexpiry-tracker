import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { db, app } from "./firebase";
import { calculateDaysLeft } from "./utils/dateUtils";

// Helper function to get user-specific collection path
const getUserInventoryPath = (userId) => `users/${userId}/inventory`;

export const addItem = async (item, userId) => {
  if (!userId) {
    throw new Error("User must be authenticated to add items");
  }
  try {
    await addDoc(collection(db, getUserInventoryPath(userId)), item);
    console.log("Item added:", item);
  } catch (error) {
    console.error("Error adding item:", error);
    throw error;
  }
};

export const getItems = async (userId) => {
  if (!userId) {
    throw new Error("User must be authenticated to get items");
  }
  const querySnapshot = await getDocs(collection(db, getUserInventoryPath(userId)));
  const items = [];
  querySnapshot.forEach((doc) => {
    const itemData = doc.data();
    // Calculate days left for each item
    const daysLeft = calculateDaysLeft(itemData.expiryDate);
    items.push({ 
      id: doc.id, 
      ...itemData,
      daysLeft: daysLeft
    });
  });
  return items;
};

// Export the GetInventory action for use in components
export { GetInventory, GetInventoryWithMetadata } from './actions/inventoryActions';

// Helper function to add multiple items to Firebase
export const addItemsToFirebase = async (items, userId) => {
  for (const item of items) {
    await addItem(item, userId);
  }
};

// Update an existing item in Firebase
export const updateItem = async (itemId, updatedData, userId) => {
  if (!userId) {
    throw new Error("User must be authenticated to update items");
  }
  try {
    const itemRef = doc(db, getUserInventoryPath(userId), itemId);
    await updateDoc(itemRef, updatedData);
    console.log("Item updated:", itemId, updatedData);
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
};

// Delete an item from Firebase
export const deleteItem = async (itemId, userId) => {
  if (!userId) {
    throw new Error("User must be authenticated to delete items");
  }
  try {
    const itemRef = doc(db, getUserInventoryPath(userId), itemId);
    await deleteDoc(itemRef);
    console.log("Item deleted:", itemId);
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
};

// Call the Cloud Function to check expiring items within a custom number of days
export const checkExpiringItemsInDays = async (daysAhead = 1) => {
  try {
    const functions = getFunctions(app);
    const callable = httpsCallable(functions, "checkExpiringItemsCustom");
    const result = await callable({ daysAhead });
    return result.data;
  } catch (error) {
    console.error("Error calling checkExpiringItemsCustom:", error);
    throw error;
  }
};
