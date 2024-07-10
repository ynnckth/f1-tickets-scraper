import TelegramBot from 'node-telegram-bot-api';
import schedule from 'node-schedule'
import { format } from "date-fns";
import {scrapeTickets, url} from "./scraper";

require('dotenv').config();

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN ?? "";

const bot = new TelegramBot(TELEGRAM_TOKEN, {polling: true});

bot.onText(/\/init/, async (message) => {
    // Send notification daily at 8am
    schedule.scheduleJob('00 08 * * *', async () => {
        const tickets = await scrapeTickets();
        const content = `Available F1 SG GP 3-day tickets ${format(new Date(), "dd.MM.yyyy")}:\n`
            + `${tickets ? tickets.map(t => `${t.grandstandName}: ${t.price}`).join("\n - ") : 'None'}`
            + `\n\n${url}`
        ;
        await sendMessage(message, content);
    });
    await sendMessage(message, "Ok");
    console.log('Initialized for chat id', message.chat.id);
});

async function sendMessage(message: TelegramBot.Message, content: string) {
    try {
        await bot.sendMessage(message.chat.id, content);
    } catch (e) {
        console.log("Error sending telegram message: ", e);
    }
}
