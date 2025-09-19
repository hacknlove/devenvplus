import { glob } from 'node:fs/promises';
import fs from 'fs/promises';
import path from 'path';
import { DockerComposerParser } from './docker-compose-parser.js';
import { PackageJsonParser } from './package-json-parser.js';

export async function inspect({ rootDir, config, ignore }) {
    if (config) {
        const configPath = path.resolve(process.cwd(), config);
        if (await fileExists(configPath)) {
            return fs.readFile(configPath, 'utf8').then(data => JSON.parse(data));
        }
    }

    const dockerComposerParser = new DockerComposerParser();
    const packageJsonParser = new PackageJsonParser(rootDir);

    for await (const file of glob('**/docker-compose.{yaml,yml}', { cwd: rootDir })) {
        if (ignore?.test(file)) {
            console.log(`Ignoring ${file} due to ignore pattern`);
            continue;
        }
        const filePath = path.join(rootDir, file);


        dockerComposerParser.parse(filePath);
        packageJsonParser.parse(filePath);
    }

    await dockerComposerParser.waitForAll();
    await packageJsonParser.waitForAll();

    return {
        services: dockerComposerParser.services,
        labels: dockerComposerParser.labels,
        packages: packageJsonParser.packages,
    }

}