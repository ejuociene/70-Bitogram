import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';
import Users from '../models/users.js';
import Posts from '../models/posts.js';
import Comments from '../models/comments.js';
import Likes from '../models/likes.js';

const database = {};

const credentials = {
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'bitogram'
};

try {
    const connection = await mysql.createConnection({
        host: credentials.host,
        user: credentials.user,
        password: credentials.password
    })
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${credentials.database}`)
    const sequelize = new Sequelize(credentials.database, credentials.user, credentials.password, {dialect: "mysql"});
    database.Posts = Posts(sequelize)
    database.Users = Users(sequelize)
    database.Comments = Comments(sequelize)
    database.Likes = Likes(sequelize)

    database.Users.hasMany(database.Posts)
    database.Posts.belongsTo(database.Users)

    database.Posts.hasMany(database.Comments)
    database.Comments.belongsTo(database.Posts)

    database.Posts.hasMany(database.Likes)
    database.Likes.belongsTo(database.Posts)
   
    database.Users.hasOne(database.Comments)
    database.Comments.belongsTo(database.Users)

    database.Users.hasOne(database.Likes)
    database.Likes.belongsTo(database.Users)

    await sequelize.sync({alter: true})
}
catch(error) {
    console.log("Nepavyko prisijungti prie duomenu bazes")
}

export default database;
