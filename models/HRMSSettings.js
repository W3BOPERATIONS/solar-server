import mongoose from 'mongoose';

const hrmsSettingsSchema = new mongoose.Schema({
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    // Position can be a string (custom) or linked to Designation model
    // Using String to allow flexibility if designations aren't fully seeded, 
    // but ideally should be ObjectId. Let's use String for now to match UI flexibility,
    // or better, ObjectId if we enforce it. 
    // The prompt says "Replace all static data...". 
    // Let's use ObjectId and if it fails fall back? No, let's stick to ObjectId for strictness if possible.
    // However, existing UI has generic positions. I'll use String for 'position' name to simplify transition 
    // from static strings, unless I force creating designations first.
    // Validating against Designation model is safer.
    // Let's use String for now to avoid blocking if Designations are missing.
    position: {
        type: String,
        required: true
    },
    payroll: {
        salary: { type: String, default: '' },
        perks: { type: String, default: '' },
        benefits: { type: String, default: '' },
        esops: { type: String, default: 'eligible' },
        payrollType: { type: String, default: 'monthly' },
        peCheck: { type: Boolean, default: false },
        peInput: { type: String, default: '' },
        esicCheck: { type: Boolean, default: false },
        esicInput: { type: String, default: '' },
        activeCpField: { type: String, default: '' },
        salaryIncrement: { type: String, default: '' },
        cpOnboardingGoal: { type: String, default: '' },
        leaves: { type: String, default: '' },
        performanceLoginTime: { type: String, default: '' },
        performanceWorkingHours: { type: Number, default: 8 }
    },
    recruitment: {
        probation: { type: String, default: '' },
        training: { type: String, default: '' }
    },
    performance: {
        efficiencyFormula: { type: String, default: '' },
        attendanceReq: { type: String, default: '' },
        leaveImpact: { type: String, default: '' },
        overdueImpact: { type: String, default: '' },
        productivity: { type: String, default: '' },
        breakTime: { type: String, default: '' },
        idealTime: { type: String, default: '' }
    },
    vacancy: {
        count: { type: String, default: '' },
        experience: { type: String, default: '' },
        skills: [{ type: String }],
        education: { type: String, default: '' },
        certifications: { type: String, default: '' },
        deadline: { type: Date },
        jobType: { type: String, default: 'fulltime' },
        description: { type: String, default: '' },
        responsibilities: { type: String, default: '' }
    },
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

// Compound unique index to prevent duplicate settings for same position in department
hrmsSettingsSchema.index({ department: 1, position: 1 }, { unique: true });

export default mongoose.model('HRMSSettings', hrmsSettingsSchema);
