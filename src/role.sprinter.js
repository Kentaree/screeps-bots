let util = require('common');

var roleSprinter = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.sprinting && creep.carry.energy === 0) {
            creep.memory.sprinting = false
        } else if (!creep.memory.sprinting && creep.carry.energy === creep.carryCapacity) {
            creep.memory.sprinting = true


        }


    }
};

module.exports = roleSprinter;