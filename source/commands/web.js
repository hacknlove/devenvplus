export const command = 'web'
export const describe = 'launch the web interface server'
export const builder = {
  port: {
    describe: 'Port to run the web interface on',
    type: 'string',
    default: '454545'
  },
  interface: {
    describe: 'Network interface to bind the web server to',
    type: 'string',
    default: 'localhost'
  }
}
export const handler = async (argv) => {
    console.log('web command called with args:', argv);
    // Implement the logic for the 'web' command here
}