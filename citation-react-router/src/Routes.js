import React, { Component } from 'react';
import { string, object, array } from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import { queryComponentTree } from './queries';
import ComponentTree from './components/ComponentTree';
import { chooseColorForComponents } from './edition/colors';
import Empty from './empty/Empty';

export default class Routes extends Component {
	static propTypes = {
		serverUrl: string.isRequired, // eslint-disable-line react/no-unused-prop-types
		components: object.isRequired, // eslint-disable-line react/no-unused-prop-types
		pages: array.isRequired,
		match: object.isRequired,
		context: string.isRequired
	};

	constructor() {
		super();
		this.state = { contents: {} };

		this.matchRenderer = this.matchRenderer.bind(this);
		this.forceUpdate = this.forceUpdate.bind(this);
	}

	componentWillMount() {
		if (window && window._contents_) {
			this.setState({ contents: window._contents_ });
		}
	}

	async loadPageContent(page) {
		if (page !== undefined && this.state.contents[page.component._id_] === undefined) {
			await Promise.resolve();
			this.setState({ contents: { [page.component._id_]: null } });
			const content = await queryComponentTree(this.props.serverUrl, page.component);
			if (this.props.context === '/edition') {
				chooseColorForComponents(content, 0);
			}
			this.setState({ contents: { [page.component._id_]: content } });
		}
	}

	matchRenderer(page) {
		return matchProps => {
			const content = this.state.contents[page.component._id_];
			if (content === undefined || content === null) {
				this.loadPageContent(page);
				return <span />;
			}
			return (
				<ComponentTree
					index={0}
					draggable={false}
					routesProps={this.props}
					page={page}
					content={content}
					matchProps={matchProps}
					refresh={this.forceUpdate}
				/>
			);
		};
	}

	render() {
		if (this.props.pages.length === 0) {
			return <Empty />;
		}
		return (
			<Switch>
				{this.props.pages.reverse().map(page => {
					const slug = page.slug === null ? '' : page.slug;
					const path = `${this.props.match.url}/${slug}`.replace(/\/\//g, '/');
					return <Route key={slug} path={path} render={this.matchRenderer(page)} />;
				})}
			</Switch>
		);
	}
}
