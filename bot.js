const mineflayer = require('mineflayer'); // Установка MineFlayer
const config = require('./config.json'); // Данные конфига
const socks = require('socks').SocksClient // Установка прокси


const random = Math.floor(Math.random() * 10000000000); // Генерация рандомных чисел после ника
const botUsername = config.nickname + random; // Соединение ника из конфига и рандомных чисел
const number = config.number + 8; // Номер слота нужного выживания, чтобы выбрать его в меню выбора выживания
console.log(config)
const bot = mineflayer.createBot({ // Создание бота
 username: config.nickname,
 version: config.version,
 skipValidation: false,
 host: config.ip,
 port: config.port,
 connect: (client) => { // Создание прокси подключения
    socks.createConnection({
      proxy: {
        host: config.proxy.ip,
        port: config.proxy.port,
        type: config.proxy.type
      },
      command: 'connect',
      destination: {
        host: config.ip,
        port: config.port
      }
    }, (err, info) => {
      if (err) {
        console.log(err);
        return;
      }
      client.setSocket(info.socket);
      client.emit('connect');
    });
  }
});


bot.once('login', () =>  {
 console.log('Зашел!')
});

bot.on('spawn', () => {
    bot.chat('/reg ' + config.password);
	bot.chat('/surv'); // Открытие меню выбора выживания
	bot.once('windowOpen', (window) => {
	bot.clickWindow(number, 0, 0); // Выбор нужного выживания
	setInterval(() => {
		bot.chat(config.message); 
	}, config.cooldown); // Отправка сообщения раз в указанную задержку
});
});


bot.on('json', (data) => {
  // Handle JSON messages
  console.log('Received JSON:', data);
});

bot.on('kicked', (reason, loggedIn) => {
 console.log(`Bot has been kicked! Reason: ${reason}`);
 process.exit(0);
}); // Вывод сообщения если бота кикнули


