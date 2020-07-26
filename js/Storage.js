const Storage = function() {
	const db = window.localStorage;
	return {
		pull: item => {
			const collection = db.getItem(item);
			if (!collection)
				return [];
			return JSON.parse(collection);
		},
		save: (collectionName, collection) => {
			db.setItem(collectionName, JSON.stringify(collection))
		},
	}
}

export default Storage();