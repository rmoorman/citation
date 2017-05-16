import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import {Field, FieldArray, reduxForm} from 'redux-form';
import LinkField from './LinkField';
import LinksField from './LinksField';

import './ObjectForm.css';

class ObjectForm extends Component {
	static propTypes = {
		handleSubmit: PropTypes.func.isRequired,
		collections: PropTypes.object.isRequired,
		fields: PropTypes.object.isRequired,
		type: PropTypes.string.isRequired
	}

	render() {
		let customFields = [];
		if (this.props.fields[this.props.type]) {
			const collections = this.props.collections;
			const fields = this.props.fields[this.props.type];
			customFields = Object.keys(fields).filter(field => !/^__/.test(field)).map(field => {
				const label = (<label htmlFor={field}>{field}</label>);
				if (fields[field].kind === 'OBJECT') {
					if (fields[field].typeName === '*') {
						return (
							<div key={field}>
								{label}
								<Field name={field} component={LinkField} props={{collections}}/>
							</div>
						);
					}
					return (
						<div key={field}>
							{label}
							<Field name={field} component={LinkField} props={{collections, type: fields[field].typeName}}/>
						</div>
					);
				} else if (fields[field].kind === 'LIST') {
					if (fields[field].typeName === '*') {
						return (
							<div key={field}>
								{label}
								<FieldArray name={field} component={LinksField} props={{collections}}/>
							</div>
						);
					}
					return (
						<div key={field}>
							{label}
							<FieldArray name={field} component={LinksField} props={{collections, type: fields[field].typeName}}/>
						</div>
					);
				}
				return (
					<div key={field}>
						{label}
						<Field name={field} component="input" type="text"/>
					</div>
				);
			});
		}
		return (
			<form className="ObjectForm" onSubmit={this.props.handleSubmit}>
				<div>
					<label htmlFor="__id__">ID</label>
					<Field name="__id__" component="input" type="text"/>
				</div>
				{
					customFields
				}
				<button type="submit">Submit</button>
			</form>
		);
	}
}

export default reduxForm({
	form: 'GenericObject',
	enableReinitialize: true
})(ObjectForm);
