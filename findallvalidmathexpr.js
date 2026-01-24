/** @param {NS} ns */
export async function main(ns) {
	const [contract, server] = ns.args;
	if (!contract || !server) return ns.tprint("Usage: run findallvalidmathexpr.js <contract> <server>");
	const [numStr, target] = ns.codingcontract.getData(contract, server);

	const result = [];
	function helper(res, path, num, diff, pos) {
		if (pos === numStr.length) {
			if (res === target) {
				result.push(path);
			}
			return;
		}

		for (let i = pos; i < numStr.length; i++) {
			if (i !== pos && numStr[pos] === '0') break;
			const curStr = numStr.substring(pos, i + 1);
			const cur = parseInt(curStr);

			if (pos === 0) {
				helper(cur, path + curStr, cur, cur, i + 1);
			} else {
				helper(res + cur, path + "+" + curStr, cur, cur, i + 1);
				helper(res - cur, path + "-" + curStr, -cur, -cur, i + 1);
				helper(res - diff + diff * cur, path + "*" + curStr, cur, diff * cur, i + 1);
			}
		}
	}

	helper(0, "", 0, 0, 0);

	const reward = ns.codingcontract.attempt(result, contract, server);
	if (reward) ns.tprint(`SUCCESS: ${reward}`); else ns.tprint(`FAILED.`);
}
