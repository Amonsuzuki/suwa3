//必要なパッケージをインポートする
import { GatewayIntentBits, Client, Partials, Message } from "discord.js";
import dotenv from "dotenv";
import http from "http";

const PORT = process.env.PORT || "3000";

const server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Server is running\n");
  }
);

server.listen(PORT, () => {
  console.log(`Server is runnninfg om port ${PORT}`);
});

//.envファイルを読み込む
dotenv.config();

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
