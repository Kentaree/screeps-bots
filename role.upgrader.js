var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
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
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('upgrading');
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.say('Moving');
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            let closest;
            if(creep.memory.currentSource) {
                closest = Game.getObjectById(creep.memory.currentSource)
            } else {
                closest = creep.pos.findClosestByRange(FIND_SOURCES);
            }

            if((structure.structureType == STRUCTURE_CONTAINER && creep.withdraw(structure,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) ||
                (creep.harvest(closest) == ERR_NOT_IN_RANGE)) {
                creep.moveTo(closest);
            }
        }
    }
};

module.exports = roleUpgrader;