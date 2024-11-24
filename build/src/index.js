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
function validateRow(row) {
    // 各セルが文字列であることを確認
    return row.every((cell) => typeof cell === "string" && cell.trim() !== "");
}
function appendToSheet(userName, Time, action) {
    return __awaiter(this, void 0, void 0, function* () {
        const newRow = [[Time, userName, action]];
        console.log(newRow);
        try {
            const getResponse = yield sheets.spreadsheets.values.get({
                spreadsheetId,
                range: "シート1",
            });
            const existingRows = getResponse.data.values || [];
            console.log(existingRows);
            const numROws = existingRows.length;
            const range = `シート1!A${numROws + 1}`;
            const updatedRows = [newRow, ...existingRows];
            if (!validateRow(updatedRows)) {
                throw new Error("新しいデータの形式が不正です");
            }
            // データをシートに追加
            yield sheets.spreadsheets.values.update({
                spreadsheetId,
                range: range,
                valueInputOption: "RAW",
                resource: {
                    values: updatedRows,
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
