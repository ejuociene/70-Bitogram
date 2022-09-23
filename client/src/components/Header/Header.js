import { useContext } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import addIcon from '../../images/add.svg';
import heartIcon from '../../images/like.svg';
import inboxIcon from '../../images/messages.svg';
import MainContext from '../../context/MainContext';

const Header = () => {
	return (
		<header className="header-container">
			<div className="header">
				<div className="header-logo">Bitogram</div>
				<nav className="nav">
					<Link to={'/new-post'}>
						<img src={addIcon} alt="add" className="nav-icon" />
					</Link>
					<img src={heartIcon} alt="like" className="nav-icon" />
					<img src={inboxIcon} alt="inbox" className="nav-icon" />
				</nav>
			</div>
		</header>
	);
};

export default Header;
