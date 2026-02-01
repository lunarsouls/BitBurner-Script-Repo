/** @param {NS} ns */
export async function main(ns) {
    ns.tprint("Initializing port opening...");

    // 1. CACHING: Check for programs ONCE at the start.
    // We create a list of only the tools we actually own.
    const myTools = [];
    if (ns.fileExists("BruteSSH.exe", "home"))   myTools.push(ns.brutessh);
    if (ns.fileExists("FTPCrack.exe", "home"))   myTools.push(ns.ftpcrack);
    if (ns.fileExists("relaySMTP.exe", "home"))  myTools.push(ns.relaysmtp);
    if (ns.fileExists("HTTPWorm.exe", "home"))   myTools.push(ns.httpworm);
    if (ns.fileExists("SQLInject.exe", "home"))  myTools.push(ns.sqlinject);

    // 2. GET SERVERS: (Same logic as before)
    const servers = getAllServers(ns);
    
    let serversOpened = 0;

    for (const server of servers) {
        if (server === "home") continue;

        // 3. OPTIMIZATION: Only try to open ports if we haven't nuked it yet
        // This prevents spamming scripts on servers you already fully control.
        if (ns.hasRootAccess(server)) continue;

        // 4. USE TOOLS: Loop through our "Toolbox"
        for (const runTool of myTools) {
            runTool(server); 
        }
        
        serversOpened++;
    }
    
    ns.tprint(`Scan complete. Attempted port opening on ${serversOpened} servers.`);
}

// (getAllServers function remains the same as your original)
function getAllServers(ns) {
    const visited = new Set();
    const queue = ["home"];
    while (queue.length > 0) {
        const current = queue.pop();
        if (!visited.has(current)) {
            visited.add(current);
            ns.scan(current).forEach(neighbor => {
                if (!visited.has(neighbor)) queue.push(neighbor);
            });
        }
    }
    return Array.from(visited);
}
