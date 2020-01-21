(function() {
	const db = window.localStorage;

	let categories = db.getItem('categories');
	if (categories) {
		categories = JSON.parse(categories);
		console.log(categories);
		categories.forEach(displayCategory)
	}

	if (!categories || categories.length === 0) {
		document.querySelector('.new-log-btn').classList.add('disabled');
	}

	let customCategories = db.getItem('customcategories');
	if (customCategories) {
		customCategories = JSON.parse(customCategories);
		console.log('custom categories: ');
		console.log(customCategories);
		customCategories.forEach(displayCustomCategory);
	}

	let logs = db.getItem('logs');
	if (logs) {
		logs = JSON.parse(logs);
		logs.forEach(displayLog);
	}
})();

// Adding category
document.querySelector('#add-cat-btn').addEventListener('click', function(evt) {
	const categoriesSelect = document.querySelector('#categories');
	const newCategoryName = categoriesSelect.options[categoriesSelect.selectedIndex].value;
	console.log(newCategoryName);

	if (newCategoryName === 'Select category') {
		return;
	}

	let categories = window.localStorage.getItem('categories');

	if (categories) {
		categories = JSON.parse(categories);
		categories.push(newCategoryName);
	} else {
		categories = [newCategoryName];
	}

	window.localStorage.setItem('categories', JSON.stringify(categories));
	displayCategory(newCategoryName);
	document.querySelector('.new-log-btn').classList.remove('disabled');
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

	catCol.classList.add('col-md-3', 'category', 'mb-3');
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

	let logs = window.localStorage.getItem('logs');
	if (logs) {
		logs = JSON.parse(logs);
		logs = logs.filter(function(log) {
			return log.category !== id;
		});
	}

	window.localStorage.setItem('categories', JSON.stringify(updatedCategories));
	window.localStorage.setItem('logs', JSON.stringify(logs));
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
	let newCustomCategory = document.querySelector('#custom-category').value;
	let customCategories = window.localStorage.getItem('customcategories');

	// Escape whitespace in category name
	while (newCustomCategory.indexOf(' ') > 0) {
		newCustomCategory = newCustomCategory.replace(' ', '-');
	}

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

function addRecord() {
	if (document.querySelector('.new-log-btn').classList.contains('disabled')) {
		return;
	}

	const newRecordModal = document.querySelector('.add-record-modal');
	const categories = document.querySelector('#modal-categories');
	const addBtn = document.querySelector('.modal-add-btn');
	const cancelBtn = document.querySelector('.modal-cancel-btn');

	let dbCategories = window.localStorage.getItem('categories');
	dbCategories = JSON.parse(dbCategories);
	
	if (categories.children.length <= dbCategories.length) {
		dbCategories.forEach(function(category) {
			let catNode = document.createElement('option');
			catNode.appendChild(document.createTextNode(category));
			categories.appendChild(catNode);
		});
	}

	newRecordModal.classList.add('visible');

	addBtn.addEventListener('click', function addNewLog() {
		const amount = document.querySelector('#logAmount');
		const logCategory = categories.options[categories.selectedIndex];
		const logDescription = document.querySelector('#logDescription');

		if (logCategory.value === 'Select category' || amount.value < 0) {
			document.querySelector('.modal-error').classList.remove('d-none');
			return;
		}

		saveLog({ amount: amount.value, category: logCategory.value.toLowerCase(), description: logDescription.value });
		
		newRecordModal.classList.remove('visible');
		newRecordModal.classList.add('hidden');
		addBtn.removeEventListener('click', addNewLog);
		amount.value = 0;
		logDescription.value = '';
		document.querySelector('.modal-error').classList.add('d-none');
	});

	cancelBtn.addEventListener('click', function cancelModal() {
		newRecordModal.classList.remove('visible');
		cancelBtn.removeEventListener('click', cancelModal);
	});
}

function saveLog(log) {
	let logs = window.localStorage.getItem('logs');

	if (!logs) {
		logs = [];
	} else {
		logs = JSON.parse(logs);
	}

	log.creationDate = new Date();
	log.id = generateLogID();
	logs.push(log);
	window.localStorage.setItem('logs', JSON.stringify(logs));
	displayLog(log);
}

// Copied modified version of:
// https://gist.github.com/6174/6062387
function generateLogID() {
	const s = ['a', 'b', 'c' ,'d', 'e', 'f', 'g', 'h', 'i', 'j', 'k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
	return s[Math.floor(Math.random() * 26)] + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function displayLog(log) {
	const categoryHolder = document.querySelector('.category-holder');
	const displayedCategories = categoryHolder.children;
	let category;

	// Find log's category
	for (let i = 0; i < displayedCategories.length; i++) {
		if (displayedCategories[i].id === log.category) {
			category = displayedCategories[i];
			break;
		}
	}

	const logWrapper = document.createElement('div');
	const description = document.createElement('div');
	const amount = document.createElement('div');
	const logDate = document.createElement('div');
	const deleteBtn = document.createElement('button');
	const deleteBtnIcon = document.createElement('i');

	logWrapper.id = log.id;
	logWrapper.classList.add('log-wrapper');
	description.classList.add('log-description');
	amount.classList.add('log-amount');
	logDate.classList.add('log-date');
	deleteBtnIcon.classList.add('far', 'fa-trash-alt');
	deleteBtn.type = "button";
	deleteBtn.classList.add('btn', 'btn-sm', 'btn-danger');

	description.appendChild(document.createTextNode(log.description));
	amount.appendChild(document.createTextNode(parseFloat(log.amount).toFixed(2) + ' лв.'));
	logDate.appendChild(document.createTextNode(new Date(log.creationDate).toUTCString()));
	deleteBtn.appendChild(deleteBtnIcon);

	logWrapper.appendChild(logDate);
	logWrapper.appendChild(deleteBtn);
	logWrapper.appendChild(description);
	logWrapper.appendChild(amount);
	category.appendChild(logWrapper);

	deleteBtn.addEventListener('click', function() {
		removeLog(log.id);
	});
}

function removeLog(id) {
	let logs = window.localStorage.getItem('logs');

	if (logs) {
		logs = JSON.parse(logs);
		logs = logs.filter(function(log) {
			return log.id !== id;
		});

		window.localStorage.setItem('logs', JSON.stringify(logs));
	}

	document.querySelector('#' + id).remove();
}