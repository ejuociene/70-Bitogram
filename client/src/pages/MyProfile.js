import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import addImg from '../images/add.svg';
import logoutImg from '../images/logout.svg';
import MainContext from '../context/MainContext';
import defaultAvatar from '../images/default_avatar.jpg';

const MyProfile = () => {
	const { setAlert, userInfo } = useContext(MainContext);
	const navigate = useNavigate();
	const [ profile, setProfile ] = useState({});
	useEffect(
		() => {
			axios.get('/api/users/user/' + userInfo.id).then((resp) => setProfile(resp.data)).catch((error) => {
				console.log(error);
				setAlert({ message: error.response.data, status: 'danger' });
				if (error.response.status === 401) {
					setTimeout(() => {
						navigate('/');
					}, 1000);
				}
			});
		},
		[ navigate, setAlert, userInfo.id ]
	);
	const logout = () => {
		axios
			.get('/api/users/logout')
			.then((resp) => {
				setAlert(resp.data);
				navigate('/');
			})
			.catch((error) => {
				console.log(error);
				setAlert({ message: error.response.data, status: 'danger' });
			});
	};
	return (
		profile && (
			<div className="profile-page">
				<header className="header-container">
					<div className="sub-header spread endside">
						<h2 className="profile-username">{profile.username}</h2>
						<Link to={'/new-post'}>
							<img src={addImg} alt="add" className="nav-icon" />
						</Link>
						<img src={logoutImg} alt="logout" className="nav-icon" onClick={() => logout()} />
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
								<h3>4</h3>
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
							<Link to={`/edit-profile`}>
								<button className="edit-btn">Edit Profile</button>
							</Link>
						</div>
						<div className="profile-posts">
							{profile.posts &&
								profile.posts.map((post) => {
									return (
										<Link to={`/userPosts/${profile.id}`} key={post.id}>
											<img src={post.photo} alt="" className="post-photo" />
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

export default MyProfile;
