require('dotenv').config();
const mongoose = require('mongoose');
const slugify = require('slugify');
const path = require('path');

// Correct import - matches your actual file name
const Project = require(path.resolve(__dirname, 'models', 'projectModel'));

async function migrateSlugs() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');

    const projects = await Project.find({
      $or: [
        { slug: { $exists: false } },
        { slug: null },
        { slug: '' }
      ]
    });

    console.log(`🔍 Found ${projects.length} projects needing slugs`);

    for (const project of projects) {
      project.slug = slugify(project.title, {
        lower: true,
        strict: true, // removes special chars
        trim: true
      });
      await project.save();
      console.log(`✔ Added slug: ${project.slug}`);
    }

    console.log('🎉 All projects updated!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

migrateSlugs();