import mongoose from 'mongoose';

const supplierTypeSchema = new mongoose.Schema(
    {
        loginTypeName: {
            type: String,
            required: true,
            trim: true,
        },
        countryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Country',
            default: null
        },
        stateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'State',
            default: null
        },
        clusterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cluster',
            default: null
        },
        districtId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'District',
            default: null
        },
        category: {
            type: String,
            trim: true,
            default: "",
        },
        subCategory: {
            type: String,
            trim: true,
            default: "",
        },
        projectType: {
            type: String,
            trim: true,
            default: "",
        },
        subType: {
            type: String,
            trim: true,
            default: "",
        },
        assignModules: {
            type: String,
            trim: true,
            default: "",
        },
        loginAccessType: {
            type: String,
            trim: true,
            default: "",
        },
        orderTat: {
            type: String,
            trim: true,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('SupplierType', supplierTypeSchema);
