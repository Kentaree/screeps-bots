var roleBuilder = {

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
            var closest = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
            if(closest) {
                if(creep.build(closest) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closest);
                }
            }
        }
        else {
            var closest = creep.pos.findClosestByRange(FIND_SOURCES);
            if(creep.harvest(closest) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closest);
            }
        }
    }
};

module.exports = roleBuilder;