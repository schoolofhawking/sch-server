import mongoose from 'mongoose'
const {Schema} = mongoose;

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            trim: true,
            required: true
        }
    },
    {timestamps:true}
);

export default mongoose.model('User', userSchema);