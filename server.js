require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const projectRoutes = require('./routes/projectRoutes');
const emailRoutes = require('./routes/emailRoutes');
const { create } = require('xmlbuilder2');
const Project = require('./models/projectModel');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', projectRoutes);
app.use('/api/email', emailRoutes);

app.get('/sitemap.xml', async (req, res) => {
  try {
    // Fetch only available projects
    const projects = await Project.find({ status: 'available' });

    // Build XML
    const root = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('urlset', { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' });

    // Add project URLs
    projects.forEach(project => {
      root.ele('url')
        .ele('loc').txt(`https://www.project.propertyplateau.com/properties/${project.slug}`).up()
        .ele('lastmod').txt(project.updatedAt.toISOString()).up()
        .ele('changefreq').txt('weekly').up()
        .ele('priority').txt('0.8').up();
    });

    // Send XML
    res.header('Content-Type', 'application/xml');
    res.send(root.end({ prettyPrint: true }));
    
  } catch (err) {
    console.error('Sitemap error:', err);
    res.status(500).send('Error generating sitemap');
  }
});


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(console.error);

const PORT = process.env.PORT || 4000;




app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
