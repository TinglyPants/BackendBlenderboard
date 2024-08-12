const isCorrectLength = (userInput, minInclusive, maxInclusive) => {
    if (userInput.length >= minInclusive && userInput.length <= maxInclusive) {
        return true;
    } else {
        return false;
    }
};
module.exports = { isCorrectLength };
