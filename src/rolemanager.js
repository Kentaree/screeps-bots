let roles = require('roles');
let utils = require('common');

const MIN_HITS_PERCENT=30;
const MIN_HITS=250000;

module.exports = {
    process : function () {

        for(let key in Game.rooms) {
            let room = Game.rooms[key];
            if (!room.memory.sources) {
                let sources = room.find(FIND_SOURCES_ACTIVE);
                let memSources = {};
                sources.forEach(function(source) {
                    let passable = utils.moveableSpacesAround(source.pos,room).length;
                    Game.notify('Source ' + source.id + " has " + passable + " passable squares");
                    memSources[source.id] = {passable: passable}
                });
                room.memory.sources = memSources;
            }
            let sourcesCount=_.keys(room.memory.sources).length;

            let constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES);
            let inNeedofRepair = room.find(FIND_STRUCTURES, {filter: (structure) => {
                if((structure.structureType == "constructedWall" || structure.structureType == "rampart") && structure.hits >= MIN_HITS) {
                    return false;
                }
                return (structure.hits < structure.hitsMax*(MIN_HITS_PERCENT/100));
            }});

            let creeps = room.find(FIND_MY_CREEPS);
            for(let i = 0; i < creeps.length; i++) {
                let creep = creeps[i];
                if (!creep.memory.source) {
                    creep.memory.source = _.keys(room.memory.sources)[i % sourcesCount].id
                }
                if(creep.memory.role==='builder' && creep.memory.idle) {
                    let site;
                    if(constructionSites.length > 0) {
                        site=creep.pos.findClosestByRange(constructionSites, {
                            filter : function (site) {
                                return (!creep.memory.project) || (site.id != creep.memory.project);
                            }
                        });
                        if(site) {
                            creep.memory.project=site.id;
                            creep.memory.construction=true;
                            creep.memory.idle=false
                        }
                    }
                    if(!site) {
                        site=creep.pos.findClosestByRange(inNeedofRepair, {
                            filter : function (site) {
                                return (!creep.memory.project) || (site.id != creep.memory.project);
                            }
                        });
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