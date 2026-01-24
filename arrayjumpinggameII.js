/** @param {NS} ns **/
export async function main(ns) {
	// Retrieve the contract filename and host from arguments.
	const contract = ns.args[0];
	const host = ns.args[1];

	// Get the array data from the contract.
	// The contract data should be an array of integers.
	const arr = ns.codingcontract.getData(contract, host);
	if (!Array.isArray(arr) || arr.length === 0) {
		ns.tprint("ERROR: Contract data is not a valid array.");
		return;
	}

	// Compute the minimum number of jumps using a greedy algorithm.
	const answer = minJumps(arr);

	// Attempt to submit the answer.
	const res = ns.codingcontract.attempt(answer, contract, host, { returnReward: true });
	ns.tprint(`Minimum jumps to reach the end: ${answer}`);
	if (res) {
		ns.tprint(`Reward: ${res}`);
		ns.write("contractReward.txt", res, "w");
	} else {
		ns.tprint("Attempt failed or answer incorrect.");
	}
}

/**
 * Computes the minimum number of jumps needed to reach the end of the array.
 * Each element in the array represents the maximum jump length at that position.
 * If it is impossible to reach the end, the function returns 0.
 *
 * @param {number[]} arr - The array of jump lengths.
 * @returns {number} - The minimum number of jumps, or 0 if unreachable.
 */
function minJumps(arr) {
	const n = arr.length;
	// If the array contains only one element, you're already at the end.
	if (n <= 1) return 0;
	// If the starting position is 0, you cannot move anywhere.
	if (arr[0] === 0) return 0;

	let jumps = 0;
	let currentEnd = 0;
	let furthest = 0;

	// Loop through the array (except the last index).
	for (let i = 0; i < n - 1; i++) {
		// Update the furthest index reachable from this position.
		furthest = Math.max(furthest, i + arr[i]);
		// If we've reached the end of the current range,
		// we need to make a jump.
		if (i === currentEnd) {
			jumps++;
			currentEnd = furthest;
			// If the current end reaches or passes the last index, we're done.
			if (currentEnd >= n - 1) {
				return jumps;
			}
		}
	}
	// If we never reach the end, return 0.
	return 0;
}
