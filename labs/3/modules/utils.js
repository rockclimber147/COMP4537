const dateTimeHelper = {
    getDate: function () {
        const now = new Date();
        return now.toISOString();
    }
};

module.exports = {
    dateTime: dateTimeHelper
};