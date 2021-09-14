const path = require("path");
const db = require('better-sqlite3')(path.resolve(__dirname, '../groups.db'));


class Database {
    /**
     *
     * @param {WAWebJS.Client} client
     */
    constructor(client) {
        this.client = client;
        this.counter = db.prepare("select * from groups").all().length;
    }

    async updateGroups(){
        this.groups = await this.getGroups();
    }


    /**
     *
     * @return {Promise<WAWebJS.Chat[]>}
     */
    async getGroups(){
        const groupsIDs = db.prepare("select groupId from groups").all().map(obj=>obj.groupId);
        let groups = [];
        for (let i=0;i<groupsIDs.length;i++){
            try {
                groups.push(await this.client.getChatById(groupsIDs[i]));
            }catch{}
        }
        return groups;
    }

    /**
     *
     * @param {string}place
     */
    async getGroupsByPlace(place){
        const command = "SELECT groupId FROM groups where place='"+place+"';";
        return db.prepare(command).all().map(obj=>obj.groupId);
    }

    addGroup(groupId, place){
        db.prepare("insert into groups (groupId, place, id ) values ('"+groupId+"', '"+place+"', "+this.counter+")").run();
        this.counter++;
        // const row = await db.prepare("insert into groups (groupId, place, id ) values ('972507336650-1630936474@g.us', 'מרכז', '2')").run();


    }

}



module.exports = Database;
