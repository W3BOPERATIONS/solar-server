import mongoose from 'mongoose';

const comboKitAssignmentSchema = new mongoose.Schema({
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State',
        required: true
    },
    cluster: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cluster',
        required: true
    },
    // The frontend sends an array of district IDs.
    // The user might be assigning this project to multiple districts.
    districts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District'
    }],
    cpTypes: [{
        type: String
    }],
    comboKits: [{
        name: String,
        image: String,
        panelBrand: String,
        panelSkus: [String],
        inverterBrand: String
    }],
    // New fields for customization
    solarkitName: {
        type: String,
        default: "Solarkit Name"
    },
    panels: [{
        type: String
    }],
    inverters: [{
        type: String
    }],
    boskits: [{
        type: String
    }],
    category: {
        type: String,
        default: 'Solar Panel'
    },
    subCategory: {
        type: String,
        default: 'Residential'
    },
    projectType: {
        type: String,
        default: '1kw-10kw'
    },
    subProjectType: {
        type: String,
        default: 'On Grid'
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Inactive'
    }
}, { timestamps: true });

const ComboKitAssignment = mongoose.model('ComboKitAssignment', comboKitAssignmentSchema);

export default ComboKitAssignment;
