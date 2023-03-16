const mongoose = require('mongoose');

// connect to MongoDB Atlas
mongoose.connect('mongodb+srv://root:root@database.ptdziec.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});


// define schema for subscribers collection
const subscriberSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// create subscribers collection model
const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = Subscriber;


