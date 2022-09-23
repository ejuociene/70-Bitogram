import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainContext from '../context/MainContext';
import Post from '../components/Post/Post';

const Explore = () => {
	const { setAlert } = useContext(MainContext);
	const navigate = useNavigate;
	const [ posts, setPosts ] = useState([]);
	useEffect(() => {
		axios.get('/api/posts').then((resp) => setPosts(resp.data)).catch((error) => {
			console.log(error);
			setAlert({ message: error.response.data, status: 'danger' });
			if (error.response.status === 401) {
				setTimeout(() => {
					navigate('/');
				}, 1000);
			}
		});
	}, []);
	return (
		<main className="container">
			<div className="explore">
				{posts.map((post) => {
					return <Post post={post} key={post.id} />;
				})}
			</div>
		</main>
	);
};

export default Explore;
