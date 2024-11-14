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
//必要なパッケージをインポートする
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
//.envファイルを読み込む
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
//Botがきちんと起動したか確認
client.once("ready", () => {
    console.log("Ready!");
    if (client.user) {
        console.log(client.user.tag);
    }
});
client.on("messageCreate", (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.author.bot)
        return;
    if (message.content === "in") {
        const date1 = new Date();
        const formattedDate = date1.toLocaleString(); // 日時を文字列に変換
        const userName = message.author.username; // ユーザー名を取得
        const responseMessage = `${userName}さんが${formattedDate}に入室しました。ウェルカム！`;
        if (message.channel.isTextBased() && "send" in message.channel) {
            message.channel.send(responseMessage);
        }
        else {
            console.error("This channel does not support sending messages.");
        }
    }
}));
client.on("messageCreate", (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.author.bot)
        return;
    if (message.content === "out") {
        const date1 = new Date();
        const formattedDate = date1.toLocaleString(); // 日時を文字列に変換
        const userName = message.author.username; // ユーザー名を取得
        const responseMessage = `${userName}さんが${formattedDate}に退室しました。またね！`;
        if (message.channel.isTextBased() && "send" in message.channel) {
            message.channel.send(responseMessage);
        }
        else {
            console.error("This channel does not support sending messages.");
        }
    }
}));
//ボット作成時のトークンでDiscordと接続
client.login(process.env.TOKEN);
