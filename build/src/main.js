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
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const index_js_1 = require("./index.js");
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
/*
const apiUrl = "https://api.api-ninjas.com/v1/quotes";
const apiKey = process.env.NINJAS;

async function fetchQuotes(): Promise<any> {
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "X-Api-Key": apiKey || "",
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errorText = await response.text();
      throw new Error(`Error: ${response.status} - ${await errorText}`);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}
*/
const apiUrl = "https://zenquotes.io/api/random";
function fetchQuotes2() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(apiUrl);
            const data = yield response.json();
            return data;
        }
        catch (error) {
            return Promise.reject(error);
        }
    });
}
const userStatus = new Map();
client.once("ready", () => {
    if (client.user) {
        console.log(`Logged in as ${client.user.tag}!`);
    }
    else {
        console.error("Client user is null.");
    }
    // 1時間ごとに "status" コマンドの処理を実行
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        const channelId = "1300296856969936906"; // 自動実行メッセージを送信するチャンネルのID
        const channel = client.channels.cache.get(channelId);
        // チャンネルがギルドチャンネルか確認する
        if ((channel === null || channel === void 0 ? void 0 : channel.isTextBased()) &&
            channel.type !== discord_js_1.ChannelType.DM &&
            "guild" in channel &&
            userStatus.size > 0) {
            let responseMessage = "現在、以下のユーザーが滞在中です。\n";
            userStatus.forEach((value, userId) => {
                const member = channel.guild.members.cache.get(userId); // channel.guild を安全に使用
                if (member) {
                    const userName = member.nickname || member.user.username;
                    responseMessage += `${userName}さん\n`;
                }
            });
            channel.send(responseMessage);
        }
        else {
            console.error("指定されたチャンネルはメッセージを送信できません。");
        }
    }), 5400000);
});
client.on("messageCreate", (message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (message.author.bot)
        return;
    const args = message.content.trim().split(/\s+/);
    const command = args[0];
    const option = args[1];
    if (command === "i") {
        const inTime = new Date();
        const formattedIntime = inTime.toLocaleString(); // 日時を文字列に変換
        const userName = ((_a = message.member) === null || _a === void 0 ? void 0 : _a.nickname) || message.author.username; // ユーザー名を取得
        const action = "入室";
        let responseMessage = "";
        console.log("Processing 'i' command for user:", userName);
        console.log(userName, formattedIntime, action);
        if (userStatus.has(message.author.id)) {
            responseMessage = `${userName}さんは既に入室しています。`;
        }
        else {
            try {
                userStatus.set(message.author.id, { inTime });
                responseMessage = `${userName}さんが${formattedIntime}に入室しました。ウェルカム！\n`;
                (0, index_js_1.appendToSheet)(userName, formattedIntime, action);
                if (option === "-jobs") {
                    const filepath = path_1.default.resolve(__dirname, "../data/quotes/jobs.json");
                    const data = yield promises_1.default.readFile(filepath, "utf-8");
                    const jobsQuotes = JSON.parse(data);
                    const randomQuote = jobsQuotes[Math.floor(Math.random() * jobsQuotes.length)];
                    responseMessage += `"${randomQuote}"\nSteve Jobs`;
                }
                else if (option === "-kaori") {
                    responseMessage += "This is a test";
                    const filepath = path_1.default.resolve(__dirname, "../data/quotes/kaori.json");
                    const data = yield promises_1.default.readFile(filepath, "utf-8");
                    const kaoriQuotes = JSON.parse(data);
                    const randomQuote = kaoriQuotes[Math.floor(Math.random() * kaoriQuotes.length)];
                    responseMessage += `"${randomQuote.quote}"\ntest${randomQuote.author}`;
                }
                else {
                    const [quotes] = yield Promise.all([fetchQuotes2()]);
                    const firstQuote = quotes[0];
                    responseMessage += `"${firstQuote.q}"\n${firstQuote.a}`;
                }
            }
            catch (error) {
                console.error("エラーが発生しました:", error);
                responseMessage += "入室中に問題が発生しました。";
            }
        }
        if (message.channel.isTextBased() && "send" in message.channel) {
            message.channel.send(responseMessage);
        }
        else {
            console.error("This channel does not support sending messages.");
        }
    }
    if (message.content === "o") {
        const outTime = new Date();
        const formattedOutTime = outTime.toLocaleString(); // 日時を文字列に変換
        const userName = ((_b = message.member) === null || _b === void 0 ? void 0 : _b.nickname) || message.author.username; // ユーザー名を取得
        if (userStatus.has(message.author.id)) {
            const { inTime } = userStatus.get(message.author.id);
            const durationMs = outTime.getTime() - inTime.getTime();
            const durationHours = Math.floor(durationMs / 3600000);
            const durationMinutes = Math.floor(durationMs / 60000) - durationHours * 60;
            const durationSeconds = Math.floor((durationMs % 60000) / 1000);
            userStatus.delete(message.author.id);
            let responseMessage = `${userName}さんが${formattedOutTime}に退室しました。\n滞在時間: ${durationHours ? `${durationHours}時間` : ""}${durationMinutes ? `${durationMinutes}分` : ""}${durationSeconds}秒。またね！`;
            if (message.channel.isTextBased() && "send" in message.channel) {
                message.channel.send(responseMessage);
            }
            else {
                console.error("This channel does not support sending messages.");
            }
            try {
                const action = "退室";
                console.log(userName, formattedOutTime, action);
                yield (0, index_js_1.appendToSheet)(userName, formattedOutTime, action);
            }
            catch (error) {
                console.error("Failed to append to the sheet", error);
                responseMessage += "スプレッドシートへの記録に失敗しました。";
            }
        }
        else {
            if (message.channel.isTextBased() && "send" in message.channel) {
                message.channel.send(`${userName}さんはまだ入室していません。`);
            }
        }
    }
    if (message.content === "allo") {
        const outTime = new Date();
        const formattedOutTime = outTime.toLocaleString();
        let responseMessage = `${formattedOutTime}に全てのユーザーが退室しました。\n`;
        if (userStatus.size > 0) {
            userStatus.forEach((value, userId) => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                const member = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.members.cache.get(userId);
                if (member) {
                    const userName = member.nickname || member.user.username;
                    const durationMs = outTime.getTime() - value.inTime.getTime();
                    const durationHours = Math.floor(durationMs / 3600000);
                    const durationMinutes = Math.floor(durationMs / 60000) - durationHours * 60;
                    const durationSeconds = Math.floor((durationMs % 60000) / 1000);
                    responseMessage += `${userName}さんは${durationHours ? `${durationHours}時間` : ""}${durationMinutes ? `${durationMinutes}分` : ""}${durationSeconds}秒滞在しました。\n`;
                    try {
                        const action = "退室";
                        yield (0, index_js_1.appendToSheet)(userName, formattedOutTime, action);
                    }
                    catch (error) {
                        console.error("Failed to append to the sheet", error);
                        responseMessage += "スプレッドシートへの記録に失敗しました。";
                    }
                }
            }));
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
    if (message.content === "status") {
        let responseMessage = "以下のユーザーが滞在中です。\n";
        if (userStatus.size > 0) {
            userStatus.forEach((value, userId) => {
                var _a;
                const member = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.members.cache.get(userId);
                if (member) {
                    const userName = member.nickname || member.user.username;
                    responseMessage += `${userName}さん\n`;
                }
            });
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
