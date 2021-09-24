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
     */
    constructor(client, chatId) {
        this.client = client;
        this.chatId = chatId;
        this.partCounter = 0;
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
     * Dialog over.
     *
     */
    async dialogOver(){
        let output = 'תודה רבה על שנרשמתם ל brave IL.\nבמידה ותימצאו מתאימים תצורפו לקבוצה ייעודית.';
        await this.sendMessage(output);
        dialogHandler.dialogMap.delete(this.chatId);
    }


}

module.exports = Dialog;
