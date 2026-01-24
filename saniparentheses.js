/** @param {NS} ns */
export async function main(ns) {
	const [contract, server] = ns.args;
	if (!contract || !server) return ns.tprint("Usage: run saniparentheses.js <contract> <server>");
	const s = ns.codingcontract.getData(contract, server);

	function isValid(str) {
		let count = 0;
		for (const c of str) {
			if (c === '(') count++;
			else if (c === ')') count--;
			if (count < 0) return false;
		}
		return count === 0;
	}

	let level = new Set([s]);
	while (level.size > 0) {
		const valid = [...level].filter(isValid);
		if (valid.length > 0) {
			const reward = ns.codingcontract.attempt(valid, contract, server);
			if (reward) ns.tprint(`SUCCESS: ${reward}`); else ns.tprint(`FAILED.`);
			return;
		}
		const nextLevel = new Set();
		for (const item of level) {
			for (let i = 0; i < item.length; i++) {
				if (item[i] === '(' || item[i] === ')') {
					nextLevel.add(item.slice(0, i) + item.slice(i + 1));
				}
			}
		}
		level = nextLevel;
	}
}
