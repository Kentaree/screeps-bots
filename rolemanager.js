var roles = require('roles');

function ensureEnoughOfRole(role) {
    let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role.role);
    if(creeps.length < role.min) {
        Game.spawns['Spaw'].createCreep(role.parts,undefined, {role: role.role});
        return false;
    }
    return true;
}

module.exports = {
    process : function () {
        for(let key in Game.rooms) {
            let room = Game.rooms[key];
            if (!room.memory.sources) {
                room.memory.sources = room.find(FIND_SOURCES_ACTIVE);
            }

            let notFullStructures = room.find(FIND_MY_STRUCTURES, {
                filter: function (structure) {
                    return (typeof structure.energy !== 'undefined');
                }
            });

            let i = 0;
            for(let name in room.creeps) {
                let creep = room.creeps[name];
                if (!creep.memory.source) {
                    creep.memory.source = room.memory.sources[i % room.memory.sources.length]
                }
                i++;
            }
        }
    }
}