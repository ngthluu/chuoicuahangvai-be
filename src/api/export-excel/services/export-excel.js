'use strict';

/**
 * export-excel service.
 */

module.exports = () => ({
  async exportExcel(ctx, header, data) {
    const excel = require('node-excel-export');
    const styles = {
      headerDark: {
        font: {
          color: {
            rgb: '00000000'
          },
          bold: true,
        }
      },
    };
    const specification = Object
      .entries(header)
      .map(([key, value]) => ({[key]: {
        displayName: value,
        headerStyle: styles.headerDark,
        width: 100,
      }}))
      .reduce((a, b) => ({...a, ...b}), {});
    
    const report = excel.buildExport(
      [
        {
          merges: [],
          specification: specification,
          data: data
        }
      ]
    );

    ctx.attachment('Report.xlsx')
    ctx.send(report)
  }
});
