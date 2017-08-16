import React, { Component } from 'react';
import { object, string } from 'prop-types';
import { Field } from 'redux-form';
import LinkField from './LinkField';

class LinksField extends Component {
	static propTypes = {
		fields: object.isRequired,
		meta: object.isRequired,
		collections: object.isRequired,
		type: string
	};

	constructor() {
		super();
		this.handleAdd = this.handleAdd.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
	}

	handleAdd() {
		const keys = Object.keys(this.props.collections);
		this.props.fields.push({
			__type__: keys[0],
			__id__: this.props.collections[keys[0]][0].__id__
		});
	}

	handleRemove(index) {
		return () => this.props.fields.remove(index);
	}

	handleUp(index) {
		return () => this.props.fields.swap(index, index - 1);
	}

	handleDown(index) {
		return () => this.props.fields.swap(index, index + 1);
	}

	render() {
		return (
			<ul className="ObjectArray">
				{this.props.fields.map((link, i) =>
					<li key={i}>
						<Field
							name={link}
							component={LinkField}
							props={{
								collections: this.props.collections,
								type: this.props.type
							}}
						/>
						<button type="button" onClick={this.handleRemove(i)}>
							X
						</button>
						{i > 0 &&
							<button type="button" onClick={this.handleUp(i)}>
								Λ
							</button>}
						{i + 1 < this.props.fields.length &&
							<button type="button" onClick={this.handleDown(i)}>
								V
							</button>}
					</li>
				)}
				<li className="ObjectArrayAdd">
					<button type="button" onClick={this.handleAdd}>+</button>
				</li>
				{this.props.meta.error && <li className="error">{this.props.meta.error}</li>}
			</ul>
		);
	}
}

export default LinksField;
