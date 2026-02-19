import mongoose from 'mongoose';

const installerToolSchema = new mongoose.Schema({
    toolName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
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
    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District',
        required: true
    }
}, {
    timestamps: true
});

const InstallerTool = mongoose.model('InstallerTool', installerToolSchema);
export default InstallerTool;
