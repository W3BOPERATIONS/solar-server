import mongoose from 'mongoose';

const projectJourneyStageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    fields: [{
        type: String,
        trim: true
    }],
    order: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }
}, {
    timestamps: true
});

const ProjectJourneyStage = mongoose.model('ProjectJourneyStage', projectJourneyStageSchema);

export default ProjectJourneyStage;
