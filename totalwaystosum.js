/** @param {NS} ns **/
export async function main(ns) {
	// Retrieve the contract filename and host from arguments.
	const contract = ns.args[0];
	const host = ns.args[1];

	// Retrieve the contract data.
	// The contract data is expected to be a number (e.g., 22).
	const data = ns.codingcontract.getData(contract, host);
	if (typeof data !== "number") {
		ns.tprint("ERROR: Contract data is not a number.");
		return;
	}
	const n = data;

	// Compute the number of partitions of n and subtract 1 to ignore the trivial partition.
	const result = partition(n, n) - 1;

	// Attempt the contract with the computed answer.
	const res = ns.codingcontract.attempt(result, contract, host, { returnReward: true });
	ns.tprint(`Total ways to sum ${n} (using at least two numbers): ${result}`);
	if (res) {
		ns.tprint(`Reward: ${res}`);
		ns.write("contractReward.txt", res, "w");
	} else {
		ns.tprint("Attempt failed or answer incorrect.");
	}
}

// Memoization cache for the partition function.
const memo = {};

/**
 * Computes the number of partitions of n using numbers up to max.
 * This function uses the recurrence:
 *    partition(n, max) = partition(n, max-1) + partition(n-max, max)
 * with base cases partition(0, max)=1 and partition(n,0)=0 (n>0).
 * @param {number} n - The number to partition.
 * @param {number} max - The largest number allowed in the partition.
 * @returns {number} - The number of partitions.
 */
function partition(n, max) {
	if (n === 0) return 1;
	if (n < 0 || max === 0) return 0;
	const key = n + "," + max;
	if (memo.hasOwnProperty(key)) return memo[key];
	const result = partition(n, max - 1) + partition(n - max, max);
	memo[key] = result;
	return result;
}
