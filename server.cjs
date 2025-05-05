const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.use(cors());

// ✅ This allows direct serving of images like: http://localhost:3001/images/Portraits/portrait001.jpg
app.use('/images', express.static(path.join(__dirname, 'public', 'Images')));

// ✅ API endpoint: /api/images/Portraits or /api/images/Street
app.get('/api/images/:category', (req, res) => {
  const { category } = req.params;

  // Capitalize folder name: 'portraits' -> 'Portraits'
  const folder = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  const folderPath = path.join(__dirname, 'public', 'Images', folder);

  // ❌ If folder doesn't exist, send 404
  if (!fs.existsSync(folderPath)) {
    return res.status(404).json({ error: 'Category not found' });
  }

  // ✅ Only include valid image files & ignore background files like bg.jpg
  const files = fs.readdirSync(folderPath).filter(file => {
    const ext = path.extname(file).toLowerCase();
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

    // ❌ Skip 'bg.jpg' or anything starting with 'bg' if it's only for backgrounds
    const isBackground = file.toLowerCase().startsWith('bg');

    return validExtensions.includes(ext) && !isBackground;
  });

  // ✅ Format the image data for the frontend
  const images = files.map((filename, index) => ({
    id: String(index + 1),
    url: `/images/${folder}/${filename}`, // Used directly in <img src=...>
    category: folder.toLowerCase(),
    subcategory: folder === 'Portraits' ? 'outdoor' : 'street photography',
    title: folder,
    year: '2024',
  }));

  res.json(images);
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
