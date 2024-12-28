import mongoose from 'mongoose';

export default async function dbConnect() {
    try {
        const { connection } = await mongoose.connect(
            process.env.MONGO_URI!,
            {}
        );

        if (connection.readyState === 1) {
            return Promise.resolve(true);
        }

        console.log('Database connected successfully.');
    } catch (error) {
        console.error(error);
        return Promise.reject(error);
    }
}
