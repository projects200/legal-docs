const fs = require("fs/promises");
const path = require("path");
const { marked } = require("marked");

const sourceDir = path.join(__dirname, "..", "legal-docs");
const outputDir = path.join(__dirname, "..", "./dist");

async function convert() {
  try {
    await fs.mkdir(outputDir, { recursive: true });

    const files = await fs.readdir(sourceDir);

    for (const file of files) {
      if (path.extname(file) === ".md") {
        const mdContent = await fs.readFile(
          path.join(sourceDir, file),
          "utf-8"
        );
        const htmlContent = marked(mdContent);

        const fullHtml = `
          <!DOCTYPE html>
          <html lang="ko">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${path.basename(file, ".md")}</title>
            <style>
              body { font-family: sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }
              h1, h2 { border-bottom: 1px solid #ddd; }
              code { background-color: #f4f4f4; padding: 2px 4px; border-radius: 4px; }
            </style>
          </head>
          <body>
            ${htmlContent}
          </body>
          </html>
        `;

        const outputFilename = `${path.basename(file, ".md")}.html`;
        await fs.writeFile(path.join(outputDir, outputFilename), fullHtml);
        console.log(`Converted ${file} to ${outputFilename}`);
      }
    }
  } catch (error) {
    console.error("Error during conversion:", error);
    process.exit(1);
  }
}

convert();
