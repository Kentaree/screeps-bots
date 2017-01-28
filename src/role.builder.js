const MIN_HITS=250000;
const MIN_HITS_PERCENT=30;
const HEAL_UNTIL_PERCENT=60;
let _ = require('lodash');
let util = require('common');

module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');

            let source = util.findBestEnergySource(creep);
            if(source) {
                creep.memory.currentSource=source.id;
            }
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('building');
        }

        if(creep.memory.building) {
            if(creep.memory.project) {
                let target = Game.getObjectById(creep.memory.project)
                if(!target) {
                    creep.memory.idle=true;
                } else {
                    if(creep.memory.construction) {
                        let result = creep.build(target)
                        if(result == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target);
                        } else if(result == ERR_INVALID_TARGET) {
                            creep.memory.idle=true;
                        }
                    } else {
                        if(target.hits >= target.hitsMax*(HEAL_UNTIL_PERCENT/100)) {
                            creep.memory.idle = true
                        } else {
                            if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(target);
                            }                            
                        }
                    }
                }
            } else {
                creep.memory.idle=true
            }
        } else {
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
