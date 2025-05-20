// models/Warehouse.js
import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  }
}, { timestamps: true });

warehouseSchema.index({ location: "2dsphere" }); // For geospatial queries

export default mongoose.model("Warehouse", warehouseSchema);
