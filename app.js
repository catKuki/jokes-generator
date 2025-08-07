const express = require('express');
require('dotenv').config();
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors'); // спілкування між різними доменами
const mongoose = require('mongoose');
const telegramBot = require('node-telegram-bot-api');

const app = express();
const bot = new telegramBot(process.env.TELEGRAM_KEY, {polling: true});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = 'Bot started';
    bot.sendMessage(chatId, text);
})


mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    });

    
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;



// Додаємо жарти в базу даних 

const joke = new mongoose.Schema({
    joke: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    author: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    }
   
});

const Joke = mongoose.model('Joke', joke);



app.post('/jokes', async (req, res) => {
    try {
        const { joke, author } = req.body;
        const newJoke = new Joke({ joke, author });
        await newJoke.save();
const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: '✅ Прийняти', callback_data: 'accept' }],
        [{ text: '❌ Відхилити', callback_data: 'confirm' }]
      ]
    }
  };

  bot.sendMessage(1334657008, `у вас новий жарт: ${joke}-${author}`, options);

        // bot.sendMessage(process.env.TELEGRAM_ID, `Новий жарт: ${joke}\nАвтор: ${author}`);
        res.status(201).json(newJoke);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add joke' });
    }
})

bot.on('callback_query', (callbackQuery) => {
  const msg = callbackQuery.message;
  const data = callbackQuery.data;

  let response = '';

  if (data === 'accept') {
    app.put('/jokes/${nsg.text}/varify')
    response = 'Ви натиснули "Прийняти".';
  } else if (data === 'decline') {
    response = 'Ви натиснули "Відхилити".';
  }


  bot.answerCallbackQuery(callbackQuery.id);


  bot.sendMessage(msg.chat.id, response);
});

app.get('/randomJoke', async (req, res) => {
    try {
        const count = await Joke.countDocuments();
        const randomIndex = Math.floor(Math.random() * count);
        const randomJoke = await Joke.findOne().skip(randomIndex);
        res.json(randomJoke);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch random joke' });
    }
});


app.get('/randomVerifiedJoke', async (req, res) => {
    try {
        const count = await Joke.countDocuments({ verified: true });
        const randomIndex = Math.floor(Math.random() * count);
        const randomJoke = await Joke.findOne({ verified: true }).skip(randomIndex);
        res.json(randomJoke);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch random joke' });
    }
});
    
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Отримати загальну кількість жартів
app.get('/jokes/count', async (req, res) => {
    try {
        const count = await Joke.countDocuments();
        res.json({ count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to count jokes' });
    }
});



app.get('/authors', async (req, res) => {
    try {
        const authors = await Joke.distinct('author');
        res.json(authors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch authors' });
    }
});

app.get('/authors-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'authors.html'));
});
// app.use(express.static(path.join(__dirname, 'public')));
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// Вказуємо явно, що головна — це jokes.html (не рекомендовано)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});