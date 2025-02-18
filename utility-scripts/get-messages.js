const { mudtoken, pullusers } = require('../config.json');
const fetch = require('node-fetch');
const apiUrl = 'https://www.hackmud.com/mobile/chats.json';
const lastTimestamp = Math.floor(Date.now() / 1000);

async function func() {
    const payload = {
        chat_token: mudtoken,
        usernames: pullusers,
        before: lastTimestamp,
    }
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const result = await response.json();
        console.dir(result, { depth: null });
    
    } catch(error) {
        console.log("There was an error:");
        console.dir(error);
    }
}

func();