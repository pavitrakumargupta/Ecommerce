// controllers/warehouseController.js
import Warehouse from "../models/Warehouse.js";

export const createWarehouse = async (req, res) => {
  try {
    const { name, address, location } = req.body;
    if (!name || !location?.coordinates) {
      return res.status(400).json({ message: "Name and coordinates required" });
    }

    const warehouse = new Warehouse({
      name,
      address,
      location: {
        type: "Point",
        coordinates: location.coordinates,
      },
    });

    await warehouse.save();
    res.status(201).json({ message: "Warehouse created", warehouse });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const getAllWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find({});
    res.status(200).json(warehouses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch warehouses", error: err.message });
  }
};
