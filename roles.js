var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports = {
    harvester: {
        parts: [WORK,WORK,CARRY,MOVE],
        role: 'harvester',
        min: 4,
        run: roleHarvester.run        
    },    
    builder: {
        parts: [WORK,WORK,CARRY,CARRY,MOVE],
        role: 'builder',
        min: 3,
        run: roleBuilder.run
    },
    upgrader: {
        parts: [WORK,WORK,CARRY,CARRY,MOVE],
        role: 'upgrader',
        min: 6,
        run: roleUpgrader.run                
    }    
};