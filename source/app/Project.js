import fs from 'node:fs/promises';
import path from 'node:path';
import React, { useEffect, useState } from 'react';
import {Text} from 'ink';

async function loadProject(project) {
	const packagejson = await import(`${project}/package.json`, {
		with: { type: "json"
	}});

	return {
		packagejson,
	};
}

function useProject(project) {
	const [projectData, setProjectData] = useState(null);

	useEffect(() => {
		const packagejson = import(`${project}/package.json`, {
			 with: { type: "json"
			}		});
		packagejson.then((data) => {
			setProjectData({
				packagejson: data?.default
			});
		});
	}, [project]);

	return projectData;
}

export default function Project({ project }) {


	const projectData = useProject(project);

	if (!projectData) return null;

	return (
		<>
			<Text>Selected project: {projectData.packagejson.name}@{projectData.packagejson.version}</Text>
		</>
	)
}
