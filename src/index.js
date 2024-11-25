const { google } = require("googleapis");
const credentials = require("../sincere-abode-441705-a4-004609ae9e2e.json"); // ダウンロードしたJSONファイル

// 認証設定
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// Google Sheets APIクライアントを作成
const sheets = google.sheets({ version: "v4", auth });

// スプレッドシートID（URLから取得）
const spreadsheetId = "1I0urZjHlNN9t7JAynZaIeAH_qyB_5SD4IsXrXxSt3i4";

async function appendToSheet(userName, Time, action) {
  const values = [[Time, userName, action]];
  console.log(values);

  try {
    // データをシートに追加
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "シート1!A1",
      valueInputOption: "RAW",
      resource: {
        values,
      },
    });
    console.log("データをGoogleスプレッドシートに出力しました");
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
}

module.exports = { appendToSheet };
