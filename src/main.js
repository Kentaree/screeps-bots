let roles = require('roles');
let rolemanager = require('rolemanager');
let structuremanager = require('structuremanager');
let tower = require('tower');

function ensureEnoughOfRole(room,role) {
    let creeps = room.find(FIND_MY_CREEPS,{
        filter: (creep) => {
            return (creep.memory.role == role.role)
        }
    });
    if(creeps.length < role.min) {
        let spawns=room.find(FIND_MY_SPAWNS);
        if(spawns.length > 0) {
            if(spawns[0].canCreateCreep(role.parts)==OK) {
                let res = spawns[0].createCreep(role.parts,undefined, {role: role.role})
                if(_.isString(res)) {
                    console.log('Created creep ' + res + ' with role ' + role.role)
                } else {
                    console.log('Didn\'t create creep because ' + res)
                }
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

    for(let name in Memory.rooms) {
        if(!Game.rooms[name]) {
            delete Memory.rooms[name];
            console.log('Clearing non-existing room memory:', name)
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

    for(let roomName in Game.rooms) {
        let room=Game.rooms[roomName];
        for(let role in roles) {
            if(!ensureEnoughOfRole(room,roles[role])) {
                break;
            }
        }
        tower.process(room);
        structuremanager.process(room);
    }
    rolemanager.process();
};
