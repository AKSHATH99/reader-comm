import mongoose, { Document, Schema } from "mongoose";


export interface Admin extends Document {
  username: string;
  password: string;
}


const AdminSchema: Schema<Admin> = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});


const AdminModel = mongoose.models.Admin || mongoose.model<Admin>("Admin", AdminSchema);

export default AdminModel;




