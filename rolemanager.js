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
            let sourcesCount=room.memory.sources.length

            let notFullStructures = room.find(FIND_MY_STRUCTURES, {
                filter: function (structure) {
                    return (typeof structure.energy !== 'undefined');
                }
            });

            let creeps = room.find(FIND_MY_CREEPS);
            for(let i = 0; i < creeps.length; i++) {
                let creep = creeps[i];
                if (!creep.memory.source) {
                    creep.memory.source = room.memory.sources[i % sourcesCount].id
                }
            }
        }
    }
}