var Comment = require('../models/comment')


//post comment
exports.save = function (req, res){
  var _comment = req.body.comment
  var movieId = _comment.media

  if (_comment.cid) {
    Comment.findById(_comment.cid, function (err, comment) {
      var newReply = {
        from: _comment.from,
        to: _comment.tid,
        content: _comment.content
      }
      comment.reply.push(newReply)
      comment.save(function (err, comment) {
        console.log('reply')
        console.log(comment)
        if (err) {
          console.log(err)
        }
        res.redirect('/media/' + movieId)        
      })
    })
  } else {
    comment = new Comment(_comment)

    comment.save(function (err, comment){
      if (err) {
        console.log(err)
      }
      res.redirect('/media/' + movieId)
    })    
  }
}
