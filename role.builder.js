const MIN_HITS=25000;

module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
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
                console.log('Repair closest ' + closest)
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
            if(creep.memory.source) {
                closest = Game.getObjectById(creep.memory.source)
            } else {
                closest = creep.pos.findClosestByRange(FIND_SOURCES);
            }
            if(creep.harvest(closest) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closest);
            }
        }
    }
};
