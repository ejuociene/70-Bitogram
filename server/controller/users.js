import express from 'express';
import bcrypt from 'bcrypt';
import db from '../database/connect.js';
import { registerValidator, userValidator, loginValidator } from '../middleware/validate.js';
import { auth } from '../middleware/auth.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.post('/register', registerValidator, async (req, res) => {
	try {
		const userExists = await db.Users.findOne({ where: { email: req.body.email } });
		if (userExists) {
			res.status(401).send('This email is already used');
			return;
		}
		req.body.password = await bcrypt.hash(req.body.password, 10);
		await db.Users.create(req.body);
		res.send('Successfully registered!');
	} catch (error) {
		console.log(error);
		res.status(400).send('Registration unsuccessful');
	}
});

router.put('/update', auth, upload.single('picture'), userValidator, async (req, res) => {
	try {
		const user = await db.Users.findByPk(req.body.id);
		console.log(req.body);
		if (req.file) {
			req.body.picture = '/uploads/' + req.file.filename;
		}
		user.update(req.body);
		req.session.user = {
			id: user.id,
			picture: user.picture,
			username: user.username
		};
		res.send('User details updated successfully');
	} catch (error) {
		console.log(error);
		res.status(500).send('Server error');
	}
});

router.post('/login', loginValidator, async (req, res) => {
	try {
		const user = await db.Users.findOne({ where: { email: req.body.email } });
		if (!user) {
			return res.status(401).send('This user does not exist');
		}
		if (await bcrypt.compare(req.body.password, user.password)) {
			req.session.loggedin = true;
			req.session.user = {
				id: user.id,
				picture: user.picture,
				username: user.username
			};
			return res.send("You're now logged in. Redirecting...");
		} else {
			return res.status(401).send('Login unsuccessfull');
		}
	} catch (err) {
		console.log(err);
		return res.status(500).send('Server error');
	}
});

router.get('/logout', (req, res) => {
	req.session.destroy();
	return res.send("You're now logged out. Redirecting...");
});

router.get('/user/:id', auth, async (req, res) => {
	try {
		const post = await db.Users.findByPk(req.params.id, {
			include: db.Posts,
			order: [ [ db.Posts, 'createdAt', 'DESC' ] ]
		});
		res.json(post);
	} catch (error) {
		console.log(error);
		res.status(500).send('Server error');
	}
});

router.get('/userinfo/:id', auth, async (req, res) => {
	try {
		const post = await db.Users.findByPk(req.params.id, {
			attributes: [ 'fullName', 'username', 'picture', 'bio', 'id' ]
		});
		res.json(post);
	} catch (error) {
		console.log(error);
		res.status(500).send('Server error');
	}
});

router.get('/check-auth', async (req, res) => {
	try {
		res.send(req.session.user);
	} catch (err) {
		console.log(err);
		res.send('Server error');
	}
});

export default router;
