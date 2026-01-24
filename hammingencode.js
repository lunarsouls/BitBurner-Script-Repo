/** @param {NS} ns */
export async function main(ns) {
	const [contract, server] = ns.args;
	if (!contract || !server) return ns.tprint("Usage: run hammingencode.js <contract> <server>");

	// Data is an integer
	const value = ns.codingcontract.getData(contract, server);

	// 1. Convert integer to binary array
	const dataBits = value.toString(2).split('').map(x => parseInt(x));

	// 2. Determine number of parity bits required
	// m = dataBits.length
	// We need k parity bits such that 2^k >= m + k + 1
	const m = dataBits.length;
	let k = 1;
	while (Math.pow(2, k) < m + k + 1) {
		k++;
	}

	// 3. Create array of size n = m + k + 1 (index 0 is global)
	// Indices: 0 (global), 1, 2, 3, 4 ...
	const encoded = new Array(m + k + 1).fill(0);

	// 4. Fill data bits into non-power-of-2 positions
	let dataPtr = 0;
	for (let i = 1; i < encoded.length; i++) {
		if ((i & (i - 1)) !== 0) { // If i is NOT a power of 2
			encoded[i] = dataBits[dataPtr++];
		}
	}

	// 5. Calculate parity bits (indices 1, 2, 4, 8...)
	for (let p = 1; p < encoded.length; p *= 2) {
		let parity = 0;
		// Check all bits k where (k & p) != 0
		for (let i = 1; i < encoded.length; i++) {
			if ((i & p) !== 0) {
				parity ^= encoded[i];
			}
		}
		encoded[p] = parity;
	}

	// 6. Calculate global parity (index 0)
	// XOR of all bits (including newly set parity bits)
	let globalParity = 0;
	for (let i = 1; i < encoded.length; i++) {
		globalParity ^= encoded[i];
	}
	encoded[0] = globalParity;

	// 7. Submit
	const result = encoded.join('');
	const reward = ns.codingcontract.attempt(result, contract, server);
	if (reward) ns.tprint(`SUCCESS: ${reward}`); else ns.tprint(`FAILED.`);
}
