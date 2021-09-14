const db = require('better-sqlite3')('..\\groups.db');
// db.run("CREATE TABLE groups(\n" +
//     "                          groupId varchar(255),\n" +
//     "                          place varchar(255),\n" +
//     "                          id BIGINT(128)\n" +
//     ");")
// db.serialize(function () {
    // db.get('SELECT * from blacklist', (err, result) => {
    //     if (err) {
    //         console.log(err)
    //     } else {
    //         console.log(result);
    //         // do something with result
    //     }
    // })
    // db.each('SELECT * FROM sqlite_master', function (err, row) {
    //     console.log(row);
    // });
//     db.each('SELECT * FROM groups', function (err, row) {
//         console.log(row);
//     });
// });
// db.run("insert into groups (groupId, place, id) values ('1251262', 'מרכז',0 );");
// db.run("delete from blacklist where phone=***********")
// db.run("DROP TABLE groups")
// db.close();
const start = async ()=>{
    // db.prepare("delete from groups where id=1").run();
    const row = await db.prepare('SELECT * FROM groups').all();
    // db.prepare("update groups set id=1 where id=2").run();
    // const row = await db.prepare("insert into groups (groupId, place, id ) values ('972507336650-1630936474@g.us', 'מרכז', '2')").run();
    console.log(row);
}
start();
