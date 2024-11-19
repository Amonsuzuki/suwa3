"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || "3000");
app.get("/", (req, res) => {
    res.send("Suwa3 is running!");
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//Botで使うGatewayIntents、partials
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.DirectMessages,
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
    ],
    partials: [discord_js_1.Partials.Message, discord_js_1.Partials.Channel],
});
client.once("ready", () => {
    console.log("Ready!");
    if (client.user) {
        console.log(client.user.tag);
    }
});
const apiUrl = "https://api.api-ninjas.com/v1/quotes";
const apiKey = process.env.NINJAS;
function fetchQuotes() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(apiUrl, {
                method: "GET",
                headers: {
                    "X-Api-Key": apiKey || "",
                },
            });
            if (response.ok) {
                const data = yield response.json();
                return data;
            }
            else {
                const errorText = yield response.text();
                throw new Error(`Error: ${response.status} - ${yield errorText}`);
            }
        }
        catch (error) {
            return Promise.reject(error);
        }
    });
}
const userStatus = new Map();
client.on("messageCreate", (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.author.bot)
        return;
    if (message.content === "in") {
        const inTime = new Date();
        const formattedIntime = inTime.toLocaleString(); // 日時を文字列に変換
        const userName = message.author.username; // ユーザー名を取得
        let responseMessage = "";
        if (userStatus.has(message.author.id)) {
            responseMessage = `${userName}さんは既に入室しています。`;
        }
        else {
            userStatus.set(message.author.id, { inTime });
            responseMessage = `${userName}さんが${formattedIntime}に入室しました。ウェルカム！\n`;
            const quotes = yield fetchQuotes();
            if (quotes)
                responseMessage += JSON.stringify(quotes);
        }
        if (message.channel.isTextBased() && "send" in message.channel) {
            message.channel.send(responseMessage);
        }
        else {
            console.error("This channel does not support sending messages.");
        }
    }
    if (message.content === "out") {
        const outTime = new Date();
        const formattedOutTime = outTime.toLocaleString(); // 日時を文字列に変換
        const userName = message.author.username; // ユーザー名を取得
        if (userStatus.has(message.author.id)) {
            const { inTime } = userStatus.get(message.author.id);
            const durationMs = outTime.getTime() - inTime.getTime();
            const durationHours = Math.floor(durationMs / 3600000);
            const durationMinutes = Math.floor(durationMs / 60000);
            const durationSeconds = Math.floor((durationMs % 60000) / 1000);
            userStatus.delete(message.author.id);
            const responseMessage = `${userName}さんが${formattedOutTime}に退室しました。\n滞在時間: ${durationHours ? `${durationHours}時間` : ""}${durationMinutes ? `${durationMinutes}分` : ""}${durationSeconds}秒。またね！`;
            if (message.channel.isTextBased() && "send" in message.channel) {
                message.channel.send(responseMessage);
            }
            else {
                console.error("This channel does not support sending messages.");
            }
        }
        else {
            if (message.channel.isTextBased() && "send" in message.channel) {
                message.channel.send(`${userName}さんはまだ入室していません。`);
            }
        }
    }
    if (message.content === "allout") {
        const outTime = new Date();
        const formattedOutTime = outTime.toLocaleString();
        let responseMessage = `${formattedOutTime}に全てのユーザーが退室しました。\n`;
        if (userStatus.size > 0) {
            userStatus.forEach((value, userId) => {
                const user = client.users.cache.get(userId);
                if (user) {
                    const durationMs = outTime.getTime() - value.inTime.getTime();
                    const durationHours = Math.floor(durationMs / 3600000);
                    const durationMinutes = Math.floor(durationMs / 60000);
                    const durationSeconds = Math.floor((durationMs % 60000) / 1000);
                    responseMessage += `${user.username}さんは${durationHours ? `${durationHours}時間` : ""}${durationMinutes ? `${durationMinutes}分` : ""}${durationSeconds}秒滞在しました。\n`;
                }
            });
            responseMessage += "またね！";
            userStatus.clear();
            if (message.channel.isTextBased() && "send" in message.channel) {
                message.channel.send(responseMessage);
            }
            else {
                console.error("This channel does not support sending messages.");
            }
        }
        else {
            if (message.channel.isTextBased() && "send" in message.channel) {
                message.channel.send("現在入室中のユーザーはいません。");
            }
        }
    }
}));
//ボット作成時のトークンでDiscordと接続
client.login(process.env.TOKEN);
