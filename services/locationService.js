import State from '../models/State.js';
import Cluster from '../models/Cluster.js';
import District from '../models/District.js';
import City from '../models/City.js';

class LocationService {
    /**
     * Get all active states
     */
    async getStates() {
        return await State.find({ isActive: true }).sort({ name: 1 });
    }

    /**
     * Get clusters by state
     */
    async getClustersByState(stateId) {
        if (!stateId) return [];
        return await Cluster.find({ state: stateId, isActive: true }).sort({ name: 1 });
    }

    /**
     * Get districts by cluster
     * Note: In the current model, a Cluster belongs to a District.
     * This returns the specific district for the cluster.
     */
    async getDistrictsByCluster(clusterId) {
        if (!clusterId) return [];
        const cluster = await Cluster.findById(clusterId).populate('district');
        if (!cluster || !cluster.district) return [];

        // We return an array to keep it consistent with other "getMany" style APIs
        // Even if it's currently 1-to-1 in this direction.
        return [cluster.district];
    }

    /**
     * Get cities by district
     * Note: In the current model, a District belongs to a City.
     */
    async getCitiesByDistrict(districtId) {
        if (!districtId) return [];
        const district = await District.findById(districtId).populate('city');
        if (!district || !district.city) return [];

        return [district.city];
    }

    /**
     * Helper to validate if a location exists and follows the hierarchy
     */
    async validateHierarchy(stateId, clusterId, districtId, cityId) {
        if (stateId) {
            const state = await State.findById(stateId);
            if (!state) throw new Error('Invalid State');
        }
        if (clusterId) {
            const cluster = await Cluster.findById(clusterId);
            if (!cluster || cluster.state.toString() !== stateId) throw new Error('Invalid Cluster for selected State');
        }
        // Add more validation if needed
        return true;
    }
}

export default new LocationService();
