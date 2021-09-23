/**
 *
 * @param {WAWebJS.Message} message
 * @param {WAWebJS.Client} client
 * @return {Promise<void>}
 */
const Server = require("../Server");


const procCommand = async (message, client) =>{
    const server = new Server();
    switch (message.body){
        case 'אשר':
            //TODO: update participation
            break;
        case 'בטל':
            //TODO:update participation
            console.log('בטל');
            break;
    }
    await message.reply("נרשמת בהצלחה");
}

module.exports = procCommand;
