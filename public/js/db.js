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
    }
    const a = async (x) => {
        const items = await db.transaction("notes").objectStore("notes").getAllKeys();
        if (x.matches) {
            console.log("Mobile mode");
            loadNotes(items, db, false, "notes-mobile", true, "mobile");
        }
        else {
            console.log("desktop mode");
            loadNotes(items, db, false, "notes", true, "desktop");
        }
    };
    let x = window.matchMedia("(max-width: 700px)");
    a(x);
    x.addEventListener("change", a);


})();

window.addEventListener("resize", resetHeight);
resetHeight();