const isValidContent = (userInput, regExp) => {
    return regExp.test(userInput);
};
module.exports = { isValidContent };
