import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/** TOKEN AUTH */
export const verifyToken = (req, res, next) => {
	try {
		let token = req.header('Authorization');

		if (!token) return res.status(403).send('Access denied');

		if (token.startsWith('Bearer '));
		token = token.slice(7, token.length).trimLeft();
		const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
		req.user = verified;
		console.log('user verified');
		next();

	} catch (err) {
		res.status(500).json({ error: err.message }); // TODO: handle errors		
	}

	// other way... with package cookie-parser
	/* 
	// try to obtain jwt from cookies
	const token = req.cookies.jwt;

	// check if jwt exists in cookies and verifies if it is authentic with jsonwebtoken method
	if (token) {
		// no need to import dotenv to use process.env again (already in app.js)
		jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
			if (err) {
				console.log(err.message);
				res.redirect('/login');
			} else {
				console.log(decodedToken);
				next();
			};
		});
	} else {
		res.redirect('/login');
	};
 */
};

/** Middleware to obtain user data if valid token */
const obtainUser = (req, res, next) => {
	// try to obtain jwt from cookies
	const token = req.cookies.jwt;

	// check if jwt exists in cookies and verifies if it is authentic with jsonwebtoken method
	if (token) {
		// no need to import dotenv to use process.env again (already in app.js)
		jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decodedToken) => {
			if (err) {
				console.log(err.message);
				res.locals.user = null;
				// we don't want to respond anything if there is an error, 
				// so we need next() to continue to following middleware, if there is one
				next();
			} else {
				console.log(decodedToken);
				// decodedToken has a payload with the user id (see token creation)
				const user = await User.findById(decodedToken.id);
				console.log(user.email);
				// locals to make any data we want accessible from the view
				res.locals.user = user;
				// we don't want to respond anything if there is an error, 
				// so we need next() to continue to following middleware, if there is one
				next();
			};
		});
	} else {
		res.locals.user = null;
		// we don't want to respond anything if there is an error, 
		// so we need next() to continue to following middleware, if there is one
		next();
	};
};