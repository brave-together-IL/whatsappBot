const Server = require('../bin/Server');

const start = async()=>{
    const server = new Server();
    console.log(await server.createEvent(["taga1", "tag2", "waiting"], "event titleas asd", "אירוע התנדבות בלה בלה בלה", "", "", -1, "דרום"))
    // console.log(await server.getEventsByTag(["tag2"]));
}
start();
