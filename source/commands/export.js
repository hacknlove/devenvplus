import fs from 'node:fs/promises';
import { inspect } from '../inspector/index.js';

export const command = 'export [path]'
export const describe = 'Export the inspection result to a JSON file'
export const builder = (yargs) =>
  yargs.positional('path', {
    describe: 'Path to the output JSON file',
    type: 'string',
    default: 'devenvplus-export.json',
  });

export async function handler(argv) {
    const project = await inspect(argv);
    const outputPath = argv.path;

    await fs.writeFile(outputPath, JSON.stringify(project, null, 2));
    console.log(`Exported inspection result to ${outputPath}`);
}
