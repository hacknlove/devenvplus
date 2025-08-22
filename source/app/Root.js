import React from 'react';
import {Text, Newline} from 'ink';
import SelectInput from 'ink-select-input';
import Help from './shared/Help.js';

export default function Root({ navigate }) {

	return (
		<>
			<Text>Choose the scope:</Text>
			<SelectInput
				items={[
					{label: 'Workspace', value: 'Workspace'},
					{label: 'Projects', value: 'Projects'},
				]}
				onSelect={navigate}
			/>
			<Newline />
			<Help />
		</>
	);
}
