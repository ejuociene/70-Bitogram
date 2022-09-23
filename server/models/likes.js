import { DataTypes } from 'sequelize';

const Likes = (sequelize) => {
	const Schema = {
		like: {
			type: DataTypes.BOOLEAN(),
			allowNull: false
		}
	};
	return sequelize.define('likes', Schema);
};

export default Likes;
