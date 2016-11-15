export const serverUrl = 'http://localhost:4000/graphql';

export function query(query) {
	return fetch(serverUrl, {
		method: 'POST',
		body: `query RootQueryType ${query}`,
		headers: new Headers({'Content-Type': 'application/graphql'})
	}).then(response => response.json());
}

export function mutation(mutation) {
	return fetch(serverUrl, {
		method: 'POST',
		body: `mutation RootQueryType ${mutation}`,
		headers: new Headers({'Content-Type': 'application/graphql'})
	}).then(response => response.json());
}
