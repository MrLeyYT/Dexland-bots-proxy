const mineflayer = require('mineflayer'); // Установка MineFlayer
const config = require('./config.json'); // Данные конфига
const socks = require('socks').SocksClient; // Установка прокси
const random = Math.floor(Math.random() * 100000); // Генерация рандомных чисел после ника
// Генерация никнейма из n случайных букв
const gen = () => { let nickname = ''; const alphabet = 'abcdefghijklmnopqrstuvwxyz'; for (let i = 0; i < config.nickname.number; i++) { nickname += alphabet.charAt(Math.floor(Math.random() * alphabet.length)); } return nickname; };
const botUsername = generateNickname(); // Соединение ника из конфига и рандомных чисел
const pass = generateNickname();
const number = config.number + 8; // Номер слота нужного выживания, чтобы выбрать его в меню выбора выживания
let sleep=ms=>{
  let d=Date.now();
  while(Date.now()-d<ms){}
};
console.log(config);
const bot = mineflayer.createBot({
    username: botUsername,
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

bot.once('login', () => {
	console.log(`Бот успешно вошел с никнеймом: ${bot.username}`);
});

bot.on('spawn', () => {
	sleep(1000);
    bot.chat('/reg ' + pass);
	sleep(1000);
	bot.chat('/s' + config.number);
	setInterval(() => {
        bot.chat('!' + genMessage() + config.message + genMessage());
    }, config.cooldown); // Отправка сообщения раз в указанную задержку
});

bot.on('kicked', (reason, loggedIn) => {
    console.log(`Bot has been kicked! Reason: ${reason}`);
    process.exit();
}); // Вывод сообщения если бота кикнули