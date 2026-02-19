import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        permissions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Permission'
        }],
        description: {
            type: String,
            default: '',
        },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department'
        },
        level: {
            type: String, // State, Cluster, District, etc.
            default: ''
        },
        parentRole: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role',
            default: null
        },
        mandatoryTasks: [{
            type: String
        }],
        optionalTasks: [{
            type: String
        }],
        rights: [{
            type: String // View, Edit, Delete etc.
        }],
        tempIncharge: { // Just a display field or link? The UI shows it.
            type: String,
            default: ''
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Role', roleSchema);
