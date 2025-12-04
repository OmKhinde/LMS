import {Webhook} from 'svix';
import User from '../models/User.js';
import Stripe from 'stripe';
import { Purchase } from '../models/Purchase.js';
import Course from '../models/Course.js';

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
                // update user from clerk webhook
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

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

// Stripe webhook handler - completely rewritten
export const stripeWebhooks = async (req, res) => {
    console.log('\n🎯 === STRIPE WEBHOOK RECEIVED ===');
    console.log('🔧 Request method:', req.method);
    console.log('🔧 Request URL:', req.url);
    console.log('🔧 Request headers:', Object.keys(req.headers));
    console.log('🔧 Content-Type:', req.headers['content-type']);
    console.log('🔧 User-Agent:', req.headers['user-agent']);
    
    const sig = req.headers['stripe-signature'];
    const body = req.body;
    
    console.log('🔐 Signature present:', !!sig);
    console.log('� Signature value:', sig ? sig.substring(0, 50) + '...' : 'None');
    console.log('�📦 Body type:', typeof body);
    console.log('📦 Body length:', body ? body.length : 0);
    console.log('📦 Body is Buffer:', Buffer.isBuffer(body));
    
    // If this is just a test request (no signature), return a test response
    if (!sig) {
        // No signature: likely a test or misconfigured request
        return res.json({ message: 'Webhook endpoint is working' });
    }
    
    if (!body) {
        console.error('No request body received');
        return res.status(400).send('No request body');
    }
    
    let event;
    
    try {
        event = stripeInstance.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        
    } catch (err) {
        console.error('Signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                // Stripe checkout session completed directly
                const session = event.data.object;
                const purchaseId = session?.metadata?.purchaseId;

                console.log('🔔 checkout.session.completed received, session id:', session?.id, 'purchaseId:', purchaseId);

                if (purchaseId) {
                    const purchaseData = await Purchase.findById(purchaseId);
                    if (purchaseData) {
                        const userData = await User.findById(purchaseData.userId);
                        const courseData = await Course.findById(purchaseData.courseId);

                        // Update purchase status and stripeSessionId
                        await Purchase.findByIdAndUpdate(purchaseId, { status: 'completed', stripeSessionId: session.id });

                        // Enroll user
                        if (courseData && !courseData.enrolledStudents.includes(purchaseData.userId)) {
                            courseData.enrolledStudents.push(purchaseData.userId);
                            await courseData.save();
                        }

                        if (userData && !userData.enrolledCourses.includes(purchaseData.courseId)) {
                            userData.enrolledCourses.push(purchaseData.courseId);
                            await userData.save();
                        }
                    }
                }

                break;
            }
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object;
                const paymentIntentId = paymentIntent.id;
                
                // Get the checkout session associated with this payment intent
                const sessions = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId
                });
                
                if (sessions.data.length > 0) {
                    const session = sessions.data[0];
                    const { purchaseId } = session.metadata;
                    
                    if (purchaseId) {
                        // Get purchase data
                        const purchaseData = await Purchase.findById(purchaseId);
                        const userData = await User.findById(purchaseData.userId);
                        const courseData = await Course.findById(purchaseData.courseId);
                        
                        console.log('📚 Processing enrollment for:');
                        console.log('- User:', userData?.name, '(ID:', purchaseData.userId, ')');
                        console.log('- Course:', courseData?.courseTitle, '(ID:', purchaseData.courseId, ')');
                        console.log('- Purchase ID:', purchaseId);
                        
                        // Update purchase status
                        await Purchase.findByIdAndUpdate(purchaseId, {
                            status: 'completed',
                            stripeSessionId: session.id
                        });
                        
                        // Enroll user in course
                        if (!courseData.enrolledStudents.includes(purchaseData.userId)) {
                            courseData.enrolledStudents.push(purchaseData.userId);
                            await courseData.save();
                            // Added user to course enrolledStudents
                        } else {
                            // User already enrolled
                        }
                        
                        // Add course to user's enrolled courses - Keep as ObjectId, don't convert to string
                        if (!userData.enrolledCourses.includes(purchaseData.courseId)) {
                            userData.enrolledCourses.push(purchaseData.courseId);
                            await userData.save();
                            console.log('✅ Added course to user enrolledCourses');
                        } else {
                            console.log('ℹ️ Course already in user enrolledCourses');
                        }
                        
                        console.log('✅ User enrolled successfully');
                    }
                }
                break;
            }
            
            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object;
                const paymentIntentId = paymentIntent.id;
                console.log(`❌ Payment failed: ${paymentIntentId}`);
                
                // Get the checkout session associated with this payment intent
                const sessions = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId
                });

                if (sessions.data.length > 0) {
                    const { purchaseId } = sessions.data[0].metadata;
                    
                    if (purchaseId) {
                        // Update purchase status to failed
                        await Purchase.findByIdAndUpdate(purchaseId, {
                            status: 'failed'
                        });
                        console.log('✅ Purchase status updated to failed');
                    }
                }
                break;
            }
            
            default:
                console.log(`ℹ️ Unhandled event type: ${event.type}`);
        }
        
        console.log('🎉 Webhook processed successfully');
        res.json({ received: true, eventType: event.type });
        
    } catch (error) {
        console.error('Error processing webhook:', error.message);
        console.error(error.stack);
        res.status(500).send(`Error processing webhook: ${error.message}`);
    }
    
}