
const whitelist = [
  'http://localhost',
  'http://127.0.0.1',
  'http://::1',
  'http://gencode.karnx.dev'
]

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

module.exports = corsOptions