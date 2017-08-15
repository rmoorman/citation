import _ from 'lodash';
import React, { Component } from 'react';
import { object, string } from 'prop-types';
import { Field } from 'redux-form';

class LinkField extends Component {
	static propTypes = {
		input: object.isRequired,
		collections: object.isRequired,
		type: string
	};

	render() {
		const type = this.props.type ? this.props.type : this.props.input.value.__type__;
		const values = _.get(this.props.collections, type, []);
		return (
			<div>
				{!this.props.type &&
					<Field name={`${this.props.input.name}.__type__`} component="select">
						{Object.keys(this.props.collections).map((type, i) => <option key={i} value={type}>{type}</option>)}
					</Field>}
				<Field name={`${this.props.input.name}.__id__`} component="select">
					{values.map((value, i) => <option key={i} value={value.__id__}>{value.__id__}</option>)}
				</Field>
			</div>
		);
	}
}

export default LinkField;
