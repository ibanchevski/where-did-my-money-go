(function() {
	const db = window.localStorage;
	const newCategories = document.querySelector('#categories');

	let categories = db.getItem('categories');
	if (categories) {
		categories = JSON.parse(categories);
		console.log(categories);
		categories.forEach(displayCategory)
	}

	document.querySelector('#add-cat-btn').addEventListener('click', function(evt) {
		const newCategoryName = newCategories.options[newCategories.selectedIndex].value;
		console.log(newCategoryName);
		let categories = db.getItem('categories');

		if (categories) {
			categories = JSON.parse(categories);
			categories.push(newCategoryName);
		} else {
			categories = [newCategoryName];
		}

		db.setItem('categories', JSON.stringify(categories));
		displayCategory(newCategoryName);
	});
})();

function displayCategory(categoryName) {
	const catholder = document.querySelector('.category-holder');
	const catCol = document.createElement("div");
	const catTitle = document.createElement('h5');
	catCol.classList.add('col-md-3', 'category');
	catTitle.appendChild(document.createTextNode(categoryName));
    catCol.appendChild(catTitle);
    catholder.appendChild(catCol);
}