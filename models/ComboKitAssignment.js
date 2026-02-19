import mongoose from 'mongoose';

const comboKitAssignmentSchema = new mongoose.Schema({
    comboKitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SolarKit', // Or BundlePlan? User said "ComboKit" which implies SolarKit + others. 
        // The UI "AddComboKitForFranchisee" likely assigns a SolarKit or Bundle.
        // I will assume it references SolarKit primarily or Bundle. 
        // Let's use generic name or SolarKit for now, can be updated.
        required: true
    },
    userType: {
        type: String,
        enum: ['Franchisee', 'Dealer'],
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Might be assigning to a region, not specific user yet? 
        // Or specific user. Let's keep optional for now if allowed.
    },
    // Location Hierarchy - Setup Locations
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State',
        required: true
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
        required: true
    },
    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District',
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

export default mongoose.model('ComboKitAssignment', comboKitAssignmentSchema);
