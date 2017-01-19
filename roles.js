var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports = {
    harvester: {
        parts: [WORK,WORK,CARRY,CARRY,MOVE],
        role: 'harvester',
        min: 3,
        run: roleHarvester.run        
    },    
    builder: {
        parts: [WORK,CARRY,MOVE],
        role: 'builder',
        min: 5,
        run: roleBuilder.run
    },
    upgrader: {
        parts: [WORK,CARRY,MOVE],
        role: 'upgrader',
        min: 10,
        run: roleUpgrader.run                
    }    
};