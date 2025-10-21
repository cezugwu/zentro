const getRandomString = (length = 11) => {
    const str = "abcd1234567fdghqytyuegthjfukhjkgi"; // Define the string inside the function
    let result = "";
    
    for (let i = 0; i < length; i++) {
        let randomIndex = Math.floor(Math.random() * str.length);
        result += str.charAt(randomIndex);
    }

    return result;
}

export default getRandomString;