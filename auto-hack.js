/** @param {NS} ns */
export async function main(ns) {
	// ----------------------------------------------------------------
	// AUTO-HACK v2.0
	// Self-contained logic to weaken, grow, and hack a target.
	// Designed to be run with multiple threads: run auto-hack.js -t 100 n00dles
	// ----------------------------------------------------------------

	const target = ns.args[0];
	if (!target) {
		ns.tprint("ERROR: Target server required.");
		ns.tprint("USAGE: run auto-hack.js <server_name>");
		return;
	}

	// --- CONFIGURATION ---
	// We want security to be essentially minimum before we hack
	const securityThresh = ns.getServerMinSecurityLevel(target) + 5;

	// We want money to be near max before we hack to maximize yield per thread
	const moneyThresh = ns.getServerMaxMoney(target) * 0.75;

	ns.print(`TARGET: ${target} | MONITORING...`);

	while (true) {
		const curSec = ns.getServerSecurityLevel(target);
		const curMoney = ns.getServerMoneyAvailable(target);

		if (curSec > securityThresh) {
			// Security is too high, it affects grow/hack chance. Fix it first.
			await ns.weaken(target);
		} else if (curMoney < moneyThresh) {
			// Not enough money in the bank. Grow it.
			await ns.grow(target);
		} else {
			// Conditions perfect. Take the money.
			await ns.hack(target);
		}
	}
}
