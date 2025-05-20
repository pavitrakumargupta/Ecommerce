import Warehouse from "../models/Warehouse.js";
import Product from "../models/Product.js";


export const createProduct = async (req, res) => {
  try {
    const { warehouseId, name, quantity, price } = req.body;

    if (!warehouseId || !name || quantity == null || price == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = new Product({
      warehouseId,
      name,
      quantity,
      price,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProductsByWarehouse = async (req, res) => {
  try {
    const { warehouseId } = req.query;

    if (!warehouseId) {
      return res.status(400).json({ message: "warehouseId is required" });
    }

    const products = await Product.find({ warehouseId }).populate("warehouseId", "name");

    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products by warehouse:", err);
    res.status(500).json({ message: "Error fetching products" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById(productId).populate("warehouseId", "name");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, quantity, price } = req.body;

    if (!name || quantity == null || price == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, quantity, price },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProductsByNearestWarehouse = async (req, res) => {
  try {
    const { lat, lng, search } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    const nearbyWarehouses = await Warehouse.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
        },
      },
    });

    if (!nearbyWarehouses.length) {
      return res.status(404).json({ message: "No nearby warehouses found" });
    }

    for (const warehouse of nearbyWarehouses) {
      const query = { warehouseId: warehouse._id };

      if (search) {
        query.name = { $regex: search, $options: "i" };
      }

      const products = await Product.find(query).populate("warehouseId", "name address location");

      if (products.length > 0) {
        // First warehouse that matches the product
        return res.status(200).json([
          {
            warehouse: {
              id: warehouse._id,
              name: warehouse.name,
              address: warehouse.address,
              location: warehouse.location,
            },
            products,
          },
        ]);
      }

      // If search is empty (just show first warehouse with any products)
      if (!search) {
        break;
      }
    }

    return res.status(404).json({ message: "No matching products found in nearby warehouses" });

  } catch (err) {
    console.error("Error in getProductsByNearestWarehouse:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getLowStockProducts = async (req, res) => {
  try {
    const lowStockProducts = await Product.find({ quantity: { $lt: 3 } }).populate("warehouseId", "name address");

    if (lowStockProducts.length === 0) {
      return res.status(404).json({ message: "No low stock products found" });
    }

    res.status(200).json(lowStockProducts);
  } catch (err) {
    console.error("Error fetching low stock products:", err);
    res.status(500).json({ message: "Server error" });
  }
};


