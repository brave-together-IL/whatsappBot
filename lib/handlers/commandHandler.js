const {MessageTypes} = require('whatsapp-web.js');
const Database = require("../../bin/Database");
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
    if(message.type === MessageTypes.BUTTON_RESPONSE){

    }
};

module.exports = procMessage;
