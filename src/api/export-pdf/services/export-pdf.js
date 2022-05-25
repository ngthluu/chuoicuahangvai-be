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
    await (new Promise((resolve, reject) => {
      pdf
        .create(document, options)
        .then((pdfBuffer) => {
          ctx.attachment('output.pdf');
          ctx.send(pdfBuffer);
          resolve(true);
        })
        .catch((error) => {
          strapi.log.info(JSON.stringify(error));
          reject(true);
        })
        ;
    }));
  }
});
