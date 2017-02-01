let roles = require('roles');
let rolemanager = require('rolemanager');
function ensureEnoughOfRole(room,role) {
    let creeps = room.find(FIND_MY_CREEPS,{
        filter: (creep) => {
            return (creep.memory.role == role.role)
        }
    });
    if(creeps.length < role.min) {
        let spawns=room.find(FIND_MY_SPAWNS);
        if(spawns.length > 0) {
            if(spawns[0].canCreateCreep(role.parts)) {
                spawns[0].createCreep(role.parts,undefined, {role: role.role})
                console.log('Created creep with role ' + role)
                return false;
            }
        }
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

    let tower = Game.getObjectById('TOWER_ID');
    if(tower) {
        let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    let counter = {};
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

    for(let role in roles) {
        for(let roomName in Game.rooms) {
            let room=Game.rooms[roomName];
            if(!ensureEnoughOfRole(room,roles[role])) {
                break;
            }
        }
    }
    rolemanager.process();
};