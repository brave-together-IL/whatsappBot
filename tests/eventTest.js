const Server = require('../bin/Server');

const start = async()=>{
    const server = new Server();
    console.log(await server.createEvent(["taga1", "tag2", "waiting"], "שasdasd", "אירוע התנדבות בלה בלה בלה", "", "", -1, "ירושלים"))
    // console.log(await server.getEventsByTag(["tag2"]));
}
start();
