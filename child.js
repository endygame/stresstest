const mineflayer = require('mineflayer');
const pvp = require('mineflayer-pvp').plugin;
const pathfinder = require('mineflayer-pathfinder').pathfinder;
const Movements = require('mineflayer-pathfinder').Movements;
const { GoalNear } = require('mineflayer-pathfinder').goals;

let i = process.argv[2]; // The bot number, passed from the parent process

var bot = mineflayer.createBot({
    host: '168.138.68.81',
    port: '25502',
    username: 'Popopfuckface' + i
});

bot.loadPlugin(pvp);
bot.loadPlugin(pathfinder);

bot.on('spawn', () => {
    bot.pathfinder.setMovements(new Movements(bot));
    wander();
    randomActivity();
});

function wander() {
    const mcData = require('minecraft-data')(bot.version);
    const defaultMove = new Movements(bot, mcData);

    bot.pathfinder.setMovements(defaultMove);

    let randomX = bot.entity.position.x + (Math.random() - 0.5) * 20;
    let randomZ = bot.entity.position.z + (Math.random() - 0.5) * 20;

    bot.pathfinder.setGoal(new GoalNear(randomX, bot.entity.position.y, randomZ, 1), true);

    // Change goal every 5 seconds
    setTimeout(wander, 5000);
}

function randomActivity() {
    let action = Math.floor(Math.random() * 3);
    switch (action) {
        case 0:
            bot.setControlState('jump', true);
setTimeout(() => {
    bot.setControlState('jump', false);
}, 500);
            break;
        case 1:
            bot.swingArm();
            break;
        case 2:
            // Place a block
            if (bot.heldItem) {
                let referenceBlock = bot.blockAt(bot.entity.position.offset(0, -1, 0));
                let placementBlock = referenceBlock.adjacentCuboid(1);
                bot.placeBlock(referenceBlock, placementBlock.face);
            }
            break;
    }

    // Perform a random action every second
    setTimeout(randomActivity, 1000);
}

bot.on('login', () => {
    process.send('Bot #' + i + ' has logged in.');
});

bot.on('kicked', (reason, loggedIn) => {
    process.send('Bot #' + i + ' was kicked for: ' + reason);
});

bot.on('death', () => {
    bot.chat("/respawn");
});
