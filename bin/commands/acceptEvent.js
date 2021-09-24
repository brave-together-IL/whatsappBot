const Server = require("../Server");


/**
 *
 * @param {WAWebJS.Message} message
 * @param {WAWebJS.Client} client
 * @return {Promise<void>}
 */
const accept = async(message, client)=>{

}

/**
 *
 * @param {WAWebJS.Message} message
 * @param {WAWebJS.Client} client
 * @return {Promise<void>}
 */
const decline = async(message, client)=>{

}


/**
 *
 * @param {WAWebJS.Message} message
 * @param {WAWebJS.Client} client
 * @return {Promise<void>}
 */
const procCommand = async (message, client) =>{
    const server = new Server();
    switch (message.body){
        case 'אשר':
            await accept(message, client);
            return;
        case 'בטל':
            await decline(message, client);
            return;
    }
}

module.exports = procCommand;
