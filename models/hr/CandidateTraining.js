import mongoose from 'mongoose';

const candidateTrainingSchema = new mongoose.Schema({
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    position: {
        type: String,
        required: true
    },

    // Location Scope
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State'
    },
    cities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City'
    }],
    districts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District'
    }],

    // Training Sections
    sections: [{
        category: {
            type: String,
            // enum: ['solarrooftop', 'solarpump', 'solarstreetlight'], // Optional: restrict if needed
            default: 'solarrooftop'
        },
        name: { type: String, required: true },
        videos: [{
            url: String, // URL or File path
            type: {
                type: String,
                enum: ['upload', 'youtube'],
                default: 'youtube'
            }
        }]
    }],

    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, { timestamps: true });

export default mongoose.model('CandidateTraining', candidateTrainingSchema);
