const Database = require('../../bin/Database');
const {Buttons} = require('whatsapp-web.js');
let db;
/**
 *
 * @param {[]}arr
 * @param value
 * @return {*}
 */
const removeItemOnce = (arr, value)=>{
    let index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}



/**
 * Redirects message calls to the right dialog.
 *
 * @param {object} event
 * @param {Server} server
 * @param {WAWebJS.Client} client
 * @return {Promise<void>}
 */
const procEvent = async (event, server, client) => {
    console.log(event);
    await server.updateEvent(event.id, removeItemOnce(event.tags, "waiting"));
    if(!db){
        db = new Database(client);
    }
    await db.updateGroups();
    let button = new Buttons(event.description, [{body:"מאשר"},{body:"בטל"}],event.title,"כדי לאשר את ההתנדבות אנא לחצו על \"מאשר\".\nכדי לבטל את השתתפותכם לחצו על \"בטל\".");

    let groupsIds = await db.getGroupsByPlace(event.geolocation);
    for (let i =0;i<groupsIds.length;i++){
        await client.sendMessage(groupsIds[i], button);
    }


};

module.exports.procEvent = procEvent;
