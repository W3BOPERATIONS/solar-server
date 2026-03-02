import mongoose from 'mongoose';

const overdueTaskSettingSchema = new mongoose.Schema({
    todayTasksDays: {
        type: Number,
        default: 0
    },
    todayPriority: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: 'medium'
    },
    showTodayTasks: {
        type: Boolean,
        default: true
    },
    pendingMinDays: {
        type: Number,
        default: 1
    },
    pendingMaxDays: {
        type: Number,
        default: 7
    },
    sendPendingReminders: {
        type: Boolean,
        default: true
    },
    reminderFrequency: {
        type: String,
        enum: ['daily', 'weekly', 'biweekly'],
        default: 'weekly'
    },
    overdueDays: {
        type: Number,
        default: 1
    },
    escalationLevels: {
        level1: { type: Boolean, default: true },
        level2: { type: Boolean, default: true },
        level3: { type: Boolean, default: false }
    },
    autoPenalty: {
        type: Boolean,
        default: true
    },
    penaltyPercentage: {
        type: Number,
        default: 2
    },
    overdueBenchmark: {
        type: Number,
        default: 70
    }
}, {
    timestamps: true
});

// Ensure only one document exists
overdueTaskSettingSchema.statics.getSettings = async function () {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

const OverdueTaskSetting = mongoose.model('OverdueTaskSetting', overdueTaskSettingSchema);
export default OverdueTaskSetting;
