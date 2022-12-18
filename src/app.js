
import * as dotenv from 'dotenv';
dotenv.config();

import { Telegraf } from 'telegraf';

import * as cron from 'node-cron';

const { BOT_TOKEN, CHAT_ID } = process.env;


const bot = new Telegraf(BOT_TOKEN);

bot.telegram.getMe().then((botInfo) => {
    bot.options.username = botInfo.username;
})

bot.command('oi', async(ctx) => {
    await ctx.telegram.sendMessage(
        ctx.message.chat.id,
        `Olá ${ctx.from.username}, desejo-te um dia feliz!`
    )
})

// cron.schedule('* * * * *', () =>{
//     console.log("Todos os minutos!!")
// })

let task = cron.schedule(
    "*/2 * * * *",
    async () => {
        await bot.telegram.sendMessage(CHAT_ID, "Já picaste o ponto?");
    },
    { scheduled: false }
);

bot.command("piquei", async (ctx) => {
    await bot.telegram.sendMessage(ctx.message.chat.id, `Fico contente ${ctx.from.username}. Vou cancelar o aviso.`);
    task.stop();
});

const startWarning = () => {
    console.log("Inicio do Cron Job!");
    task.start();
};

cron.schedule("30 9 * *  1,2,3,4,5", startWarning, {
    scheduled: true,
    timezone: "Europe/Lisbon",
});

cron.schedule("30 12 * *  1,2,3,4,5", startWarning, {
    scheduled: true,
    timezone: "Europe/Lisbon",
});

cron.schedule("0 14 * *  1,2,3,4,5", startWarning, {
    scheduled: true,
    timezone: "Europe/Lisbon",
});

cron.schedule("30 18 * * 1,2,3,4,5", startWarning, {
    scheduled: true,
    timezone: "Europe/Lisbon",
});
// s m h (d of month) month (day of week)

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));