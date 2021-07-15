const { trimAndSantizeObject } = require('../utils/global');

module.exports = (req, res, next) => {
	trimAndSantizeObject(req.body);
	return next();
};
