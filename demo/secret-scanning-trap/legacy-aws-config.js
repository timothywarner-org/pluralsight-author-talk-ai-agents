// legacy-aws-config.js
// FAKE TEST CREDENTIALS — DO NOT USE. Planted to trigger GitHub secret scanning.
// These are AWS's documented example values from their own docs.

module.exports = {
  region: 'us-east-1',
  // Pattern: AKIA[A-Z0-9]{16}  --  AWS Access Key ID
  accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
  // Pattern: 40-char base64-ish  --  AWS Secret Access Key
  secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
};
