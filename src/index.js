
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const config = require ('./config');
const helper = require ('./helpers');
const keyboard = require ('./keyboard');
const kb = require ('./keyboard_btn');
const database = require ('../database.json');
const { getChatId } = require('./helpers');
 
helper.logStart(); 



mongoose.connect(config.DB_URL,{ useNewUrlParser: true })
  .then( ()=> console.log("MongoDB connected!"))
  .catch((err) =>  console.log(err));
  
require('./modal/windows_modal');
const answer = mongoose.model('answers');


// database.allanswers.forEach(an => new answer(an).save());


// .catch(e => console.log(answer))

//==============================================================================================================
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(config.token, {polling:true});




bot.on('message', msg =>{
  console.log ("bot is working!!");
 const chatId = helper.getChatId(msg);
  switch (msg.text){
    case kb.home.windows:
      bot.sendMessage(chatId, `<b>${msg.from.first_name}</b> choose your "Windows" options:`,{
        reply_markup:{keyboard:keyboard.windows},
        parse_mode:'HTML'
         });
      break;
      case kb.windows.install:
        sendAnswerByQuery(chatId,{type:"WindowsInstall"});
        break;
      case kb.windows.update:
        sendAnswerByQuery(chatId,{type:"WindowsUpdate"});
        break;
      case kb.home.office:
      bot.sendMessage(chatId, `<b>${msg.from.first_name}</b> choose your "Office" options:`,{
        reply_markup:{keyboard:keyboard.office},
        parse_mode:'HTML'
         });
      break;  
      case kb.office.outlook:
        sendAnswerByQuery(chatId,{type:"OfficeOutlook"});
        break;
      case kb.office.install:
        sendAnswerByQuery(chatId,{type:"OfficeInstall"});
        break;  
      case kb.home.activation:
        bot.sendMessage(chatId, `<b>${msg.from.first_name}</b> choose your "Activation" options:`,{
        reply_markup:{keyboard:keyboard.activaion},
        parse_mode:'HTML'
         });
      break;
      case kb.activaion.office:
        sendAnswerByQuery(chatId,{type:"ActivationOffice"});
        break;
      case kb.activaion.windows:
        sendAnswerByQuery(chatId,{type:"ActivationWindows"});
        break;     

    case kb.backHome:
      bot.sendMessage(chatId, `<b>${msg.from.first_name}</b> Lets start from the begining:`,{
        reply_markup:{keyboard:keyboard.home},
        parse_mode:'HTML'
      });
      break;    
  }


});

bot.onText( /\/start/, msg => {
 const text = `Hello, <b>${msg.from.first_name}</b> glad to see you here!!\n Chosse on what topic you need help: `;
 bot.sendMessage(helper.getChatId(msg), text, {
   parse_mode:'HTML',
   reply_markup: {
     keyboard: keyboard.home
   }
 });
});

bot.onText(/\/f(.+)/, (msg, [source, match]) => {
  const answerUuid = helper.getItemUuid(source);
   const chatId = helper.getChatId(msg);
  answer.findOne({uuid:answerUuid}).then(answer => {
    const messageStyly = `What you should do: ${answer.text}\n`;
    bot.sendPhoto(chatId, answer.picture, {
      caption : messageStyly,
      reply_markup:{
        inline_keyboard:[
          [
            {
              text: 'Follow help Link',
              url:answer.link
            }
          ],
        ]
      }
    });
  });
});

// ==============================================================================

function sendAnswerByQuery (chatId, query) {
  answer.find(query).then(answer => {
    console.log(answer);
    const html = answer.map((f, i) => {
      return `${i+1} <b>${f.name}</b> - /f${f.uuid}`;
    }).join('\n');
    sendHtml(chatId, html);
   
  });
}

function sendHtml (chatId, html, kbName = null){
  const options ={
    parse_mode: 'HTML'
  }
  if (kbName){
    options['reply_markup'] = {
      keyboard:keyboard[kbName]
    };
  }
  bot.sendMessage(chatId, html, options);
}

