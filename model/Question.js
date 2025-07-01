const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  promptUsed:  { type: String },
  description: { type: String, required: true },
  constraints: [{ type: String }],
  examples: [{
    input:        { type: String },
    output:       { type: String },
    explanation:  { type: String }
  }],
  testCases: [{
    input:  { type: String },
    output: { type: String }
  }],
  hints:        [{ type: String }],
  solution:     { type: String },
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status:       { type: String, enum: ['solved', 'unsolved'], default: 'unsolved' },
  createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', questionSchema);