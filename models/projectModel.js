const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  // Basic Information
  title: { type: String, required: true },
  tagline: String,
  description: String,
  
  // Pricing Information
  price: {
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    pricePerSqFt: Number,
    displayText: String, // e.g., "Price on Request", "₹25 Crore+"
    isPriceVisible: { type: Boolean, default: true }
  },
  
  // Location Details
  location: {
    address: String,
    city: { type: String, required: true },
    state: String,
    country: { type: String, default: 'India' },
    pinCode: String,

    landmark: String,
    neighborhoodDescription: String
  },
  
  // Property Specifications
  builtUpArea: { type: String, required: true }, // e.g., "22,000 Sq ft"
  landArea: { type: String, required: true }, // e.g., "1.2 acres"
  bedrooms: { type: Number, required: true },
  bathrooms: Number,
  floors: Number,
  yearBuilt: Number,
  
  // Configuration
  configurationTags: [String], // e.g., ["4 BHK Penthouse", "Villa Ment", "Sea Facing"]
  
  // Features
  highlights: [String], // Key selling points
  amenities: [String], // Luxury amenities
  uniqueFeatures: [String], // Special features like "Private Beach Access"
  
  // Media
  heroVideo: String,
  exterior: [String], // Image URLs
  interior: [String], // Image URLs
  views: [String], // Image URLs
  lifestyle: [String], // Image URLs
  floorplan: [String], // Image URLs
  virtualTour: String, // VR tour URL
  
  // Provenance
  architect: String,
  interiorDesigner: String,
  developer: String,
  designPhilosophy: String,
  
  // Legal & Financial
  reraNumber: String,
  possessionStatus: String, // "Ready to Move", "Under Construction"
  ownershipType: String, // "Freehold", "Leasehold"
  stampDuty: String,
  maintenanceCharges: String,
  
  // Contact Information
  contactPerson: String,
  contactEmail: String,
  contactPhone: String,
  
  // Metadata
  isFeatured: { type: Boolean, default: false },
  status: { type: String, enum: ['available', 'sold', 'reserved'], default: 'available' },
  lastPriceUpdate: Date,
  
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true } 
});

// Virtual for formatted price
projectSchema.virtual('price.formatted').get(function() {
  if (!this.price.amount) return 'Price on Request';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: this.price.currency || 'INR',
    maximumFractionDigits: 0
  }).format(this.price.amount);
});

// Indexes for faster queries
projectSchema.index({ title: 'text', 'location.city': 1, 'location.state': 1 });
projectSchema.index({ price: 1 });


module.exports = mongoose.model('Project', projectSchema);