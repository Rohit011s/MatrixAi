import fs from "fs/promises";
import path from "path";
import { PdfReader } from "pdfreader";

function readPdf(filePath,originalName) {
  return new Promise((resolve, reject) => {
    let text = "";

    new PdfReader().parseFileItems(filePath, (err, item) => {
      if (err) return reject(err);

      if (!item) return resolve(text.trim());

      if (item.text) {
        text += item.text + " ";
      }
    });
  });
}

export default async function extractText(filePath,originalName) {
  const ext = path.extname(originalName).toLowerCase();

  switch (ext) {
    case ".txt":
      return await fs.readFile(filePath, "utf8");

    case ".pdf":
      return await readPdf(filePath);

    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }
}