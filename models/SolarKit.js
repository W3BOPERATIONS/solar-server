import mongoose from 'mongoose';

const solarKitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: true
    },
    products: [{
        type: String
    }],
    bom: [{
        title: String,
        items: [{
            name: String,
            qty: String,
            unit: String
        }]
    }],
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
});

const SolarKit = mongoose.model('SolarKit', solarKitSchema);

export default SolarKit;
