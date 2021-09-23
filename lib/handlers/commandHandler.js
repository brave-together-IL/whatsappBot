const {MessageTypes} = require('whatsapp-web.js');
const acceptEvent = require('../../bin/commands/acceptEvent');
const admins = require('../../config/admins.json');
const Database = require("../../bin/Database");
const userOperation = require('../../bin/commands/userOperation')
let db;

/**
 * Redirects command calls to the right handler.
 *
 * @param {WAWebJS.Message} message
 * @param {WAWebJS.Client} client
 * @param {Database} db
 * @return {Promise<void>}
 */
const procMessage = async (message, client, db) => {
    const chat = await message.getChat();
    if(message.type === MessageTypes.BUTTON_RESPONSE && chat.isGroup){
        await acceptEvent(message, client, db);
        return;
    }
    if(admins.includes((await message.getContact()).number+"@c.us")){
        await userOperation(message, client, db);
        return;
    }
};

module.exports = procMessage;
