// models/Party.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IParty extends Document {
  name: string;
  contact_info: {
    phone?: string;
    email?: string;
  };
  address: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
  };
  isVendor: boolean;
}

const PartySchema = new Schema<IParty>({
  name: { type: String, required: true },
  contact_info: {
    phone: String,
    email: String,
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postal_code: String,
  },
  isVendor: { type: Boolean, required: true },
});

export default mongoose.models.Party ||
  mongoose.model<IParty>("Party", PartySchema);
