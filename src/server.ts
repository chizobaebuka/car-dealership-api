import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectDB from './config/db';
// import './models/user.model'; // Import models explicitly to ensure they are registered

export const PORT = process.env.PORT || 4404;

const startServer = async () => {
    try {
        await connectDB(); // Connect to MongoDB
        console.log('Models synced successfully'); // Add a log to confirm model registration
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`Swagger docs at http://localhost:${PORT}/api-doc`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1); // Exit the process if the server fails to start
    }
};

startServer();