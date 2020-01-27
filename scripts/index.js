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
const addSum = (parent, children) => {
	const cells = [ 'AI', 'AJ', 'AK', 'AL', 'DY' ];
	for (let i = 0; i < cells.length; i++) {
		parent[2][cells[i]] += [].concat
			.apply(
				[],
				children.map((item) => {
					return item[cells[i]];
				})
			)
			.reduce((a, b) => a + b, 0);
	}
};

const calculatePercents = (parent, children) => {
	const cells = [
		{ cell: 'DG', a: 'DD4', b: 'DC4' },
		{ cell: 'DR', a: 'DQ4', b: 'AL4' },
		{ cell: 'DW', a: 'DU4', b: 'DV4' },
		{ cell: 'DZ', a: 'DX4', b: 'DY4' }
	];
	for (let i = 0; i < cells.length; i++) {
		parent[2][cells[i]['cell']] = pare;
	}
	//DG: DD4/DC4
	//DR: DQ4/AL4
	//DW: DU4/DV4
	//DZ: DX4/DY4
};

const headings = (file_path) => {
	return excelToJson({
		sourceFile: file_path,
		sheets: [ 'DLAR' ],
		columnToKey: {
			B: 'B',
			L: 'L',
			N: 'N',
			O: 'O',
			P: 'P',
			AI: 'AI',
			AJ: 'AJ',
			AK: 'AK',
			AL: 'AL',
			DG: 'DG',
			DR: 'DR',
			DW: 'DW',
			DY: 'DY',
			DZ: 'DZ'
		}
	});
};

const result = (file_path) => {
	return excelToJson({
		sourceFile: file_path,
		rows: 5,
		sheets: [ 'DLAR' ],
		columnToKey: {
			L: 'L',
			N: 'N',
			O: 'O',
			P: 'P',
			W: 'W',
			AI: 'AI',
			AJ: 'AJ',
			AK: 'AK',
			AL: 'AL',
			DG: 'DG',
			DR: 'DR',
			DW: 'DW',
			DY: 'DY',
			DZ: 'DZ'
		}
	});
};

/* Retrieve the heading row from JSON data */
const getHeadings = (json) => {
	let list = [];
	for (let i = 0; i < 4; i++) {
		if (i != 0 && i != 3) {
			json[i]['DG'] = (json[i]['DG'] * 100).toFixed(2) + ' %';
			json[i]['DR'] = (json[i]['DR'] * 100).toFixed(2) + ' %';
			json[i]['DW'] = (json[i]['DW'] * 100).toFixed(2) + ' %';
			json[i]['DZ'] = (json[i]['DZ'] * 100).toFixed(2) + ' %';

			if (i == 2) {
				json[i]['AI'] = 0;
				json[i]['AJ'] = 0;
				json[i]['AK'] = 0;
				json[i]['AL'] = 0;
				json[i]['DY'] = 0;
			}
		}
		list.push(json[i]);
	}
	delete list[3]['B'];
	return list;
};

/* Return a array of employee names from the JSON data */
const listEmployees = (json) => {
	let list = [];
	for (let i = 0; i < json.length; i++) {
		if (json[i].hasOwnProperty('W')) {
			let name = JSON.stringify(json[i]['W']).trim();
			name = name.slice(1, name.length - 1);
			if (!list.includes(name)) {
				list.push(name);
			} else {
				continue;
			}
		}
	}
	return list;
};

/* Return a array of company names based on the selected employee names from the JSON data */
const listCompanies = (employees, json) => {
	let list = [];
	for (let i = 0; i < json.length; i++) {
		if (json[i].hasOwnProperty('L') && json[i].hasOwnProperty('W')) {
			//Condition is skipped if there is no employee name
			let employee = JSON.stringify(json[i]['W']).trim();
			employee = employee.slice(1, employee.length - 1);
			if (employees.includes(employee)) {
				let company = JSON.stringify(json[i]['L']).trim();
				company = company.slice(1, company.length - 1);
				if (!list.includes(company)) {
					list.push(company);
				} else {
					continue;
				}
			} else continue;
		}
	}
	return list;
};

/* Find the record of the company name via JSON. Return as obj */
const findRecord = (employees, companyName, json) => {
	let data = [];
	for (let i = 0; i < json.length; i++) {
		if (json[i].hasOwnProperty('L') && json[i].hasOwnProperty('W')) {
			let employee = JSON.stringify(json[i]['W']).trim();
			employee = employee.slice(1, employee.length - 1);

			if (employees.includes(employee)) {
				let record = JSON.stringify(json[i]['L']).trim();
				//Remove double quotes surrounding the name
				record = record.slice(1, record.length - 1);
				if (record === companyName) {
					json[i]['DG'] = (json[i]['DG'] * 100).toFixed(2) + ' %';
					json[i]['DR'] = (json[i]['DR'] * 100).toFixed(2) + ' %';
					json[i]['DW'] = (json[i]['DW'] * 100).toFixed(2) + ' %';
					json[i]['DZ'] = (json[i]['DZ'] * 100).toFixed(2) + ' %';
					delete json[i]['W']; //erase employee name not needed
					data.push(json[i]);
				}
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
	const worksheet = workbook.addWorksheet('DLAR');
	worksheet.columns = [
		{ header: '', key: 'B' },
		{ header: '', key: 'L' },
		{ header: '', key: 'N' },
		{ header: '', key: 'O' },
		{ header: '', key: 'P' },
		{ header: '', key: 'AI' },
		{ header: '', key: 'AJ' },
		{ header: '', key: 'AK' },
		{ header: '', key: 'AL' },
		{ header: '', key: 'DG' },
		{ header: '', key: 'DR' },
		{ header: '', key: 'DW' },
		{ header: '', key: 'DY' },
		{ header: '', key: 'DZ' }
	];

	for (let i = 0; i < json.length; i++) {
		worksheet.addRow(json[i]).commit();
	}

	workbook.commit().then(() => {
		console.log('File created. Stored in ' + file_path);
	});
};

// const file_path = '/Users/solorzke/Downloads/prepaid_daily_pulse_naws(1).xlsx';
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
