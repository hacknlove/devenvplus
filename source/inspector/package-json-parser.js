import fs from 'node:fs/promises';
import path from 'path';
import { fileExists } from '../shared/fileExists.js';

async function importPackageJson(pkgPath) {
    try {
        const { name, scripts, workspaces } = await fs.readFile(pkgPath, 'utf8').then(data => JSON.parse(data));

        if (!workspaces) {
            return { name, scripts };
        }

        return {
            name,
            scripts,
            workspaces: await importWorkspacePackages(workspaces, pkgPath)
        };
    } catch (err) {
        throw new Error(`Failed to import package.json from ${pkgPath}: ${err.message}`, { cause: err });
    }
}

async function importWorkspacePackages(workspaces, pkgPath) {
    const packages = {};
    for (const pattern of workspaces) {
        for await (const workspace of fs.glob(pattern, { cwd: pkgPath })) {
            const pkgPath = path.join(pkgPath, workspace, 'package.json');
            if (await fileExists(pkgPath)) {
                const { name, scripts } = await importPackageJson(pkgPath);
                packages[name] = scripts;
            }
        }
    }
    return packages;
}

async function findClosestPackageJson(startDir, rootDir) {
    let dir = startDir;
    while (dir !== rootDir) {
        const pkgPath = path.join(dir, 'package.json');
        if (await fileExists(pkgPath)) {
            return pkgPath;
        }
        const parentDir = path.dirname(dir);
        dir = parentDir;
    }
}

export class PackageJsonParser {
    constructor(rootDir = process.cwd()) {
        this.rootDir = rootDir;
        this.packages = {};
        this.promises = [];
    }

    async _parse(filePath) {
        const jsonPath = await findClosestPackageJson(path.dirname(filePath), this.rootDir);

        if (!jsonPath) {
            return;
        }

        const pkg = await importPackageJson(jsonPath);
        if (!pkg) {
            return;
        }

        if (this.packages[pkg.name]) {
            throw new Error(`Duplicate package name: ${pkg.name} in ${jsonPath} and ${this.packages[pkg.name].path}`);
        }

        this.packages[pkg.name] = {
            path: jsonPath,
            scripts: pkg.scripts || {},
            workspacePackages: pkg.workspaces || {},
        }
    }

    parse(pkgPath) {
        const promise = this._parse(pkgPath);
        this.promises.push(promise);
        return promise;
    }

    async waitForAll() {
        await Promise.all(this.promises);
        return this.packages;
    }
}