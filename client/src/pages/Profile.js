import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import arrowBackImg from '../images/arrow-back.svg';
import MainContext from '../context/MainContext';
import defaultAvatar from '../images/default_avatar.jpg';

const Profile = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { setAlert } = useContext(MainContext);
	const [ profile, setProfile ] = useState({});
	useEffect(
		() => {
			axios
				.get('/api/users/user/' + id)
				.then((resp) => {
					let postsCount = 0;
					resp.data.posts.map((post) => {
						return (postsCount += 1);
					});
					resp.data.postsCount = postsCount;
					setProfile(resp.data);
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
		[ id ]
	);
	console.log(profile);
	return (
		profile && (
			<div className="profile-page">
				<header className="header-container">
					<div className="sub-header oneside">
						<Link to={'/explore'}>
							<img src={arrowBackImg} alt="back" className="back-arrow" />
						</Link>
						<h2 className="profile-username">{profile.username}</h2>
					</div>
				</header>
				<main className="container">
					<div className="profile-container">
						<div className="profile-top">
							<img
								src={profile.picture ? profile.picture : defaultAvatar}
								alt={profile.username}
								className="profile-picture"
							/>
							<div className="profile-data">
								<h3>{profile.postsCount}</h3>
								<p>Posts</p>
							</div>
							<div className="profile-data">
								<h3>4,815</h3>
								<p>Followers</p>
							</div>
							<div className="profile-data">
								<h3>834</h3>
								<p>Following</p>
							</div>
						</div>
						<div className="profile-info">
							<h4>{profile.fullName}</h4>
							<p>{profile.bio}</p>
						</div>
						<div className="profile-posts">
							{profile.posts &&
								profile.posts.map((post) => {
									return (
										<Link to={`/userPosts/${id}`} key={post.id}>
											<img src={post.photo} alt="post-photo" className="post-photo" />
										</Link>
									);
								})}
						</div>
					</div>
				</main>
			</div>
		)
	);
};

export default Profile;
