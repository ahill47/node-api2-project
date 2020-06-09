const express = require("express")
const posts = require("./db")

// create a new standalone router which will be attached to endpoints
const router = express.Router();

router.delete("/api/posts/:id", (req, res)=>{
    posts.remove(req.params.id)
    .then((count)=>{
        if (count >0){
            res.status(200).json({
                message: "The post has been removed"
            })
        }else{
            res.status(400).json(
                { message: "The post with the specified ID does not exist." 
            });
            
        }
        
    })
    .catch((error)=>{
        console.log(error);
        res.status(500).json(
            { error: "The post could not be removed" }
        )
    })
})


router.get("/api/posts/:id", (req, res) => {
  posts
    .findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
        console.log(post);
      } else {
        res.status(404).json({
          message: "The post with the specified ID does not exist.",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: "The post information could not be retrieved.",
      });
    });
});

router.get("/api/posts", (req, res)=>{
    posts.find()
        .then((post)=>{
            res.status(200).json(post)
        })
        .catch((error)=>{
            console.log(error)
            res.status(500).json({
                message: "Error retrieving posts",
            })
        })
})

router.get("/api/posts/:id/comments", (req,res)=>{
    posts.findPostComments(req.params.id)
        .then((comments)=>{
                res.status(200).json(comments)
                console.log(comments)
        })
        .catch((error)=>{
            console.log(error)
            res.status(500).json({
                message: "Error getting comments"
            })
        }
        )
})




router.post("/api/posts", (req, res)=>{
    if (!req.body.title || !req.body.content){
        return res.status(400).json(
            { errorMessage: "Please provide title and contents for the post." }
        )
    }
    posts.add(req.body)
        .then((post)=>{
            res.status(201).json(post)

        })
        .catch((error)=>{
            console.log(error);
            res.status(500).json(
                { error: "There was an error while saving the post to the database" }
            )
        }
        )
}
)

router.post('/:id/comments', (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    const comment = { ...req.body, post_id: id };
    if (!text) {
      res
        .status(400)
        .json({ errorMessage: 'Please provide text for the comment.' });
    } else {
      posts.findById(id)
        .then(post => {
          if (!post.length) {
            res.status(404).json({
              message: 'The post with the specified ID does not exist.'
            });
          } else {
            Posts.insertComment(comment)
              .then(comment => {
                res.status(201).json(comment);
              })
              .catch(error => {
                res.status(500).json({
                  error:
                    'There was an error while saving the comment to the database'
                });
              });
          }
        })
        .catch(error => {
          res.status(500).json(error);
        });
    }
  });
  
  router.put('/:id', (req, res) => {
    const post = req.body;
    const { id } = req.params;
    if (!req.body.title || !req.body.contents) {
      res.status(400).json({
        errorMessage: 'Please provide title and contents for the post.'
      });
    } else {
      posts.update(id, posts)
        .then(updated => {
          if (updated) {
            res.status(200).json(updated);
          } else {
            res.status(404).json({
              message: 'The post with the specified ID does not exist.'
            });
          }
        })
        .catch(error => {
          console.log(error);
          res
            .status(500)
            .json({ error: 'The post information could not be modified' });
        });
    }
  });
  

module.exports = router;