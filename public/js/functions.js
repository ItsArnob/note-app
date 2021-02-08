/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
async function loadNotes(items, db, a) {
    if (!document.querySelectorAll(".note").length == 0) { console.log("A"); document.getElementById("notes").innerHTML = ""; }
    const ids = items.reverse();
    let idsLength = ids.length;
    ids.forEach(async key => {
        const obj = await db.transaction("notes").objectStore("notes").get(key);
        const div = document.createElement("div");

        div.addEventListener("click", () => {
            if (document.querySelector(".selectedNote")) { document.querySelector(".selectedNote").classList.remove("selectedNote"); }
            div.classList.add("selectedNote");
            document.getElementById("card").innerText = obj.note;
        });

        div.className = "note";
        div.id = key;
        div.innerHTML = "<p class=\"noteTitle\"></p><p class=\"noteText\"></p>";
        div.querySelector(".noteTitle").innerText = obj.title;
        console.log(obj.note);
        if (obj.note.indexOf("\n") == -1) { div.querySelector(".noteText").innerText = obj.note; }
        else div.querySelector(".noteText").innerText = obj.note.substr(0, obj.note.indexOf("\n"));
        document.getElementById("notes").appendChild(div);
        if (!--ids.length && a) { document.querySelector(".note").click();}

    });

}
async function addNote() {
    const noteContainer = document.getElementById("card");
    if (document.querySelector(".selectedNote")) { document.querySelector(".selectedNote").classList.remove("selectedNote"); }
    noteContainer.innerHTML = `
    <div id="noteTitleContainer"><input type="text" placeholder="Note title" id="noteTitleInput"><div id="buttonsContainer"> <button id="saveBtn" onclick="saveNote()">Save note</button> <button id="cancelBtn" onclick="cancelNote()">Cancel</button></div> </div> <textarea placeholder="The note itself" id="noteInput"></textarea>
    `;
     
}
async function saveNote() {
    const noteTitle = document.getElementById("noteTitleInput");
    const note = document.getElementById("noteInput");
    if(noteTitle.value == "" || noteTitle.value.trim() == "") return console.log("You didn't enter a title.");
    if(note.value == "" || note.value.trim() == "") return console.log("You didn't enter the note.");
    
    const tx = db.transaction("notes", "readwrite");
    const store = await tx.objectStore("notes");
    const now = new Date();
    const valToStore ={
        title: noteTitle.value,
        note: note.value, 
        createdAt: now,
        updatedAt: now 
    }; 
    const value = await store.put(valToStore);
    await tx.done;
    const items = await db.transaction("notes").objectStore("notes").getAllKeys();
    loadNotes(items, db, true);
}
async function cancelNote() {
    document.getElementById("card").innerHTML = "";
    const items = await db.transaction("notes").objectStore("notes").getAllKeys();

    if (items.length === 0) {
        document.getElementById("card").innerHTML = "You dont have any notes. <br>Click the \"add note\" icon to add one!";

    } else {
        document.getElementById("card").innerText = "You dont have any notes open.";
    }
}