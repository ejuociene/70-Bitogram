import { DataTypes } from 'sequelize';

const Users = (sequelize) => {
	const Schema = {
		email: {
			type: DataTypes.STRING(),
			allowNull: false
		},
		fullName: {
			type: DataTypes.STRING(),
			allowNull: false
		},
		username: {
			type: DataTypes.STRING(),
			allowNull: false
		},
		password: {
			type: DataTypes.STRING(),
			allowNull: false
		},
		picture: {
			type: DataTypes.STRING(),
			defaultValue: 'https://instastatistics.com/images/default_avatar.jpg'
		},
		bio: {
			type: DataTypes.STRING()
		}
	};
	return sequelize.define('users', Schema);
};

export default Users;
