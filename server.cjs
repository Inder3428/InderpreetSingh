const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// 👉 Serve built frontend from 'dist'
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// 👉 Catch-all for React routes
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// 👉 Serve images
app.use('/images', express.static(path.join(__dirname, 'public', 'Images')));

// 👉 API endpoint for categories like Portraits, Street
app.get('/api/images/:category', (req, res) => {
  const { category } = req.params;
  const folder = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  const folderPath = path.join(__dirname, 'public', 'Images', folder);

  if (!fs.existsSync(folderPath)) {
    return res.status(404).json({ error: 'Category not found' });
  }

  const files = fs.readdirSync(folderPath).filter(file => {
    const ext = path.extname(file).toLowerCase();
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const isBackground = file.toLowerCase().startsWith('bg');
    return validExtensions.includes(ext) && !isBackground;
  });

  const images = files.map((filename, index) => ({
    id: String(index + 1),
    url: `/images/${folder}/${filename}`,
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
