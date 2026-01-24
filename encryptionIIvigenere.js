/** @param {NS} ns **/
export async function main(ns) {
	// Retrieve contract filename and host from command-line arguments.
	const contract = ns.args[0];
	const host = ns.args[1];

	// Get the contract data, which should be an array: [plaintext, keyword]
	const data = ns.codingcontract.getData(contract, host);
	if (!Array.isArray(data) || data.length !== 2) {
		ns.tprint("ERROR: Contract data is not in the expected format.");
		return;
	}
	let plaintext = data[0];
	let keyword = data[1];

	// Encrypt the plaintext using the Vigenère cipher with the given keyword.
	const ciphertext = vigenereEncrypt(plaintext, keyword);

	// Attempt to solve the contract with the ciphertext.
	const res = ns.codingcontract.attempt(ciphertext, contract, host, { returnReward: true });
	ns.tprint(`Ciphertext: ${ciphertext}`);
	if (res) {
		ns.tprint(`Reward: ${res}`);
		ns.write("contractReward.txt", res, "w");
	} else {
		ns.tprint("Attempt failed or answer incorrect.");
	}
}

/**
 * Encrypts the plaintext using the Vigenère cipher.
 * Each letter in the plaintext is paired with a letter from the repeating keyword.
 * Non-alphabet characters (if any) are left unchanged.
 *
 * @param {string} plaintext - The text to be encrypted.
 * @param {string} keyword - The keyword to use for encryption.
 * @returns {string} The resulting ciphertext in uppercase.
 */
function vigenereEncrypt(plaintext, keyword) {
	// Ensure both plaintext and keyword are in uppercase.
	plaintext = plaintext.toUpperCase();
	keyword = keyword.toUpperCase();

	let ciphertext = "";
	let keyIndex = 0;

	// Process each character of the plaintext.
	for (let i = 0; i < plaintext.length; i++) {
		const char = plaintext[i];
		// Check if the character is an uppercase letter.
		if (char >= "A" && char <= "Z") {
			// Get the 0-indexed position of the plaintext character.
			const ptIndex = char.charCodeAt(0) - 65;
			// Get the corresponding key letter (repeat the keyword as needed).
			const keyChar = keyword[keyIndex % keyword.length];
			// Compute the shift amount (0 for A, 1 for B, etc.).
			const shift = keyChar.charCodeAt(0) - 65;
			// Encrypt the character: (plaintext index + shift) mod 26.
			const cipherIndex = (ptIndex + shift) % 26;
			ciphertext += String.fromCharCode(cipherIndex + 65);
			keyIndex++;  // Only increment for letters.
		} else {
			// Preserve any non-alphabetical characters (e.g., spaces).
			ciphertext += char;
		}
	}
	return ciphertext;
}
