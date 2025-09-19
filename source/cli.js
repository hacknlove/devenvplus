// bin.js (ESM)
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import path from 'path';

yargs(hideBin(process.argv))
  .scriptName('devenvplus')
  .option('rootDir', {
    describe: 'Root directory for the project',
    type: 'string',
    default: process.cwd(),
    global: true
  })
  .option('ignore', {
    describe: 'Regex pattern to ignore docker-compose files',
    type: 'string',
    default: [],
    global: true
  })
  .option('config', {
    describe: 'Path to a specific configuration file (overrides auto-detection)',
    type: 'string',
    global: true
  })
  .middleware(argv => {
    argv.rootDir = path.resolve(process.cwd(), argv.rootDir);
    if (argv.config) {
      argv.config = path.resolve(process.cwd(), argv.config);
    }
    
    if (typeof argv.ignore === 'string' && argv.ignore.length) {
      argv.ignore = [argv.ignore];
    }
    if (argv.ignore.length) {
      argv.ignore = new RegExp(argv.ignore.map(pattern => pattern.trim()).filter(pattern => pattern.length > 0).map(pattern => `(${pattern})`).join('|'));
    } else {
      argv.ignore = null;
    }

    return argv;
  }, true)
  .commandDir('commands')
  .strictCommands()
  .demandCommand(1)
  .help()
  .wrap(process.stdout.columns)
  .locale('en')
  .parse();