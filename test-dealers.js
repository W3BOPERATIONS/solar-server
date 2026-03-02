import mongoose from 'mongoose';
import User from './models/User.js';

mongoose.connect('mongodb://127.0.0.1:27017/solar_erp').then(async () => {
    const dm = await User.findOne({ role: 'dealerManager' });
    console.log('Dealer Manager:', dm ? { id: dm._id, district: dm.district, state: dm.state } : 'Not found');

    if (dm) {
        let query = { role: 'dealer' };
        if (dm.district) {
            query.district = dm.district;
        } else if (dm.state) {
            query.state = dm.state;
        }

        const dealers = await User.find({
            role: 'dealer',
            $or: [
                { createdBy: dm._id },
                query
            ]
        });
        console.log('Found dealers for DM:', dealers.length, dealers.map(d => ({ id: d._id, name: d.name, createdBy: d.createdBy, district: d.district, state: d.state })));
    }

    const allDealers = await User.find({ role: 'dealer' });
    console.log('All dealers:', allDealers.length, allDealers.map(d => ({ id: d._id, name: d.name, createdBy: d.createdBy, district: d.district, state: d.state })));

    process.exit(0);
});
