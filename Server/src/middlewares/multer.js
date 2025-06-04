import multer from "multer";

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage }); // Create multer instance with memory storage

export default upload; // Export the multer instance for use in routes
