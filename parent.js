const { fork } = require('child_process');
var numBots = 1000; // The number of bots to spawn

for (let i = 0; i < numBots; i++) {
    setTimeout(() => {
        console.log('Creating bot #' + i);

        const child = fork(`${__dirname}/child.js`, [i]); // This will start a separate Node.js process running child.js

        child.on('message', (message) => {
            console.log('Message from bot #' + i + ':', message);
        });

        child.on('error', (error) => {
            console.error('Error from bot #' + i + ':', error);
        });

        child.on('exit', (code, signal) => {
            if (code !== 0) {
                console.error(`Bot #${i} process exited with code ${code}, signal ${signal}`);
            }
        });
    }, i * 250); // 500 milliseconds (1/2 second) delay between each bot creation
}
