export const auth = (req, res, next) => {
	if (req.session.loggedin) return next();
	return res.status(401).send('Your session has expired');
};

export const adminAuth = (req, res, next) => {
	if (req.session.loggedin && req.session.user.role === 1) return next();
	return res.status(401).send('Your session has expired');
};
