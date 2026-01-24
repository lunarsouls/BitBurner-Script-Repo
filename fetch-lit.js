/** @param {NS} ns */
export async function main(ns) {
	const visited = new Set();
	const queue = ["home"];
	let serversNuked = 0;
	let filesScraped = 0;
	ns.tprint("Knowledge Scraping...");
	ns.disableLog("ALL");
	// Check which programs we have on home
	const programs = [
		{ name: "BruteSSH.exe", func: ns.brutessh },
		{ name: "FTPCrack.exe", func: ns.ftpcrack },
		{ name: "relaySMTP.exe", func: ns.relaysmtp },
		{ name: "HTTPWorm.exe", func: ns.httpworm },
		{ name: "SQLInject.exe", func: ns.sqlinject }
	].filter(p => ns.fileExists(p.name, "home"));
	while (queue.length > 0) {
		const server = queue.shift();
		if (visited.has(server)) continue;
		visited.add(server);
		// Discovery
		const neighbors = ns.scan(server);
		for (const neighbor of neighbors) {
			if (!visited.has(neighbor)) queue.push(neighbor);
		}
		if (server === "home") continue;
		// Domination Phase: Attempt to gain Root
		if (!ns.hasRootAccess(server)) {
			const requiredPorts = ns.getServerNumPortsRequired(server);
			if (programs.length >= requiredPorts) {
				programs.forEach(p => p.func(server));
				ns.nuke(server);
				if (ns.hasRootAccess(server)) {
					serversNuked++;
					ns.print(`SUCCESS: Nuked ${server}`);
				}
			}
		}
		// Extraction Phase: Scrape all data
		if (ns.hasRootAccess(server)) {
			const files = ns.ls(server).filter(f =>
				f.endsWith(".lit") || f.endsWith(".txt")
			);

			if (files.length > 0) {
				const success = await ns.scp(files, "home", server);
				if (success) {
					filesScraped += files.length;
					ns.print(`DATA PULLED: ${files.length} items from ${server}`);
				}
			}
		}
	}
	ns.tprint("--------------------------------------------------");
	ns.tprint(`KNOWLEDGE SCRAPE COMPLETE.`);
	ns.tprint(`Servers Newly Rooted: ${serversNuked}`);
	ns.tprint(`Files Recovered: ${filesScraped}`);
	ns.tprint("Check your home server to analyze the data.");
}
