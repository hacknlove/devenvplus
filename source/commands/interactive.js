import { cencode } from "cencode"
export const command = 'interactive'
export const describe = 'launch the interactive terminal interface'
export const builder = {
  state: {
    describe: 'Serialized state for the interface to start with',
    type: 'string',
    default: cencode({})
  },
}
export const handler = async (argv) => {
    console.log('interactive command called with args:', argv);
    // Implement the logic for the 'interactive' command here
}