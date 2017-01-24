let roleHarvester = require('role.harvester');
let roleUpgrader = require('role.upgrader');
let roleBuilder = require('role.builder');

module.exports = {
    harvester: {
        parts: [WORK,CARRY,MOVE],
        role: 'harvester',
        min: 3,
        run: roleHarvester.run
    },
    builder: {
        parts: [WORK,WORK,CARRY,CARRY,MOVE],
        role: 'builder',
        min: 5,
        run: roleBuilder.run
    },
    upgrader: {
        parts: [WORK,WORK,CARRY,CARRY,MOVE],
        role: 'upgrader',
        min: 10,
        run: roleUpgrader.run
    }
};
