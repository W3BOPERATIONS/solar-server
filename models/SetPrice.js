import mongoose from 'mongoose';

const setPriceSchema = new mongoose.Schema(
    {
        productType: {
            type: String,
            required: true,
            enum: ['Solar Panel', 'Inverter', 'Battery', 'Solar Water Heater', 'Solar Street Light', 'Solar Pump']
        },
        // Linking to other models for normalization if needed, but keeping text for flexibility as per requirement
        // In a strict relational model we would use ObjectIds, but based on the frontend it seems to use strings heavily.
        // However, to be "fully dynamic" and "database driven", we should try to link where possible. 
        // The requirement says "productId / serviceId".
        // I will add both references and fallback strings to support the existing frontend filters.

        brand: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        subCategory: {
            type: String,
            required: true
        },
        projectType: {
            type: String,
            required: true
        },
        subProjectType: {
            type: String,
            required: true
        },

        // Pricing details
        benchmarkPrice: {
            type: Number,
            required: true,
            min: 0
        },
        marketPrice: {
            type: Number,
            required: true,
            min: 0
        },
        gst: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },

        // Calculated field, but good to store for query speed if needed
        finalPrice: {
            type: Number
        },

        status: {
            type: String,
            enum: ['Active', 'Inactive'],
            default: 'Active'
        },

        // Location Specifics
        state: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'State'
        },
        district: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'District'
        },
        cluster: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cluster'
        }
    },
    {
        timestamps: true
    }
);

// Auto-calculate final price before saving
setPriceSchema.pre('save', function (next) {
    if (this.marketPrice && this.gst) {
        this.finalPrice = this.marketPrice + (this.marketPrice * this.gst / 100);
    } else {
        this.finalPrice = this.marketPrice;
    }
    next();
});

export default mongoose.model('SetPrice', setPriceSchema);
