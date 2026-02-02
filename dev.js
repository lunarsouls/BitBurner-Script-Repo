/** @param {NS} ns */
export async function main(ns) {
    // Attempt to hook into the game's internal webpack/react router
    globalThis.webpack_require ?? webpackChunkbitburner.push([[-1], {}, w => globalThis.webpack_require = w]);

    // Find the 'toPage' function and force it to navigate to 'Dev'
    Object.keys(webpack_require.m).forEach(k => {
        Object.values(webpack_require(k)).forEach(p => {
            if (p?.toPage) p.toPage('Dev');
        });
    });
}
