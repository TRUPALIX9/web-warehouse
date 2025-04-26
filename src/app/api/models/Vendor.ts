import mongoose, { Document, Schema } from 'mongoose';

export interface IVendor extends Document {
  name: string;
  contact_info: {
    phone?: string;
    email?: string;
    website?: string;
  };
  address: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
  };
  tax_id?: string;
  registration_number?: string;
  payment_terms?: string;
  customer_type?: string;
  preferred_shipping_method?: string;
  credit_limit?: number;
  notes?: string;
  is_active: boolean;
  created_at: Date;
}

const VendorSchema = new Schema<IVendor>({
  name: { type: String, required: true },
  contact_info: {
    phone: String,
    email: String,
    website: String,
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postal_code: String,
  },
  tax_id: String,
  registration_number: String,
  payment_terms: String,
  customer_type: String,
  preferred_shipping_method: String,
  credit_limit: Number,
  notes: String,
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.models.Vendor || mongoose.model<IVendor>('Vendor', VendorSchema);
