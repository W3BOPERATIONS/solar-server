import mongoose from 'mongoose';

const checklistItemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true,
        trim: true
    },
    required: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    }
});

const checklistTemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    items: [checklistItemSchema],
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    completionStatus: {
        type: String,
        enum: ['completed', 'pending'],
        default: 'pending'
    },
    category: {
        type: String,
        trim: true
    },
    iconName: {
        type: String, // lucide icon name
        default: 'ClipboardList'
    },
    iconBg: {
        type: String, // Tailwind class e.g. 'bg-blue-100 text-blue-600'
        default: 'bg-blue-100 text-blue-600'
    }
}, {
    timestamps: true
});

const ChecklistTemplate = mongoose.model('ChecklistTemplate', checklistTemplateSchema);

export default ChecklistTemplate;
