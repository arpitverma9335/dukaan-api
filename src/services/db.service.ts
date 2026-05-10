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
        } catch (error) {
            throw error;
        }
    }

    public getConnectionObject(): Promise<Mongoose> {
        return this.dbConnection;
    }
}

const dbInstance = new DBConnect();
export { dbInstance };