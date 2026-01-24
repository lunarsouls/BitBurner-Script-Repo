/** @param {NS} ns **/
export async function main(ns) {
	// Retrieve contract filename and host from command-line arguments.
	const contract = ns.args[0];
	const host = ns.args[1];

	// Retrieve the grid data from the contract.
	// Expected to be a 2D array of numbers (0 = free, 1 = obstacle).
	const grid = ns.codingcontract.getData(contract, host);
	if (!Array.isArray(grid) || grid.length === 0 || !Array.isArray(grid[0])) {
		ns.tprint("ERROR: Contract data is not a valid grid.");
		return;
	}

	const m = grid.length;
	const n = grid[0].length;

	// Initialize BFS.
	const queue = [];
	const visited = Array(m).fill(0).map(() => Array(n).fill(false));

	// Start at top-left with an empty path.
	queue.push({ r: 0, c: 0, path: "" });
	visited[0][0] = true;

	// Directions: up, down, left, right.
	const directions = [
		{ dr: -1, dc: 0, move: "U" },
		{ dr: 1, dc: 0, move: "D" },
		{ dr: 0, dc: -1, move: "L" },
		{ dr: 0, dc: 1, move: "R" }
	];

	let foundPath = "";

	while (queue.length > 0) {
		const current = queue.shift();
		const { r, c, path } = current;

		// If we've reached the bottom-right, we've found our shortest path.
		if (r === m - 1 && c === n - 1) {
			foundPath = path;
			break;
		}

		// Explore neighbors.
		for (const d of directions) {
			const nr = r + d.dr;
			const nc = c + d.dc;
			if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === 0 && !visited[nr][nc]) {
				visited[nr][nc] = true;
				queue.push({ r: nr, c: nc, path: path + d.move });
			}
		}
	}

	// If no valid path exists, foundPath remains an empty string.
	const answer = foundPath;

	// Submit the answer.
	const res = ns.codingcontract.attempt(answer, contract, host, { returnReward: true });
	ns.tprint(`Shortest Path: ${answer}`);
	if (res) {
		ns.tprint(`Reward: ${res}`);
		ns.write("contractReward.txt", res, "w");
	} else {
		ns.tprint("Attempt failed or answer incorrect.");
	}
}
