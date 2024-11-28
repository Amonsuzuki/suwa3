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
function appendToSheet(userName, Time, action) {
    return __awaiter(this, void 0, void 0, function* () {
        const values = [[Time, userName, action]];
        console.log(values);
        try {
            // データをシートに追加
            yield sheets.spreadsheets.values.append({
                spreadsheetId,
                range: "シート1!A1",
                valueInputOption: "RAW",
                resource: {
                    values,
                },
            });
            console.log("データをGoogleスプレッドシートに出力しました");
        }
        catch (error) {
            console.error("エラーが発生しました:", error);
        }
    });
}
module.exports = { appendToSheet };
