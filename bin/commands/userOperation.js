

/**
 *
 * @param {WAWebJS.Message} message
 * @param {WAWebJS.Client} client
 * @param {Database} db
 * @return {Promise<void>}
 */
const approved = (message, client, db)=>{

}

/**
 *
 * @param {WAWebJS.Message} message
 * @param {WAWebJS.Client} client
 * @param {Database} db
 * @return {Promise<void>}
 */

const decline = (message, client, db)=>{

}

/**
 *
 * @param {WAWebJS.Message} message
 * @param {WAWebJS.Client} client
 * @param {Database} db
 * @return {Promise<void>}
 */

const procCommand = async (message, client, db)=>{
    switch (message.body){
        case 'אשר':
            approved();
            return;
        case 'בטל':
            decline();
            return;
    }

};

module.exports = procCommand;
