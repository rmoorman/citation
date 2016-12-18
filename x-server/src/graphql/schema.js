/* eslint no-use-before-define: 0 */

import {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLInterfaceType,
	GraphQLID,
	GraphQLList,
	GraphQLString
} from 'graphql';

import {readCollection, readObject} from '../gitasdb/read';
import {inspectObject, graphqlQuerySerialize} from '../gitasdb/inspect';
// import {writeObject} from '../gitasdb/write';

export const ObjectInterface = new GraphQLInterfaceType({
	name: 'Object',
	fields: () => ({
		__id__: {type: GraphQLID},
		__type__: {type: GraphQLString}
	})
});

export const PageType = new GraphQLObjectType({
	name: 'Page',
	interfaces: [ObjectInterface],
	isTypeOf: value => value.__type__ === 'Page',
	fields: () => ({
		__id__: {type: GraphQLID},
		__type__: {type: GraphQLString},
		slug: {type: GraphQLString},
		title: {type: GraphQLString},
		children: {
			type: new GraphQLList(PageType),
			resolve: root => readChildren(root.children)
		},
		component: {
			type: ComponentType,
			resolve: root => readChild(root.component)
		}
	})
});

export const ComponentType = new GraphQLObjectType({
	name: 'Component',
	interfaces: [ObjectInterface],
	isTypeOf: value => value.__type__ === 'Component',
	fields: () => ({
		__id__: {type: GraphQLID},
		__type__: {type: GraphQLString},
		__tree__: {
			type: GraphQLString,
			resolve: inspect
		},
		type: {type: GraphQLString},
		children: {
			type: new GraphQLList(ComponentType),
			resolve: root => readChildren(root.children)
		},
		data: {
			type: new GraphQLList(ObjectInterface),
			resolve: root => readChildren(root.data)
		}
	})
});

export const ContentType = new GraphQLObjectType({
	name: 'Content',
	interfaces: [ObjectInterface],
	isTypeOf: value => value.__type__ === 'Content',
	fields: () => ({
		__id__: {type: GraphQLID},
		__type__: {type: GraphQLString},
		title: {type: GraphQLString},
		content: {type: GraphQLString}
	})
});

function read(type, id = null) {
	return id === null ? readCollection(type) : [readObject(type, id)];
}

async function inspect(root) {
	const inspection = await inspectObject(root.__type__, root.__id__);
	return graphqlQuerySerialize(inspection);
}

function readChildren(links) {
	return Promise.all(links.links.map(link => {
		const {collection, id} = link;
		return readObject(collection, id);
	}));
}

function readChild(link) {
	const {collection, id} = link.link;
	return readObject(collection, id);
}

export const ContentSchema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: 'Query',
		fields: {
			Page: {
				type: new GraphQLList(PageType),
				args: {id: {type: GraphQLID}},
				resolve: (root, {id}) => read('Page', id)
			},
			Component: {
				type: new GraphQLList(ComponentType),
				args: {id: {type: GraphQLID}},
				resolve: (root, {id}) => read('Component', id)
			},
			Content: {
				type: new GraphQLList(ContentType),
				args: {id: {type: GraphQLID}},
				resolve: (root, {id}) => read('Content', id)
			}
		}
	})// ,
	// mutation: new GraphQLObjectType({
	// 	name: 'Mutation',
	// 	fields: {
	// 		editObject: {
	// 			type: ObjectType,
	// 			args: {
	// 				type: {type: GraphQLString},
	// 				slug: {type: GraphQLString},
	// 				title: {type: GraphQLString},
	// 				content: {type: GraphQLString}
	// 			},
	// 			resolve: async (root, params) => {
	// 				const {type, slug, ...object} = params;
	// 				return writeObject(type, slug, object);
	// 			}
	// 		}
	// 	}
	// })
});
