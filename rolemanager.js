var roles = require('roles');

function ensureEnoughOfRole(role) {
    let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role.role);
    if(creeps.length < role.min) {
        Game.spawns['Spaw'].createCreep(role.parts,undefined, {role: role.role});
        return false;
    }
    return true;
}

Game.rooms.forEach(function(room){
    var notFullStructures = room.find(FIND_MY_STRUCTURES, { filter : function(structure) {
        return structure.transferEnergy && (structure.energy < structure.energyCapacity);
    }});




});