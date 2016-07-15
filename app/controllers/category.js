var Category = require('../models/category')


//admin new category
exports.new = function (req, res) {
  res.render('adminCategory', {
    title : '后台录入页',
    category: {
      name: ""
    }
  })
}

//admin showUpdate category
exports.showUpdate = function (req, res) {
  var id = req.params.id;
  if (!id) {
    return handleError(new Error('no category id'));
  }
  Category.findById(id, function(err, category){
    if (err) {
      return handleError(err);
    }
    res.render('updateCategory', {
      title : '后台录入页',
      category: category
    })    

  })

}

// admin post category
exports.save = function (req, res){
  var _category = req.body.category
  Category.findOne({name: _category.name}, function (err, category) {
    if (!category ) {
      var newCategory = new Category(_category)
      newCategory.save(function (err, category) {
        if (err) {
          console.log(err)
        }
        res.redirect('/admin/category/list')
      })
    } 
  })
}

exports.update = function (req, res){
  var id = req.params.id;
  if (!id) {
    return handleError(new Error('no category id'));
  }
  Category.findById(id, function(err, category){
    if (err) {
      return handleError(err);
    }
    category.name = req.body.categoryName;
    category.save(function(err, category){
      if (err) {
        console.log(err)
      }
      res.redirect('/admin/category/list')      
    }) 

  })    
}

//category list page 
exports.list = function(req, res) {
  Category.fetch(function (err, categories){
    if (err) {
      console.log(err)
    }
    // console.log("mark")
    res.render('categoryList', {
      title: '分类列表页',
      categories: categories
    })  
  })
}

//list delete Category
exports.delete = function (req, res){
  var id = req.query.id
  console.log(id)
  if (id) {
    Category.remove({_id: id}, function (err, category) {
      if (err) {
        console.log(err)
      } else {
        res.json({success:1})
      }
    })
  }
}

//
exports.medias = function(req, res, next){
  var id = req.query.id
  console.log(id)
  if (id) {
    Category.findOne({_id: id})
      .populate('medias')
      .exec(function(err, category){
        res.render('categoryMedias', {category: category});  
      })
  }  
}


