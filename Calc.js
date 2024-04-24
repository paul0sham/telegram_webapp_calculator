const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.7093883473:AAFcLVWw4NwSx7gvEdJTE-0YcM1EGCjK3BI, { polling: false });

function Solve(val) {
    var v = document.getElementById('res');
    v.value += val;
 }
 function Result() {
    var num1 = document.getElementById('res').value;
    var num2 = eval(num1);
    document.getElementById('res').value = num2;
 }
 function Clear() {
    var inp = document.getElementById('res');
    inp.value = '';
 }
 function Back() {
    var ev = document.getElementById('res');
    ev.value = ev.value.slice(0,-1);
 }
 bot.sendMessage(process.env.6181497425, 'Hello from my calculator web app!');
