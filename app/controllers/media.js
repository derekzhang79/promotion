
var Media = require('../models/media')
var Comment = require('../models/comment')
var Category = require('../models/category')
var fs = require('fs')
var path = require('path')
var formidable = require('formidable');
var util = require('util');
var _ = require('underscore');
	// detail page
exports.detail = function (req, res) {
	var id = req.params.id
	Media.update({_id: id}, {$inc: {pv: 1}}, function (err) {
		if(err) {
			console.log(err)
		}
	})
	Media.findById(id, function (err, media){
		Comment
			.find({media: id})
			.populate('from', 'name') 
			.populate('reply.from reply.to', 'name')
			.exec(function (err, comments) {
				// console.log('comments:')
				// console.log(comments)
				res.render('detail', {
					title : "" + media.name,
					media: media,
					comments: comments
				})
			})    
	})
}

	//admin page
exports.new = function (req, res) {
	Category.find({}, function (err, categories) {
		console.log(categories)
		res.render('admin', {
			title : '后台录入页',
			categories: categories,
			media: {}
		})
	})
}

//admin update media
exports.update = function (req, res) {
	var id = req.params.id
	if (id) {
		Media.findById(id, function (err, media){
			if (err) {
				console.log(err)
			}
			Category.find({}, function (err, categories) {
				res.render('admin', {
					title: 'Imovie 后台更新页面',
					media: media,
					categories: categories
				})
			})    
		})
	}
}

// admin post movie
exports.save = function (req, res){
	
	// console.log('fields:' + util.inspect(fields));
	console.log('req.body:' + util.inspect(req.body));
	// console.log('req.body.movie:'+req.body.movie)
	var id = req.body.media._id;
	var mediaObj = req.body.media
	// console.log(movieObj)
	var _media;

	if (id) {
		Media.findById(id, function (err, media){
			if (err) {
				console.log(err)
			}
			/*
				_.extend(destination, *sources) 
							Copy all of the properties in the source objects over to the destination object, 
							and return the destination object. It's in-order, so the last source will override 
							properties of the same name in previous arguments.
					*/
			_media = _.extend(media, mediaObj)
			_media.save(function (err, media){
				if (err) {
					console.log(err)
				}				
				var categoryId = media.category
				Category.findById(categoryId, function (err, category) {
					category.medias.push(media._id)
					category.save (function (err, category) {
						res.redirect('/media/' + media._id)
					})
				})
			}) 
		})
	} else {
		_media = new Media(mediaObj)

		var categoryName = mediaObj.categoryName
		var categoryId = mediaObj.category
		
		_media.save(function (err, media){
			console.log(media)
			if (err) {
				console.log(err)
			}
			if (categoryId) {
				Category.findById(categoryId, function (err, category) {
					category.medias.push(media._id)
					category.save (function (err, category) {
						res.redirect('/media/' + media._id)
					})
				})
			} else if (categoryName){
				var category = new Category({
					name: categoryName,
					medias: [media._id]
				})
				category.save(function (err, category) {
					media.category = category._id 
					media.save(function (err, media) {
						res.redirect('/media/' + media._id)						
					})
				})
			}

		})
	}


}

//list page 
exports.list = function(req, res) {
	Media.fetch(function (err, medias){
		if (err) {
			console.log(err)
		}
		// console.log("mark")
		res.render('list', {
			title: '促销介质 列表页',
			medias: medias
		})  
	})
}

//list delete media
exports.delete = function (req, res){
	var id = req.query.id
	console.log(id)
	if (id) {
		Media.remove({_id: id}, function (err, meida) {
			if (err) {
				console.log(err)
			} else {
				res.json({success:1})
			}
		})
	}
}

//save media file
exports.saveFile = function (req, res, next) {
    // parse a file upload 
    var form = new formidable.IncomingForm();   //创建上传表单
      form.encoding = 'utf-8';    //设置编辑
      form.uploadDir = 'public/temp';   //设置上传目录
      form.keepExtensions = true;  //保留后缀
      form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
 
    form.parse(req, function(err, fields, files) {
    	if (err) {
    		console.log(err);
    		next();
    	}
    	console.log(util.inspect({fields: fields, files: files}));
    	req.body = { media: fields };
    	var contentObj = files.uploadContent;
    	var thumbnailObj = files.uploadThumbnail;


		fs.readFile(contentObj.path, function (err, data) {
	    	if (err) {
	    		console.log(err);
	    		next();
	    	}			
			var timestamp = Date.now()
			var type = contentObj.type.split('/')[1]
			var poster = timestamp + '.' + type	
			var newPath = path.join(__dirname, '../../', 'public/upload/' + poster);
			fs.writeFile(newPath, data, function (err) {
		    	if (err) {
		    		console.log(err);
		    	}
				req.body.media.content = poster;

				console.log('req.body.media.content'+ req.body.media.content);

				fs.readFile(thumbnailObj.path, function(err, data){
			    	if (err) {
			    		console.log(err);
			    	}					
					var timestamp = Date.now()
					var type = thumbnailObj.type.split('/')[1]
					var poster = timestamp + '.' + type	
					var newPath = path.join(__dirname, '../../', 'public/upload/' + poster)	
					fs.writeFile(newPath, data, function(err){
				    	if (err) {
				    		console.log(err);
				    	}
				    	req.body.media.thumbnail = poster;

				    	console.log('req.body.media.thumbnail'+ req.body.media.thumbnail);

				    	next();	
					})				
				})
			})
		}) 

    });


}
