/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
    ns.tprint("INITIATING MASS NUKE PROTOCOL...");

    const servers = getAllServers(ns);
    let successCount = 0;

    for (const server of servers) {
        if (server === "home" || ns.hasRootAccess(server)) continue;

        // Attempt to open ports based on available executables
        if (ns.fileExists("BruteSSH.exe", "home")) ns.brutessh(server);
        if (ns.fileExists("FTPCrack.exe", "home")) ns.ftpcrack(server);
        if (ns.fileExists("relaySMTP.exe", "home")) ns.relaysmtp(server);
        if (ns.fileExists("HTTPWorm.exe", "home")) ns.httpworm(server);
        if (ns.fileExists("SQLInject.exe", "home")) ns.sqlinject(server);

        try {
            ns.nuke(server);
            if (ns.hasRootAccess(server)) {
                ns.tprint(`SUCCESS: ${server} rooted.`);
                successCount++;
            }
        } catch (e) {
            // Nuke failed (not enough ports or level too low)
        }
        await ns.sleep(10);
    }
    
    ns.tprint(`SCAN COMPLETE. New servers breached: ${successCount}`);
}

function getAllServers(ns) {
    const visited = new Set(["home"]);
    const queue = ["home"];
    while (queue.length > 0) {
        const current = queue.shift();
        const nextNodes = ns.scan(current);
        for (const next of nextNodes) {
            if (!visited.has(next)) {
                visited.add(next);
                queue.push(next);
            }
        }
    }
    return Array.from(visited);
}
