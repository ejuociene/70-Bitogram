import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import homeImg from '../../images/home.svg';
import emptyHomeImg from '../../images/home_empty.svg';
import searchIcon from '../../images/search.svg';
import MainContext from '../../context/MainContext';

const Footer = () => {
	const { userInfo, setHome, home } = useContext(MainContext);
	return (
		<footer className="footer">
			<nav className="footer-nav">
				<Link to={'/explore'} onClick={() => setHome(true)}>
					<img src={home ? homeImg : emptyHomeImg} alt="home" className="nav-icon" />
				</Link>
				<img src={searchIcon} alt="search" className="nav-icon" />
				<Link to={'/my-profile'} onClick={() => setHome(false)}>
					<img src={userInfo.picture} alt="profile" className="nav-icon footer-profile" />
				</Link>
			</nav>
		</footer>
	);
};

export default Footer;
