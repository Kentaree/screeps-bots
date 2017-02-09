let roleHarvester = require('role.harvester');
let roleUpgrader = require('role.upgrader');
let roleBuilder = require('role.builder');
let roleSprinter = require('role.sprinter');

module.exports = {
    harvester: {
        parts: [WORK,WORK,CARRY,MOVE],
        role: 'harvester',
        min: 3,
        run: roleHarvester.run
    },
    builder: {
        parts: [WORK,WORK,CARRY,MOVE],
        role: 'builder',
        min: 5,
        run: roleBuilder.run
    },
    upgrader: {
        parts: [WORK,WORK,CARRY,MOVE],
        role: 'upgrader',
        min: 10,
        run: roleUpgrader.run
    },
    sprinter: {
        parts: [CARRY,CARRY,MOVE,MOVE],
        role: 'sprinter',
        min: 0,
        run: roleSprinter.run
    }
};
