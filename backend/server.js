import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.route.js";

// Load environment variables
dotenv.config({ path: './.env' });

const app = express();
const PORT = 5000;  // Set to port 5000

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // allows us to accept JSON data in the req.body

// API Routes
app.use("/api/products", productRoutes);

// Root route for API check
app.get("/api", (req, res) => {
	res.json({ message: "API is running..." });
});

// Serve static files from the frontend/dist directory
const frontendPath = path.join(__dirname, "..", "frontend", "dist");
console.log("Frontend path:", frontendPath);

// Check if the frontend build exists
if (!existsSync(frontendPath)) {
	console.error("Frontend build directory not found at:", frontendPath);
} else {
	console.log("Frontend build directory found");
}

// Serve static files
app.use(express.static(frontendPath));

// Handle all other routes by serving the index.html
app.get('/*', (req, res) => {
	console.log("Serving index.html for path:", req.path);
	res.sendFile(path.join(frontendPath, "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ success: false, message: "Something went wrong!" });
});

// Start server
const startServer = async () => {
    try {
        await connectDB();
        const server = app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });

        // Handle server errors
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`Port ${PORT} is already in use. Please close any other applications using this port.`);
                process.exit(1);
            } else {
                console.error('Server error:', error);
            }
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();



