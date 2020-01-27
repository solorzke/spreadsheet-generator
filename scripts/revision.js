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

const sheet_data = (file_path) => {
	return excelToJson({
		sourceFile: file_path,
		sheets: [ 'DLAR' ]
	});
};

const getKeyByValue = (object, value) => {
	for (var prop in object) {
		if (object.hasOwnProperty(prop)) {
			if (object[prop] === value) return prop;
		}
	}

	return false;
};

const headings = (file_path) => {
	let json = excelToJson({
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

	// return json;

	/* Row 1 */
	const B_1 = getKeyByValue(json.DLAR[0], 'Prepaid Daily Pulse');
	/* Row 2 */
	const B_2 = getKeyByValue(json.DLAR[1], 'Total');
	const AI_2 = getKeyByValue(json.DLAR[1], 11016);
	const AJ_2 = getKeyByValue(json.DLAR[1], 18172);
	const AK_2 = getKeyByValue(json.DLAR[1], 18972);
	const AL_2 = getKeyByValue(json.DLAR[1], 5965);
	const DG_2 = getKeyByValue(json.DLAR[1], 0.6714510286378238);
	const DR_2 = getKeyByValue(json.DLAR[1], 0.7155071248952222);
	const DW_2 = getKeyByValue(json.DLAR[1], 0.2186092066601371);
	const DW_2 = getKeyByValue(json.DLAR[1], 0.2186092066601371);
	const DW_2 = getKeyByValue(json.DLAR[1], 0.2186092066601371);
};

// const result = (file_path) => {
// 	return excelToJson({
// 		sourceFile: file_path,
// 		rows: 5,
// 		sheets: [ 'DLAR' ],
// 		columnToKey: {
// 			L: 'L',
// 			N: 'N',
// 			O: 'O',
// 			P: 'P',
// 			W: 'W',
// 			AI: 'AI',
// 			AJ: 'AJ',
// 			AK: 'AK',
// 			AL: 'AL',
// 			DG: 'DG',
// 			DR: 'DR',
// 			DW: 'DW',
// 			DY: 'DY',
// 			DZ: 'DZ'
// 		}
// 	});
// };

/* Retrieve the heading row from JSON data */
const getHeadings = (json) => {
	let list = [];
	for (let i = 0; i < 4; i++) {
		if (i != 0 && i != 3) {
			json[i]['DG'] = (json[i]['DG'] * 100).toFixed(2) + ' %';
			json[i]['DR'] = (json[i]['DR'] * 100).toFixed(2) + ' %';
			json[i]['DW'] = (json[i]['DW'] * 100).toFixed(2) + ' %';
			json[i]['DZ'] = (json[i]['DZ'] * 100).toFixed(2) + ' %';
		}
		list.push(json[i]);
	}
	delete list[3]['B'];
	return list;
};

const path = '/Users/solorzke/Downloads/prepaid_daily_pulse_naws(1).xlsx';
const da = headings(path).DLAR;
console.log(getKeyByValue(da[1], 11016));

// console.log(headings(path).DLAR[0]);
// console.log(headings(path).DLAR[1]);

// console.log(headings(path).DLAR[2]);
// console.log(headings(path).DLAR[3]);

// /* Return a array of employee names from the JSON data */
// const listEmployees = (json) => {
// 	let list = [];
// 	for (let i = 0; i < json.length; i++) {
// 		if (json[i].hasOwnProperty('W')) {
// 			let name = JSON.stringify(json[i]['W']).trim();
// 			name = name.slice(1, name.length - 1);
// 			if (!list.includes(name)) {
// 				list.push(name);
// 			} else {
// 				continue;
// 			}
// 		}
// 	}
// 	return list;
// };

// /* Return a array of company names based on the selected employee names from the JSON data */
// const listCompanies = (employees, json) => {
// 	let list = [];
// 	for (let i = 0; i < json.length; i++) {
// 		if (json[i].hasOwnProperty('L') && json[i].hasOwnProperty('W')) {
// 			//Condition is skipped if there is no employee name
// 			let employee = JSON.stringify(json[i]['W']).trim();
// 			employee = employee.slice(1, employee.length - 1);
// 			if (employees.includes(employee)) {
// 				let company = JSON.stringify(json[i]['L']).trim();
// 				company = company.slice(1, company.length - 1);
// 				if (!list.includes(company)) {
// 					list.push(company);
// 				} else {
// 					continue;
// 				}
// 			} else continue;
// 		}
// 	}
// 	return list;
// };

// /* Find the record of the company name via JSON. Return as obj */
// const findRecord = (employees, companyName, json) => {
// 	let data = [];
// 	for (let i = 0; i < json.length; i++) {
// 		if (json[i].hasOwnProperty('L') && json[i].hasOwnProperty('W')) {
// 			let employee = JSON.stringify(json[i]['W']).trim();
// 			employee = employee.slice(1, employee.length - 1);

// 			if (employees.includes(employee)) {
// 				let record = JSON.stringify(json[i]['L']).trim();
// 				//Remove double quotes surrounding the name
// 				record = record.slice(1, record.length - 1);
// 				if (record === companyName) {
// 					json[i]['DG'] = (json[i]['DG'] * 100).toFixed(2) + ' %';
// 					json[i]['DR'] = (json[i]['DR'] * 100).toFixed(2) + ' %';
// 					json[i]['DW'] = (json[i]['DW'] * 100).toFixed(2) + ' %';
// 					json[i]['DZ'] = (json[i]['DZ'] * 100).toFixed(2) + ' %';
// 					delete json[i]['W']; //erase employee name not needed
// 					data.push(json[i]);
// 				}
// 			}
// 		}
// 	}
// 	const result = data.length !== 0 ? data : [ 'Company Name does not exist!' ];
// 	return result;
// };

// /* Generate the XLSX file based on the sorted data */
// const generateExcel = (file_path, json) => {
// 	const options = {
// 		filename: file_path,
// 		useStyles: true,
// 		useSharedStrings: true
// 	};

// 	const workbook = new Excel.stream.xlsx.WorkbookWriter(options);
// 	const worksheet = workbook.addWorksheet('DLAR');
// 	worksheet.columns = [
// 		{ header: '', key: 'B' },
// 		{ header: '', key: 'L' },
// 		{ header: '', key: 'N' },
// 		{ header: '', key: 'O' },
// 		{ header: '', key: 'P' },
// 		{ header: '', key: 'AI' },
// 		{ header: '', key: 'AJ' },
// 		{ header: '', key: 'AK' },
// 		{ header: '', key: 'AL' },
// 		{ header: '', key: 'DG' },
// 		{ header: '', key: 'DR' },
// 		{ header: '', key: 'DW' },
// 		{ header: '', key: 'DY' },
// 		{ header: '', key: 'DZ' }
// 	];

// 	for (let i = 0; i < json.length; i++) {
// 		worksheet.addRow(json[i]).commit();
// 	}

// 	workbook.commit().then(() => {
// 		console.log('File created. Stored in ' + file_path);
// 	});
// };

// // const r = result('/Users/solorzke/Downloads/prepaid_daily_pulse_naws(1).xlsx').DLAR;
// // console.log(findRecord([ 'marco solorzano', 'Marco Solorzano' ], 'Nb Network Solutions', r));
// // // const records = findRecord('Nb Network Solutions', r);
// // // const h = headings('/Users/solorzke/Downloads/prepaid_daily_pulse_naws(1).xlsx');
// // // // //const headers = getHeadings(h);
// // // // console.log(records);
// // // // //generateExcel([ ...headers, ...records ]);
// // // const headers = getHeadings(h.DLAR);
// // // console.log(headers);
// // const a = findRecord('Nb Network Solutions', r);
// // console.log(a);
