import { Router } from 'express'
import Post from '../../models/Feed/Post.js'
import Feed from '../../models/Feed/Feed.js'
import { FEED_ID } from '../../index.js'

const router = Router()

router.post('/', async (req, res) => {

    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const { postId } = req.body
    try {
        const post = await Post.findById(postId);

        if (post.postedBy.toString().split('@')[0] !== req.user.email.split('@')[0]) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const feed = await Feed.findOne({ _id: FEED_ID })
        const postIndex = feed.posts.findIndex(post => post._id.toString() === postId.toString());
        if (postIndex !== -1) {                 
          feed.posts.splice(postIndex, 1);      
        }
        
        feed.posts.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
        })

        await feed.save();
        
        return res.status(200).json({ message: 'Posts deleted', posts: feed.posts })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

export default router
