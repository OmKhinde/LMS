import mongoose, { model, mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    _id:{type: String ,required: true},
    name:{type: String ,required: false, default: ''},
    email:{type: String ,required: false, default: ''},
    imageUrl:{type: String ,required: false, default: ''},
    enrolledCourses:[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Course'
        }
    ]
},{timestamps: true});

const User = mongoose.model('User',userSchema);

export default User;