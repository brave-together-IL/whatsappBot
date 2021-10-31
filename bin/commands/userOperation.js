const {MessageTypes} = require("whatsapp-web.js");
const Server = require("../Server");


/**
 *
 * @param {WAWebJS.GroupChat[]}groups
 */
const findFitGroup = async (groups)=>{
    for(let i=0;i<groups.length;i++){
        if(groups[i].groupMetadata.participants.length<6){
            return groups[i];
        }
    }
    return undefined;
}

/**
 *
 * @param {WAWebJS.Message} message
 * @param {WAWebJS.Client} client
 * @param {Database} db
 * @return {Promise<void>}
 */
const approved = async (message, client, db)=>{
    const quoted = await message.getQuotedMessage();
    if(!quoted || !quoted.fromMe){
        return;
    }
    let infoMessage;
    if(quoted.type===MessageTypes.DOCUMENT){
        const chat = await quoted.getChat();
        const messages = await chat.fetchMessagesUntil(quoted);
        for(let i=0;i<messages.length;i++){
            if(messages[i].id._serialized===quoted.id._serialized){
                infoMessage = messages[i-1];
                break;
            }
        }
        if(!infoMessage){
            return;
        }
    }else{
        infoMessage = quoted;
    }
    const answers = infoMessage.body.split("\n").splice(0, 5);

    await db.updateGroups();
    let server = new Server();
    let res = await server.createUser(answers[0], answers[1], answers[2], answers[3], answers[4]);
    if (res.isAxiosError){
        return;
    }
    //adding user to fit group.
    let groupsId = await db.getGroupsByPlace(answers[3]);
    let groups = [];
    for (let i =0;i<groupsId.length;i++){
        try {
            groups.push(await client.getChatById(groupsId[i]));
        }catch(err){
        }
    }
    let fitGroup = await findFitGroup(groups);
    if (!fitGroup){
        const res = await client.createGroup(answers[2], [answers[4]+"@c.us"]);
        db.addGroup(res.gid._serialized, answers[2]);
        return;
    }
    // await fitGroup.addParticipants([answers[5]+"@c.us"]);
    const inviteCode = await fitGroup.getInviteCode();
    await client.sendMessage(answers[4]+"@c.us", "https://chat.whatsapp.com/"+inviteCode, {linkPreview: true});
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
            await approved(message, client, db);
            return;
    }

};

module.exports = procCommand;
