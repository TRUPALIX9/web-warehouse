// src/models/Inventory.ts
import mongoose from 'mongoose';

const InventorySchema = new mongoose.Schema(
  {
    "SKU NUMBER": { type: String, required: true },
    DESCRIPTION: { type: String, required: true },
    INVENTORY: { type: Number, required: true },
    "Height (in)": { type: Number, required: true },
    "Width (in)": { type: Number, required: true },
    "Weight (lb)": { type: Number, required: true },
  },
  { timestamps: true }
);

const Inventory = mongoose.models.Inventory || mongoose.model('Inventory', InventorySchema);

export default Inventory;
