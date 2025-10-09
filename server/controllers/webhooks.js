import {Webhook} from 'svix';
import User from '../models/User.js';

//api controller function to manage clerk user with database

export const clerkWebhooks = async(req,res)=>{
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
        await whook.verify(JSON.stringify(req.body), {
            "svix-id"  : req.headers["svix-id"],
            "svix-timestamp" : req.headers["svix-timestamp"],
            "svix-signature" : req.headers["svix-signature"],
        })

        const {data, type} = req.body;
        
        // Debug logging
        console.log("Webhook Type:", type);
        console.log("Webhook Data:", JSON.stringify(data, null, 2));

        switch(type) {
            case "user.created" : {
                const userData = {
                    _id : data.id || data._id,  // Clerk uses 'id', not '_id'
                    email : data.email_addresses?.[0]?.email_address || '',
                    name : (data.first_name || '') + " " + (data.last_name || ''),
                    imageUrl : data.image_url || '',
                }

                console.log("Creating user with data:", userData);
                await User.create(userData)
                res.json({success: true})
                break;
            }

            case "user.updated" : {
               const userData = {
                    email : data.email_addresses?.[0]?.email_address || '',
                    name : (data.first_name || '') + " " + (data.last_name || ''),
                    imageUrl : data.image_url || '',
                }
                console.log("Updating user with data:", userData);
                await User.findByIdAndUpdate(data.id || data._id, userData)
                res.json({success: true})
                break ;
            }

            case "user.deleted" : {
                console.log("Deleting user with ID:", data.id || data._id);
                await User.findByIdAndDelete(data.id || data._id)
                res.json({success: true})
                break;
            }

              default : 
                    console.log("Unknown webhook type:", type);
                    res.json({success: false, message: "Unknown webhook type"})
                    break
        }
    } catch (error) {
        console.error("Webhook error:", error);
        res.json({success : false , message : error.message})
    }
}