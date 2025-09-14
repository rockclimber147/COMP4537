import { RedirectButton, CSS, Pages, NoteContainer, StorageAccess } from "./script.js";
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

        this.readerContainer = new ReaderNoteContainer(body);

        const backButton = new RedirectButton(Messages.BACK, [CSS.BACK_BUTTON], Pages.INDEX);
        backButton.render(body);

        this.update()
        window.addEventListener("storage", () => this.update());
        this.startUpdatingTimestamp();
    }

    getFormattedTime() {
        return new Date().toLocaleTimeString();
    }

    update() {
        this.updatedAt.innerHTML = Messages.UPDATED_AT(this.getFormattedTime());
        this.readerContainer.clear()
        this.readerContainer.addNotes()
    }

    startUpdatingTimestamp() {
        setInterval(() => this.update(), 2000);
    }
}

class ReaderNoteContainer extends NoteContainer {
    addNotes() {
        const notes = StorageAccess.loadNotes()
        this.loadNotes(notes)
    }

    addNote(text, index) {
        const note = super.addNote(text, index);
        return note;
    }
}