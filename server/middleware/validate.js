import Joi from 'joi';

const validate = (schema, req, res, next) => {
	const options = {
		abortEarly: true,
		stripUnknown: true
	};
	const { error, value } = schema.validate(req.body, options);
	let message = '';
	if (error) {
		console.log(req.body);
		console.log(error.details[0].path[0]);
		switch (error.details[0].path[0]) {
			case 'email':
				message = 'Neteisingas el.pašto adresas';
				break;
			case 'password':
				message = 'Slaptažodis turi turėti nuo 5 iki 12 ženklų';
				break;
			default:
				message = 'Visi laukeliai privalo būti užpildyti';
				break;
		}
		return res.status(500).send(message);
	}
	req.body = value;
	next();
};

export const registerValidator = (req, res, next) => {
	const schema = Joi.object({
		fullName: Joi.string().min(1).max(255).required(),
		username: Joi.string().min(1).max(255).required(),
		email: Joi.string().email().required(),
		password: Joi.string().min(5).max(12).required()
	});
	validate(schema, req, res, next);
};

export const userValidator = (req, res, next) => {
	const schema = Joi.object({
		fullName: Joi.string().min(1).max(255).required(),
		username: Joi.string().min(1).max(255).required(),
		picture: Joi.string().allow(''),
		bio: Joi.string().allow(''),
		id: Joi.number().required()
	});
	validate(schema, req, res, next);
};

export const loginValidator = (req, res, next) => {
	const schema = Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().min(5).max(12).required()
	});
	validate(schema, req, res, next);
};

export const postValidator = (req, res, next) => {
	const schema = Joi.object({
		caption: Joi.string().required(),
		photo: Joi.string().allow(''),
		location: Joi.string().allow('')
	});
	validate(schema, req, res, next);
};

export const commentValidator = (req, res, next) => {
	const schema = Joi.object({
		comment: Joi.string().min(1).required(),
		userId: Joi.number().required()
	});
	validate(schema, req, res, next);
};

export const likeValidator = (req, res, next) => {
	const schema = Joi.object({
		like: Joi.boolean().required(),
		userId: Joi.number().required()
	});
	validate(schema, req, res, next);
};
export default validate;
