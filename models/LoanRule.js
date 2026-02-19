import mongoose from 'mongoose';

const loanRuleSchema = new mongoose.Schema({
    projectType: {
        type: String,
        required: true,
        trim: true
    },
    interestRate: {
        type: Number,
        required: true
    },
    tenureMonths: {
        type: Number,
        required: true
    },
    maxAmount: {
        type: Number,
        required: true
    },
    fields: [{
        name: String,
        selected: Boolean
    }],
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    clusterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cluster',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const LoanRule = mongoose.model('LoanRule', loanRuleSchema);

export default LoanRule;
