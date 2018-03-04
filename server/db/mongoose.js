const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://alex:hello213@ds012578.mlab.com:12578/todo');

module.exports = {
  mongoose
}
