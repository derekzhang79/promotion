var mongoose = require('mongoose')
var MediaSchema = require('../schemas/media.js')
var Media = mongoose.model('Media', MediaSchema)

module.exports = Media