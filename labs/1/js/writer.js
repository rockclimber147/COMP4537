import { Button, RedirectButton, CSS, Pages, NoteContainer, StorageAccess } from "./script.js";
import { Messages } from "../lang/en/user.js";
document.addEventListener("DOMContentLoaded", function (e) {
    new Content()
});

class Content {
    constructor() {
        const body = document.body;

        this.updatedAt = document.createElement("div");
        this.updatedAt.innerHTML = Messages.UPDATED_AT(this.getFormattedTime());
        body.appendChild(this.updatedAt);

        this.writerElement = document.createElement("div")
        this.writerContainer = new WriterNoteContainer(this.writerElement);
        body.appendChild(this.writerElement)

        const notes = StorageAccess.loadNotes();
        this.writerContainer.loadNotes(notes);

        this.addButtonCntainer = document.createElement("div")
        body.append(this.addButtonCntainer)
        this.addButton = new Button(Messages.ADD, [CSS.ADD_BUTTON], () => {
            this.writerContainer.addNote("", -1)
            StorageAccess.saveNotes(this.writerContainer.getAllTexts()) 
        })
        this.addButton.render(this.addButtonCntainer)

        const backButton = new RedirectButton(Messages.BACK, [CSS.BACK_BUTTON], Pages.INDEX);
        backButton.render(body);

        this.startUpdatingTimestamp();
    }

    getFormattedTime() {
        return new Date().toLocaleTimeString();
    }

    update() {
        this.updatedAt.innerHTML = Messages.STORED_AT(this.getFormattedTime());
        this.writerContainer.update()
    }

    startUpdatingTimestamp() {
        setInterval(() => this.update(), 2000);
    }
}

class WriterNoteContainer extends NoteContainer {
    constructor(parent) {
        super(parent);
    }

    addNote(text, index) {
        const note = super.addNote(text, index);

        const removeBtn = new Button(Messages.REMOVE, [CSS.REMOVE_BUTTON], () => {
            this.notes = this.notes.filter(n => n !== note);
            note.container.remove();
            StorageAccess.saveNotes(this.getAllTexts());
        });

        removeBtn.render(note.container);
        StorageAccess.saveNotes(this.getAllTexts());
        return note;
    }

    update() {
        StorageAccess.saveNotes(this.getAllTexts());
    }
}