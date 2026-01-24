/** @param {NS} ns */
export async function main(ns) {
	const [contract, server] = ns.args;
	if (!contract || !server) return ns.tprint("Usage: run lzdecomp.js <contract> <server>");
	const encoded = ns.codingcontract.getData(contract, server);

	let decoded = "";
	let i = 0;
	let type = 0; // 0: Literal, 1: Backref

	while (i < encoded.length) {
		const len = parseInt(encoded[i]);
		i++;

		if (type === 0) {
			// Literal
			if (len > 0) {
				decoded += encoded.substring(i, i + len);
				i += len;
			}
		} else {
			// Backref
			if (len > 0) {
				const dist = parseInt(encoded[i]);
				i++;
				// Copy len chars from dist back
				// Note: dist is 1-based offset from current end
				for (let j = 0; j < len; j++) {
					decoded += decoded[decoded.length - dist];
				}
			}
		}
		// Toggle type
		type = 1 - type;
	}

	const reward = ns.codingcontract.attempt(decoded, contract, server);
	if (reward) ns.tprint(`SUCCESS: ${reward}`); else ns.tprint(`FAILED.`);
}
