var roles = require('roles');
var rolemanager = require('rolemanager');
function ensureEnoughOfRole(role) {
    let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role.role);
    if(creeps.length < role.min) {
        Game.spawns['Spaw'].createCreep(role.parts,undefined, {role: role.role});
        return false;
    }
    return true;
}

module.exports.loop = function () {

    for(let name in Memory.creeps) {
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

    var counter = {};
    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        let role = roles[creep.memory.role];
        role.run(creep);

        counter[role.role] = 1 + (counter[role.role] || 0)
    }

    if(!(Game.time % 5)) {
        console.log('*********');
        for (let role in counter) {
            console.log('Role ' + role + ": " + counter[role])
        }
    }

    for(var role in roles) {
         if(!ensureEnoughOfRole(roles[role])) {
             break;
         }
    }
    rolemanager.process();
};