const mongoose = require('mongoose');

// mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/freshteam', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: true,
	useCreateIndex: true,
});

module.exports = mongoose.connection;
