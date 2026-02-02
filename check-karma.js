/** @param {NS} ns */
export async function main(ns) {
	const karma = ns.heart.break();
	const needed = -54000;
	ns.tprint(`Current Karma: ${ns.formatNumber(karma, 2)}`);
	if (karma > needed) {
		ns.tprint(`You need ${ns.formatNumber(needed - karma, 2)} more to create a Gang.`);
	} else {
		ns.tprint("You have enough Karma to create a Gang (Slum Snakes etc.)");
	}
}
