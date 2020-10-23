import express from 'express';
import mongoose from 'mongoose';

const state = {};

try {
    mongoose.connect(process.env.MONGO_IP);
} catch (err) {
    throw err;
}
const db = mongoose.connection;
db.on('error', console.error(err));
db.once('open', initModel());

const initModel = () => {
    state.productSchema = new mongoose.Schema({
        name: String,
        slogan: String,
        desc: String,
        category: String,
        defaultPrice: Number,
        styles: [{
            name: String,
            price: Number,
            salePrice: Number,
            salePrice: Number,
            photos: [{
                url: String,
                thumbnail: String,
            }],
            skus: [{
                size: String,
                amount: Number,
            }],

        }],
    });
    initExpress();
}

const initExpress = () => {
    const app = express();

    app.route('/products/:id')
        .get([], (req, res) => {
    
        })
}
