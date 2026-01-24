/** @param {NS} ns */
export async function main(ns) {
	const [contract, server] = ns.args;
	if (!contract || !server) return ns.tprint("Usage: run algostocktraderIII.js <contract> <server>");
	const prices = ns.codingcontract.getData(contract, server);

	if (prices.length === 0) return ns.codingcontract.attempt(0, contract, server);

	// Max profit with at most 2 transactions.
	// Forward pass: max profit with 1 transaction from 0 to i
	let left = new Array(prices.length).fill(0);
	let minP = prices[0];
	for (let i = 1; i < prices.length; i++) {
		minP = Math.min(minP, prices[i]);
		left[i] = Math.max(left[i - 1], prices[i] - minP);
	}

	// Backward pass: max profit with 1 transaction from i to n-1
	let right = new Array(prices.length).fill(0);
	let maxP = prices[prices.length - 1];
	for (let i = prices.length - 2; i >= 0; i--) {
		maxP = Math.max(maxP, prices[i]);
		right[i] = Math.max(right[i + 1], maxP - prices[i]);
	}

	// Maximize sum of left[i] + right[i]
	let maxProfit = 0;
	for (let i = 0; i < prices.length; i++) {
		maxProfit = Math.max(maxProfit, left[i] + right[i]);
	}

	const reward = ns.codingcontract.attempt(maxProfit, contract, server);
	if (reward) ns.tprint(`SUCCESS: ${reward}`); else ns.tprint(`FAILED.`);
}
