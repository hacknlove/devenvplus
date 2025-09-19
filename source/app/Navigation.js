import clipboard from 'clipboardy';
import React, {useState, useEffect, useRef} from 'react';
import {useInput, useApp} from 'ink';
import { cencode } from 'cencode';
import { asyncit } from './AsyncComponents.js';
import toast from './app/shared/Help.js';

export function Navigation({ path }) {
	const {exit} = useApp();
	const [currentPath, setCurrentPath] = useState(null);

	const history = useRef([]);
	const Component = useRef(null);
	const Properties = useRef({});
	const Highlighted = useRef(null);

	async function navigate(path, props = {}) {
		history.current.push([currentPath, props]);
		replace(path, props);
	}

	async function replace(path, props = {}) {
		if (!path) return;
		const component = await import(`./app/${path.value ?? path}.js`).then(mod => mod.default);
		Component.current = component;
		Properties.current = props;
		Highlighted.current = null;
		setCurrentPath(path.value ?? path);
	}

	function onHighlight(item) {
		Highlighted.current = item.value ?? item;
	}

	useEffect(() => {
		replace(path);
	}, []);

	useInput((input, key) => {
		if (input === 'q') {
			return exit();
		}
		if (key.escape) {
			if (!history.current.length) {
				return exit();
			}
			replace(...history.current.pop());
			return
		}

		if (input === ' ') {
			const serialized = cencode({
				path: currentPath,
				history: history.current,
				highlighted: Highlighted.current,
				flags: global.cli.flags,
			})
			clipboard.writeSync(`devenvplus --exec '${serialized}'`);
			toast("One shot command copied to the clipboard", { uniqueKey: "copy one shot" });
			return
		}

		if (key.upArrow || key.downArrow || key.return) {
			return
		}
		toast("Press up and down arrows to navigate; enter to select, escape to go back; q to quit, space to get a CLI shortcut.", { uniqueKey: 'keyboard-shortcuts' });

	});

	if (!currentPath || !Component) {
		return null;
	}

	return <Component.current navigate={navigate} onHighlight={onHighlight} {...Properties.current} />;
}
