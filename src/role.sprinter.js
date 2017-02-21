let util = require('common');

function findSuitableDropoff(creep) {
    let structures = creep.room.find(FIND_MY_STRUCTURES, { filter: (structure) => { return structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity; } } )
    if(structures.length == 0) {
        structures = creep.room.find(FIND_MY_STRUCTURES, { filter: (structure) => { return structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity; } } );
    }
    if(structures.length == 0) {
        structures = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return ((structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity) || (structure.structureType == STRUCTURE_CONTAINER && _.sum(structure.store) < structure.storeCapacity) } } )
    }
    if(structures.length>0) {
        return creep.pos.findClosestByPath(structures);
    }
}

let roleSprinter = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.sprinting && creep.carry.energy === 0) {
            creep.memory.sprinting = false
        } else if (!creep.memory.sprinting && creep.carry.energy === creep.carryCapacity) {
            creep.memory.sprinting = true
            let dropOff = findSuitableDropoff(creep)
            if(dropOff) {
                creep.memory.dropoff = dropOff.id
            }
        }

        if(creep.memory.sprinting) {
            let dest = Game.getObjectById(creep.memory.dropoff)
            if(creep.transfer(dest,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(dest);
            }
        } else {
            let currentRoom = Game.rooms[creep.pos.roomName]
            let sourceInfo = currentRoom.memory.sources[creep.memory.source]
            let containerPos = sourceInfo.containerPos
            if(containerPos) {
                if(!creep.pos.isNearTo(containerPos)) {
                    creep.moveTo(containerPos)
                } else {
                    creep.withdraw(currentRoom.find)
                }
            }
        }

    }
};

module.exports = roleSprinter;