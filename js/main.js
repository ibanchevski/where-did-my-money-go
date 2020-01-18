(function() {
	const db = window.localStorage;
	const newCategories = document.querySelector('#categories');

	let categories = db.getItem('categories');
	if (categories) {
		categories = JSON.parse(categories);
		console.log(categories);
		categories.forEach(displayCategory)
	}

	// Adding category
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

	// Don't add category if already exists
	for (let i = 0; i < catholder.children.length; i++) {
		if (catholder.children[i].id === categoryName.toLowerCase()) {
			return;
		}
	}

	const catCol = document.createElement("div");
	const catTitle = document.createElement('h5');
	const catDeleteBtn = document.createElement('button');

	catCol.classList.add('col-md-3', 'category');
	catCol.id = categoryName.toLowerCase();
	catDeleteBtn.classList.add('btn', 'btn-sm', 'btn-danger', 'delete-cat-btn');
	catDeleteBtn.addEventListener('click', function() {
		deleteCategory(catCol.id);
	});

	catTitle.appendChild(document.createTextNode(categoryName));
	catDeleteBtn.appendChild(document.createTextNode('Delete'));
    catCol.appendChild(catTitle);
    catCol.appendChild(catDeleteBtn);
    catholder.appendChild(catCol);
}

function deleteCategory(id) {
	const category = document.querySelector('#' + id);
	category.remove();

	let categories = JSON.parse(window.localStorage.getItem('categories'));
	let updatedCategories = categories.filter(function(cat) {
		return cat.toLowerCase() !== id;
	});

	window.localStorage.setItem('categories', JSON.stringify(updatedCategories));
	updatedCategories.forEach(displayCategory);
}