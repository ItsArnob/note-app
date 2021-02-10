/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */

function resetHeight() {
    document.body.style.height = `${window.innerHeight}px`;
}
function getOrdialDay(dt) {
    return dt + (dt % 10 == 1 && dt != 11 ? "st" : (dt % 10 == 2 && dt != 12 ? "nd" : (dt % 10 == 3 && dt != 13 ? "rd" : "th")));
}
async function loadNotes(items, db, a, id, reload, device) {
    if (!document.getElementById(id).childElementCount == 0) { document.getElementById(id).innerHTML = ""; }
    const ids = items.reverse();
    const idsLength = ids.length;
    console.log(device, "outofloop");
    ids.forEach(async key => {
        const obj = await db.transaction("notes").objectStore("notes").get(key);
        const div = document.createElement("div");
        console.log(device, "outofclickevent");
        div.addEventListener("click", () => {
            if (document.querySelector(".selectedNote")) { document.querySelector(".selectedNote").classList.remove("selectedNote"); }
            div.classList.add("selectedNote");
            const date = obj.createdAt;
            const now = new Date();
            const hour12Time = date.toLocaleString("default", { minute: "numeric", hour: "numeric", hour12: true });
            const timeStamp = now.getDate() === date.getDate() ? `Today at ${hour12Time}` : now.getDate() - 1 === date.getDate() ? `Yesterday at ${hour12Time}` : `${date.toLocaleString("default", { month: "short" })} ${getOrdialDay(date.getDate())} ${date.getFullYear()}`;
            console.log(device);
            if (device == "desktop") {
                document.getElementById("card").innerHTML = `<div id="titleAndTime-desk"><p class="noteTitleName">Note name:</p> <p class="title" id="title"> </p> <p class="time">${timeStamp}</p></div> <p id="card-note" class="card-note"></p>`;
                document.getElementById("title").innerText = obj.title;
                document.getElementById("card-note").innerText = obj.note; 
            }
            else {
                console.log(obj);
                document.getElementById("note-container-mobile").style.display = "flex";
                document.getElementById("notes-mobile").style.display = "none";
                document.getElementById("mobile-top-bar").style.display = "none";
                document.getElementById("card-mobile").innerHTML = `<div id="titleAndTime"><p class="noteTitleName">Note name:</p> <p id="title-mobile" class="title"> </p> <p class="time">${timeStamp}</p></div> <p class="card-note" id="card-note-mobile"></p>`;
                document.getElementById("title-mobile").innerText = obj.title;
                document.getElementById("card-note-mobile").innerText = obj.note; 
            }

        });
        if (device == "desktop") {
            div.className = "note";
        } else div.className = "note-mobile";

        div.id = key;
        div.innerHTML = "<p class=\"noteTitle\"></p><p class=\"noteText\"></p>";
        div.querySelector(".noteTitle").innerText = obj.title;
        if (obj.note.indexOf("\n") == -1) { div.querySelector(".noteText").innerText = obj.note; }
        else div.querySelector(".noteText").innerText = obj.note.substr(0, obj.note.indexOf("\n"));
        document.getElementById(id).append(div);
        if (!--ids.length) {
            if (a && !reload) {
                if(device == "desktop") {
                    document.querySelector(".note").click();
                } else {
                    document.querySelector(".note-mobile").click();
                }

            }
            else if (reload) {
                document.getElementById("notes-mobile").style.display = "";
                document.getElementById("note-container-mobile").style.display = "none";
                document.getElementById("mobile-top-bar").style.display = "";
                if (idsLength > 0) {
                    return document.getElementById("card").innerText = "You dont have any notes open.";

                }
                document.getElementById("card").innerHTML = "You dont have any notes. <br>Click the \"add note\" icon to add one!";
            }

        }
    });

}
async function addNote(isMobile) {
    if (isMobile) {
        document.getElementById("note-container-mobile").style.display = "flex";
        document.getElementById("notes-mobile").style.display = "none";
        document.getElementById("mobile-top-bar").style.display = "none";
        return a(document.getElementById("card-mobile"), true);
    }
    a(document.getElementById("card"));
    function a(noteContainer, ismobile) {
        if (document.querySelector(".selectedNote")) { document.querySelector(".selectedNote").classList.remove("selectedNote"); }
        noteContainer.innerHTML = `
    <div id="noteTitleContainer"><input type="text" placeholder="Note title" id="noteTitleInput"><div id="buttonsContainer"> <button id="saveBtn" onclick="saveNote(${ismobile ? true : false})">Save note</button> <button id="cancelBtn" onclick="cancelNote(${isMobile ? true : false})">Cancel</button></div> </div> <textarea placeholder="The note itself" id="noteInput"></textarea>
    `;
    }

}
async function saveNote(isMobile) {
    const noteTitle = document.getElementById("noteTitleInput");
    const note = document.getElementById("noteInput");
    if (noteTitle.value == "" || noteTitle.value.trim() == "") return console.log("You didn't enter a title.");
    if (note.value == "" || note.value.trim() == "") return console.log("You didn't enter the note.");

    const tx = db.transaction("notes", "readwrite");
    const store = await tx.objectStore("notes");
    const now = new Date();
    const valToStore = {
        title: noteTitle.value,
        note: note.value,
        createdAt: now,
        updatedAt: now
    };
    const value = await store.put(valToStore);
    await tx.done;
    const items = await db.transaction("notes").objectStore("notes").getAllKeys();
    if (isMobile) {
        loadNotes(items, db, true, "notes-mobile", undefined, "mobile");
    }
    else loadNotes(items, db, true, "notes", undefined, "desktop");


}
async function cancelNote(isMobile) {
    document.getElementById("card").innerHTML = "";
    const items = await db.transaction("notes").objectStore("notes").getAllKeys();
    if (isMobile) {
        document.getElementById("notes-mobile").style.display = "";
        document.getElementById("mobile-top-bar").style.display = "";
        document.getElementById("note-container-mobile").style.display = "none";   
    }
    else {
        if (items.length === 0) {
            document.getElementById("card").innerHTML = "You dont have any notes. <br>Click the \"add note\" icon to add one!";

        } else {
            document.getElementById("card").innerText = "You dont have any notes open.";
        }
    }
}
async function notesMobileButton() {
    if (document.querySelector(".selectedNote")) { document.querySelector(".selectedNote").classList.remove("selectedNote"); }
    document.getElementById("notes-mobile").style.display = "";
    document.getElementById("mobile-top-bar").style.display = "";
    document.getElementById("note-container-mobile").style.display = "none";

}