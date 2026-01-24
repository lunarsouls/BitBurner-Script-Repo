/** @param {NS} ns */
export async function main(ns) {
	const [contract, server] = ns.args;
	if (!contract || !server) return ns.tprint("Usage: run spiralizematrix.js <contract> <server>");
	const matrix = ns.codingcontract.getData(contract, server);

	const res = [];
	let top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1;

	while (top <= bottom && left <= right) {
		for (let i = left; i <= right; i++) res.push(matrix[top][i]);
		top++;
		for (let i = top; i <= bottom; i++) res.push(matrix[i][right]);
		right--;
		if (top <= bottom) {
			for (let i = right; i >= left; i--) res.push(matrix[bottom][i]);
			bottom--;
		}
		if (left <= right) {
			for (let i = bottom; i >= top; i--) res.push(matrix[i][left]);
			left++;
		}
	}

	const reward = ns.codingcontract.attempt(res, contract, server);
	if (reward) ns.tprint(`SUCCESS: ${reward}`); else ns.tprint(`FAILED.`);
}
