const fs = require("fs");
const path = require("path");

class DateTimeHelper {
    getDate() {
        const now = new Date();
        return now.toISOString();
    }
}

class FileHelper {
    static BASE_DIR_NAME = "files"
    static MAX_FILES = 5

    constructor() {
        this.BASE_DIR = path.resolve(FileHelper.BASE_DIR_NAME);

        if (!fs.existsSync(this.BASE_DIR)) {
            fs.mkdirSync(this.BASE_DIR, { recursive: true });
        }
    }

    readFile(fileName) {
        const filePath = path.join(this.BASE_DIR, fileName);
        try {
            const data = fs.readFileSync(filePath, "utf-8");
            return data;
        } catch (err) {
            console.error(`Error reading file ${fileName}:`, err.message);
            return null;
        }
    }

    writeFile(content, fileName = "file.txt") {
        if (!this.fileExists(fileName) && !this.canAddFile()) return false
        const filePath = path.join(this.BASE_DIR, fileName);
        try {
            fs.appendFileSync(filePath, content, "utf-8");
            console.log(`File ${fileName} appended successfully.`);
            return true;
        } catch (err) {
            console.error(`Error writing file ${fileName}:`, err.message);
            return false;
        }
    }

    fileExists(fileName) {
        const filePath = path.join(this.BASE_DIR, fileName);
        try {
            return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
        } catch (err) {
            console.error(`Error checking file ${fileName}:`, err.message);
            return false;
        }
    }

    canAddFile() {
        try {
            const files = fs.readdirSync(this.BASE_DIR, { withFileTypes: true });
            const fileCount = files.filter(f => f.isFile()).length;
            return fileCount < FileHelper.MAX_FILES;
        } catch (err) {
            console.error("Error checking files in base directory:", err.message);
            return false;
        }
    }
}

module.exports = {
    dateTime: new DateTimeHelper(),
    fileHelper: new FileHelper(),
};