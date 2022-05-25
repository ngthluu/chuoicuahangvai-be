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
      phantomPath: "./node_modules/phantomjs-prebuilt/bin/phantomjs",
      format: "A4",
      orientation: "portrait",
      border: "10mm",
      localUrlAccess: true,
    };

    const document = {
      html: html,
      data: data,
      type: "buffer",
      path: "./output.pdf",
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
