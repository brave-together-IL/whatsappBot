const Server = require('../bin/Server');
const procEvent = require('./handlers/eventHandler').procEvent;
const tags = ['waiting'];

/**
 *
 * @param {int} ms
 * @return {Promise<>}
 */
const sleep = async (ms) =>{
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const startListening = async (client) =>{
    while(client===undefined){
        await sleep(2000);
    }
    const server = new Server();
    await server.refreshToken();
    // console.log(await server.createUser("alon", "shwartzblat", "azor", "alon@gmail.com", "972507336650"))
    // console.log(await server.deleteUserById("9"));
    // console.log(await server.getAllUsers());
    let running = true;
    let events;
    while (running){
        events = await server.getEventsByTag(tags);
        for (let i =0;i<events.length;i++) {
            procEvent(events[i], server, client);
        }
        await sleep(3000);
    }
}

module.exports = startListening;
/*

{"email": "users_email","password": "users_password","first_name": "first_name","last_name": "last_name","cellphone": "+972501234567"}



 */
