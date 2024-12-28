import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    email: string;
    password: string;
    role: string;
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
});

const UserModel =
    mongoose.models?.User || mongoose.model<IUser>('User', UserSchema);

export default UserModel;
