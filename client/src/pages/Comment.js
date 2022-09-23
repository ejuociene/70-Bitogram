import React, { useContext, useEffect, useState } from 'react';
import {  useNavigate, useParams } from 'react-router-dom';
import MainContext from '../context/MainContext';
import arrowBackImg from '../images/arrow-back.svg';
import messagesImg from '../images/messages.svg';
import axios from 'axios';

const Comment = () => {
	const { postId } = useParams();
	const { userInfo, setAlert } = useContext(MainContext);
	const [ post, setPost ] = useState({});
	const [refresh, setRefresh] = useState(false)
	const navigate = useNavigate();
	const [ comment, setComment ] = useState({
		comment: '',
		userId: userInfo.id
	});
	useEffect(() => {
		axios.get(`/api/posts/post/${postId}`).then((resp) => setPost(resp.data)).catch((error) => {
			console.log(error);
			setAlert({ message: error.response.data, status: 'danger' });
			if (error.response.status === 401) {
				setTimeout(() => {
					navigate('/');
				}, 1000);
			}
		});
	}, [navigate, postId, setAlert, refresh]);
	const handleChange = (e) => {
		setComment((prevComment) => {
			return { ...prevComment, [e.target.name]: e.target.value };
		});
	};
	const handleForm = (e) => {
        e.preventDefault()
        console.log(comment)
		axios
			.post(`/api/comments/new/${postId}`, comment)
			.then((resp) => {
				setAlert({ message: resp.data, status: 'succcess' });
				setRefresh(prevState => !prevState)
				setComment({comment: '',
				userId: userInfo.id})
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
	};
	const goBack = () => {
		navigate(-1);
	};
	return (
		<div className="form-page">
			<header className="header-container">
				<div className='sub-header'>
				<img src={arrowBackImg} alt="back" className="back-arrow" onClick={() => goBack()} />
				<h2 className="sub-title">Comments</h2>
				<img src={messagesImg} alt="save" className="sub-header-icon" />
				</div>
			</header>
			<div className='container'>
			<main className="form-container">
				<div className="comment-section">
					<img src={post.user?.picture} alt={post.user?.id} className="form-profile-sm" />
					<p className="post-caption">
						<span className="post-user">{post.user && post.user.username} </span>
						{post.caption}
					</p>
				</div>
				<div className="break-line" />
                {post.comments && post.comments.map((each) => {
					return (
						<div className='comment-section' key={each.id}>
                <img src={each.user?.picture} alt={each.user?.id} className="form-profile-sm" />
					<p className="post-caption">
						<span className="post-user">{each.user?.username} </span>
						{each.comment}
					</p>
                </div>)})}
			
                    <form className='footer-comment' onSubmit={(e) => handleForm(e)}>
                        <img src={userInfo.picture} alt="profile" className='comment-profile'></img>
                        <textarea className='input-form' rows="1" value={comment.comment} name="comment" placeholder={"Comment as " + userInfo.username + "..."} onChange={(e) => handleChange(e)}/>
                        <button className='post-btn'>Post</button>
                    </form>
	
			</main>
		</div>
            
</div>
	);
};

export default Comment;
