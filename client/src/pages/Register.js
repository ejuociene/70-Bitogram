import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainContext from '../context/MainContext';

const Register = () => {
	const { setAlert } = useContext(MainContext);
	const [ form, setForm ] = useState({
		email: '',
		fullName: '',
		username: '',
		password: ''
	});
	const navigate = useNavigate();
	const handleChange = (e) => {
		setForm((prevForm) => {
			return { ...prevForm, [e.target.name]: e.target.value };
		});
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		axios
			.post('/api/users/register', form)
			.then((resp) => {
				setAlert({ message: resp.data, status: 'success' });
				navigate('/');
			})
			.catch((error) => {
				console.log(error);
				setAlert({ message: error.response.data, status: 'danger' });
			});
	};
	return (
		<div className="user-container">
			<div className="logo">Bitogram</div>
			<h3>Sign up to see photos and videos from your friends.</h3>
			<form className="user-form" onSubmit={(e) => handleSubmit(e)}>
				<input type="text" name="email" placeholder="Email address" onChange={(e) => handleChange(e)} />
				<input type="text" name="fullName" placeholder="Full Name" onChange={(e) => handleChange(e)} />
				<input type="text" name="username" placeholder="Username" onChange={(e) => handleChange(e)} />
				<input type="password" name="password" placeholder="Password" onChange={(e) => handleChange(e)} />
				<button className="form-btn">Next</button>
			</form>
			<div>
				<p className="login-text">
					Have an account?{' '}
					<Link to={'/'} className="link register-link">
						Log in
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Register;
