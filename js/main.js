(function() {
	const db = window.localStorage;

	let categories = db.getItem('categories');
	if (categories) {
		categories = JSON.parse(categories);
		console.log(categories);
		categories.forEach(displayCategory)
	}

	let customCategories = db.getItem('customcategories');
	if (customCategories) {
		customCategories = JSON.parse(customCategories);
		console.log('custom categories: ');
		console.log(customCategories);
		customCategories.forEach(displayCustomCategory);
	}
})();

// Adding category
document.querySelector('#add-cat-btn').addEventListener('click', function(evt) {
	const categoriesSelect = document.querySelector('#categories');
	const newCategoryName = categoriesSelect.options[categoriesSelect.selectedIndex].value;
	console.log(newCategoryName);

	if (newCategoryName === 'Select category') { return }

	let categories = window.localStorage.getItem('categories');

	if (categories) {
		categories = JSON.parse(categories);
		categories.push(newCategoryName);
	} else {
		categories = [newCategoryName];
	}

	window.localStorage.setItem('categories', JSON.stringify(categories));
	displayCategory(newCategoryName);
});

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
	const catEntriesHolder = document.createElement('div');

	catCol.classList.add('col-md-3', 'category');
	catCol.id = categoryName.toLowerCase();

	catDeleteBtn.classList.add('btn', 'btn-sm', 'btn-danger', 'delete-cat-btn');
	catDeleteBtn.addEventListener('click', function() {
		deleteCategory(catCol.id);
	});

	catEntriesHolder.classList.add('category-entries-holder');

	catTitle.appendChild(document.createTextNode(categoryName));
	catDeleteBtn.appendChild(document.createTextNode('Delete'));
    catCol.appendChild(catTitle);
    catCol.appendChild(catDeleteBtn);
    catCol.appendChild(catEntriesHolder);
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

function toggleCustomCategory() {
	const customCategoryHolder = document.querySelector('.custom-category-holder');
	customCategoryHolder.classList.toggle('d-none');
	if (!customCategoryHolder.classList.contains('d-none')) {
		document.querySelector('#custom-category').value = '';
	}
}

function addCustomCategory() {
	const newCustomCategory = document.querySelector('#custom-category').value;
	let customCategories = window.localStorage.getItem('customcategories');

	if (customCategories) {
		customCategories = JSON.parse(customCategories);
		customCategories.push(newCustomCategory);
	} else {
		customCategories = [newCustomCategory];
	}

	window.localStorage.setItem('customcategories', JSON.stringify(customCategories));
	
	displayCustomCategory(newCustomCategory);
	toggleCustomCategory();
}

function displayCustomCategory(categoryName) {
	const category = document.createElement('option');

	category.appendChild(document.createTextNode(categoryName));
	document.querySelector('#categories').appendChild(category);
}