const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Define the folders inside /public/Images
const sourceFolders = ['portraits', 'street'];
const baseInputDir = path.join(__dirname, 'public', 'Images');
const baseOutputDir = path.join(__dirname, 'public', 'WEBP');

// Create the output base folder if it doesn't exist
if (!fs.existsSync(baseOutputDir)) fs.mkdirSync(baseOutputDir, { recursive: true });

sourceFolders.forEach((folder) => {
  const inputDir = path.join(baseInputDir, folder);
  const outputDir = path.join(baseOutputDir, folder);

  // Create subfolder in output if needed
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  fs.readdir(inputDir, (err, files) => {
    if (err) {
      console.error(`❌ Error reading ${folder} folder:`, err.message);
      return;
    }

    files.forEach((file) => {
      const ext = path.extname(file).toLowerCase();
      if (ext === '.jpg' || ext === '.jpeg') {
        const inputPath = path.join(inputDir, file);
        const outputName = path.basename(file, ext) + '.webp';
        const outputPath = path.join(outputDir, outputName);

        sharp(inputPath)
          .toFormat('webp')
          .toFile(outputPath)
          .then(() => console.log(`✅ ${folder}: ${file} → ${outputName}`))
          .catch((err) => console.error(`❌ Failed to convert ${file}:`, err.message));
      }
    });
  });
});
