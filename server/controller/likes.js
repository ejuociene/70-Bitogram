import express from 'express';
import db from '../database/connect.js';
import { likeValidator } from '../middleware/validate.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/like/:postId', auth, likeValidator, async (req, res) => {
	try {
		req.body.postId = req.params.postId;
		new db.Likes(req.body).save();
		res.send('Like saved successfully');
	} catch (error) {
		console.log(error);
		res.status(500).send('Server error');
	}
});

router.get('/:postId', auth, async (req, res) => {
	try {
		const likes = await db.Likes.findAndCountAll({ where: { postId: req.params.postId } });
		res.json(likes);
	} catch (error) {
		console.log(error);
		res.status(500).send('Server error');
	}
});

router.delete('/unlike/:postId', auth, async (req, res) => {
	try {
		await db.Likes.destroy({ where: { postId: req.params.postId, userId: req.session.user.id } });
		res.send('Like deleted');
	} catch (error) {
		console.log(error);
		res.status(500).send('Server error');
	}
});

export default router;
