let _ = require('lodash');

const OBSTACLE_OBJECT_TYPES_NO_CREEP = ["spawn", "wall", "source", "constructedWall", "extension", "link", "storage", "tower", "observer", "powerSpawn", "powerBank", "lab", "terminal","nuker"]

function moveableSpacesAround(pos, room) {
    let spaces = [];
    spacesAround(room,pos,function(space) {
            space.look().map(function(lookRes) {
                if(lookRes.type === 'terrain') {
                    return lookRes['terrain'];
                }
                if(lookRes.type === 'structure') {
                    return lookRes['structure'].structureType;
                }

                return lookRes.type;
            });
            if(_.intersection(square,OBSTACLE_OBJECT_TYPES_NO_CREEP).length==0) {
                spaces.push(square)
            }
        }
    );
    return spaces;
}

function spacesAround(room, pos, callback) {
    let startY = pos.y-1;
    let startX = pos.x-1;
    for(let y=startY; y < (startY+3); y++) {
        for(let x=startX; x < (startX+3); x++) {
            if(x === pos.x && y === pos.y) {
                continue;
            }
            callback(new RoomPosition(x,y,room.name));
        }
    }
}



module.exports = {
    findBestEnergySource : function(creep) {
        let closest = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER && _.sum(structure.store) > 0)
            }
        });
        let structureRange = closest ? creep.pos.getRangeTo(closest) : 99999;
        let closestSource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        let sourceRange=closestSource ?  creep.pos.getRangeTo(closestSource) : 99999;

        if(sourceRange > structureRange) {
            return closest;
        }
        return closestSource;
    },

    hasEnergySpace : function (structure) {
        if(structure.structureType == STRUCTURE_CONTAINER) {
            return _.sum(structure.store) < structure.storeCapacity;
        }
        return structure.energy < structure.energyCapacity;
    },

    spacesAround : spacesAround,
    moveableSpacesAround : moveableSpacesAround,
    OBSTACLE_OBJECT_TYPES_NO_CREEP : OBSTACLE_OBJECT_TYPES_NO_CREEP
};
