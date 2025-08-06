// const express = require('express');
// const multer = require('multer');
// const { uploadToS3 } = require('../utils/s3Upload');
// const Project = require('../models/projectModel');

// const router = express.Router();
// const upload = multer({ storage: multer.memoryStorage() });

// const cpUpload = upload.fields([
//   { name: 'heroVideo', maxCount: 1 },
//   { name: 'virtualTour', maxCount: 1 }, // ✅ Added virtualTour
//   { name: 'exterior', maxCount: 10 },
//   { name: 'interior', maxCount: 10 },
//   { name: 'views', maxCount: 10 },
//   { name: 'lifestyle', maxCount: 10 },
//   { name: 'floorplan', maxCount: 10 }
// ]);

// // ✅ POST - Create new project
// router.post('/projects', cpUpload, async (req, res) => {
//   try {
//     const form = req.body;

//     // Parse JSON fields
// const fieldsToParse = ['configurationTags', 'highlights', 'provenance', 'legal', 'amenities', 'price', 'location'];

//     fieldsToParse.forEach(field => {
//       if (form[field]) form[field] = JSON.parse(form[field]);
//     });

//     // Upload files
//     const uploadCategory = async (files, folder) => {
//       if (!files) return [];
//       return await Promise.all(files.map(file => uploadToS3(file, folder)));
//     };

//     const heroVideoUrl = req.files.heroVideo?.[0]
//       ? await uploadToS3(req.files.heroVideo[0], 'heroVideos')
//       : null;

//     const virtualTourUrl = req.files.virtualTour?.[0]
//       ? await uploadToS3(req.files.virtualTour[0], 'virtualTours')
//       : null;

//     const exteriorUrls = await uploadCategory(req.files.exterior, 'exterior');
//     const interiorUrls = await uploadCategory(req.files.interior, 'interior');
//     const viewsUrls = await uploadCategory(req.files.views, 'views');
//     const lifestyleUrls = await uploadCategory(req.files.lifestyle, 'lifestyle');
//     const floorplanUrls = await uploadCategory(req.files.floorplan, 'floorplan');

//     const newProject = new Project({
//       ...form,
//       heroVideo: heroVideoUrl,
//       virtualTour: virtualTourUrl,
//       exterior: exteriorUrls,
//       interior: interiorUrls,
//       views: viewsUrls,
//       lifestyle: lifestyleUrls,
//       floorplan: floorplanUrls,
//     });

//     const saved = await newProject.save();
//     res.status(201).json(saved);
//   } catch (err) {
//     console.error('Upload failed:', err);
//     res.status(500).json({ message: 'Upload failed', error: err.message });
//   }
// });

// // ✅ GET all projects (with optional city filter)
// // In projectRoute.js
// router.get('/projects', async (req, res) => {
//   try {
//     const { city } = req.query;
//     console.log('Requested city filter:', city);
    
//     const query = city ? { 
//       'location.city': city // Exact match (case-sensitive)
//     } : {};
    
//     console.log('MongoDB query:', query);
    
//     const projects = await Project.find(query);
//     console.log(`Found ${projects.length} projects`);
    
//     res.status(200).json(projects);
//   } catch (err) {
//     console.error('Error in /projects:', err);
//     res.status(500).json({ message: 'Failed to fetch projects', error: err.message });
//   }
// });

// // ✅ GET single project by ID
// router.get('/projects/:id', async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.id);
//     if (!project) return res.status(404).json({ message: 'Project not found' });
//     res.status(200).json(project);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch project', error: err.message });
//   }
// });



// module.exports = router;

const express = require('express');
const multer = require('multer');
const { uploadToS3, deleteFromS3 } = require('../utils/s3upload');

const Project = require('../models/projectModel');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const cpUpload = upload.fields([
  { name: 'heroVideo', maxCount: 1 },
  { name: 'virtualTour', maxCount: 1 },
  { name: 'exterior', maxCount: 10 },
  { name: 'interior', maxCount: 10 },
  { name: 'views', maxCount: 10 },
  { name: 'lifestyle', maxCount: 10 },
  { name: 'floorplan', maxCount: 10 }
]);

