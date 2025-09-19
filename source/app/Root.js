import React from 'react';
import {Text, Newline} from 'ink';
import SelectInput from 'ink-select-input';

export default function Root({ navigate, onHighlight }) {

	return (
		<>
			<Text>Choose the scope:</Text>
			<SelectInput
				items={[
					{label: 'Workspace', value: 'Workspace'},
					{label: 'Projects', value: 'Projects'},
				]}
				onSelect={navigate}
				onHighlight={onHighlight}
			/>
			<Newline />
		</>
	);
}
