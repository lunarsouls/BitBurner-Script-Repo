/** @param {NS} ns */
export async function main(ns) {
    const [contract, server] = ns.args;
    
    if (!contract || !server) {
        ns.tprint("ERROR: Usage: run arrayjump.js <contract_id> <server>");
        return;
    }

    const data = ns.codingcontract.getData(contract, server);
    
    // Problem: Given an array of non-negative integers, you are initially positioned at the first index of the array.
    // Each element in the array represents your maximum jump length at that position.
    // Determine if you are able to reach the last index.
    
    // Output: 1 if possible, 0 if not.
    
    let maxReach = 0;
    let canReach = 0;
    
    for (let i = 0; i < data.length; i++) {
        // If current index is beyond what we can reach, we are stuck.
        if (i > maxReach) {
            canReach = 0;
            break;
        }
        
        // Update max reach from current position
        maxReach = Math.max(maxReach, i + data[i]);
        
        // If we can reach the last index
        if (maxReach >= data.length - 1) {
            canReach = 1;
            break;
        }
    }
    
    const reward = ns.codingcontract.attempt(canReach, contract, server);
    
    if (reward) {
        ns.tprint(`SUCCESS: Solved ${contract} on ${server}. Reward: ${reward}`);
    } else {
        ns.tprint(`FAILURE: Wrong answer for ${contract} on ${server}.`);
    }
}
