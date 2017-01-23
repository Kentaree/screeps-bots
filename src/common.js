let _ = require('lodash');

module.exports = {
    findBestEnergySource : function(creep) {
        let closest = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER && _.sum(structure.store) > 0)
            }
        });
        let structureRange = closest ? creep.pos.getRangeTo(closest) : 99999;
        let closestSource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        let sourceRange=closestSource ?  creep.pos.getRangeTo(closestSource) : 99999;

        if(sourceRange > structureRange) {
            return closest;
        }
        return closestSource;
    },

    hasEnergySpace : function (structure) {
        if(structure.structureType == STRUCTURE_CONTAINER) {
            return _.sum(structure.store) < structure.storeCapacity;
        }
        return structure.energy < structure.energyCapacity;
    }

};
