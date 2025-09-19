import fs from 'node:fs/promises';
import yaml from 'yaml';

export class DockerComposerParser {
    constructor() {
        this.services = {};
        this.labels = {};
        this.promises = [];
    }
    
    async _parse(filePath) {
        const content = await fs.readFile(filePath, 'utf8');
        const doc = yaml.parse(content);
        if (!doc.services) {
            return;
        }

        const config = doc['x-devenvplus'] || {};

        for (const service of Object.keys(doc.services)) {
            if (config.ignore?.includes(service)) {
                continue;
            }
            if (this.services[service]) {
                console.warn(`Ignoring ${service} in ${filePath}, because it is already defined at ${this.services[service].filePath}`);
                continue;
            }
            this.services[service] = {
                filePath,
                dependencies: [
                    ...config?.dependencies || [],
                    ...config[service]?.dependencies || []
                ],
            }
        }

        if (config.labels) {
            for (const label of config.labels) {
                if (!this.labels[label]) {
                    this.labels[label] = [];
                }
                this.labels[label].push(...Object.keys(doc.services));
            }
        }

        for (const service of config.services || []) {
            if (!doc.services[service]) {
                throw new Error(`Service ${service} defined in x-devenvplus but not found in services in ${filePath}`);
            }
            this.services[service].dependencies.push(...config[service].dependencies || []);
            for (const label of config[service].labels || []) {
                if (!this.labels[label]) {
                    this.labels[label] = [];
                }
                this.labels[label].push(service);
            }
        }
    }

    parse(filePath) {
        const promise = this._parse(filePath);
        this.promises.push(promise);
        return promise;
    }

    async waitForAll() {
        await Promise.all(this.promises);
        return {
            services: this.services,
            labels: this.labels,
        };
    }
}
