let utils = require('common');

function planRoads(room) {
    let spawns = room.find(FIND_MY_SPAWNS);
    spawns.forEach(function(spawn) {
        let sources = room.find(FIND_SOURCES)
        sources.forEach(function (source) {

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

    }
}