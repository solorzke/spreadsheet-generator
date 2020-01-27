console.log('App loading...');
console.log('JS script "query.js" loaded...');

let headerRows;
let resultRows;
let selected = []; //selected[1] => companies
let file_path;
let data = [];

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

	/* After submitting the file_path, run the script and load the company list */
	$('#upload').click((event) => {
		if (document.getElementById('filename').files[0] !== undefined) {
			console.log('User uploaded file: ' + document.getElementById('filename').files[0]);
			console.log('Uploaded File path: ' + document.getElementById('filename').files[0].path);
			file_path = document.getElementById('filename').files[0].path;
			console.log('Retrieving Company Names...\n');
			headerRows = headings(file_path);
			resultRows = result(file_path);
			$('#companies').empty().append(new Option('', '')); //Clears the options list in select
			const companies = listCompanies(resultRows).sort();
			for (let i = 0; i < companies.length; i++) {
				$('#companies').append(new Option(companies[i], companies[i]));
			}
			console.log('Company list loaded...');
			$('#cp-view').toggleClass('invisible');
			$('#cp-view').slideDown(1000);
			$('#upload-view').addClass('disabled'); //Disable the Upload (Step 1) Section when clicked
			console.log('Upload-View is disabled...');
		} else {
			alert('Please upload a file first!');
		}
	});

	/* Every time the user selects a company, add it to the array */
	$('#companies').on('change', function(e) {
		var optionSelected = $('option:selected', this);
		if (!selected.includes(this.value)) {
			selected.push(this.value);
			console.log('Companies selected: ' + selected);
			$('#co-list').after(
				'<div data-name="' +
					this.value +
					'"><p class="d-inline-block">' +
					this.value +
					'</p><button data-name="' +
					this.value +
					'" class="float-right btn btn-sm btn-danger ml-2 del-co" onclick="removeItem(this, selected);">Delete</button></div>'
			);
		}
	});

	/* Back button for Cp-View div, locks out that view and returns to Upload-view */
	$('#cp-back-btn').click((event) => {
		/* Clear Company array and DOM elements for selected companies */
		$('#co-list').nextAll().remove();
		selected = [];
		console.log('Removed DOM Cp List & cleared array.\nHiding section\nEnabling Upload Section...');
		$('#cp-view').toggleClass('invisible');
		$('#cp-view').slideUp(1000);
		$('#upload-view').removeClass('disabled'); //Enable the Upload (Step 1) Section when clicked
	});

	/* Generate the report after user clicks the 'generate' button */
	$('#generate').click((event) => {
		console.log('Generating report document based on the query data...');
		const headers = getHeadings(headerRows);
		// data = [ ...headers ];
		for (let i = 0; i < selected.length; i++) {
			const record = findRecord(selected[i], resultRows);
			data = [ ...data, ...record ];
		}
		const totalRow = calculateTotal(data);
		data = [ headers, ...data, totalRow ];
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
