const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question:  { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  code:      { type: String, required: true },
  language:  { type: String, required: true },
  passed:    { type: Boolean, default: false },
  testResults: [{
    input:    { type: String },
    expected: { type: String },
    stdout:   { type: String },
    status:   { type: String},
    passed:   { type: Boolean}
  }],
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', submissionSchema);
