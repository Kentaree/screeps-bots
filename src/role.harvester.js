let utils = require('common');

function findSuitableDropoff(creep) {
    let structures = creep.room.find(FIND_MY_STRUCTURES, { filter: (structure) => { return structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity; } } )
    if(structures.length == 0) {
        structures = creep.room.find(FIND_MY_STRUCTURES, { filter: (structure) => { return structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity; } } );
    }
    if(structures.length == 0) {
        structures = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return ((structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity) || (structure.structureType == STRUCTURE_CONTAINER && _.sum(structure.store) < structure.storeCapacity) } } )
    }
    if(structures.length>0) {
        let target = _.reduce(structures, function(result, structure) {
            let range=creep.pos.getRangeTo(structure);
            if(result && result.range < range) {
                return result;
            }
            return {range: range, structure: structure}
        },{range: 99999});
        creep.memory.dropoff = target.structure.id;
        return target.structure
    }
}

let roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
            creep.say('Drop off');
            creep.memory.harvesting = false;
            findSuitableDropoff(creep)
        }

        if(!creep.memory.harvesting && creep.carry.energy==0) {
            creep.say('Harvesting');
            creep.memory.harvesting = true;
            let source = creep.pos.findClosestByRange(FIND_SOURCES);
            if(source) {
                creep.memory.source = source.id;
            }
        }

        if(creep.memory.harvesting) {
            if(creep.memory.source) {
                let closest = Game.getObjectById(creep.memory.source);
                if(creep.harvest(closest) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closest);
                    creep.say('Move src');
                }
            } else {
                let source = creep.pos.findClosestByPath(FIND_SOURCES);
                if(source) {
                    creep.memory.source = source.id;
                }
            }
        }  else {
            if(creep.memory.dropoff) {
                let closest = Game.getObjectById(creep.memory.dropoff);
                if(!utils.hasEnergySpace(closest)) {
                    closest = findSuitableDropoff(creep)
                }
                creep.say('Moving');
                if(creep.transfer(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closest);
                }
            } else {
                creep.say('No struct')
            }
        }
    }
};

module.exports = roleHarvester;