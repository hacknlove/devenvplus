import React from 'react';
import {Navigation} from './Navigation.js';
import { AsyncComponents } from './AsyncComponents.js';

export default function Navigable() {


	return (

	<>
		<Navigation path="Root" />
		<AsyncComponents area="global" />
	</>
	)
}
