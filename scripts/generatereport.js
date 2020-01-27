const Excel = require('exceljs');

const options = {
	filename: 'myfile.xlsx',
	useStyles: true,
	useSharedStrings: true
};

const workbook = new Excel.stream.xlsx.WorkbookWriter(options);

const worksheet = workbook.addWorksheet('my sheet');

worksheet.columns = [ { header: '', key: 'id' }, { header: '', key: 'first name' }, { header: 'pass', key: 'ph' } ];

var data;

for (let i = 1; i <= 10; i++) {
	data = {
		id: i,
		'first name': 'name ' + i
	};

	worksheet.addRow(data).commit();
}

workbook.commit().then(function() {
	console.log('excel file cretaed');
});
