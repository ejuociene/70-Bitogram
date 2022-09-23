import { DataTypes } from 'sequelize';

const Posts = (sequelize) => {
	const Schema = {
		photo: {
			type: DataTypes.STRING(),
			allowNull: false
		},
		caption: {
			type: DataTypes.TEXT(),
			allowNull: false
		},
		location: {
			type: DataTypes.STRING()
		}
	};
	return sequelize.define('posts', Schema);
};

export default Posts;
