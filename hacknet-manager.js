/** @param {NS} ns */
export async function main(ns) {
	ns.enableLog("hacknet.upgradeLevel");
	ns.enableLog("hacknet.upgradeRam");
	ns.enableLog("hacknet.upgradeCore");
	ns.enableLog("hacknet.purchaseNode");

	ns.print("Hacknet Manager Started...");

	// We will only spend this much of our current cash on upgrades
	const SPEND_RATIO = 0.05;

	while (true) {
		// 1. Try to upgrade existing nodes
		const numNodes = ns.hacknet.numNodes();
		for (let i = 0; i < numNodes; i++) {
			const money = ns.getServerMoneyAvailable("home");

			// Level
			if (ns.hacknet.getLevelUpgradeCost(i, 1) < money * SPEND_RATIO) {
				ns.hacknet.upgradeLevel(i, 1);
			}
			// RAM
			if (ns.hacknet.getRamUpgradeCost(i, 1) < money * SPEND_RATIO) {
				ns.hacknet.upgradeRam(i, 1);
			}
			// Cores
			if (ns.hacknet.getCoreUpgradeCost(i, 1) < money * SPEND_RATIO) {
				ns.hacknet.upgradeCore(i, 1);
			}
		}

		// 2. Try to buy a new node
		const money = ns.getServerMoneyAvailable("home");
		if (ns.hacknet.getPurchaseNodeCost() < money * SPEND_RATIO) {
			ns.hacknet.purchaseNode();
			ns.print("Purchased new Hacknet Node.");
		}

		await ns.sleep(100);
	}
}
