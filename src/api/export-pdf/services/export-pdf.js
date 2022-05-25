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
      strapi.log.info(JSON.stringify("not done here"));
      const pdfBuffer = await pdf.create(document, options);
      strapi.log.info(JSON.stringify("done here"));
      ctx.attachment('output.pdf');
      ctx.send(pdfBuffer);
    } catch (err) {
      strapi.log.info(JSON.stringify(err));
    }
  }
});
