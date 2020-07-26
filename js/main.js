'use strict';

import Storage from './Storage.js';

(function() {
	const categories = Storage.pull('categories');
	const logs = Storage.pull('logs');

	if (categories.length != 0) {
		document.querySelector('.no-categories').classList.add('d-none');
	} else {
		document.querySelector('.new-log-btn').classList.add('disabled');
	}

	categories.forEach(displayCategory);
	logs.forEach(displayLog);
	document.querySelector('.monthly-expense').innerHTML = calculateMonthlyExpenses();
	document.querySelector('#newCategoryBtn').addEventListener('click', toggleCustomCategoryInput);
	document.querySelector('#newCategoryForm').addEventListener('submit', addCategory);
	document.querySelector('#addRecordBtn').addEventListener('click', addRecord);
	document.querySelector('.delete-cat-btn').addEventListener('click', function(e) {
		deleteCategory(this.parentElement.id);
	});
})();

function toggleCustomCategoryInput() {
	const customCategoryHolder = document.querySelector('.custom-category-holder');
	customCategoryHolder.classList.toggle('d-none');
	if (!customCategoryHolder.classList.contains('d-none')) {
		document.querySelector('#custom-category').value = '';
	}
}

function addCategory(e) {
	e.preventDefault();
	let categoryName = document.querySelector('#custom-category').value;
	let categories = window.localStorage.getItem('categories');

	// Escape whitespace in category name
	while (categoryName.indexOf(' ') > 0) {
		categoryName = categoryName.replace(' ', '-');
	}

	if (categories === null || categories === undefined) {
		categories = [];
	} else {
		categories = JSON.parse(categories);
	}

	if (categories.includes(categoryName)) {
		document.querySelector('.add-category-error').classList.remove('d-none');
		return;
	}

	categories.push(categoryName);
	window.localStorage.setItem('categories', JSON.stringify(categories));
	
	displayCategory(categoryName);
	toggleCustomCategoryInput();
	document.querySelector('.new-log-btn').classList.remove('disabled');
	document.querySelector('.no-categories').classList.add('d-none');
	document.querySelector('.add-category-error').classList.add('d-none');
}

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

	catCol.classList.add('col-sm', 'category', 'mb-3');
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
	document.querySelector(`#${id}`).remove();
	
	const categories = Storage.pull('categories');
	const updatedCategories = categories.filter(c => c.toLowerCase() !== id);

	let categoryLogs = Storage.pull('logs');
	categoryLogs = categoryLogs.filter(log => log.category !== id);

	Storage.save('categories', updatedCategories);
	Storage.save('logs', categoryLogs);
	
	updatedCategories.forEach(displayCategory);
	if (updatedCategories.length === 0) {
		document.querySelector('.no-categories').classList.remove('d-none');
		document.querySelector('.new-log-btn').classList.add('disabled');
	}
	document.querySelector('.monthly-expense').innerHTML = calculateMonthlyExpenses();
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

	dbCategories.forEach(function(category) {
		let catNode = document.createElement('option');
		catNode.appendChild(document.createTextNode(category));
		categories.appendChild(catNode);
	});

	newRecordModal.classList.add('visible');

	addBtn.addEventListener('click', function addNewLog() {
		const amount = document.querySelector('#logAmount');
		const logCategory = categories.options[categories.selectedIndex];
		const logDescription = document.querySelector('#logDescription');

		if (logCategory.value === 'Select category' || amount.value < 0) {
			document.querySelector('.modal-error').classList.remove('d-none');
			return;
		}

		const log = {
			amount: amount.value,
			category: logCategory.value.toLowerCase(),
			description: logDescription.value,
			creationDate: new Date(),
			id: generateLogID(),
		}

		saveLog(log);
		displayLog(log);

		newRecordModal.classList.remove('visible');
		newRecordModal.classList.add('hidden');
		addBtn.removeEventListener('click', addNewLog);
		amount.value = 0;
		logDescription.value = '';
		document.querySelector('.modal-error').classList.add('d-none');
		document.querySelector('.monthly-expense').innerHTML = calculateMonthlyExpenses();
		while (categories.firstChild) {
			categories.removeChild(categories.firstChild);
		}
	});

	cancelBtn.addEventListener('click', function cancelModal() {
		newRecordModal.classList.remove('visible');
		cancelBtn.removeEventListener('click', cancelModal);
		while (categories.firstChild) {
			categories.removeChild(categories.firstChild);
		}
	});
}

function saveLog(log) {
	const logs = Storage.pull('logs');
	const newLogs = logs.concat(log);
	Storage.save('logs', newLogs);
}

// Copied modified version of:
// https://gist.github.com/6174/6062387
function generateLogID() {
	const s = ['a', 'b', 'c' ,'d', 'e', 'f', 'g', 'h', 'i', 'j', 'k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
	return s[Math.floor(Math.random() * 26)] + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function calculateMonthlyExpenses() {
	const logs = Storage.pull('logs');
	let expenses = 0;
	let now = new Date();
	for (const log of logs) {
		const logDate = new Date(log.creationDate);
		if ((logDate.getFullYear() === now.getFullYear()) && (logDate.getMonth() === now.getMonth())) {
			expenses += parseFloat(log.amount, 10);
		}
	}
	return expenses.toFixed(2);
}

function displayLog(log) {
	const categoryHolder = document.querySelector('.category-holder');
	const displayedCategories = [...categoryHolder.children];
	const category = displayedCategories.find(c => c.id === log.category);

	const logTemplate = `
		<div class="log-wrapper" id="${log.id}">
			<div class="log-date">${new Date(log.creationDate).toUTCString()}</div>
			<button type="button" class="btn btn-sm btn-danger">
				<i class="far fa-trash-alt"></i>
			</button>
			<div class="log-description">${log.description}</div>
			<div class="log-amount">
				${parseFloat(log.amount).toFixed(2)}лв.
			</div>
		</div>
	`;

	category.innerHTML += logTemplate;
	// TODO: Add delete functionality
	// deleteBtn.addEventListener('click', function() {
	// 	removeLog(log.id);
	// });
}

function removeLog(id) {
	let logs = Storage.pull('logs');
	logs = logs.filter(log => log.id !== id);
	Storage.save('logs', logs);
	document.querySelector(`#${id}`).remove();
	document.querySelector('.monthly-expense').innerHTML = calculateMonthlyExpenses();
}