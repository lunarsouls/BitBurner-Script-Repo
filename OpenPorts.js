/** 
 * OpenPorts.js
 *
 * This script recursively scans your network starting from "home".
 * For every server found (except home), it attempts to open all available ports
 * using your port-opening programs:
 *   - BruteSSH.exe
 *   - FTPCrack.exe
 *   - relaySMTP.exe
 *   - HTTPWorm.exe
 *   - SQLInject.exe
 *
 * Usage:
 *   run OpenPorts.js
 */
export async function main(ns) {
    ns.tprint("Starting OpenPorts scan...");
    // Get all servers from home.
    const servers = getAllServers(ns);
    
    for (const server of servers) {
        if (server === "home") continue; // Skip home
        ns.tprint(`Attempting to open ports on ${server}...`);
        openPorts(ns, server);
    }
    
    ns.tprint("OpenPorts scan complete.");
}

/**
 * Recursively scans the network starting from "home" and returns an array of all server hostnames.
 */
function getAllServers(ns) {
    const visited = new Set();
    const queue = ["home"];
    
    while (queue.length > 0) {
        const current = queue.pop();
        if (!visited.has(current)) {
            visited.add(current);
            let neighbors = ns.scan(current);
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    queue.push(neighbor);
                }
            }
        }
    }
    return Array.from(visited);
}

/**
 * Attempts to open all available ports on the given server.
 */
function openPorts(ns, server) {
    if (ns.fileExists("BruteSSH.exe", "home")) {
        ns.brutessh(server);
        ns.tprint(`BruteSSH executed on ${server}`);
    }
    if (ns.fileExists("FTPCrack.exe", "home")) {
        ns.ftpcrack(server);
        ns.tprint(`FTPCrack executed on ${server}`);
    }
    if (ns.fileExists("relaySMTP.exe", "home")) {
        ns.relaysmtp(server);
        ns.tprint(`relaySMTP executed on ${server}`);
    }
    if (ns.fileExists("HTTPWorm.exe", "home")) {
        ns.httpworm(server);
        ns.tprint(`HTTPWorm executed on ${server}`);
    }
    if (ns.fileExists("SQLInject.exe", "home")) {
        ns.sqlinject(server);
        ns.tprint(`SQLInject executed on ${server}`);
    }
}
