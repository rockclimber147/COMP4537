export class Button {
  constructor(text, cssClasses = [], onClick = null) {
    this.element = document.createElement("button");
    this.element.textContent = text;
    this.element.classList.add(...cssClasses);
    if (onClick) {
      this.element.addEventListener("click", onClick);
    }
  }

  render(parent) {
    parent.appendChild(this.element);
  }
}

export class RedirectButton extends Button {
  constructor(text, cssClasses = [], filename) {
    super(text, cssClasses, () => {
      window.location.href = filename;
    });
  }
}

export class NoteContainer {
  constructor(parent) {
    this.parent = parent;
    this.container = document.createElement("div");
    this.container.classList.add(CSS.NOTE_CONTAINER);
    this.notes = [];
    this.parent.appendChild(this.container);
  }

  loadNotes(notesArray) {
    this.clear();
    notesArray.forEach((text, index) => this.addNote(text, index));
  }

  addNote(text = "", index = this.notes.length) {
    const note = new Note(text, index);
    this.notes.push(note);
    note.render(this.container);
    return note;
  }

  getAllTexts() {
    return this.notes.map(note => note.getText());
  }

clear() {
    this.notes.forEach(note => {
        if (note.container.parentNode) {
            note.container.parentNode.removeChild(note.container);
        }
    });
    this.notes = [];
}
}

class Note {
  constructor(text, index) {
    this.container = document.createElement("div");
    this.container.classList.add(CSS.NOTE)
    this.index = index
    this.textarea = document.createElement("textarea");
    this.textarea.value = text;
    this.container.appendChild(this.textarea);
  }

  getText() {
    return this.textarea.value;
  }

  render(parent) {
    parent.appendChild(this.container);
  }
}

export class StorageAccess {
  static STORAGE_KEY = "notes";
    static saveNotes(notesArray) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notesArray));
    }

    static loadNotes() {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    }
}

export class CSS {
    static REMOVE_BUTTON = "remove-button"
    static ADD_BUTTON = "add-button"
    static BACK_BUTTON = "back-button"
    static TEXT_BOX = "text-box"
    static NOTE_CONTAINER = "note-container"
    static NOTE = "note"
}

export class Pages {
  static INDEX = "index.html"
  static READER = "reader.html"
  static WRITER = "writer.html"
}
