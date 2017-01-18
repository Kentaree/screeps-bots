let _ = require('lodash')

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy < creep.carryCapacity) {
            let closest;
            if(creep.memory.source) {
                closest = Game.getObjectById(creep.memory.source)
            } else {
                closest = creep.pos.findClosestByRange(FIND_SOURCES);
            }
            if(creep.harvest(closest) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closest);
            }
        }
        else {
            var closest = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_CONTAINER ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity) ||
                                structure.structureType == STRUCTURE_CONTAINER && _.sum(structure.store) < storeCapacity;
                    }
            });
            if(closest) {
                creep.say('Moving to closest structure')
                if(creep.transfer(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closest);
                }
            } else {
                creep.say('No structure close')
            }
    }
    }
};

module.exports = roleHarvester;