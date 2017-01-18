var roles = require('roles');
var _ = require('lodash');

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
        _.forIn(Game.rooms(function (room, key) {
            if (!room.memory.sources) {
                room.memory.sources = room.find(FIND_SOURCES_ACTIVE);
            }

            let notFullStructures = room.find(FIND_MY_STRUCTURES, {
                filter: function (structure) {
                    return (typeof structure.energy !== 'undefined');
                }
            });

            let i = 0;
            room.creeps.forEach(function (creep) {
                if (!creep.memory.source) {
                    creep.memory.source = room.memory.sources[i % room.memory.sources.length]
                }
                i++;
            })
        }))
    }
}