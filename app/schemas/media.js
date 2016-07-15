var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var MediaSchema = new Schema({

	name: String,
	// ['移动','PC','轮播',‘微博’,‘tab切’......]
	tags: [],
	summary:  String,
	content: String,
	thumbnail: {
		type: String,
		default: 'default.png'
	},
	previewUri: String,
	showUrl: String,	
	publishTime: {
		type: Date
	},
	pv: {
		type: Number,
		default: 0
	},		
	category: {
		type: ObjectId,
		ref: 'Category'
	},
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}   	
})

MediaSchema.pre('save', function(next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	} else {
		this.meta.updateAt = Date.now()
	}
	next()
})

MediaSchema.statics = {
	fetch: function(cb) {
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)
	},
	findById: function(id, cb) {
		return this 
			.findOne({_id: id})
			.exec(cb)
	}
}

module.exports = MediaSchema