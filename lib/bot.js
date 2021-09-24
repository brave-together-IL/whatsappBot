const {Client} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const Settings = require('../config/bot.json');
const fs = require('fs');
const path = require('path');
const {forwardToDialog, dialogMap} = require('./handlers/dialogHandler')
const Dialog = require('../bin/signUp/Dialog')
const commandHandler = require('./handlers/commandHandler');
const startEventLoop = require('./eventsUpdater');
const Database = require("../bin/Database");
let db;
// Mange client settings.
// Load session file.
if (fs.existsSync(Settings.sessionFile)) {
  Settings.launchOptions.session = require(path.resolve(Settings.sessionFile));
}

// Define client.
const client = new Client(Settings.launchOptions);

client.on('qr', (qr) => {
  qrcode.generate(qr, {small: true});
});

client.on('authenticated', (session) => {
  console.log('AUTHENTICATED');
  // Save session to file.
  fs.writeFile(Settings.sessionFile, JSON.stringify(session), function(err) {
    if (err) {
      console.error(err);
    }
  });
});

client.on('ready', () => {
  console.log('Client is ready!');
  startEventLoop(client)
  db = new Database(client);
  db.updateGroups();
});

client.on('message_create', async (message) => {
  const chat = await message.getChat();
  commandHandler(message, client, db);
  if(!chat.isGroup) {
    if (message.body === 'בדיקה' && !message.fromMe) {
      dialogMap.set(message.getChatId(), new Dialog(client, message.getChatId()));
    }
    if (!message.fromMe) {
      forwardToDialog(message);
    }
  }
  });


// Start client actions.
client.initialize().catch((err) => console.log(err));
