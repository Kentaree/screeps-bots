let roles = require('roles');
let utils = require('common');

const MIN_HITS_PERCENT=30;

module.exports = {
    process : function () {

        for(let key in Game.rooms) {
            let room = Game.rooms[key];
            if (!room.memory.sources) {
                let sources = room.find(FIND_SOURCES_ACTIVE);
                let memSources = [];
                sources.forEach(function(source) {
                    let passable = utils.moveableSpacesAround(source.pos,room).length;
                    Game.notify('Source ' + source.id + " has " + passable + " passable squares");
                    memSources.push({id: source.id, passable: passable});
                });
                room.memory.sources = memSources;
            }
            let sourcesCount=room.memory.sources.length;

            let constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES);
            let inNeedofRepair = room.find(FIND_STRUCTURES, {filter: (structure) => {
                return (structure.hits < structure.hitsMax*(MIN_HITS_PERCENT/100));
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
                            creep.memory.construction=true;
                            creep.memory.idle=false
                        }
                    }
                    if(!site) {
                        site=creep.pos.findClosestByPath(inNeedofRepair);
                        if(site) {
                            creep.memory.project=site.id;
                            creep.memory.construction=false;
                            creep.memory.idle=false
                        }
                    }
                }
            }
        }
    }
};