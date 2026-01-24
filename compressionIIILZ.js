/** @param {NS} ns */
export async function main(ns) {
	const args = ns.args;
	if (args.length < 2) {
		ns.tprint("Usage: run compressionIIILZ.js <contract> <server>");
		return;
	}
	const contract = args[0];
	const server = args[1];

	ns.tprint("v4.0 - DP Optimal Solver");

	const data = ns.codingcontract.getData(contract, server);
	const n = data.length;

	// dp[i][state] = min string length
	// state 0: expect literal, 1: expect reference
	// We strictly initialize arrays to avoid sparse array issues
	const dp = new Array(n + 1);
	const path = new Array(n + 1);

	for (let i = 0; i <= n; i++) {
		dp[i] = [Infinity, Infinity];
		path[i] = ["", ""];
	}

	dp[0][0] = 0;

	const timeLimit = 20;
	let lastTime = performance.now();

	for (let i = 0; i <= n; i++) {
		// Safety yield for large datasets
		if (i % 100 === 0 && (performance.now() - lastTime > timeLimit)) {
			await ns.sleep(0);
			lastTime = performance.now();
		}

		// 1. Handle State Swaps (Length 0 chunks)
		// State 0 -> State 1 (Literal "0")
		if (dp[i][0] + 1 < dp[i][1]) {
			dp[i][1] = dp[i][0] + 1;
			path[i][1] = path[i][0] + "0";
		}
		// State 1 -> State 0 (Reference "0")
		if (dp[i][1] + 1 < dp[i][0]) {
			dp[i][0] = dp[i][1] + 1;
			path[i][0] = path[i][1] + "0";
		}

		if (i === n) break;

		// 2. Transitions from State 0 (Literal)
		if (dp[i][0] !== Infinity) {
			// Try lengths 1..9
			for (let len = 1; len <= 9; len++) {
				if (i + len > n) break;
				// Cost: 1 (len digit) + len (content)
				const cost = dp[i][0] + 1 + len;
				if (cost < dp[i + len][1]) {
					dp[i + len][1] = cost;
					path[i + len][1] = path[i][0] + len + data.substring(i, i + len);
				}
			}
		}

		// 3. Transitions from State 1 (Reference)
		if (dp[i][1] !== Infinity) {
			// Try dist 1..9
			for (let dist = 1; dist <= 9; dist++) {
				// Count match length
				let matchLen = 0;
				let cur = i;
				while (matchLen < 9 && cur < n) {
					if ((cur - dist) >= 0 && data[cur] === data[cur - dist]) {
						matchLen++;
						cur++;
					} else {
						break;
					}
				}

				if (matchLen > 0) {
					// Try all sub-lengths valid for this match
					for (let len = 1; len <= matchLen; len++) {
						const cost = dp[i][1] + 2; // 1 (len digit) + 1 (dist digit)
						if (cost < dp[i + len][0]) {
							dp[i + len][0] = cost;
							path[i + len][0] = path[i][1] + len + "" + dist;
						}
					}
				}
			}
		}
	}

	let result = "";
	// Choose minimal end state
	if (dp[n][0] < dp[n][1]) {
		result = path[n][0];
	} else {
		result = path[n][1];
	}

	const reward = ns.codingcontract.attempt(result, contract, server);
	if (reward) ns.tprint(`SUCCESS! Reward: ${reward}`);
	else ns.tprint(`FAILED. Output: ${result}`);
}
