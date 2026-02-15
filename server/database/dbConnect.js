const mongoose = require('mongoose');
const url = process.env.MONGO_URL;

const dbConnect = async () =>
{
    try {
        mongoose.connect(url);
        console.log("Mongodb connected");
    }
    catch (error)
    {
        console.log("Mongodb not connected");
    }
}
module.exports = dbConnect;