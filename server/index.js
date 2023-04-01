const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const cloudinary = require('cloudinary');
const fileUpload = require('express-fileupload');
dotenv.config();
const PORT = process.env.PORT || 5000;

const userRouter = require('./routes/user.js');
const timelineRouter = require('./routes/timeline.js');
const threadRouter = require('./routes/thread.js');
const eventRouter = require('./routes/event.js');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-Requested-With, Content-Type, Authorization'
    );
    next();
});
app.use(express.json({ limit: '10MB' }));
app.use(fileUpload());

app.use('/api/user', userRouter);
app.use('/api/timeline', timelineRouter);
app.use('/api/thread', threadRouter);
app.use('/api/event', eventRouter);

app.get('/', (req, res) => {
    res.send('Hello, welocme to timethreads API');
});
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
mongoose.set('strictQuery', false);
mongoose
    .connect(process.env.CONNECTION_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected successfully'))
    .catch((error) => console.log(`${error} did not connect`));

app.listen(PORT, () =>
    console.log(
        'Hello! This is timethreads backend, listening on port - ',
        PORT
    )
);
