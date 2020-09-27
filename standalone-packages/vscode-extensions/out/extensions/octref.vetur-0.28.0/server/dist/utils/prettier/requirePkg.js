"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireLocalPkg = void 0;
/**
 * Adapted from
 * https://github.com/prettier/prettier-vscode/blob/1843acb5d/src/requirePkg.ts
 */
const path = require("path");
const resolve = require("resolve");
const readPkgUp = require("read-pkg-up");
/**
 * Recursively search for a package.json upwards containing given package
 * as a dependency or devDependency.
 * @param {string} fspath file system path to start searching from
 * @param {string} pkgName package's name to search for
 * @returns {string} resolved path to prettier
 */
function findPkg(fspath, pkgName) {
    const result = readPkgUp.sync({ cwd: fspath, normalize: false });
    if (!result) {
        return undefined;
    }
    const pkgPath = result.path;
    const pkg = result.packageJson;
    const { root } = path.parse(fspath);
    if (pkg &&
        ((pkg.dependencies && pkg.dependencies[pkgName]) || (pkg.devDependencies && pkg.devDependencies[pkgName]))) {
        return resolve.sync(pkgName, { basedir: pkgPath });
    }
    else if (pkgPath) {
        const parent = path.resolve(path.dirname(pkgPath), '..');
        if (parent !== root) {
            return findPkg(parent, pkgName);
        }
    }
    return;
}
/**
 * Require package explicitely installed relative to given path.
 * Fallback to bundled one if no pacakge was found bottom up.
 * @param {string} fspath file system path starting point to resolve package
 * @param {string} pkgName package's name to require
 * @returns module
 */
function requireLocalPkg(fspath, pkgName) {
    const modulePath = findPkg(fspath, pkgName);
    if (modulePath !== void 0) {
        try {
            return require(modulePath);
        }
        catch (e) {
            console.log(`Failed to load ${pkgName} from ${modulePath}. Using bundled version.`);
        }
    }
    return require(pkgName);
}
exports.requireLocalPkg = requireLocalPkg;
//# sourceMappingURL=requirePkg.js.map