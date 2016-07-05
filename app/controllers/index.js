var Media = require('../models/media')
var Category = require('../models/category')

//index page
exports.index = function (req, res) {
  Category
    .find({})
    .populate({path: 'medias', options: {limit: 6}})
    .exec(function (err, categories) {
      if (err) {
        console.log(err)
      }
      res.render('index', {
        title : '促销活动管理 首页',
        categories: categories
      })  
  })
}

//search page 
exports.search = function (req, res) {
  var catId = req.query.cat 
  var search = req.query.search
  var page = parseInt(req.query.p, 10) || 0
  var count = 2
  var index = page * count

  console.log(catId)
  if (catId) {
    Category
      .find({_id: catId})
      .populate({
        path: 'medias', 
        select: 'name thumbnail showUrl',
      })
      .exec(function (err, categories) {
        if (err) {
          console.log(err)
        }
        

        var medias = categories[0].medias || []
        // console.log(medias)
        var results = medias.slice(index, index + count)
        // console.log(results)
        res.render('results', {
          title : '促销活动管理 首页',
          keyword: categories[0].name,
          medias: results,
          query: 'cat='+catId,
          currentPage: (page + 1),
          totalPage: Math.ceil(medias.length / 2)
        })  
    })
  } else {
    Media
      .find({name: new RegExp(search + '*', 'i')})
      .exec(function (err, medias) {
        if (err) {
          console.log(err)
        }
        var results = medias.slice(index, index + count)
        res.render('results', {
          keyword: search,
          medias: results,
          query: 'search='+ search,
          currentPage: (page + 1),
          totalPage: Math.ceil(medias.length / 2)
        })
      })

  }
}
