import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
import { calculateDaysLeft } from "./utils/dateUtils";

export const addItem = async (item) => {
  try {
    await addDoc(collection(db, "inventory"), item);
    console.log("Item added:", item);
  } catch (error) {
    console.error("Error adding item:", error);
  }
};

export const getItems = async () => {
  const querySnapshot = await getDocs(collection(db, "inventory"));
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
export const addItemsToFirebase = async (items) => {
  for (const item of items) {
    await addItem(item);
  }
};

// Update an existing item in Firebase
export const updateItem = async (itemId, updatedData) => {
  try {
    const itemRef = doc(db, "inventory", itemId);
    await updateDoc(itemRef, updatedData);
    console.log("Item updated:", itemId, updatedData);
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
};

// Delete an item from Firebase
export const deleteItem = async (itemId) => {
  try {
    const itemRef = doc(db, "inventory", itemId);
    await deleteDoc(itemRef);
    console.log("Item deleted:", itemId);
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
};
