import mongoose from 'mongoose';

const installerRatingSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

const InstallerRating = mongoose.model('InstallerRating', installerRatingSchema);
export default InstallerRating;
