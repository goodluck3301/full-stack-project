import mongoose from "mongoose";

const PostScheme = new mongoose.Schema({
        title: {
            type:String,
            required:true,
        },
        text: {
            type:String,
            required:true,
            unique:true
        },
        tags: {
            type:Array,
            default: [],
        },
        viewsCount: {
            type:Number,
            default: 0,
        },
        user: {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required:true
        },
        comment: [{
            user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User',
              required: true
            },
            text: {
              type: String,
              required: true
            },
            createdAt: {
              type: Date,
              default: Date.now
            }
        }],
        imageUrl: String,
    },  
    {
        timestamps:true,
    },
)

export default mongoose.model('Post', PostScheme)