var mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
var pvp = require('mineflayer-pvp').plugin;


var bots = [];
var numBots = 13; // The number of bots to spawn
var loginCount = 0; // To keep track of logged in bots

for (let i = 0; i < numBots; i++) {
    var bot = mineflayer.createBot({
        host: '168.138.68.81',
        port: '25502',
        username: 'Bot' + i
    });

    bot.loadPlugin(pathfinder)
    bot.loadPlugin(pvp);

    bot.on('login', () => {
        console.log('Bot' + i + ' has logged in.');
        loginCount++; // Increment the count each time a bot logs in

        if(loginCount == numBots) { // If all bots are logged in
            bots[0].pvp.attack(bots[numBots - 1].entity); // Make the first bot attack the last one
        }
    });

    bot.on('kicked', (reason, loggedIn) => {
        console.log('Bot' + i + ' was kicked for: ' + reason);
    });

    bot.on('death', () => {
        bot.chat("/respawn");
    });

    bots.push(bot);
}
