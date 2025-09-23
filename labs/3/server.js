const http = require("http")
const dateTimeUtils = require("./modules/utils");
const dateTimeHelper = dateTimeUtils.dateTime;
const Messages = require(`./lang/en/en`)

const PORT = process.env.PORT || 3001;

http.createServer(function (req, res) {

}).listen(PORT)

console.log(dateTimeHelper.getDate())
console.log(Messages.WELCOME)