console.log('App loading...');
console.log('JS script "query.js" loaded...');

let headerRows;
let resultRows;
let selected = [ [], [] ]; //selected[0] => employees, selected[1] => companies
let file_path;
let data = [];

$('#emp-view').slideUp(0);
$('#cp-view').slideUp(0);

/* Splice item from an array */
const removeItem = (element, array) => {
	const item = element.getAttribute('data-name');
	console.log('Data: ' + item);
	array.splice(array.indexOf(item), 1);
	$('div[data-name="' + item + '"]').remove();
	console.log('Removed item: ' + item + '\nCurrent list: ' + array);
};

$(document).ready(() => {
	console.log('Modules Loaded. App main screen displayed...');

	/* After submitting the file_path, run the script and load the company/employee list */
	$('#upload').click((event) => {
		if (document.getElementById('filename').files[0] !== undefined) {
			console.log('User uploaded file: ' + document.getElementById('filename').files[0]);
			console.log('Uploaded File path: ' + document.getElementById('filename').files[0].path);
			file_path = document.getElementById('filename').files[0].path;
			console.log('Retrieving Employee Names...\n');
			headerRows = headings(file_path);
			resultRows = result(file_path);
			const employees = listEmployees(resultRows.DLAR);
			$('#employees').empty().append(new Option('', '')); //Clears the options list in select
			for (let i = 0; i < employees.length; i++) {
				$('#employees').append(new Option(employees[i], employees[i]));
			}
			console.log('Employee names loaded...');
			$('#emp-view').toggleClass('invisible');
			$('#emp-view').slideDown(1000);
			$('#upload-view').addClass('disabled'); //Disable the Upload (Step 1) Section when clicked
		} else {
			alert('Please upload a file first!');
		}
	});

	/* Every time the user selects a company, add it to the array */
	$('#companies').on('change', function(e) {
		var optionSelected = $('option:selected', this);
		if (!selected[1].includes(this.value)) {
			selected[1].push(this.value);
			console.log('Companies selected: ' + selected[1]);
			$('#co-list').after(
				'<div data-name="' +
					this.value +
					'"><p class="d-inline-block">' +
					this.value +
					'</p><button data-name="' +
					this.value +
					'" class="float-right btn btn-sm btn-danger ml-2 del-co" onclick="removeItem(this, selected[1]);">Delete</button></div>'
			);
		}
	});

	/* Every time the user selects a employee, add it to the array */
	$('#employees').on('change', function(e) {
		var optionSelected = $('option:selected', this);
		if (!selected[0].includes(this.value)) {
			selected[0].push(this.value);
			console.log('Employees selected: ' + selected[0]);
			$('#emp-list').after(
				'<div data-name="' +
					this.value +
					'"><p class="d-inline-block">' +
					this.value +
					'</p><button data-name="' +
					this.value +
					'" class="float-right btn btn-sm btn-danger ml-2 del-emp" onclick="removeItem(this, selected[0]);">Delete</button></div>'
			);
		}
	});

	/* When Employee list is confirmed, generate the filtered company list */
	$('#emp-btn').click((event) => {
		const companies = listCompanies(selected[0], resultRows.DLAR).sort();
		for (let i = 0; i < companies.length; i++) {
			$('#companies').append(new Option(companies[i], companies[i]));
		}
		console.log('Company list loaded...');
		$('#cp-view').toggleClass('invisible');
		$('#cp-view').slideDown(1000);
		$('#emp-view').addClass('disabled'); //Disable the Employee (Step 2) Section when clicked
		console.log('Emp-View is disabled...');
	});

	/* Back button for Emp-View div, locks out that view and returns to upload-view */
	$('#emp-back-btn').click((event) => {
		/* Clear Employee array and DOM elements for selected employees */
		$('#emp-list').nextAll().remove();
		selected[0] = [];
		console.log('Removed DOM Emp List & cleared array.\nHiding section\nEnabling Upload Section...');
		$('#emp-view').toggleClass('invisible');
		$('#emp-view').slideUp(1000);
		$('#upload-view').removeClass('disabled'); //Enable the Upload (Step 1) Section when clicked
	});

	/* Back button for Cp-View div, locks out that view and returns to Emp-view */
	$('#cp-back-btn').click((event) => {
		/* Clear Company array and DOM elements for selected companies */
		$('#co-list').nextAll().remove();
		selected[1] = [];
		console.log('Removed DOM Cp List & cleared array.\nHiding section\nEnabling Emp-View Section...');
		$('#cp-view').toggleClass('invisible');
		$('#cp-view').slideUp(1000);
		$('#emp-view').removeClass('disabled'); //Enable the Emp (Step 2) Section when clicked
	});

	/* Generate the report after user clicks the 'generate' button */
	$('#generate').click((event) => {
		console.log('Generating report document based on the query data...');
		const headers = getHeadings(headerRows.DLAR);
		data = [ ...headers ];
		for (let i = 0; i < selected[1].length; i++) {
			const record = findRecord(selected[0], selected[1][i], resultRows.DLAR);
			addSum(data, record);
			data = [ ...data, ...record ];
		}
		console.log('Finshed query...\nGenerating report...');
		if (file_path && data) {
			const new_path = parse_path(file_path);
			generateExcel(new_path, data);
			console.log('Report generated....');
		} else {
			console.log('No file_path or data generated. Cant generate report');
		}
	});
});
