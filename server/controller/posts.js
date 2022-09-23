import express from 'express';
import db from '../database/connect.js';
import upload from '../middleware/multer.js';
import { postValidator } from '../middleware/validate.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/new', auth, upload.single('photo'), postValidator, async (req, res) => {
	try {
		if (req.file) req.body.photo = '/uploads/' + req.file.filename;
		req.body.userId = req.session.user.id;
		await db.Posts.create(req.body);
		res.send('Naujas įrašas sėkmingai sukurtas');
	} catch (error) {
		console.log(error);
		res.status(500).send('Įvyko serverio klaida');
	}
});

router.get('/', auth, async (req, res) => {
	try {
		let posts = await db.Posts.findAll({
			order: [ [ 'createdAt', 'DESC' ] ],
			include: [ { model: db.Users }, { model: db.Comments, include: db.Users } ]
		});
		res.json(posts);
	} catch (error) {
		console.log(error);
		res.status(500).send('Server error');
	}
});

router.get('/post/:id', auth, async (req, res) => {
	try {
		const post = await db.Posts.findByPk(req.params.id, {
			include: [ db.Users, { model: db.Comments, include: db.Users } ]
		});
		res.json(post);
	} catch (error) {
		console.log(error);
		res.status(500).send('Server error');
	}
});

router.get('/user-posts/:userId', auth, async (req, res) => {
	try {
		const post = await db.Posts.findAll({
			where: { userId: req.params.userId },
			order: [ [ 'createdAt', 'DESC' ] ],
			include: [ db.Users, { model: db.Comments, include: db.Users } ]
		});
		res.json(post);
	} catch (error) {
		console.log(error);
		res.status(500).send('Server error');
	}
});

router.put('/edit/:id', auth, upload.single('photo'), postValidator, async (req, res) => {
	try {
		const post = await db.Posts.findByPk(req.params.id);
		if (req.file) {
			req.body.image = '/uploads/' + req.file.filename;
		}
		post.update(req.body);
		res.send('Post updated successfully');
	} catch (error) {
		console.log(error);
		res.status(500).send('Server error');
	}
});

router.delete('/delete/:id', auth, async (req, res) => {
	try {
		const post = await db.Posts.findByPk(req.params.id);
		post.destroy();
		res.send('Post deleted successfully');
	} catch (err) {
		res.status(500).send('Server error');
	}
});

export default router;
