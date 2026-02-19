import mongoose from 'mongoose';

const surveyBOMSchema = new mongoose.Schema({
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
    terraceType: {
        type: String,
        required: true
    },
    buildingType: {
        type: String,
        required: true
    },
    structureType: {
        type: String,
        required: true
    },
    floorCount: {
        type: Number,
        default: null
    },
    pipes: [{
        product: String,
        formulaItem: String,
        formulaQty: Number,
        price: Number
    }],
    accessories: [{
        product: String,
        formulaItem: String,
        formulaQty: Number,
        price: Number
    }],
    wires: [{
        product: String,
        formulaItem: String,
        formulaQty: Number,
        price: Number
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.model('SurveyBOM', surveyBOMSchema);
