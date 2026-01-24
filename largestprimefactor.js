/** @param {NS} ns */
export async function main(ns) {
	const [contract, server] = ns.args;
	if (!contract || !server) return ns.tprint("Usage: run largestprimefactor.js <contract> <server>");
	let n = ns.codingcontract.getData(contract, server);

	let factor = 2;
	while (factor * factor <= n) {
		if (n % factor === 0) {
			n /= factor;
		} else {
			factor++;
		}
	}

	const reward = ns.codingcontract.attempt(n, contract, server);
	if (reward) ns.tprint(`SUCCESS: ${reward}`); else ns.tprint(`FAILED.`);
}
