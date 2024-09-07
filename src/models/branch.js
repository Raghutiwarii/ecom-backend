import mongoose from "mongoose";

const BranchSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  liveLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  address: { type: String },
  deliveryPartners: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DeliveryPartner",
  },
});

export const Branch = mongoose.model("Branch", BranchSchema);
