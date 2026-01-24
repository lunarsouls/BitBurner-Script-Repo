/** @param {NS} ns */
export async function main(ns) {
    ns.enableLog("ALL");
    ns.ui.openTail(); 

    // --- ARGS & CONFIGURATION ---
    const target = ns.args[0] || "sigma-cosmetics";
    const stockSym = getStockSymbol(target);
    const soldierScript = "soldier.js";

    if (!stockSym) {
        ns.tprint(`ERROR: Could not automatically determine stock symbol for server '${target}'.`);
        ns.tprint("Supported servers: sigma-cosmetics, joesguns, nwo, megacorp, ecorp, etc.");
        return;
    }
    
    // --- THRESHOLDS ---
    const SECURITY_THRESH = 2; 
    const FORECAST_BUY = 0.60; 
    const FORECAST_SELL = 0.50; 
    const CASH_RESERVE = 100000000; 

    // --- PERFORMANCE TUNING ---
    const MAX_GROW_THREADS = 10000; 
    const UPDATE_DELAY = 2000; 

    ns.print(`CONTROLLER STARTED ON ${target} [${stockSym}]`);

    const serverList = getRootedServers(ns);

    while (true) {
        const minSec = ns.getServerMinSecurityLevel(target);
        const curSec = ns.getServerSecurityLevel(target);
        const maxMon = ns.getServerMaxMoney(target);
        const curMon = ns.getServerMoneyAvailable(target);

        const growTime = ns.getGrowTime(target);
        const weakTime = ns.getWeakenTime(target);
        
        manageStock(ns, stockSym, FORECAST_BUY, FORECAST_SELL, CASH_RESERVE);

        if (curSec > minSec + SECURITY_THRESH) {
            const threadsNeeded = Math.ceil((curSec - minSec) / 0.05);
            ns.print(`[WEAKEN] Security: ${curSec.toFixed(2)} (Min: ${minSec}). Threads: ${threadsNeeded}`);
            distributePayload(ns, serverList, soldierScript, target, "weaken", threadsNeeded, 0);
            await ns.sleep(weakTime + 50); 
        }
        else if (curMon >= maxMon) {
            ns.print(`[HACK] Security: ${curSec.toFixed(2)}. Money Full. Tickling...`);
            distributePayload(ns, serverList, soldierScript, target, "hack", 1, 0);
            await ns.sleep(500); 
        }
        else {
            ns.print(`[GROW] Security: ${curSec.toFixed(2)}. Forecast: ${(ns.stock.getForecast(stockSym)*100).toFixed(1)}%`);
            distributePayload(ns, serverList, soldierScript, target, "grow", MAX_GROW_THREADS, Math.floor(Math.random() * 100));
            await ns.sleep(UPDATE_DELAY);
        }
    }
}

/** Smart Stock Management System */
function manageStock(ns, sym, buyThresh, sellThresh, reserve) {
    if (!ns.stock.hasWSEAccount()) return;
    const forecast = ns.stock.getForecast(sym);
    const pos = ns.stock.getPosition(sym);
    const sharesOwned = pos[0];
    const maxShares = ns.stock.getMaxShares(sym);
    const askPrice = ns.stock.getAskPrice(sym);
    const bidPrice = ns.stock.getBidPrice(sym);
    const myMoney = ns.getServerMoneyAvailable("home");

    if (sharesOwned > 0 && forecast < sellThresh) {
        const profit = sharesOwned * (bidPrice - pos[1]);
        ns.stock.sellStock(sym, sharesOwned);
        ns.tprint(`DUMPED ${sym}. Profit: ${ns.formatNumber(profit)}`);
    }

    if (forecast >= buyThresh && sharesOwned < maxShares) {
        const availableMoney = myMoney - reserve;
        if (availableMoney > 0) {
            const sharesToBuy = Math.min(maxShares - sharesOwned, Math.floor(availableMoney / askPrice));
            if (sharesToBuy > 0 && (sharesToBuy * askPrice) > 10000000) { 
                ns.stock.buyStock(sym, sharesToBuy);
                ns.print(`BOUGHT ${ns.formatNumber(sharesToBuy)} shares of ${sym}`);
            }
        }
    }
}

function distributePayload(ns, servers, script, target, job, totalThreadsNeeded, delay) {
    let threadsRemaining = totalThreadsNeeded;
    const scriptRam = ns.getScriptRam(script);
    for (const server of servers) {
        if (threadsRemaining <= 0) break;
        let availableRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
        if (server === "home") availableRam = Math.max(0, availableRam - 32); 
        const possibleThreads = Math.floor(availableRam / scriptRam);
        if (possibleThreads > 0) {
            const actualThreads = Math.min(possibleThreads, threadsRemaining);
            ns.exec(script, server, actualThreads, target, job, delay, Date.now());
            threadsRemaining -= actualThreads;
        }
    }
}

function getRootedServers(ns) {
    const servers = ["home"];
    const visited = new Set(["home"]);
    const scan = (current) => {
        const connected = ns.scan(current);
        for (const next of connected) {
            if (!visited.has(next)) {
                visited.add(next);
                if (!ns.hasRootAccess(next)) {
                    try {
                        if (ns.fileExists("BruteSSH.exe", "home")) ns.brutessh(next);
                        if (ns.fileExists("FTPCrack.exe", "home")) ns.ftpcrack(next);
                        ns.nuke(next);
                    } catch (e) {}
                }
                if (ns.hasRootAccess(next)) servers.push(next);
                scan(next);
            }
        }
    };
    scan("home");
    return servers.sort((a, b) => ns.getServerMaxRam(b) - ns.getServerMaxRam(a));
}

function getStockSymbol(server) {
    const map = {
        "ecorp": "ECP", "megacorp": "MGCP", "blade": "BLD", "nwo": "NWO",
        "clarkinc": "CLRK", "omnitek": "OMN", "4sigma": "FSIG", "kuai-gong": "KGI",
        "fulcrumtech": "FLCM", "stormtech": "STM", "defcomm": "DCOMM", "helios": "HLS",
        "vitalife": "VITA", "icarus": "ICRS", "universal": "UNIV", "microdyne": "MDYN",
        "titan-labs": "TITN", "rho-construction": "RHO", "alpha-ent": "APHE",
        "syscore": "SYSC", "comptek": "CPTK", "netlink": "NTALK", "catalyst": "CTLST",
        "summit-uni": "SMUN", "global-pharm": "GPH", "nova-med": "NOVA",
        "sigma-cosmetics": "SGC", "joesguns": "JGN", "foodnstuff": "FNS"
    };
    return map[server];
}
