import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        code: {
            type: String,
            trim: true,
            unique: true,
            sparse: true
        },
        description: {
            type: String,
            default: '',
        },
        headOfDepartment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        assignedModules: [{
            module: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Module'
            },
            level: {
                type: String,
                enum: ['country', 'state', 'cluster', 'district'],
                default: 'country'
            },
            status: {
                type: String,
                enum: ['active', 'inactive', 'coming-soon'],
                default: 'active'
            }
        }],
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

export default mongoose.model('Department', departmentSchema);
