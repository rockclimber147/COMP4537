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
    static MAX_FILE_SIZE = 5 * 1024 * 1024

    constructor() {
        this.BASE_DIR = path.resolve(FileHelper.BASE_DIR_NAME);

        if (!fs.existsSync(this.BASE_DIR)) {
            fs.mkdirSync(this.BASE_DIR, { recursive: true });
        }
    }

    readFile(fileName) {
        const filePath = this.getPath(fileName);
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
        const filePath = this.getPath(fileName)

        if (this.fileExists(fileName)) {
            try {
                const stats = fs.statSync(filePath);
                if (stats.size + Buffer.byteLength(content, "utf-8") > FileHelper.MAX_FILE_SIZE) {
                    console.warn(`Cannot append to "${fileName}": file size limit exceeded`);
                    return false;
                }
            } catch (err) {
                console.error(`Error checking size of file ${fileName}:`, err.message);
                return false;
            }
        }

        try {
            fs.appendFileSync(filePath, content, "utf-8");
            console.log(`File ${fileName} appended successfully.`);
            return true;
        } catch (err) {
            console.error(`Error writing file ${fileName}:`, err.message);
            return false;
        }
    }

    fileExists(filePath) {
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

    getPath(fileName) {
        const safeFileName = path.basename(fileName);
        const filePath = path.join(this.BASE_DIR, safeFileName);
        return filePath
    }
}

module.exports = {
    dateTime: new DateTimeHelper(),
    fileHelper: new FileHelper(),
};