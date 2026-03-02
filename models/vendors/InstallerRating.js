import mongoose from 'mongoose';

const installerRatingSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        trim: true
    },
    rate: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }
}, {
    timestamps: true
});

const InstallerRating = mongoose.model('InstallerRating', installerRatingSchema);
export default InstallerRating;
