/** @param {NS} ns */
export async function main(ns) {
    const target = ns.args[0];
    const job = ns.args[1];
    // A random delay prevents all scripts from finishing on the exact same millisecond,
    // which can cause RAM glitches or game lag.
    const delay = ns.args[2] || 0; 

    if (delay > 0) await ns.sleep(delay);

    if (job === "weaken") await ns.weaken(target);
    else if (job === "grow") await ns.grow(target);
    else if (job === "hack") await ns.hack(target);
}
