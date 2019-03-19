/**
 * Demo of Shades of Purple VSCode theme.
 *
 * I'm 💜'ing it.
 */
import React from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';

const Wrap = styled.div`
	display: table;
	width: 100%;
`;

const Message = styled.p`
	font-size: 1.8rem;
	line-height: 1.45;
`;

/**
 * VSCode Component.
 *
 * @class VSCode
 * @extends {React.Component}
 */
class VSCode extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: null
		};
	}

	// Render it baby.
	render() {
		return (
			<Wrap>
				<button onClick={() => alert('Stop clicking me!')}>{this.props.value}</button>
				<Message>Testing the React.js Syntax in VSCode Shades of Purple 💜 theme.</Message>
			</Wrap>
		);
	}
}

// Show it to all.
render(VSCode, document.getElementById('root'));
