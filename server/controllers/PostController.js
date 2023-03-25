import PostModel from '../models/Post.js'

// Get Last 5 Tags for show on global
export const getLastTags = async (req, res) => {
    try {
        const post = await PostModel.find().limit(5).exec()

        const tags = post.map(obj => obj.tags).flat().slice(0,5)
        res.json(tags)
    }catch(err) {
        res.status(500).json({
            message: 'Չհաջովեց ստանալ տեգերը․․․'
        })
    }
}

// Get All Post for show page
export const getAll = async (req, res) => {
    try{
        const posts =  await PostModel.find().populate('user').exec()

        res.json(posts)
    }catch(err) {
        res.status(500).json({
            message: 'Չհաջողվեց stanal հրապարակումները...',
            error: err
        })
    }
}

// Get One Post by Id
export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
    
        const updatedDoc = await PostModel.findOneAndUpdate(
          { _id: postId },
          { $inc: { viewsCount: 1 } },
          { new: true }
        ).populate('user').exec();
    
        if (!updatedDoc) {
          return res.status(404).json({
            message: 'Հրապարակումը չի գտնվել...'
          })
        }
    
        res.json(updatedDoc);
      } catch (err) {
        console.log(err);
        res.status(500).json({
          message: 'Չհաջողվեց ստանալ հրապարակումները...',
          error: err
        });
      }
}

// Creat Post
export const create = async (req, res) => {
    try{
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId,
        })

        const post = await doc.save()

        res.json(post)
    }catch(err) {
        res.status(500).json({
            message: 'Չհաջողվեց ստեղծել հրապարակում...',
            error: err
        })
    }
}

// Remove Post by Id
export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
    
        const deletedDoc = await PostModel.findByIdAndDelete({
             _id: postId 
        }).exec();

        if(!deletedDoc){
            return res.status(404).json({
                message: "Հրապարակումը չի գտնվել․․․"
            })
        }

        res.json({
            success: true
        })

      } catch (err) {
        console.log(err);
        res.status(500).json({
          message: 'Չհաջողվեց ստանալ հրապարակումները...',
          error: err
        });
      }
}

// For Edit Post by Id
export const update = async (req, res) => {
    try {
        const postId = req.params.id

        const updateDoc = await PostModel.updateOne(
            {
                _id: postId 
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.userId,
                tags: req.body.tags.split(','),
            },
            ).exec();

            if(updateDoc){
                res.json({
                    success:true
                })
            }
    } catch(err){
        res.json({
            message: "Չի հաջողվել թարմացնել հրապարակումը",
        })
    }
}

// Add Comment
export const addComment = async (req, res) => {
    try {
      const postId = req.params.id;
  
      const updatedPost = await PostModel.findByIdAndUpdate(
        postId,
        {
          $push: {
            comment: {
              user: req.userId,
              text: req.body.comment
            }
          }
        },
        { new: true }
      ).exec();
  
      if (!updatedPost) {
        return res.json({ message: 'Post not found' });
      }
  
      res.json({ success: true });
    } catch (err) {
      res.json({ message: 'Error adding comment' });
    }
  };