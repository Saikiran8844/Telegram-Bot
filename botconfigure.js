
//import needed modules for database, admin panel and chatbot commands
const TelegramBot = require('node-telegram-bot-api');
//const express = require('express');
const Subscriber=require('./database')


//declare the app 
//const app = express();
//const port = 3000;

//const bodyParser = require('body-parser');
//app.use(bodyParser.urlencoded({ extended: true }));  

// replace the value below with the Telegram token you receive from @BotFather
const token = '5726702579:AAGnVE-SRY5HVXnSt-hMyGFmSK3mRg9c-Vs';

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });



const iphoneModels = {
    iphone12: 799,
    iphone12mini: 699,
    iphone12pro: 999,
    iphone12promax: 1099,
    iphone11: 599,
    iphone11pro: 799,
    iphone11promax: 899,
  };

// Handles the /help command
bot.onText(/\/help|help/, (msg) => {
  let helpMessage = 'Available commands:\n';
  helpMessage += '/price <model>: Get the price of a specific iPhone model.\n';
  helpMessage += '/prices: Get the prices of all available iPhone models.\n';
  helpMessage += '/subscribe <model>: Subscribe to daily updates for a specific iPhone model.\n';
  helpMessage += '/unsubscribe <model>: Unsubscribe from daily updates for a specific iPhone model.\n';
  bot.sendMessage(msg.chat.id, helpMessage);
});
  
  // Command to get all prices
  bot.onText(/^(\/prices|prices)$/, (msg) => {
    const chatId = msg.chat.id;
    let response = 'Here are the prices for all iPhone models:\n';
    for (const model in iphoneModels) {
      response += `${model}: $${iphoneModels[model]}\n`;
    }
    bot.sendMessage(chatId, response);
  });
  
  // Command to get price of a specific model
  bot.onText(/^\/price (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const modelName = match[1].toLowerCase();
    if (iphoneModels[modelName]) {
      bot.sendMessage(chatId, `The price of ${modelName} is $${iphoneModels[modelName]}`);
      bot.sendMessage(chatId, `If you want to subscribe for daily updates--use /subscribe and to unsubscribe--use /unsubscribe`);
    } else {
      bot.sendMessage(chatId, `Sorry, I could not find the price for ${modelName}`);
    }
  });
  
  // Greeting message
  bot.onText(/^(\/start|start)$|^(hello|hii)$/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Hey there, I\'m here to help you with iPhone prices. Use the /price command to get the price of a specific model, or use the /prices command to get the prices of all models.');
  });
  

// Define a function to handle the /subscribe command
bot.onText(/\/subscribe|subscribe/, async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.chat.username;

  try {
    // check if the user is already subscribed
    const subscriber = await Subscriber.findOne({ username: username });

    if (subscriber) {
      bot.sendMessage(chatId, 'You are already subscribed!');
    } else {
      // create new subscriber record
      const newSubscriber = new Subscriber({ username: username });
      await newSubscriber.save();
      bot.sendMessage(chatId, 'You have subscribed for daily updates on iPhone prices!');
    }
  } catch (error) {
    if (error.code === 11000) {
      bot.sendMessage(chatId, 'You are already subscribed!');
    } else {
      console.error(error);
      bot.sendMessage(chatId, 'An error occurred while trying to subscribe you. Please try again later.');
    }
  }
});


// Define a function to handle the /unsubscribe command
bot.onText(/^(\/unsubscribe|unsubscribe)$/, async(msg) => {
  const chatId = msg.chat.id;
  const username = msg.chat.username;

  // check if the user is already subscribed
  const subscriber = await Subscriber.findOne({ username: username });

  if (subscriber) {
    await Subscriber.deleteOne({ username: username });
    bot.sendMessage(chatId, 'You have unsubscribed from daily updates on iPhone prices.');
  } else {
    bot.sendMessage(chatId, 'You are not subscribed.');
  }
});


//command for other chat 
bot.onText(/^(\/(.+)|(.+))/,(msg)=>{
    bot.sendMessage(chatId, 'I don\'t know what you want to do.');
});

 
  // Invalid command message
  bot.on('message', (msg) => {
    //const chatId = msg.chat.id;
    console.log(msg);
   
  });

  module.exports = {
    token,
    bot
  };




