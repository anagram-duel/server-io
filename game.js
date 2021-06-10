const words = require("./animals.json");

const generateRandomWord = () => {
	const randomIndex = Math.ceil(Math.random() * words.length);
	return words[randomIndex];
};

const generateScrambleWord = (word) => {
	word = word.toUpperCase();
	word = word.split("");
	for (var b = word.length - 1; 0 < b; b--) {
		var c = Math.floor(Math.random() * (b + 1));
		d = word[b];
		word[b] = word[c];
		word[c] = d;
	}
	return word.join("");
};

const generateWord = () => {
	const word = generateRandomWord();
	const scrambleWord = generateScrambleWord(word);
	return { word, scrambleWord };
};

const guess = (playerWord, correctWord) => {
	const guess =
		playerWord.toUpperCase().trim() === correctWord.toUpperCase().trim()
			? true
			: false;
	return guess;
};

module.exports = { generateRandomWord, guess };
