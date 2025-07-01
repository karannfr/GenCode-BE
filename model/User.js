const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  stats: {
    totalQuestions:  { type: Number, default: 0 },
    solvedQuestions: { type: Number, default: 0 },
    languagesUsed: {
      Java:   { type: Number, default: 0 },
      Python: { type: Number, default: 0 },
      C:      { type: Number, default: 0 },
      Cpp:    { type: Number, default: 0 }
    }
  },
  refreshToken : String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);