import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import MainContext from '../context/MainContext';
import Post from '../components/Post/Post';
import arrowBackImg from '../images/arrow-back.svg';

const Explore = () => {
	const { userId } = useParams();
	const { setAlert } = useContext(MainContext);
	const navigate = useNavigate();
	const [ posts, setPosts ] = useState([]);
	useEffect(() => {
		axios.get(`/api/posts/user-posts/${userId}`).then((resp) => setPosts(resp.data)).catch((error) => {
			console.log(error);
			setAlert({ message: error.response.data, status: 'danger' });
			if (error.response.status === 401) {
				setTimeout(() => {
					navigate('/');
				}, 1000);
			}
		});
	}, []);
	const goBack = () => {
		navigate(-1);
	};
	return (
		<div className="profile-page">
			<header className="header-container">
				<div className="sub-header">
					<img src={arrowBackImg} alt="back" className="back-arrow" onClick={() => goBack()} />
					<h2 className="sub-title">Posts</h2>
				</div>
			</header>
			<main className="container">
				<div className="explore">
					{posts.map((post) => {
						return <Post post={post} key={post.id} />;
					})}
				</div>
			</main>
		</div>
	);
};

export default Explore;
