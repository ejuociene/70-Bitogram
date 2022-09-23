import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainContext from '../context/MainContext';
import arrowBackImg from '../images/arrow-back.svg';
import checkImg from '../images/check.svg';
import axios from 'axios';

const NewPost = () => {
	const { userInfo, setAlert } = useContext(MainContext);
	const navigate = useNavigate();
	const [ post, setPost ] = useState({
		photo: '',
		caption: '',
		location: ''
	});
	const handleChange = (e) => {
		console.log(e.target);
		setPost((prevPost) => {
			if (e.target.name === 'photo') {
				document.getElementById('preview').src = window.URL.createObjectURL(e.target.files[0]);
			}
			return { ...prevPost, [e.target.name]: e.target.name === 'photo' ? e.target.files[0] : e.target.value };
		});
	};
	console.log(post);
	const handleForm = () => {
		const form = new FormData();
		for (const key in post) {
			form.append(key, post[key]);
		}
		axios
			.post('/api/posts/new', form)
			.then((resp) => {
				setAlert({ message: resp.data, status: 'succcess' });
				navigate('/explore');
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
	console.log(post);
	return (
		<div className="form-page">
			<header className="header-container">
				<div className="sub-header">
					<img src={arrowBackImg} alt="back" className="back-arrow" onClick={() => goBack()} />
					<h2 className="sub-title">New Post</h2>
					<img src={checkImg} alt="save" className="sub-header-icon" onClick={() => handleForm()} />
				</div>
			</header>
			<main className="container">
				<div className="form-container">
					<div className="form-section caption-section">
						<img src={userInfo.picture} alt={userInfo.id} className="form-profile" />
						<textarea
							placeholder="Write a caption..."
							name="caption"
							autosize
							className="input-form-caption"
							onChange={(e) => handleChange(e)}
						/>
						<img id="preview" className={post.photo === '' ? 'hidden' : ''} src="#" alt="post" />
					</div>
					<div className="break-line" />
					<div className="form-section">
						<label className="label">Choose a photo: </label>
						<input
							type="file"
							name="photo"
							className="input-form-upload"
							onChange={(e) => handleChange(e)}
						/>
					</div>
					<div className="break-line" />
					<div className="form-section">
						<input
							type="text"
							name="location"
							className="input-form"
							placeholder="Add location"
							onChange={(e) => handleChange(e)}
						/>
					</div>
					<div className="break-line" />
				</div>
			</main>
		</div>
	);
};

export default NewPost;
