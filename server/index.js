import express from 'express';
import cors from 'cors';
import session from 'express-session';
import Users from './controller/users.js';
import Posts from './controller/posts.js';
import Comments from './controller/comments.js';
import Likes from './controller/likes.js';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(express.json());

app.set('trust proxy', 1);
app.use(
	session({
		secret: 'labai slapta fraze',
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: false,
			maxAge: 6000000
		}
	})
);

app.use('/api/posts/', Posts);
app.use('/api/users/', Users);
app.use('/api/comments/', Comments);
app.use('/api/likes/', Likes);
app.listen(3000);
