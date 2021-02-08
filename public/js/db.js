/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
let db;
(async function () {
    const dbName = "notes-db";
    const storeName = "notes";
    const version = 1;

    db = await idb.openDB(dbName, version, {
        upgrade(db) {
            const store = db.createObjectStore(storeName, { autoIncrement: true });
        }
    });
    window.db = db;
    const items = await db.transaction("notes").objectStore("notes").getAllKeys();

    if (items.length === 0) {
        document.getElementById("card").innerHTML = "You dont have any notes. <br>Click the \"add note\" icon to add one!";
    
    } else {
        document.getElementById("card").innerText = "You dont have any notes open.";
        loadNotes(items, db);   
    }
    
})();