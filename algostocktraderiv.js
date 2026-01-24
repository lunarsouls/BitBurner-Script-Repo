/** @param {NS} ns */
export async function main(ns) {
	const [contract, server] = ns.args;
	if (!contract || !server) return ns.tprint("Usage: run algostocktraderiv.js <contract> <server>");
	const [k, prices] = ns.codingcontract.getData(contract, server);

	const len = prices.length;
	if (len < 2) return ns.codingcontract.attempt(0, contract, server);

	if (k > len / 2) {
		let maxP = 0;
		for (let i = 1; i < len; i++) {
			maxP += Math.max(prices[i] - prices[i - 1], 0);
		}
		return ns.codingcontract.attempt(maxP, contract, server);
	}

	const dp = Array(k + 1).fill(0).map(() => Array(len).fill(0));
	for (let i = 1; i <= k; i++) {
		let maxDiff = -prices[0];
		for (let j = 1; j < len; j++) {
			dp[i][j] = Math.max(dp[i][j - 1], prices[j] + maxDiff);
			maxDiff = Math.max(maxDiff, dp[i - 1][j] - prices[j]);
		}
	}

	const reward = ns.codingcontract.attempt(dp[k][len - 1], contract, server);
	if (reward) ns.tprint(`SUCCESS: ${reward}`); else ns.tprint(`FAILED.`);
}
