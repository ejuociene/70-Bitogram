import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import likeImg from '../../images/like.svg';
import fullLikeImg from '../../images/liked.svg';
import commentImg from '../../images/comment.svg';
import sendImg from '../../images/messages.svg';
import saveImg from '../../images/save.svg';
import defaultAvatar from '../../images/default_avatar.jpg';
import menuImg from "../../images/menu.svg"
import axios from 'axios';
import './Post.css';
import MainContext from '../../context/MainContext';

const Post = (props) => {
	const { post } = props;
	const { userInfo, setAlert, setHome } = useContext(MainContext);
	const [ likesCount, setLikesCount ] = useState('');
	const [ isLiked, setIsLiked ] = useState(false);
	const navigate = useNavigate();
	useEffect(
		() => {
			axios
				.get(`/api/likes/${post.id}`)
				.then((resp) => {
					resp.data.rows.map((like) => {
						if (like.userId === userInfo.id) {
							return setIsLiked(true);
						}
					});
					setLikesCount(resp.data.count);
				})
				.catch((error) => {
					console.log(error);
					setAlert({ message: error.response.data, status: 'danger' });
					if (error.response.status === 401) {
						setTimeout(() => {
							navigate('/');
						}, 1000);
					}
				});
		},
		[ isLiked, navigate, post.id, setAlert, userInfo.id ]
	);
	const like = () => {
		if (!isLiked) {
			const form = {
				like: true,
				userId: userInfo.id
			};
			axios
				.post(`/api/likes/like/${post.id}`, form)
				.then((resp) => {
					setIsLiked(true);
				})
				.catch((error) => {
					console.log(error);
					setAlert({ message: error.response.data, status: 'danger' });
					if (error.response.status === 401) {
						setTimeout(() => {
							navigate('/');
						}, 1000);
					}
				});
		} else {
			axios
				.delete(`/api/likes/unlike/${post.id}`)
				.then((resp) => {
					setIsLiked(false);
					setAlert(resp.data);
				})
				.catch((error) => {
					console.log(error);
					setAlert({ message: error.response.data, status: 'danger' });
					if (error.response.status === 401) {
						setTimeout(() => {
							navigate('/');
						}, 1000);
					}
				});
		}
	};
	return (
		<div className="post-container">
			{post.user && (
				<div className="post-header">
					<Link to={`/profile/${post.userId}`} className="link" onClick={() => setHome(false)}>
						<img
							className="post-user-profile"
							src={post.user.picture ? post.user.picture : defaultAvatar}
							alt="user-profile"
						/>
					</Link>
					<Link to={`/profile/${post.userId}`} className="link" onClick={() => setHome(false)}>
						<h2 className="post-user">{post.user.username}</h2>
					</Link>
					<img src={menuImg} alt="menu" className='menu-icon'/>
					
				</div>
			)}
			<img src={post.photo} alt={post.userId} />
			<div className="post-icons">
				<img src={isLiked ? fullLikeImg : likeImg} alt="like" className="post-icon" onClick={like} />
				<Link to={`/comments/${post.id}`}>
					<img src={commentImg} alt="comment" className="post-icon" />
				</Link>
				<img src={sendImg} alt="send" className="post-icon" />
				<img src={saveImg} alt="save" className="post-icon" />
			</div>
			<div className="post-caption-container">
				<Link to={`/likes/${post.id}`} className="link">
					<p className="post-likes">
						{likesCount} {likesCount === 1 ? 'like' : 'likes'}
					</p>
				</Link>
				<p className="post-caption">
					<Link to={`/profile/${post.userId}`} className="link" onClick={() => setHome(false)}>
						<span className="post-user">{post.user && post.user.username} </span>
					</Link>
					{post.caption}
				</p>
			</div>
			{post.comments?.length > 0 && (
				<div className='post-comments-container'>
					<div>
					<Link to={`/profile/${post.comments[0].user.id}`} className="link" onClick={() => setHome(false)}>
						<span className="post-user">{post.comments[0].user?.username} </span>
					</Link>
					{post.comments[0].comment}
					</div>
					{post.comments?.length > 1 && <div>
					<Link to={`/profile/${post.comments[1].user.id}`} className="link" onClick={() => setHome(false)}>
						<span className="post-user">{post.comments[1].user?.username} </span>
					</Link>
					{post.comments[1].comment}

					</div>
					}
					{post.comments?.length > 2 &&
				<Link to={"/comments/" + post.id} className="post-comment-link">
					View all {post.comments?.length} {post.comments?.length === 1 ? 'comment' : 'comments'}
				</Link>}
			</div>)}
		</div>
	);
};

export default Post;
