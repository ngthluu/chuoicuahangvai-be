'use strict';

/**
 * export-excel service.
 */

module.exports = () => ({
  async exportPdf(ctx, templateFileName, data) {
    const pdf = require("pdf-creator-node");
    const fs = require("fs");
    const html = fs.readFileSync(templateFileName, "utf8");

    const options = {
      format: "A4",
      orientation: "portrait",
      border: "10mm",
    };

    const document = {
      html: html,
      data: data,
      type: "buffer",
    };
    
    try {
      const pdfBuffer = await pdf.create(document, options);
      ctx.attachment('output.pdf');
      ctx.send(pdfBuffer);
    } catch (err) {
      strapi.log.info(JSON.stringify(err));
    }
  }
});
