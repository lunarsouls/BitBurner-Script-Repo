/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
    ns.tprint("AUTO-BACKDOOR INITIATED...");

    // Get all servers
    const servers = getAllServers(ns);
    
    for (const server of servers) {
        if (server === "home") continue;
        
        const so = ns.getServer(server);
        const playerLevel = ns.getHackingLevel();

        // Skip conditions
        if (so.backdoorInstalled) continue;
        if (!so.hasAdminRights) continue;
        if (playerLevel < so.requiredHackingSkill) continue;

        // Perform traversal and install
        ns.tprint(`TARGET IDENTIFIED: ${server} (Level ${so.requiredHackingSkill})`);
        await traverseAndInstall(ns, server);
    }
    
    ns.tprint("BACKDOOR PROTOCOL COMPLETE.");
    // Ensure we end up at home
    ns.singularity.connect("home");
}

async function traverseAndInstall(ns, target) {
    const path = getPath(ns, target);
    if (!path) return;

    // 1. Travel to target
    for (const node of path) {
        ns.singularity.connect(node);
    }

    // 2. Install
    try {
        await ns.singularity.installBackdoor();
        ns.tprint(`SUCCESS: Backdoor installed on ${target}`);
    } catch(err) {
        ns.tprint(`ERROR: Could not install on ${target}: ${err}`);
    }

    // 3. Return to home (reverse path)
    // We walk back step-by-step because .connect() only works on neighbors
    // Note: 'home' is hardcoded as the return point
    const goHome = getPathFrom(ns, target, "home");
    if (goHome) {
        for (const node of goHome) {
            ns.singularity.connect(node);
        }
    } else {
        ns.tprint("CRITICAL: Lost in network. Manually return to home.");
    }
}

/** BFS to find path from start to end */
function getPathFrom(ns, start, end) {
    if (start === end) return [];
    const queue = [[start]];
    const visited = new Set([start]);
    while (queue.length > 0) {
        const path = queue.shift();
        const current = path[path.length - 1];
        if (current === end) return path.slice(1);
        for (const next of ns.scan(current)) {
            if (!visited.has(next)) {
                visited.add(next);
                queue.push([...path, next]);
            }
        }
    }
    return null;
}

/** BFS path from home to target */
function getPath(ns, target) {
    return getPathFrom(ns, "home", target);
}

function getAllServers(ns) {
    const visited = new Set(["home"]);
    const queue = ["home"];
    while (queue.length > 0) {
        const current = queue.shift();
        for (const next of ns.scan(current)) {
            if (!visited.has(next)) {
                visited.add(next);
                queue.push(next);
            }
        }
    }
    return Array.from(visited);
}
