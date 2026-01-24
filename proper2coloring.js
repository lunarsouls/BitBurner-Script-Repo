/** @param {NS} ns */
export async function main(ns) {
	const [contract, server] = ns.args;
	if (!contract || !server) return ns.tprint("Usage: run proper2coloring.js <contract> <server>");

	const [numVertices, edges] = ns.codingcontract.getData(contract, server);

	const adj = Array.from({ length: numVertices }, () => []);
	for (const [u, v] of edges) {
		adj[u].push(v);
		adj[v].push(u);
	}

	const colors = Array(numVertices).fill(-1);

	for (let i = 0; i < numVertices; i++) {
		if (colors[i] === -1) {
			colors[i] = 0;
			const stack = [i];

			while (stack.length > 0) {
				const u = stack.pop();
				for (const v of adj[u]) {
					if (colors[v] === -1) {
						colors[v] = 1 - colors[u];
						stack.push(v);
					} else if (colors[v] === colors[u]) {
						// Conflict -> Impossible
						ns.codingcontract.attempt([], contract, server);
						return;
					}
				}
			}
		}
	}

	const reward = ns.codingcontract.attempt(colors, contract, server);
	if (reward) ns.tprint(`SUCCESS: ${reward}`); else ns.tprint(`FAILED.`);
}
