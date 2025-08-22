import React, {useState, useEffect, useRef} from 'react';
import {useInput, useApp} from 'ink';

export function Navigation({ path }) {
	const {exit} = useApp();
	const [currentPath, setCurrentPath] = useState(null);

	const history = useRef([]);
	const Component = useRef(null);

	async function navigate(path) {
		history.current.push(currentPath);
		const component = await import(`./app/${path.value ?? path}.js`).then(mod => mod.default);
		Component.current = component;
		setCurrentPath(path);
	}

	useEffect(() => {
		navigate(path);
	}, []);

	useInput((input, key) => {
		if (input === 'q') {
			return exit();
		}
		if (key.escape) {
			if (!history.current.length) {
				return exit();
			}
			navigate(history.current.pop());
		}
	});

	if (!currentPath || !Component) {
		return null;
	}

	return <Component.current navigate={navigate} />;
}
