/** @param {NS} ns */
export async function main(ns) {
    const [contract, server] = ns.args;
    if (!contract || !server) return ns.tprint("Usage: run hamming.js <contract> <server>");
    const encoded = ns.codingcontract.getData(contract, server);

    // 1. Calculate the syndrome (which bit is wrong)
    const n = encoded.length;
    let syndrome = 0;
    for (let i = 0; i < n; i++) {
        if (encoded[i] === '1') {
            syndrome ^= i; 
        }
    }

    let corrected = encoded.split('');
    // 2. Flip the error bit if syndrome is non-zero
    // Note: Bitburner indices are 0-based in array, but Hamming usually treats index 0 as global parity?
    // Bitburner implementation: Index 0 is global parity. 
    // The syndrome logic above works if indices match powers of 2 (1, 2, 4...).
    // Index 0 is usually not part of syndrome calc in standard hamming unless checking global parity.
    // Let's rely on standard syndrome calculation.
    
    if (syndrome !== 0) {
        corrected[syndrome] = corrected[syndrome] === '0' ? '1' : '0';
    }

    // 3. Extract data bits (indices that are NOT powers of 2, and not index 0)
    let dataBits = "";
    for (let i = 1; i < n; i++) {
        // If i is not a power of 2
        if ((i & (i - 1)) !== 0) {
            dataBits += corrected[i];
        }
    }

    // 4. Convert binary to integer
    const result = parseInt(dataBits, 2);

    const reward = ns.codingcontract.attempt(result, contract, server);
    if (reward) ns.tprint(`SUCCESS: ${reward}`); else ns.tprint(`FAILED.`);
}
