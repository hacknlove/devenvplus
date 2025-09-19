export const command = 'exec [service] [command] [args...] <options...>'
export const describe = 'Execute a command from package.json scripts, inside a container'

export const handler = async (argv) => {
    console.log('exec command called with args:', argv);
    // Implement the logic for the 'exec' command here
}