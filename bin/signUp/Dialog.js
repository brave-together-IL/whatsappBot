const Database = require('../Database')
const dialogHandler = require('../../lib/handlers/dialogHandler');
const {List, MessageMedia} = require('whatsapp-web.js');
const Server = require('../Server');
let sections = [{title:'איזורים',rows:[{title:'מרכז'},{title:'צפון'},{title:'ירושלים'},{title:'דרום'}]}];
const list = new List('אנא בחרו את איזור מגוריכם','לבחירה',sections,'איזור מגורים','פוטר');
const pdfPath = require("../../config/bot.json").pdfFile;
const messages = [
    'היי, ברוכים הבאים לצ\'אט ההתנדבות של מצעד הגבורה!\nאנו שמחים שבחרתם להתנדב ולתרום מזמנכם למטרה נעלה זו.\nכדי להתחיל אנו זקוקים למספר פרטים\n\nשם פרטי:',
    'שם משפחה:',
    list,
    'מייל:',
    MessageMedia.fromFilePath(pdfPath)
];
const admins = require('../../config/admins');



/**
 * Dialog class.
 */
class Dialog{
    answers = [];


    /**
     * Constructor for a dialog game.
     *
     * @param {WAWebJS.Client} client
     * @param {string} chatId
     * @param {Database} db
     */
    constructor(client, chatId, db) {
        this.client = client;
        this.chatId = chatId;
        // Cap question count.
        this.partCounter = 0;
        this.db = db;
    }

    /**
     * Prepares the outside given data from processing.
     *
     * @param {WAWebJS.Message} message
     */
    async procMessage(message) {

        if(!this.validate(message)){
            await this.sendMessage(messages[this.partCounter-1]);
            return;
        }
        if(this.partCounter===5){
            this.answers.push(message.from.split('@')[0])
            let output = '';
            for(let j=1;j<this.answers.length;j++){
                output += this.answers[j]+'\n';
            }
            for(let i=0;i<admins.length;i++){
                await this.client.sendMessage(admins[i], await message.downloadMedia());
                await this.client.sendMessage(admins[i], output);
            }
            this.dialogOver();
            return;
        }else{
            this.answers.push(message.body);
        }
        await this.sendMessage(messages[this.partCounter])
        this.partCounter++;
    }



    /**
     * Send message to the chat.
     *
     * @param text
     */
    async sendMessage(text){
        await this.client.sendMessage(this.chatId, text);
    }


    /**
     * validate message info.
     *
     * @param {WAWebJS.Message} message
     */
    validate(message){
        switch (this.partCounter){
            case 0:
                return true;
            case 1:
            case 2:
                return this.validateName(message.body);
            case 3:
                return message.type==='list_response';
            case 4:
                return this.validateMail(message.body);
            case 5:
                return message.type==="document";


        }

    }


    /**
     * Validate name
     * @param {string} name
     */
    validateName(name){
        return name.length>1;
    }

    /**
     * Validate email
     * @param {string} email
     * @return {boolean}
     */
    validateMail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.toLowerCase());
    }

    /**
     *
     * @param {GroupChat[]}groups
     */
    findFitGroup(groups){
        for(let i=0;i<groups.length;i++){
            if(groups[i].groupMetadata.participants.length<6){
                return groups[i];
            }
        }
        return undefined;
    }

    /**
     * Dialog over.
     *
     */
    async dialogOver(){
        let output = 'תודה רבה על שנרשמתם ל brave IL.\nבמידה ותימצאו מתאימים תצורפו לקבוצה ייעודית.';
        await this.sendMessage(output);
        dialogHandler.dialogMap.delete(this.chatId);
        /*await this.db.updateGroups();
        let server = new Server();
        let res = await server.createUser(this.answers[1], this.answers[2], this.answers[3], this.answers[4], this.answers[5]);
        if (res.isAxiosError){
            this.answers.splice(3, 2);
            this.partCounter--;
            await this.sendMessage("אימייל זה תפוס.\n אנא נסה מייל אחר:");
            return;
        }
        await this.sendMessage();*/

        /*dialogHandler.dialogMap.delete(this.chatId);
        //adding user to fit group.
        let groupsId = await this.db.getGroupsByPlace(this.answers[3]);
        let groups = [];
        for (let i =0;i<groupsId.length;i++){
            try {
                groups.push(await this.client.getChatById(groupsId[i]));
            }catch(err){
            }
        }
        let fitGroup = this.findFitGroup(groups);
        if (!fitGroup){
            const res = await this.client.createGroup(this.answers[3], [this.answers[5]+"@c.us"]);
            this.db.addGroup(res.gid._serialized, this.answers[3]);
            return;
        }

        // await fitGroup.addParticipants([this.answers[5]+"@c.us"]);
        const inviteCode = await fitGroup.getInviteCode();
        await this.client.sendMessage(this.answers[5]+"@c.us", "https://chat.whatsapp.com/"+inviteCode, {linkPreview: true});*/
    }


}

module.exports = Dialog;
