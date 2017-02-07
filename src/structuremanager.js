let utils = require('common');

let roomCostCache = {};

function roomCost(roomName) {
    if(roomCostCache[roomName]) {
        return roomCostCache[roomName];
    }
    let room = Game.rooms[roomName]
    if(room) {
        let costs = new PathFinder.CostMatrix;

        room.find(FIND_STRUCTURES).forEach(function (structure) {
            if(structure.structureType == STRUCTURE_ROAD) {
                costs.set(structure.pos.x, structure.pos.y, 1);
            } else if(utils.OBSTACLE_OBJECT_TYPES_NO_CREEP.includes(structure.structureType)) {
                costs.set(structure.pos.x, structure.pos.y, 0xff);
            }
        })
        return costs;
    }
    return false;
}

function planRoads(room) {
    let spawns = room.find(FIND_MY_SPAWNS);
    spawns.forEach(function(spawn) {

        utils.spacesAround(room,spawn.pos,function (space) {
            room.createConstructionSite(space, STRUCTURE_ROAD);
        });

        let sources = room.find(FIND_SOURCES)
        sources.forEach(function (source) {
            let results = PathFinder.search(spawn.pos,
                { pos: source.pos, range: 1 },
                {
                    plainCost: 2,
                    swampCost: 10,
                    roomCallback: roomCost
                });
            if(!results.incomplete) {
                results.path.forEach(function(pos) {
                     room.createConstructionSite(pos, STRUCTURE_ROAD);
                });
            }
        })
    });
}

function buildContainers(room) {
    let sources = room.find(FIND_SOURCES);
    sources.forEach(function(source){
        let spaces = utils.moveableSpacesAround(source.pos)
    });
}


module.exports = {
    process: function (room) {
        if(Game.time % 50 == 0) {
            planRoads(room)
        }
    }
}