import State from '../models/State.js';
import Cluster from '../models/Cluster.js';
import District from '../models/District.js';
import City from '../models/City.js';
import Zone from '../models/Zone.js';

class LocationService {
    /**
     * Get all active states
     */
    async getStates() {
        return await State.find({ isActive: true }).sort({ name: 1 });
    }

    /**
     * Get districts by state
     */
    async getDistrictsByState(stateId) {
        const query = { isActive: true };
        if (stateId && stateId !== 'all') query.state = stateId;
        return await District.find(query).sort({ name: 1 });
    }

    /**
     * Get clusters by district
     */
    async getClustersByDistrict(districtId) {
        const query = { isActive: true };
        if (districtId && districtId !== 'all') query.districts = districtId; // Mongoose handles ID in array automatically
        return await Cluster.find(query).sort({ name: 1 });
    }

    /**
     * Get clusters by state
     */
    async getClustersByState(stateId) {
        const query = { isActive: true };
        if (stateId && stateId !== 'all') query.state = stateId;
        return await Cluster.find(query).sort({ name: 1 });
    }

    /**
     * Get districts by cluster
     */
    async getDistrictsByCluster(clusterId) {
        if (clusterId === 'all') {
            return await District.find({ isActive: true }).sort({ name: 1 });
        }
        const cluster = await Cluster.findById(clusterId);
        if (!cluster) return [];
        return await District.find({ _id: { $in: cluster.districts }, isActive: true }).sort({ name: 1 });
    }

    /**
     * Get zones by cluster
     */
    async getZonesByCluster(clusterId) {
        const query = { isActive: true };
        if (clusterId && clusterId !== 'all') query.clusters = clusterId;
        return await Zone.find(query).sort({ name: 1 });
    }

    /**
     * Get cities by zone
     */
    async getCitiesByZone(zoneId) {
        const query = { isActive: true };
        if (zoneId && zoneId !== 'all') query.zones = zoneId;
        return await City.find(query).sort({ name: 1 });
    }

    /**
     * Helper to validate if a location exists and follows the hierarchy
     */
    async validateHierarchy(stateId, districtId, clusterId, zoneId) {
        if (stateId) {
            const state = await State.findById(stateId);
            if (!state) throw new Error('Invalid State');
        }
        if (districtId) {
            const district = await District.findById(districtId);
            if (!district || district.state.toString() !== stateId) throw new Error('Invalid District for selected State');
        }
        if (clusterId) {
            const cluster = await Cluster.findById(clusterId);
            if (!cluster || !cluster.districts.includes(districtId)) throw new Error('Invalid Cluster for selected District');
        }
        if (zoneId) {
            const zone = await Zone.findById(zoneId);
            if (!zone || !zone.clusters.includes(clusterId)) throw new Error('Invalid Zone for selected Cluster');
        }
        return true;
    }
}

export default new LocationService();
