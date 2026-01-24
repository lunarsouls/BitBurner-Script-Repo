/** @param {NS} ns **/
export async function main(ns) {
	// --- LOGGING ---
	ns.enableLog("scan");
	ns.enableLog("sleep");
	ns.enableLog("exec");

	// --- SOLVER MAPPING ---
	const solvers = {
		"Algorithmic Stock Trader IV": "algostocktraderiv.js",
		"Algorithmic Stock Trader III": "algostocktraderiii.js",
		"Algorithmic Stock Trader I": "algostocktraderI.js",
		"Subarray with Maximum Sum": "subarraymaxsum.js",
		"Spiralize Matrix": "spiralizematrix.js",
		"Array Jumping Game": "arrayjump.js",
		"Generate IP Addresses": "generateip.js",
		"Sanitize Parentheses in Expression": "saniparentheses.js",
		"Unique Paths in a Grid I": "uniquepathsgridI.js",
		"Unique Paths in a Grid II": "uniquepathsgridII.js",
		"Minimum Path Sum in a Triangle": "minimumpathsumtriangle.js",
		"Encryption I: Caesar Cipher": "encryptcaesarcipherI.js",
		"Total Ways to Sum": "totalwaystosum.js",
		"Total Ways to Sum II": "totalwaystosumII.js",
		"Encryption II: Vigenère Cipher": "encryptionIIvigenere.js",
		"Compression III: LZ Compression": "compressionIIILZ.js",
		"Compression II: LZ Decompression": "lzdecomp.js",
		"Find All Valid Math Expressions": "findallvalidmathexpr.js",
		"Shortest Path in a Grid": "shortestpathingrid.js",
		"Array Jumping Game II": "arrayjumpinggameII.js",
		"Find Largest Prime Factor": "largestprimefactor.js",
		"Merge Overlapping Intervals": "mergeovint.js",
		"Compression I: RLE Compression": "rlecompI.js",
		"HammingCodes: Encoded Binary to Integer": "hammingBtoI.js",
		"HammingCodes: Integer to Encoded Binary": "hammingencode.js",
		"Square Root": "squareroot.js",
		"Proper 2-Coloring of a Graph": "proper2coloring.js"
	};

	const checkedContracts = new Set();

	while (true) {
		const serversToScan = [];
		const visited = new Set(["home"]);
		const stack = ["home"];
		while (stack.length > 0) {
			const host = stack.pop();
			if (!ns.getServer(host).purchasedByPlayer && ns.hasRootAccess(host)) {
				serversToScan.push(host);
			}
			for (const neighbor of ns.scan(host)) {
				if (!visited.has(neighbor)) {
					visited.add(neighbor);
					stack.push(neighbor);
				}
			}
		}

		for (const server of serversToScan) {
			const contracts = ns.ls(server, ".cct");
			for (const contract of contracts) {
				const contractId = `${server}:${contract}`;
				if (checkedContracts.has(contractId)) continue;
				checkedContracts.add(contractId);

				const type = ns.codingcontract.getContractType(contract, server);
				ns.tprint(`Found contract "${contract}" on ${server} [Type: ${type}]`);

				if (!solvers[type]) {
					ns.tprint(`No solver mapping for contract type "${type}". Skipping.`);
					continue;
				}
				const solverFile = solvers[type];

				if (!ns.fileExists(solverFile, "home")) {
					ns.tprint(`Missing solver script "${solverFile}". Skipping.`);
					continue;
				}

				ns.tprint(`Solving "${type}" on ${server} using ${solverFile}...`);
				const pid = ns.exec(solverFile, "home", 1, contract, server);

				if (pid === 0) continue;

				// WAIT FOR SCRIPT TO FINISH (WITH TIMEOUT)
				let attempts = 0;
				while (ns.isRunning(pid, "home")) {
					await ns.sleep(100);
					attempts++;
					// If script takes > 10 seconds, assume it's stuck/too heavy and kill it
					if (attempts > 100) {
						ns.kill(pid);
						ns.tprint(`WARN: Solver "${solverFile}" timed out. Killed process.`);
						break;
					}
				}

				if (!ns.ls(server, ".cct").includes(contract)) {
					ns.tprint(`SUCCESS: Solved!`);
				} else {
					ns.tprint(`WARN: Failed to solve "${contract}". Check logic.`);
				}
			}
		}
		await ns.sleep(60000);
	}
}
