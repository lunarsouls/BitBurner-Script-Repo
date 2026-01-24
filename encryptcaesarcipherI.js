/** @param {NS} ns **/
export async function main(ns) {
	// Retrieve contract filename and host from command-line arguments.
	const contract = ns.args[0];
	const host = ns.args[1];

	// Retrieve the contract data.
	// Expected format: [plaintext, shiftValue]
	const data = ns.codingcontract.getData(contract, host);
	if (!Array.isArray(data) || data.length !== 2) {
		ns.tprint("ERROR: Contract data is not in the expected format.");
		return;
	}

	let plaintext = data[0];
	const shift = data[1];

	// Ensure plaintext is uppercase.
	plaintext = plaintext.toUpperCase();
	let ciphertext = "";

	// Loop over each character in the plaintext.
	for (let i = 0; i < plaintext.length; i++) {
		const char = plaintext[i];
		// Check if character is an uppercase letter (A-Z).
		if (char >= 'A' && char <= 'Z') {
			// Convert letter to index (0-25)
			let index = plaintext.charCodeAt(i) - 65;
			// Apply left shift. (Use modulo 26 and handle negatives.)
			let newIndex = (index - shift) % 26;
			if (newIndex < 0) newIndex += 26;
			// Convert back to uppercase letter.
			ciphertext += String.fromCharCode(newIndex + 65);
		} else {
			// Leave spaces (or any non-alphabetic characters) unchanged.
			ciphertext += char;
		}
	}

	// Attempt to submit the ciphertext as the solution.
	const res = ns.codingcontract.attempt(ciphertext, contract, host, { returnReward: true });
	ns.tprint(`Ciphertext: ${ciphertext}`);
	if (res) {
		ns.tprint(`Reward: ${res}`);
		ns.write("contractReward.txt", res, "w");
	} else {
		ns.tprint("Attempt failed or answer incorrect.");
	}
}
