/** @param {NS} ns */
export async function main(ns) {
	const [contract, server] = ns.args;
	if (!contract || !server) return ns.tprint("Usage: run uniquepathsgridII.js <contract> <server>");
	const obstacleGrid = ns.codingcontract.getData(contract, server);

	const m = obstacleGrid.length;
	const n = obstacleGrid[0].length;
	if (obstacleGrid[0][0] === 1) {
		ns.codingcontract.attempt(0, contract, server);
		return;
	}

	obstacleGrid[0][0] = 1;
	for (let i = 1; i < m; i++) obstacleGrid[i][0] = (obstacleGrid[i][0] === 0 && obstacleGrid[i - 1][0] === 1) ? 1 : 0;
	for (let j = 1; j < n; j++) obstacleGrid[0][j] = (obstacleGrid[0][j] === 0 && obstacleGrid[0][j - 1] === 1) ? 1 : 0;

	for (let i = 1; i < m; i++) {
		for (let j = 1; j < n; j++) {
			if (obstacleGrid[i][j] === 0) {
				obstacleGrid[i][j] = obstacleGrid[i - 1][j] + obstacleGrid[i][j - 1];
			} else {
				obstacleGrid[i][j] = 0;
			}
		}
	}

	const reward = ns.codingcontract.attempt(obstacleGrid[m - 1][n - 1], contract, server);
	if (reward) ns.tprint(`SUCCESS: ${reward}`); else ns.tprint(`FAILED.`);
}
