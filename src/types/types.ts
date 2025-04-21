// src/types.ts
export interface InventoryItem {
    _id: string;                // The unique ID of the item
    "SKU NUMBER": string;       // SKU number of the item
    DESCRIPTION: string;        // Description of the item
    INVENTORY: number;          // Inventory quantity
    "Height (in)": number;      // Height of the item in inches
    "Width (in)": number;       // Width of the item in inches
    "Weight (lb)": number;      // Weight of the item in pounds
  }
  