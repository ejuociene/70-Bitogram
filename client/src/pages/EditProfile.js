import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainContext from '../context/MainContext';
import closeImg from '../images/close.svg';
import checkImg from '../images/check.svg';

const EditProfile = () => {
	const { userInfo, setAlert, setRefresh } = useContext(MainContext);
	const navigate = useNavigate();
	const [ profile, setProfile ] = useState({
		picture: '',
		fullName: '',
		username: '',
		bio: '',
		id: ''
	});
	useEffect(() => {
		axios.get(`/api/users/userinfo/${userInfo.id}`).then((resp) => setProfile(resp.data)).catch((error) => {
			console.log(error);
			setAlert({ message: error.response.data, status: 'danger' });
			if (error.response.status === 401) {
				setTimeout(() => {
					navigate('/');
				}, 1000);
			}
		});
	}, []);
	const handleChange = (e) => {
		console.log(e.target);
		setProfile((prevProfile) => {
			if (e.target.name === 'picture') {
				document.getElementById('preview').src = window.URL.createObjectURL(e.target.files[0]);
			}
			return {
				...prevProfile,
				[e.target.name]: e.target.name === 'picture' ? e.target.files[0] : e.target.value
			};
		});
	};
	console.log(profile);
	const handleForm = (e) => {
		e.preventDefault();
		const form = new FormData();
		for (const key in profile) {
			form.append(key, profile[key]);
		}
		axios
			.put(`/api/users/update`, form)
			.then((resp) => {
				setAlert({ message: resp.data, status: 'success' });
				setRefresh((prevState) => !prevState);
				navigate(-1);
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
	console.log(profile);
	return (
		<form className="form-page" onSubmit={(e) => handleForm(e)}>
			<header className="header-container">
				<div className="sub-header spread">
					<img src={closeImg} alt="back" className="back-arrow" onClick={() => goBack()} />
					<h2 className="sub-title">Edit profile</h2>
					<button type="submit" className="submit-btn">
						<img src={checkImg} alt="save" className="sub-header-icon" />
					</button>
				</div>
			</header>
			<div className="container">
				{profile && (
					<main className="form-container">
						<div className="form-section column">
							<img src={userInfo.picture} id="preview" alt={profile.fullName} className="edit-picture" />
							<label className="label">Change profile photo: </label>
							<input
								type="file"
								name="picture"
								className="input-form-upload"
								onChange={(e) => handleChange(e)}
							/>
						</div>
						<div className="break-line" />

						<div className="form-section">
							<label className="form-label">Name</label>
							<input
								type="text"
								name="fullName"
								value={profile.fullName || ''}
								className="input-form"
								onChange={(e) => handleChange(e)}
							/>
						</div>
						<div className="break-line" />
						<div className="form-section">
							<label className="form-label">Username</label>
							<input
								type="text"
								name="username"
								value={profile.username || ''}
								className="input-form"
								onChange={(e) => handleChange(e)}
							/>
						</div>
						<div className="break-line" />
						<div className="form-section">
							<label className="form-label">Bio</label>
							<input
								type="text"
								name="bio"
								value={profile.bio || ''}
								className="input-form"
								onChange={(e) => handleChange(e)}
							/>
						</div>
						<div className="break-line" />
					</main>
				)}
			</div>
		</form>
	);
};

export default EditProfile;
