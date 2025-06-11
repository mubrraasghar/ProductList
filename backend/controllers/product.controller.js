import mongoose from "mongoose";
import Product from "../models/product.models.js";

// GET all products
export const getProducts = async (req, res) => {
	try {
		const products = await Product.find({});
		res.status(200).json({ success: true, data: products });
	} catch (error) {
		console.error("Error in fetching products:", error.message);
		res.status(500).json({ success: false, message: "Server Error", error: error.message });
	}
};

// CREATE a new product
export const createProduct = async (req, res) => {
	const product = req.body;

	if (!product.name || !product.price || !product.image) {
		return res.status(400).json({
			success: false,
			message: "Please provide all fields",
		});
	}

	try {
		const newProduct = new Product(product);
		await newProduct.save();

		res.status(201).json({
			success: true,
			message: "Product created successfully",
			data: newProduct,
		});
	} catch (error) {
		console.error("Error in creating product:", error.message);
		res.status(500).json({
			success: false,
			message: "Failed to create product",
			error: error.message,
		});
	}
};

// UPDATE a product
export const updateProduct = async (req, res) => {
	const { id } = req.params;
	const product = req.body;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Product ID" });
	}

	try {
		const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });

		res.status(200).json({
			success: true,
			message: "Product updated successfully",
			data: updatedProduct,
		});
	} catch (error) {
		console.error("Error in updating product:", error.message);
		res.status(500).json({
			success: false,
			message: "Failed to update product",
			error: error.message,
		});
	}
};

// DELETE a product
export const deleteProduct = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Product ID" });
	}

	try {
		await Product.findByIdAndDelete(id);

		res.status(200).json({
			success: true,
			message: "Product deleted successfully",
		});
	} catch (error) {
		console.error("Error in deleting product:", error.message);
		res.status(500).json({
			success: false,
			message: "Failed to delete product",
			error: error.message,
		});
	}
};
