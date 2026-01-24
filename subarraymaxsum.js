/** 
 * Solver for the "Subarray with Maximum Sum" coding contract.
 *
 * This contract expects an array of integers as input.
 * The goal is to find the contiguous subarray with the largest sum.
 *
 * The script implements Kadane's algorithm:
 *  - It initializes maxCurrent and maxGlobal with the first element of the array.
 *  - It then iterates through the array, updating these values based on the maximum subarray sum ending at each index.
 *
 * After computing the maximum subarray sum, the script attempts the solution using ns.codingcontract.attempt.
 *
 * Usage:
 *   run solve-subarrayMaxSum.js <contractFilename> <host>
 * where <host> is the server hosting the contract and <contractFilename>
 * is the filename of the contract.
 */
export async function main(ns) {
	// Validate input arguments
	if (ns.args.length < 2) {
		ns.tprint("Usage: run subarraymaxsum.js <contractFilename> <host>");
		return;
	}

	// NOTE: Argument order extracted to match autosolver.js convention
	const contractFile = ns.args[0];
	const host = ns.args[1];

	// Retrieve contract data (expected to be an array of integers)
	const data = ns.codingcontract.getData(contractFile, host);
	if (!Array.isArray(data)) {
		ns.tprint("Error: Contract data is not an array.");
		return;
	}

	ns.print(`Solving contract "${contractFile}" on ${host}`);
	ns.print(`Input data: ${JSON.stringify(data)}`);

	// Implement Kadane's algorithm to find the maximum subarray sum
	let maxCurrent = data[0];
	let maxGlobal = data[0];

	for (let i = 1; i < data.length; i++) {
		maxCurrent = Math.max(data[i], maxCurrent + data[i]);
		if (maxCurrent > maxGlobal) {
			maxGlobal = maxCurrent;
		}
	}

	ns.print(`Calculated maximum subarray sum: ${maxGlobal}`);

	// Attempt to solve the contract
	const result = ns.codingcontract.attempt(maxGlobal, contractFile, host, { returnReward: true });
	if (result) {
		ns.tprint(`Contract solved successfully! Reward: ${result}`);
		ns.print(`Contract solved successfully! Reward: ${result}`);
	} else {
		ns.tprint("Failed to solve contract.");
		ns.print("Failed to solve contract.");
	}
}
