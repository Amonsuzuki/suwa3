//必要なパッケージをインポートする
import { GatewayIntentBits, Client, Partials, Message } from "discord.js";
import dotenv, { parse } from "dotenv";
import express from "express";

//.envファイルを読み込む
dotenv.config();

let postCount = 0;
const app = express();
app.listen(3000);
app.post("/", function (req, res) {
  console.log(`Received POST request.`);
  postCount++;
  if (postCount == 10) {
    postCount = 0;
  }
  res.send("POST response by glitch");
});

/*
const app = express();

const PORT: number = parseInt(process.env.PORT || "3000");

app.get("/", (req, res) => {
  res.send("Suwa3 is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
*/

//Botで使うGatewayIntents、partials
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel],
});

//Botがきちんと起動したか確認
client.once("ready", () => {
  console.log("Ready!");
  if (client.user) {
    console.log(client.user.tag);
  }
});

client.on("messageCreate", async (message: Message) => {
  if (message.author.bot) return;

  if (message.content === "in") {
    const date1 = new Date();
    const formattedDate = date1.toLocaleString(); // 日時を文字列に変換
    const userName = message.author.username; // ユーザー名を取得

    const responseMessage = `${userName}さんが${formattedDate}に入室しました。ウェルカム！`;

    if (message.channel.isTextBased() && "send" in message.channel) {
      message.channel.send(responseMessage);
    } else {
      console.error("This channel does not support sending messages.");
    }
  }
});

client.on("messageCreate", async (message: Message) => {
  if (message.author.bot) return;

  if (message.content === "out") {
    const date1 = new Date();
    const formattedDate = date1.toLocaleString(); // 日時を文字列に変換
    const userName = message.author.username; // ユーザー名を取得

    const responseMessage = `${userName}さんが${formattedDate}に退室しました。またね！`;

    if (message.channel.isTextBased() && "send" in message.channel) {
      message.channel.send(responseMessage);
    } else {
      console.error("This channel does not support sending messages.");
    }
  }
});

//ボット作成時のトークンでDiscordと接続
client.login(process.env.TOKEN);
