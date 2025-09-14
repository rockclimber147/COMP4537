import { RedirectButton, CSS, Pages } from "./script.js";
import { Messages } from "../lang/en/user.js";
document.addEventListener("DOMContentLoaded", function (e) {
    new Content()
});

class Content {
    constructor() {
        const title = document.getElementById("title")
        title.innerHTML = Messages.TITLE
        const navDiv = document.getElementById("nav")
        const readButton = new RedirectButton(Messages.READER, [], Pages.READER)
        readButton.render(nav)
        const writeButton = new RedirectButton(Messages.WRITER, [], Pages.WRITER)
        writeButton.render(nav)
    }
}