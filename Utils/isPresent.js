const isPresent = (userInput) => {
    if (userInput === "" || userInput === undefined || userInput === null) {
        return false;
    } else {
        return true;
    }
};
module.exports = { isPresent };
