import { Router } from 'express'
import Post from '../../models/Feed/Post.js'
import Feed from '../../models/Feed/Feed.js'
import { FEED_ID } from '../../index.js';

const router = Router();

router.post('/', async (req, res) => {

    if (req.user.email.split('@')[0] !== req.body.onid) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { postId, isUpvoted, isDownvoted, onid } = req.body

    try {
        const postToDownvote = await Post.findById(postId)
        // console.log("postToDownvote before:", postToDownvote)

        if (!postToDownvote) {
            return res.status(400).json({ error: 'Post to downvote not found' })
        }

        postToDownvote.upvotes = [...new Set(postToDownvote.upvotes)];
        postToDownvote.downvotes = [...new Set(postToDownvote.downvotes)];

        const alreadyDownvoted = postToDownvote.downvotes.includes(onid);

        if (isDownvoted === false && !alreadyDownvoted) {
            if (isUpvoted === true) {
                // postToDownvote.upvotes -= 1
                const upvoteIndex = postToDownvote.upvotes.indexOf(onid);
                if (upvoteIndex !== -1) {
                    postToDownvote.upvotes.splice(upvoteIndex, 1);
                }
            }
            // postToDownvote.downvotes += 1
            postToDownvote.downvotes.push(onid)
        } else {
            //postToDownvote.downvotes -= 1
            const downvoteIndex = postToDownvote.downvotes.indexOf(onid);
            if (downvoteIndex !== -1) {
                postToDownvote.downvotes.splice(downvoteIndex, 1);
            }
        }

        // console.log("postToDownvote after update:", postToDownvote)

        const feed = await Feed.findOne({ _id: FEED_ID })
        const postIndex = feed.posts.findIndex(post => post._id.toString() === postId.toString());
        feed.posts[postIndex] = postToDownvote
        
        await feed.save();
        await postToDownvote.save();
        
        return res.status(200).json({ message: 'Post downvoted', post: postToDownvote })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

export default router
