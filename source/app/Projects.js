import { resolve } from 'node:path';
import { readdir } from 'fs/promises'

import React from 'react';
import {Text} from 'ink';
import SelectInput from 'ink-select-input';

const rootDir = global.cli.flags.rootDir ?? process.env.DEVENVPLUS_ROOT ?? '.'

const resolvedRoot = resolve(process.cwd(), rootDir);

const rootDir = await readdir(resolvedRoot, { withFileTypes: true })


const projects = rootDir.filter(dirent => dirent.isDirectory() && dirent.name[0] !== '.').map(dirent => dirent.name)

export default function Project({ navigate, onHighlight }) {
	return (
		<>
			<Text>Chose the project:</Text>
			<SelectInput items={projects.map(project => ({ label: project, value: project }))} onSelect={(item) => {
				navigate('Project', { project: resolve(resolvedRoot, item.value) })
			}} limit={5} onHighlight={onHighlight} />
		</>
	)
}
