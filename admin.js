const Subscriber=require('./database')
//const bot=require('./botconfigure')

const {token,bot}= require('./botconfigure')
const express=require('express')
//declare the app 
const app = express();
const port = 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));  


// Display a login form for the admin
app.get('/', (req, res) => {
  res.send(`
    <form method="post" action="/login">
      <label for="username">Username:</label>
      <input type="text" id="username" name="username">
      <br>
      <label for="password">Password:</label>
      <input type="password" id="password" name="password">
      <br>
      <button onclick="location.href='/login'" type="submit">Login</button>
    </form>
  `);
});

// Handle login form submission
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if the credentials are correct
  if (username === 'admin' && password === 'root') {
    // Redirect to the admin panel
    res.redirect('/admin');
  } else {
    // Display an error message
    res.send('Invalid username or password. Please try again.');
  }
});

// Display the admin panel
app.get('/admin', (req, res) => {
  
    res.send(`
      <h1 >Admin Panel</h1>
      <p>Update bot settings and manage user accounts here.</p>
      
      <br>
      <button onclick="location.href='/users'"  type="submit">Manage users</button>
      <br>
      <button onclick="location.href='/settings'" type="submit">Bot Settings</button>
    `);
  
});

app.get('/users', async function(req, res) {
    // get all users from database
    try {
      const subscribers = await Subscriber.find({});
      res.render('users', { subscribers: subscribers });
    } catch (err) {
      console.error(err);
      res.send('Error retrieving subscribers');
    }
  });


// Handle sending messages to subscribers
app.get('/settings', (req, res) => {
  res.send(`
  <h1 >Admin Panel</h1>
  <p>Update bot settings.</p>
  
  <br>
  <button onclick="location.href='/editbot'"  type="submit">Edit Bot</button>
  <br>
  <button onclick="location.href='/token'" type="submit">API Token</button>
  <br>
  
  <button onclick="location.href='/more'" type="submit">More</button>
`);
  console.log("we are settings page");
});

app.get('/token',(req,res)=>{
  res.send(`Telegram bot token: ${token}`);
  //console.log(token);
}
);
app.get('/more',(req,res)=>{
  res.send(`For more settings We need to write the code `);
  //console.log(token);
}
);
app.get('/editbot',(req, res) => {
  // Render the bot settings page page HTML with a form to edit bot settings
  res.send(`
    <h1>Bot Admin Panel</h1>
    <form action="/editbot" method="post">
      <label>Group Privacy:</label>
      <select name="groupPrivacy">
        <option value="true">Enabled</option>
        <option value="false">Disabled</option>
      </select>
      <br><br>
      <label>Payment Settings:</label>
      <select name="paymentSettings">
        <option value="true">Enabled</option>
        <option value="false">Disabled</option>
      </select>
      <br><br>
      <input type="submit" value="Save Settings">
    </form>
  `);
});


app.post('/editbot', (req, res) => {
  // Get the updated bot settings from the form data
  const groupPrivacy = req.body.groupPrivacy;
  const paymentSettings = req.body.paymentSettings;

  // Use the Telegram Bot API to update the bot settings
  bot.setMyCommands([
    { command: 'start', description: 'Start the bot' },
    { command: 'help', description: 'Get help with the bot' },
  ]);

  bot.setMyPrivacy({ 
    chat_privacy: groupPrivacy,
  });

  bot.setMyPayments(paymentSettings);

  // Send a confirmation message to the bot's chat
  bot.sendMessage('BOT_CHAT_ID', 'Bot settings updated');

  // Redirect back to the settings page
  res.redirect('/settings');
});

// Start the Express app on port 3000
app.listen(3000, () => {
  console.log('App listening on port 3000');
});



