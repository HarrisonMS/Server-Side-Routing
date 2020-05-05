const express = require("express");
const router = express.Router();
const Posts = require("./postModel");

router.use(express.json());

//GETS ALL POSTS

router.get("/", (req, res) => {
  Posts.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      console.log(error.message);
      res.status(500).json({ message: "Error getting " });
    });
});

//GETS POST BY ID

router.get("/:id", (req, res) => {
  const { id } = req.params;
  Posts.findById(id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "post by that id was not found in our database" });
      }
    })
    .catch((error) => {
      console.log(error.message);
      res.status(500).json({ message: "Error getting ", error });
    });
});

// post by id this example uses the insert2 option that returns the contents of the new post

router.post("/v2", (req, res) => {
  const post = req.body;
  if (!post.title || !post.contents) {
    res.status(400).json({
      errorMessage: "body must contain a post.title and post.contents",
    });
  } else {
    Posts.insert2(post)
      .then((post) => {
        res.status(201).json(post);
      })
      .catch((error) => {
        console.log(error.message);
        res.status(500).json({ message: "error posting to db", error });
      });
  }
});

///post by id returns id of post instead of doing it through the model chaing a .then on the .then destructuring
router.post("/v1", (req, res) => {
  const post = req.body;
  if (!post.title || !post.contents) {
    res.status(400).json({
      errorMessage: "body must contain a post.title and post.contents",
    });
  } else {
    Posts.insert(post)
      .then(({ id }) => {
        Posts.findById(id)
          .then((post) => {
            res.status(201).json(post);
          })
          .catch((error) => {
            console.log(error.message);
            res.status(500).json({ message: "error posting to db", error });
          });
      })
      .catch((error) => {
        console.log(error.message);
        res.status(500).json({ message: "error posting to db", error });
      });
  }
});

router.post("/:id/comments", (req, res) => {
  const { id } = req.params;
  Posts.findById(id)
    .then((post) => {
      if (post.length < 1) {
        res.status(404).json({ errorMessage: "no post by that id was found" });
      } else {
        const comments = req.body;
        if (!comments.text) {
          res.status(400).json({
            errorMessage:
              "you need to provide a comments.text to the request body",
          });
        } else {
          comments.post_id = req.params.id;
          Posts.insertComment(comments)
            .then(({ id }) => {
              Posts.findCommentById(id).then((comment) => {
                res.status(201).json(comment);
              });
            })
            .catch((error) => {
              console.log("error on the POST no text field", error);
              res.status(500).json({
                errorMessage: " There was an error while saving the comment",
              });
            });
        }
      }
    })
    .catch((error) => {
      console.log("error on the POST no text field", error);
      res.status(500).json({
        errorMessage: " There was an error while saving the comment",
      });
    });
});

router.put("/:id", (req, res) => {
  const changes = req.body;
  const { id } = req.params;
  Posts.update(id, changes)
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((error) => {
      console.log(error.message);
      res.status(500).json({ message: "error updating db", error });
    });
});

router.get("/:id/comments", (req, res) => {
  const { id } = req.params;
  Posts.findPostComments(id)
    .then((comments) => {
      res.status(200).json(comments);
    })
    .catch((error) => {
      console.log(error.message);
      res.status(500).json({ message: "errro gettting comments" });
    });
});

router.delete("/:id", (req, res) => {
  Posts.remove(req.params.id).then((removed) => {
    if (removed) {
      res.status(404).json({ message: `deleted ${removed} post` });
    } else {
      res.status(200).json({ message: "post not found" });
    }
  });
});
module.exports = router;
