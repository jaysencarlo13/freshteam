const isString = (variable) => typeof variable === 'string' || variable instanceof String;
const isObject = (variable) => typeof variable === 'object';

exports.trimAndSantizeObject = (obj) => {
	for (const key in obj) {
		if (isString(obj[key])) {
			/**
			 * If key contains password, don't do anything
			 */
			if (key.toLowerCase().indexOf('password') !== -1) {
				continue;
			}

			/**
			 * If key is false after trimming, delete it
			 */
			if (!obj[key].trim()) {
				delete obj[key];
				continue;
			}

			/**
			 * Trim string
			 */
			obj[key] = obj[key].trim();

			/**
			 * If key name is email, convert it to lowercase
			 */
			if (key.toLowerCase().indexOf('email') !== -1) {
				obj[key] = obj[key].toLowerCase();
			}
		} else if (Array.isArray(obj[key])) {
			/**
			 * Santize all keys in array
			 */
			for (let i = 0; i < obj[key].length; i++) {
				trimAndSantizeObject(obj[key][i]);
			}
		} else if (isObject(obj[key])) {
			/**
			 * If value is object, recursively trim all children
			 */
			trimAndSantizeObject(obj[key]);
		}
	}
};
