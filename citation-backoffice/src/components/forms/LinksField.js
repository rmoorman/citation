import React from 'react';
import { func, object, string } from 'prop-types';
import { Field } from 'redux-form';
import { withHandlers } from 'recompose';

import LinkField from './LinkField';
import { FieldArrayContainer, InputLine, ControlLine } from '../common/Form';
import { Button } from '../common/Button';
import { red } from '../style/colors';

const LinksInputLine = InputLine.extend`
	> div:first-child {
		width: calc(100% - 12rem);
	}
`;

const enhancer = withHandlers({
	handleAdd: ({ fields, types }) => () => {
		const keys = Object.keys(types);
		fields.push({
			_type_: keys[0],
			_id_: types[keys[0]][0]._id_
		});
	},
	handleRemove: ({ fields }) => index => () => fields.remove(index),
	handleUp: ({ fields }) => index => () => fields.swap(index, index - 1),
	handleDown: ({ fields }) => index => () => fields.swap(index, index + 1)
});

const LinksField = ({ type, fields, types, handleAdd, handleRemove, handleUp, handleDown }) => (
	<FieldArrayContainer>
		{fields.map((link, i) => (
			<LinksInputLine key={i}>
				<Field name={link} component={LinkField} props={{ types, type }} />
				<Button icon="delete" onClick={handleRemove(i)} color={red} />
				{i > 0 && <Button icon="up" onClick={handleUp(i)} />}
				{i + 1 < fields.length && <Button icon="down" onClick={handleDown(i)} />}
			</LinksInputLine>
		))}
		<ControlLine>
			<Button icon="plus" onClick={handleAdd} />
		</ControlLine>
	</FieldArrayContainer>
);

LinksField.propTypes = {
	fields: object.isRequired,
	types: object.isRequired,
	type: string,
	handleAdd: func.isRequired,
	handleRemove: func.isRequired,
	handleUp: func.isRequired,
	handleDown: func.isRequired
};

export default enhancer(LinksField);
