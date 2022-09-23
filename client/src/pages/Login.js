import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainContext from '../context/MainContext';
import axios from 'axios';

const Login = () => {
	const { setAlert, setRefresh, setHome } = useContext(MainContext);
	const navigate = useNavigate();
	const [ form, setForm ] = useState({
		email: '',
		password: ''
	});
	const handleChange = (e) => {
		setForm((prevForm) => {
			return { ...prevForm, [e.target.name]: e.target.value };
		});
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		axios
			.post('/api/users/login', form)
			.then((resp) => {
				console.log(resp);
				setAlert({ message: resp.data, status: 'success' });
				setHome(true);
				navigate('/explore');
				setRefresh((prevState) => !prevState);
			})
			.catch((error) => {
				console.log(error);
				setAlert({ message: error.response.data, status: 'danger' });
			});
	};
	return (
		<div className="user-container">
			<div className="logo">Bitogram</div>
			<form className="user-form" onSubmit={(e) => handleSubmit(e)}>
				<input type="text" name="email" placeholder="Email address" onChange={(e) => handleChange(e)} />
				<input type="password" name="password" placeholder="Password" onChange={(e) => handleChange(e)} />
				<button className="form-btn">Log In</button>
			</form>
			<div>
				<p className="login-text">
					Don't have a account?{' '}
					<Link to={'/register'} className="link register-link">
						Sign Up
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Login;
