(function() {
	const db = window.localStorage;
	const newCategories = document.querySelector('#categories');

	let categories = db.getItem('categories');
	if (categories) {
		categories = categories.split(',').filter(cat => cat !== "null");
		console.log(categories);
		categories.forEach(displayCategories)
	}

	document.querySelector('#add-cat-btn').addEventListener('click', function(evt) {
		const newCategoryName = newCategories.options[newCategories.selectedIndex].value;
		console.log(newCategoryName);
		categories += "," + newCategoryName;
		db.setItem('categories', categories);
	});
})();

function displayCategories(categoryName) {
	const catholder = document.querySelector('.category-holder');
	const catCol = document.createElement("div");
	const catTitle = document.createElement('h5');
	catCol.classList.add('col-md-3', 'category');
	catTitle.appendChild(document.createTextNode(categoryName));
    catCol.appendChild(catTitle);
    catholder.appendChild(catCol);
}