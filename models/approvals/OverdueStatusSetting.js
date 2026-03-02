import mongoose from 'mongoose';

const overdueStatusSettingSchema = new mongoose.Schema({
    department: {
        type: String,
        required: true,
        index: true
    },
    state: {
        type: String,
        required: true,
        index: true
    },
    city: {
        type: String,
        required: true,
        index: true
    },
    modules: [{
        id: Number,
        name: String,
        overdueDays: Number,
        status: String,
        tasks: [{
            id: Number,
            name: String,
            overdueDays: Number,
            status: String
        }]
    }],
    isDefault: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Compound index for unique settings per location
overdueStatusSettingSchema.index({ department: 1, state: 1, city: 1 }, { unique: true });

const OverdueStatusSetting = mongoose.model('OverdueStatusSetting', overdueStatusSettingSchema);
export default OverdueStatusSetting;
