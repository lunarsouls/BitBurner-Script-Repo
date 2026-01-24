/** @param {NS} ns */
export async function main(ns) {
	const [contract, server] = ns.args;
	if (!contract || !server) return ns.tprint("Usage: run squareroot.js <contract> <server>");

	ns.tprint("v2.1 - Starting BigInt Square Root Solver...");

	const data = ns.codingcontract.getData(contract, server);

	let answer = "";
	const timeLimit = 15;
	let lastTime = performance.now();

	const solve = async (val) => {
		let x = val;
		let y = (x + 1n) / 2n;
		while (y < x) {
			if (performance.now() - lastTime > timeLimit) {
				await ns.sleep(0);
				lastTime = performance.now();
			}
			x = y;
			y = (x + val / x) / 2n;
		}

		// Round to NEAREST integer
		// if x*(x+1) < val, then val is closer to (x+1)^2
		if (x * (x + 1n) < val) {
			x += 1n;
		}
		return x;
	}

	try {
		let bigVal;

		if (typeof data === 'number') {
			// Handle unsafe numbers by rounding first, though precision likely lost
			bigVal = BigInt(Math.round(data));
		} else {
			const clean = String(data).replace(/['"\s]/g, '');
			if (clean.includes('e')) {
				bigVal = BigInt(Math.floor(Number(clean)));
			} else {
				bigVal = BigInt(clean);
			}
		}

		if (bigVal < 0n) throw new Error("Negative");

		const root = await solve(bigVal);
		answer = root.toString();

	} catch (e) {
		ns.tprint("WARN: Falling back to Math.sqrt (inaccurate for large numbers) due to: " + e.message);
		const root = Math.sqrt(Number(data));
		answer = Math.round(root).toLocaleString('fullwide', { useGrouping: false });
	}

	const reward = ns.codingcontract.attempt(answer, contract, server);
	if (reward) ns.tprint(`SUCCESS: ${reward}`);
	else ns.tprint(`FAILED. Answer sent: ${answer}`);
}
