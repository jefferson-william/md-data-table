// support for Browserify

require('./.temp/templates.js');
require('./app/md-data-table/md-data-table.js');
require('./app/md-data-table/scripts/mdColumnHeader.js');
require('./app/md-data-table/scripts/mdDataTable.js');
require('./app/md-data-table/scripts/mdDataTableCell.js');
require('./app/md-data-table/scripts/mdDataTableFoot.js');
require('./app/md-data-table/scripts/mdDataTableHead.js');
require('./app/md-data-table/scripts/mdDataTablePagination.js');
require('./app/md-data-table/scripts/mdDataTableProgress.js');
require('./app/md-data-table/scripts/mdDataTableRow.js');
require('./app/md-data-table/scripts/mdDataTableService.js');
require('./app/md-data-table/scripts/mdSelectAll.js');
require('./app/md-data-table/scripts/mdSelectRow.js');

module.exports = 'md.data.table';
