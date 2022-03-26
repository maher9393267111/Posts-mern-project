
import express from 'express';
import mongoose from 'mongoose';

import bodyParser from 'body-parser';
import cors from "cors";

const app = express();

app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());

import postRoutes from './routes/posts.js';
import userRoutes from  './routes/user.js'


app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());

app.use('/posts', postRoutes);
app.use('/user',userRoutes)



const CONNECTION_URL = 'mongodb+srv://maher:maher9326@cluster0.nf63j.mongodb.net/posts-project?retryWrites=true&w=majority';
// const PORT = process.env.PORT|| 5000;




mongoose
    .connect( CONNECTION_URL, {
        useNewUrlParser: true,
     
    })
    .then(() => console.log('DB Connected'));


//PORT 


const PORT = process.env.PORT || 5000
app.listen(PORT, () =>{
    console.log('Server is running on port', PORT)
})





// mongoose.connect(CONNECTION_URL)
//   .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
//   .catch((error) => console.log(`${error} did not connect`));

