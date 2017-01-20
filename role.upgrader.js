let util = require('common');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('harvesting');
            let source = util.findBestEnergySource(creep);
            if(source) {
                creep.memory.currentSource=source.id;
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

            if(!util.hasEnergySpace(closest)) {
                closest = util.findBestEnergySource(creep);
            }

            if(!closest) {
                creep.say('Narp')
                return
            }
            if((closest.structureType == STRUCTURE_CONTAINER && creep.withdraw(closest,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) ||
                (creep.harvest(closest) == ERR_NOT_IN_RANGE)) {
                creep.moveTo(closest);
            }
        }
    }
};

module.exports = roleUpgrader;