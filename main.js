var roles = require('roles');

function ensureEnoughOfRole(role) {
    var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role.role);
    if(creeps.length < role.min) {
        Game.spawns['Spaw'].createCreep(role.parts,undefined, {role: role.role});
        return false;
    }
    return true;
}

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var tower = Game.getObjectById('TOWER_ID');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        var role = roles[creep.memory.role];
        role.run(creep);
    }
    
    for(var role in roles) {
         if(!ensureEnoughOfRole(roles[role])) {
             break;
         }
    }
}