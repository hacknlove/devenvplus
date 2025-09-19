import React from 'react';
import {Text} from 'ink';
import { asyncit } from '../../AsyncComponents.js';

export default function toast(text, {
	timeout = 3000,
	uniqueKey
}) {
  return asyncit(Helper, { text, uniqueKey }, "global", timeout);
}

function Helper({ text }) {
	return (
		<Text color="gray">
			{text}
		</Text>
	);
}
