import { Schema, model } from "mongoose";

interface IAddress {
    userId: Schema.Types.ObjectId;
    name: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
}

const AddressSchema = new Schema<IAddress>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zip: { type: String, required: true }
});

export const Address = model<IAddress>('Address', AddressSchema);