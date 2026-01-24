/** @param {NS} ns */
export async function main(ns) {
	const [contract, server] = ns.args;
	if (!contract || !server) return ns.tprint("Usage: run totalwaystosumII.js <contract> <server>");
	const [target, coins] = ns.codingcontract.getData(contract, server);

	const dp = new Array(target + 1).fill(0);
	dp[0] = 1;

	for (const coin of coins) {
		for (let j = coin; j <= target; j++) {
			dp[j] += dp[j - coin];
		}
	}

	const reward = ns.codingcontract.attempt(dp[target], contract, server);
	if (reward) ns.tprint(`SUCCESS: ${reward}`); else ns.tprint(`FAILED.`);
}