// POST - Create new project
router.post('/projects', cpUpload, async (req, res) => {
  try {
    const form = req.body;

    // Parse JSON fields
    const fieldsToParse = ['configurationTags', 'highlights', 'amenities', 'uniqueFeatures', 'price', 'location'];
    fieldsToParse.forEach(field => {
      if (form[field]) form[field] = JSON.parse(form[field]);
    });

    // Upload files
    const uploadCategory = async (files, folder) => {
      if (!files) return [];
      return await Promise.all(files.map(file => uploadToS3(file, folder)));
    };

    const heroVideoUrl = req.files.heroVideo?.[0]
      ? await uploadToS3(req.files.heroVideo[0], 'heroVideos')
      : null;

    const virtualTourUrl = req.files.virtualTour?.[0]
      ? await uploadToS3(req.files.virtualTour[0], 'virtualTours')
      : null;

    const exteriorUrls = await uploadCategory(req.files.exterior, 'exterior');
    const interiorUrls = await uploadCategory(req.files.interior, 'interior');
    const viewsUrls = await uploadCategory(req.files.views, 'views');
    const lifestyleUrls = await uploadCategory(req.files.lifestyle, 'lifestyle');
    const floorplanUrls = await uploadCategory(req.files.floorplan, 'floorplan');

    const newProject = new Project({
      ...form,
      heroVideo: heroVideoUrl,
      virtualTour: virtualTourUrl,
      exterior: exteriorUrls,
      interior: interiorUrls,
      views: viewsUrls,
      lifestyle: lifestyleUrls,
      floorplan: floorplanUrls,
    });

    const saved = await newProject.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

// GET all projects
router.get('/projects', async (req, res) => {
  try {
    const { city } = req.query;
    const query = city ? { 'location.city': city } : {};
    const projects = await Project.find(query);
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch projects', error: err.message });
  }
});

// GET single project
router.get('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch project', error: err.message });
  }
});

// PUT - Update project
router.put('/projects/:id', cpUpload, async (req, res) => {
  try {
    const form = req.body;
    const fieldsToParse = ['configurationTags', 'highlights', 'amenities', 'uniqueFeatures', 'price', 'location'];
    fieldsToParse.forEach(field => {
      if (form[field]) form[field] = JSON.parse(form[field]);
    });

    const existingProject = await Project.findById(req.params.id);
    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Upload new files if they exist
    const uploadCategory = async (files, folder) => {
      if (!files) return [];
      return await Promise.all(files.map(file => uploadToS3(file, folder)));
    };

    const heroVideoUrl = req.files.heroVideo?.[0]
      ? await uploadToS3(req.files.heroVideo[0], 'heroVideos')
      : existingProject.heroVideo;

    const virtualTourUrl = req.files.virtualTour?.[0]
      ? await uploadToS3(req.files.virtualTour[0], 'virtualTours')
      : existingProject.virtualTour;

    const exteriorUrls = req.files.exterior
      ? [...existingProject.exterior, ...(await uploadCategory(req.files.exterior, 'exterior'))]
      : existingProject.exterior;

    const interiorUrls = req.files.interior
      ? [...existingProject.interior, ...(await uploadCategory(req.files.interior, 'interior'))]
      : existingProject.interior;

    const viewsUrls = req.files.views
      ? [...existingProject.views, ...(await uploadCategory(req.files.views, 'views'))]
      : existingProject.views;

    const lifestyleUrls = req.files.lifestyle
      ? [...existingProject.lifestyle, ...(await uploadCategory(req.files.lifestyle, 'lifestyle'))]
      : existingProject.lifestyle;

    const floorplanUrls = req.files.floorplan
      ? [...existingProject.floorplan, ...(await uploadCategory(req.files.floorplan, 'floorplan'))]
      : existingProject.floorplan;

    const updatedProject = {
      ...existingProject.toObject(),
      ...form,
      heroVideo: heroVideoUrl,
      virtualTour: virtualTourUrl,
      exterior: exteriorUrls,
      interior: interiorUrls,
      views: viewsUrls,
      lifestyle: lifestyleUrls,
      floorplan: floorplanUrls,
    };

    const saved = await Project.findByIdAndUpdate(req.params.id, updatedProject, { new: true });
    res.status(200).json(saved);
  } catch (err) {
    console.error('Update failed:', err);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
});

router.delete('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Collect all media URLs safely
    const mediaUrls = [
      project.heroVideo,
      project.virtualTour,
      ...(project.exterior || []),
      ...(project.interior || []),
      ...(project.views || []),
      ...(project.lifestyle || []),
      ...(project.floorplan || [])
    ].filter(url => url && typeof url === 'string');

    // Delete all media files from S3 (with error handling)
    const deleteResults = await Promise.allSettled(
      mediaUrls.map(url => deleteFromS3(url).catch(e => {
        console.error(`Failed to delete ${url}:`, e.message);
        return null;
      }))
    );

    // Check if any deletions failed
    const failedDeletes = deleteResults.filter(r => r.status === 'rejected');
    if (failedDeletes.length > 0) {
      console.error('Some media files failed to delete:', failedDeletes);
    }

    // Delete the project from database
    await Project.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ 
      message: 'Project deleted successfully',
      failedDeletes: failedDeletes.length
    });
  } catch (err) {
    console.error('Delete error:', {
      error: err.message,
      stack: err.stack,
      params: req.params
    });
    res.status(500).json({ 
      message: 'Failed to delete project',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// PUT - Remove media from project
// Make sure you have this route properly implemented
router.put('/projects/:id/media', async (req, res) => {
  try {
    const { mediaType, mediaUrl } = req.body;
    
    // First delete from S3
    await deleteFromS3(mediaUrl);
    
    // Then remove from database
    const update = { $pull: {} };
    update.$pull[mediaType] = mediaUrl;
    
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );
    
    res.status(200).json(updatedProject);
  } catch (err) {
    console.error('Error in media deletion:', err);
    res.status(500).json({ 
      message: 'Failed to delete media',
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

module.exports = router;