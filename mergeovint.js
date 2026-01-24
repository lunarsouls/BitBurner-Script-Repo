/** @param {NS} ns */
export async function main(ns) {
	const [contract, server] = ns.args;
	if (!contract || !server) return ns.tprint("Usage: run mergeovint.js <contract> <server>");
	const intervals = ns.codingcontract.getData(contract, server);

	intervals.sort((a, b) => a[0] - b[0]);
	const merged = [];
	for (const interval of intervals) {
		if (merged.length === 0 || merged[merged.length - 1][1] < interval[0]) {
			merged.push(interval);
		} else {
			merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], interval[1]);
		}
	}

	const reward = ns.codingcontract.attempt(merged, contract, server);
	if (reward) ns.tprint(`SUCCESS: ${reward}`); else ns.tprint(`FAILED.`);
}
