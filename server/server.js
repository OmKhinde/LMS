import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import { clerkMiddleware } from '@clerk/express'

//initialize express
const app = express()

 await connectDB();


 app.use(cors())
 app.use(clerkMiddleware())


//routes
app.get('/',(req,res)=>{
    res.send("api is working")
})
app.post('/clerk',express.json(),clerkWebhooks);
app.use('/api/aducator',express.json(),educatorRouter);


const PORT = process.env.PORT || 5000

app.listen(PORT , ()=>{
    console.log(`server is running on port no. ${PORT}`);
})

