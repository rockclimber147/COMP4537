const fs = require("fs");
const path = require("path");

class DateTimeHelper {
    getDate() {
        const now = new Date();
        return now.toISOString();
    }
}

class FileHelper {
    readFile(fileName) {
        const filePath = path.resolve(fileName);
        try {
            const data = fs.readFileSync(filePath, "utf-8");
            return data;
        } catch (err) {
            console.error(`Error reading file ${fileName}:`, err.message);
            return null;
        }
    }

    writeFile(content, fileName = "file.txt") {
        const filePath = path.resolve(fileName);
        try {
            fs.appendFileSync(filePath, content, "utf-8");
            console.log(`File ${fileName} appended successfully.`);
            return true;
        } catch (err) {
            console.error(`Error writing file ${fileName}:`, err.message);
            return false;
        }
    }
}

module.exports = {
    dateTime: new DateTimeHelper(),
    fileHelper: new FileHelper(),
};