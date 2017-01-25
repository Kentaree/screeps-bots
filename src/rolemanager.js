var roles = require('roles');
let utils = require('common');

function ensureEnoughOfRole(role) {
    let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role.role);
    if(creeps.length < role.min) {
        Game.spawns['Spaw'].createCreep(role.parts,undefined, {role: role.role});
        return false;
    }
    return true;
}

function findSuitableDropoff(creep) {
    let structures = creep.room.find(FIND_MY_STRUCTURES, { filter: (structure) => { return structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity; } } )
    if(structures.length == 0) {
        structures = creep.room.find(FIND_MY_STRUCTURES, { filter: (structure) => { return structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity; } } )
    }
    if(structures.length == 0) {
        structures = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return ((structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity) || (structure.structureType == STRUCTURE_CONTAINER && _.sum(structure.store) < structure.storeCapacity) } } )
    }
    if(structures.length>0) {
        let target = _.reduce(structures, function(result, structure) {
            let range=creep.pos.getRangeTo(structure);
            if(result && result.range < range) {
                return result;
            }
            return {range: range, structure: structure}
        },{range: 99999});
        creep.memory.dropoff = target.structure.id;
        return target.structure
    }
}


module.exports = {
    process : function () {
        for(let key in Game.rooms) {
            let room = Game.rooms[key];
            if (!room.memory.sources) {
                room.memory.sources = room.find(FIND_SOURCES_ACTIVE);
            }
            let sourcesCount=room.memory.sources.length

            let constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES);
            let inNeedofRepair = room.find(FIND_STRUCTURES, {filter: (structure) => {
                return (structure.hits < structure.hitsMax*MIN_HITS_PERCENT);
            }});

            let creeps = room.find(FIND_MY_CREEPS);
            for(let i = 0; i < creeps.length; i++) {
                let creep = creeps[i];
                if (!creep.memory.source) {
                    creep.memory.source = room.memory.sources[i % sourcesCount].id
                }
                if(creep.memory.role==='builder' && creep.memory.idle) {
                    let site;
                    if(constructionSites.length > 0) {
                        site=creep.pos.findClosestByPath(constructionSites);
                        if(site) {
                            creep.memory.project=site.id;
                            creep.memory.idle=false
                        }
                    }
                    if(!site) {
                        site=creep.pos.findClosestByPath(inNeedofRepair);
                        if(site) {
                            creep.memory.project=site.id;
                            creep.memory.idle=false
                        }
                    }
                }
            }
        }
    }
}