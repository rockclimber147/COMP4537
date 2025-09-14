import { UserMessage } from "../lang/messages/en/user.js"

document.addEventListener("DOMContentLoaded", function (e) {
    new Game("goButton", "textInput", "buttonContainer")
});

class Utils {
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
}

export class Input {
    constructor(buttonId, inputId) {
        this.gameStartButton = document.getElementById(buttonId)
        this.input = document.getElementById(inputId)
        this.game = undefined
        this.gameStartButton.onclick = () => {
            this.game.start()
        }
    }

    setGame(game) {
        this.game = game
    }

    getInputVal() {
        const val = parseInt(this.input.value)
        if (!val) return undefined
        if (val < 3 || val > 7) return undefined
        return val
    }

    clearInputVal() {
        this.input.value = ""
    }

    disable() {
        this.gameStartButton.disabled = true
        this.input.disabled = true
    }

    enable() {
        this.gameStartButton.disabled = false
        this.input.disabled = false
    }
}

export class ButtonContainer {
    static BUTTON_WIDTH_EM = 10
    static BUTTON_HEIGHT_EM = 5
    constructor(containerId) {
        this.container = document.getElementById(containerId)
        this.buttons = []
        this.game = undefined
    }

    setGame(game) {
        this.game = game
    }

    createButtons(amount) {
        for (let i = 1; i <= amount; i++) {
            const button = new Button(i)
            button.setContainer(this)
            this.buttons.push(button)
            this.container.appendChild(button.getElement())
        }
    }

    async shuffle() {
        this.container.style.height = `${this.buttons.length * ButtonContainer.BUTTON_HEIGHT_EM}em`

        // I used ChatGPT to help figure out how to get the container size in em
        const rect = this.container.getBoundingClientRect()
        const fontSizePx = parseFloat(getComputedStyle(this.container).fontSize)
        const widthEm = rect.width / fontSizePx
        const heightEm = rect.height / fontSizePx
        // end chatGPT block
        
        const maxX = widthEm - ButtonContainer.BUTTON_WIDTH_EM
        const maxY = heightEm - ButtonContainer.BUTTON_HEIGHT_EM
        for (let i = 0; i < this.buttons.length; i++) {
            await Utils.sleep(2000)
            this.shuffleButtons(maxX, maxY)
        }
        await Utils.sleep(2000)
    }

    shuffleButtons(maxX, maxY) {
        for (let button of this.buttons) {
            const x = Math.random() * maxX
            const y = Math.random() * maxY
            button.setPosition(x, y)
        }
    }

    activateButtons() {
        for (let button of this.buttons) {
            button.setIsActive(true)
        }
    }

    hideButtonText() {
        for (let button of this.buttons) {
            button.hideText()
        }
    }

    clear() {
        for (let button of this.buttons) {
            button.remove()
        }
        this.buttons = []
    }

    onButtonClicked(number) {
        this.game.onButtonClicked(number)
    }
}

export class Button {
    constructor(number) {
        this.number = number
        this.buttonElement = document.createElement("button")
        this.parentContainer = undefined
        this.isActive = false
        this.isClicked = false
        this.setUpButtonElement()
    }

    setUpButtonElement() {
        this.buttonElement.id = `${this.number}`
        this.buttonElement.innerHTML = `${this.number}`
        this.buttonElement.style.backgroundColor = this.getRandomColor()
        this.buttonElement.classList.add("game-button")
        this.buttonElement.onclick = () => this.onClick()
    }

    setContainer(parent) {
        this.parentContainer = parent
    }

    setIsActive(val) {
        this.isActive = val
    }

    getElement() {
        return this.buttonElement
    }

    remove() {
        this.buttonElement.remove()
    }

    onClick() {
        if (!this.isActive || this.isClicked) return
        this.isClicked = true
        this.showText()
        this.parentContainer.onButtonClicked(this.number)
    }

    getRandomColor() {
        const letters = '3456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * (letters.length))];
        }
        return color;
    }

    setPosition(x, y) {
        this.buttonElement.style.position = "absolute"
        this.buttonElement.style.left = `${x}em`
        this.buttonElement.style.top = `${y}em`
    }

    hideText() {
        this.buttonElement.innerHTML = ""
    }

    showText() {
        this.buttonElement.innerHTML = this.buttonElement.id
    }
}

class Game {
    constructor(gameStartButtonId, inputTextBoxId, buttonContainerId) {
        this.input = new Input(gameStartButtonId, inputTextBoxId)
        this.input.setGame(this)
        this.buttonContainer = new ButtonContainer(buttonContainerId)
        this.buttonContainer.setGame(this)
        this.isRunning = false
        this.nextButtonIndex = 1;
    }

    async start() {
        if (this.isRunning) return
        const toCreate = this.input.getInputVal()
        if (!toCreate) return
        this.reset()
        this.isRunning = true
        this.input.disable()
        this.buttonContainer.createButtons(toCreate)
        await Utils.sleep(1000 * (toCreate - 2))
        await this.buttonContainer.shuffle()
        this.buttonContainer.activateButtons()
        this.buttonContainer.hideButtonText()        
    }

    end() {
        if (this.nextButtonIndex === this.input.getInputVal()) this.onWin()
        else this.onLose()
        this.isRunning = false
        this.reset()
    }

    reset() {
        this.buttonContainer.clear()
        this.nextButtonIndex = 1
        this.input.enable()
        this.isRunning = false
    }

    displayMessage(message) {
        alert(message)
    }

    onWin() {
        this.displayMessage(UserMessage.EXCELLENT_MEMORY)
        this.reset()
    }

    onLose() {
        this.displayMessage(UserMessage.WRONG_ORDER)
        this.reset()
    }

    onButtonClicked(number) {
        if (number == this.nextButtonIndex) this.nextButtonIndex++
        else this.onLose()
        if (this.nextButtonIndex == this.input.getInputVal() + 1) this.onWin()
    }
}
