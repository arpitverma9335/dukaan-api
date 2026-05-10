import { connect, Mongoose } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config()

class DBConnect {
    // Using the built-in Mongoose type instead of 'typeof import'
    private dbConnection: Promise<Mongoose>;

    constructor() {
        this.dbConnection = this.connectToDatabase();
    }

    private async connectToDatabase(): Promise<Mongoose> {
        const uri = process.env.MONGODB_URI || '';
        
        try {
            const db = await connect(uri);
            console.log('MongoDB connection established');
            return db;
        } catch (error: any) {
            console.error('Error connecting to MongoDB:', error);
            // Throwing allows the caller to handle the failure (e.g., crashing the server)
            throw new Error(error?.message || 'Failed to connect to the database');
        }
    }

    public getConnectionObject(): Promise<Mongoose> {
        return this.dbConnection;
    }
}

const dbInstance = new DBConnect();
export { dbInstance };