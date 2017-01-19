const MIN_HITS=25000;
let _ = require('lodash')
module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');

            let source = Game.getObjectById(creep.memory.source)
            let sourceRange = creep.pos.getRangeTo(source)
            let closest = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER && _.sum(structure.store) > 0)
                }
            });
            let structureRange;
            if(closest) {
                structureRange = creep.pos.getRangeTo(closest);
            } else {
                structureRange = 9999;
            }
            if(sourceRange > structureRange) {
                creep.memory.currentSource=source.id;
            } else {
                creep.memory.currentSource=closest.id;
            }
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('building');
        }

        if(creep.memory.building) {
            let closest = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
            if(closest) {
                if(creep.build(closest) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closest);
                }
                return;
            }
            
            closest = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.hits < MIN_HITS && structure.hits < structure.hitsMax);
                    }
            });
            if(closest) {
                let status = creep.repair(closest)
                if(status == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closest);
                } else {
                    creep.say('Repair ' + status)
                }
            } else {
                creep.say('Nothing to repair')
            }
        } else {
            let closest;
            if(creep.memory.currentSource) {
                closest = Game.getObjectById(creep.memory.currentSource)
            } else {
                closest = creep.pos.findClosestByRange(FIND_SOURCES);
            }

            if((closest.structureType == STRUCTURE_CONTAINER && creep.withdraw(closest,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) ||
                (creep.harvest(closest) == ERR_NOT_IN_RANGE)) {
                creep.moveTo(closest);
            }
        }
    }
};
