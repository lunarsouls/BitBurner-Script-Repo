/** @param {NS} ns */
export async function main(ns) {
	const [contract, server] = ns.args;
	if (!contract || !server) return ns.tprint("Usage: run rlecompI.js <contract> <server>");
	const data = ns.codingcontract.getData(contract, server);

	let encoded = "";
	let i = 0;
	while (i < data.length) {
		let count = 1;
		while (i + 1 < data.length && data[i] === data[i + 1] && count < 9) {
			count++;
			i++;
		}
		encoded += String(count) + data[i];
		i++;
	}

	const reward = ns.codingcontract.attempt(encoded, contract, server);
	if (reward) ns.tprint(`SUCCESS: ${reward}`); else ns.tprint(`FAILED.`);
}
