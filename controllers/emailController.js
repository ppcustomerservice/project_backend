const { sendEmail } = require('../utils/emailSender');

// Handle Contact Form
exports.handleContactForm = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  const emailResult = await sendEmail({
    to: 'abhishek.pandhare@propertyplateau.com',
    subject: `New Contact Form Submission: ${subject}`,
    html: `
      <h3>Contact Form Submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  });

  if (emailResult.error) return res.status(500).json({ error: emailResult.error });
  res.status(200).json({ success: true });
};

// Handle Private Access Form


// Handle Private Access Form Submission
exports.handlePrivateAccessForm = async (req, res) => {
  const {
    name,
    title,
    email,
    phone,
    country,
    communication,
    assetType,
    location,
    budget,
    timeline,
    profession,
    company,
    role,
    entity,
    entityName,
    features,
    offMarket,
    manager,
    nda,
    notes
  } = req.body;

  // Format features as a bulleted list
  const formattedFeatures = features && features.length > 0 
    ? `<ul>${features.map(f => `<li>${f}</li>`).join('')}</ul>`
    : 'None selected';

  const emailResult = await sendEmail({
    to: 'abhishek.pandhare@propertyplateau.com',
    subject: `New Private Access Request from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d4af37; border-bottom: 1px solid #d4af37; padding-bottom: 10px;">
          Private Access Request Details
        </h2>
        
        <h3 style="color: #d4af37;">Personal Information</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; width: 30%;"><strong>Name:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${title} ${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Country:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${country}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Preferred Contact:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${communication}</td>
          </tr>
        </table>

        <h3 style="color: #d4af37;">Property Requirements</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; width: 30%;"><strong>Asset Type:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${assetType}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Preferred Location:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${location || 'Not specified'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Budget Range:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${budget}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Timeline:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${timeline}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Desired Features:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${formattedFeatures}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Off-Market Interest:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${offMarket}</td>
          </tr>
        </table>

        <h3 style="color: #d4af37;">Professional Background</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; width: 30%;"><strong>Profession:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${profession || 'Not specified'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Company:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${company || 'Not specified'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Role:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${role || 'Not specified'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Representing Organization:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${entity} ${entity ? `(${entityName})` : ''}</td>
          </tr>
        </table>

        <h3 style="color: #d4af37;">Confidentiality</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; width: 30%;"><strong>Dedicated Manager:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${manager}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>NDA Requirements:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${nda || 'None specified'}</td>
          </tr>
        </table>

        <h3 style="color: #d4af37;">Additional Notes</h3>
        <p style="background: #f5f5f5; padding: 15px; border-radius: 4px;">
          ${notes || 'No additional notes provided'}
        </p>
      </div>
    `,
  });

  if (emailResult.error) {
    return res.status(500).json({ error: emailResult.error });
  }
  res.status(200).json({ success: true });
};

// Handle Property Detail Form
exports.handlePropertyDetailForm = async (req, res) => {
  const { name, email, phone, message } = req.body;

  const emailResult = await sendEmail({
    to: 'abhishek.pandhare@propertyplateau.com',
    subject: `New Property Inquiry from ${name}`,
    html: `
      <h3>Property Detail Inquiry</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong> ${message || 'No additional message'}</p>
    `,
  });

  if (emailResult.error) return res.status(500).json({ error: emailResult.error });
  res.status(200).json({ success: true });
};