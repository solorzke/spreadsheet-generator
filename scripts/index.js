'use strict';
const excelToJson = require('convert-excel-to-json');
const Excel = require('exceljs');

console.log("Node.js script: 'index.js' loaded...");

/* Retrieve the root path of the file that was submitted and return a new file path */
const parse_path = (file_path) => {
	const index = file_path.lastIndexOf('/');
	const path = file_path.substr(0, index + 1);
	return path + 'report.xlsx';
};

/* Add the sum of each column to it */
const calculateTotal = (children) => {
	const cells = [ [ 'J', 'O', 'S' ] ];
	let totalRow = {
		C: 'Total',
		J: 0,
		O: 0,
		S: 0,
		P: 0,
		T: 0,
		AG: 0
	};

	/* Calculate the total sums for these cell categories */
	for (let i = 0; i < cells[0].length; i++) {
		totalRow[cells[0][i]] += [].concat
			.apply(
				[],
				children.map((item) => {
					return item[cells[0][i]];
				})
			)
			.reduce((a, b) => a + b, 0);
	}
	totalRow['P'] = totalRow['O'] / totalRow['J'] * 100;
	totalRow['T'] = totalRow['S'] / totalRow['J'] * 100;
	totalRow['AG'] = (totalRow['P'] - totalRow['T']).toFixed(2) + ' %';
	totalRow['P'] = totalRow['P'].toFixed(2) + ' %';
	totalRow['T'] = totalRow['T'].toFixed(2) + ' %';
	return totalRow;
};

const headings = (file_path) => {
	const data = excelToJson({
		sourceFile: file_path,
		columnToKey: {
			C: 'C', //Name
			D: 'D', //Address
			I: 'I', //Door Type
			J: 'J', //Qualified Activations
			O: 'O', //3rd Payments
			P: 'P', //3rd Payment %
			S: 'S', //4th Payments
			T: 'T', //4th Payment %
			AG: 'AG' //4th Month
		}
	});
	return data[Object.keys(data)[0]];
};

const result = (file_path) => {
	const data = excelToJson({
		sourceFile: file_path,
		rows: 1,
		columnToKey: {
			C: 'C', //Name
			D: 'D', //Address
			I: 'I', //Door Type
			J: 'J', //Qualified Activations
			O: 'O', //3rd Payments
			P: 'P', //3rd Payment %
			S: 'S', //4th Payments
			T: 'T', //4th Payment %
			AG: 'AG' //4th Month
		}
	});
	return data[Object.keys(data)[0]];
};

/* Retrieve the heading row from JSON data */
const getHeadings = (json) => {
	return json[0];
};

/* Return a array of company names from the JSON data */
const listCompanies = (json) => {
	let list = [];
	for (let i = 1; i < json.length; i++) {
		if (json[i].hasOwnProperty('C')) {
			//Condition is skipped if there is no Company name
			let company = JSON.stringify(json[i]['C']).trim();
			company = company.slice(1, company.length - 1);
			if (!list.includes(company)) {
				list.push(company);
			} else {
				continue;
			}
		}
	}
	return list;
};

/* Find the record of the company name via JSON. Return as obj */
const findRecord = (companyName, json) => {
	let data = [];
	for (let i = 0; i < json.length; i++) {
		if (json[i].hasOwnProperty('C')) {
			let record = JSON.stringify(json[i]['C']).trim();
			//Remove double quotes surrounding the name
			record = record.slice(1, record.length - 1);
			if (record === companyName) {
				json[i]['P'] = (json[i]['P'] * 100).toFixed(2) + ' %';
				json[i]['T'] = (json[i]['T'] * 100).toFixed(2) + ' %';
				json[i]['AG'] = (json[i]['AG'] * 100).toFixed(2) + ' %';
				data.push(json[i]);
			}
		}
	}
	const result = data.length !== 0 ? data : [ 'Company Name does not exist!' ];
	return result;
};

/* Generate the XLSX file based on the sorted data */
const generateExcel = (file_path, json) => {
	const options = {
		filename: file_path,
		useStyles: true,
		useSharedStrings: true
	};

	const workbook = new Excel.stream.xlsx.WorkbookWriter(options);
	const worksheet = workbook.addWorksheet('report');
	worksheet.columns = [
		{ header: '', key: 'C' },
		{ header: '', key: 'D' },
		{ header: '', key: 'I' },
		{ header: '', key: 'J' },
		{ header: '', key: 'O' },
		{ header: '', key: 'P' },
		{ header: '', key: 'S' },
		{ header: '', key: 'T' },
		{ header: '', key: 'AG' }
	];

	for (let i = 0; i < json.length; i++) {
		worksheet.addRow(json[i]).commit();
	}

	workbook.commit().then(() => {
		console.log('File created. Stored in ' + file_path);
	});
};

// const file_path = '/Users/solorzke/Downloads/Percentage by Door.xls';
// // const headers = headings(file_path);
// const results = result(file_path);
// console.log(results.slice(1, results.length));
// const re = findRecord('Nb Network Solutions', results);
// const total = addSum(re);
// generateExcel(parse_path(file_path), [ headers[0], ...re, total ]);

// let data = [];
// const headerRows = headings(file_path);
// const resultRows = result(file_path);
// const headers = getHeadings(headerRows.DLAR);
// const a = [
// 	[ 'Marco Solorzano', 'marco solorzano' ],
// 	[ 'Crystal Clear Wireless', 'MI Wireless 1', 'MI Wireless 10', 'MI Wireless 2' ]
// ];
// data = [ ...headers ];
// for (let i = 0; i < a[1].length; i++) {
// 	let record = findRecord(a[0], a[1][i], resultRows.DLAR);
// 	addSum(data, record);
// 	data = [ ...data, ...record ];
// }

// console.log(data);
// const r = result('/Users/solorzke/Downloads/prepaid_daily_pulse_naws(1).xlsx').DLAR;
// console.log(findRecord([ 'marco solorzano', 'Marco Solorzano' ], 'Nb Network Solutions', r));
// // const records = findRecord('Nb Network Solutions', r);
// // const h = headings('/Users/solorzke/Downloads/prepaid_daily_pulse_naws(1).xlsx');
// // // //const headers = getHeadings(h);
// // // console.log(records);
// // // //generateExcel([ ...headers, ...records ]);
// // const headers = getHeadings(h.DLAR);
// // console.log(headers);
// const a = findRecord('Nb Network Solutions', r);
// console.log(a);
