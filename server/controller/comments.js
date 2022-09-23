import express from 'express';
import db from '../database/connect.js';
import { commentValidator } from '../middleware/validate.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/new/:postId', auth, commentValidator, async (req, res) => {
	try {
		req.body.postId = req.params.postId;
		new db.Comments(req.body).save();
		res.send('Comment saved successfully');
	} catch (error) {
		console.log(error);
		res.status(500).send('Server error');
	}
});

router.delete('/delete/:id', auth, async (req, res) => {
	try {
		const comment = await db.Comments.findByPk(req.params.id);
		comment.destroy();
		res.send('Comment deleted');
	} catch (error) {
		console.log(error);
		res.status(500).send('Server error');
	}
});

export default router;
