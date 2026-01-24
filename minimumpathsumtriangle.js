/** @param {NS} ns */
export async function main(ns) {
	const [contract, server] = ns.args;
	if (!contract || !server) return ns.tprint("Usage: run minimumpathsumtriangle.js <contract> <server>");
	const triangle = ns.codingcontract.getData(contract, server);

	for (let i = triangle.length - 2; i >= 0; i--) {
		for (let j = 0; j < triangle[i].length; j++) {
			triangle[i][j] += Math.min(triangle[i + 1][j], triangle[i + 1][j + 1]);
		}
	}

	const reward = ns.codingcontract.attempt(triangle[0][0], contract, server);
	if (reward) ns.tprint(`SUCCESS: ${reward}`); else ns.tprint(`FAILED.`);
}
