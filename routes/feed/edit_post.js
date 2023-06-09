import { Router } from 'express';
import Post from '../../models/Feed/Post.js';
import Feed from '../../models/Feed/Feed.js';
import { FEED_ID } from '../../index.js';

const router = Router();

router.post('/', async (req, res) => {
  const { postId, content } = req.body;

  try {
    const postToEdit = await Post.findById(postId);

    if (!postToEdit) {
      return res.status(400).json({ error: 'Post to edit not found' });
    }

    if (postToEdit.postedBy.toString().split('@')[0] !== req.user.email.split('@')[0]) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    postToEdit.content = content;

    const feed = await Feed.findOne({ _id: FEED_ID });
    const postIndex = feed.posts.findIndex((post) => post._id.toString() === postId.toString());
    feed.posts[postIndex] = postToEdit;

    await feed.save();
    await postToEdit.save();

    return res.status(200).json({ message: 'Post edited', post: postToEdit });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
