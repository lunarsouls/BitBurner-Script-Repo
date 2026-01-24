/** @param {NS} ns */
export async function main(ns) {
    const [contract, server] = ns.args;
    if (!contract || !server) return ns.tprint("Usage: run algostocktraderI.js <contract> <server>");
    const prices = ns.codingcontract.getData(contract, server);

    let maxProfit = 0;
    let minPrice = Number.MAX_VALUE;

    for (let i = 0; i < prices.length; i++) {
        if (prices[i] < minPrice) {
            minPrice = prices[i];
        } else if (prices[i] - minPrice > maxProfit) {
            maxProfit = prices[i] - minPrice;
        }
    }

    const reward = ns.codingcontract.attempt(maxProfit, contract, server);
    if (reward) ns.tprint(`SUCCESS: ${reward}`); else ns.tprint(`FAILED.`);
}
