/** @param {NS} ns */
export async function main(ns) {
	const [contract, server] = ns.args;

	if (!contract || !server) {
		ns.tprint("ERROR: Usage: run generateip.js <contract_id> <server>");
		return;
	}

	const input = ns.codingcontract.getData(contract, server);

	// Problem: Given a string containing only digits, restore it by returning all possible valid IP address combinations.
	// A valid IP address consists of exactly four integers (each integer is between 0 and 255, separated by single dots and cannot have leading zeros).

	const ret = [];

	function helper(acc, remaining) {
		// If we have 4 segments and no remaining characters, we found a valid IP
		if (acc.length === 4) {
			if (remaining.length === 0) {
				ret.push(acc.join("."));
			}
			return;
		}

		// If we have 4 segments but still characters left, invalid path
		if (remaining.length === 0) return;

		// Try taking 1, 2, or 3 digits for the next segment
		for (let i = 1; i <= 3 && i <= remaining.length; i++) {
			const segment = remaining.substring(0, i);

			// Check validity:
			// 1. Value must be <= 255
			// 2. If length > 1, cannot start with 0 (leading zero check)
			if (parseInt(segment) > 255) continue;
			if (segment.length > 1 && segment[0] === '0') continue;

			// Recurse
			helper([...acc, segment], remaining.substring(i));
		}
	}

	helper([], input);

	const reward = ns.codingcontract.attempt(ret, contract, server);

	if (reward) {
		ns.tprint(`SUCCESS: Solved ${contract} on ${server}. Reward: ${reward}`);
	} else {
		ns.tprint(`FAILURE: Wrong answer for ${contract} on ${server}.`);
	}
}
