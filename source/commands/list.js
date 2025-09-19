import { inspect } from '../inspector/index.js';

export const command = 'list'
export const describe = 'List all available services, labels and commands'

export async function handler(argv) {
    const projectPromise = inspect(argv);
    let waiting = true;
    projectPromise.then(() => waiting = false);
    const spinnerFrames = ['-', '\\', '|', '/'];
    let frameIndex = 0;

    while (waiting) {
        process.stdout.write(`\rInspecting project... ${spinnerFrames[frameIndex]}`);
        frameIndex = (frameIndex + 1) % spinnerFrames.length;
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    process.stdout.write('\rInspection complete!          \n');

    const project = await projectPromise;   

    console.log(JSON.stringify( project, null, 2 ));
}