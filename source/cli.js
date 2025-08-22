#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';

const cli = meow(
	`
		Usage
		  $ devenvplus [root]

		Examples
		  $ devenvplus ~/project/foo
	`,
	{
		importMeta: import.meta,
	},
);

global.cli = cli;

render(<App />, {
	patchConsole: true,
});
