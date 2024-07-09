let stock;
let avgVolume, avgClose;

const express = require('express');
const app = express();
const BreezeConnect = require('breezeconnect').BreezeConnect;

let data;

// Replace with your actual credentials
const appKey = "-";
const appSecret = "-";
const sessionKey = "-";

app.get("/", (req, res) => {
    res.send("Average traded volume is "+ avgVolume + "\n" + "Average close price of equity is:" + avgClose);
});

app.listen(1234, () => {
    console.log("Server is working on port 1234");
});

var breeze = new BreezeConnect({ "appKey": appKey });

// Generate Session
breeze.generateSession(appSecret, sessionKey).then(function(resp) {
    console.log("Session generated successfully");
    apiCalls();
}).catch(function(err) {
    console.error("Error generating session:", err);
});

function apiCalls() {
    breeze.getHistoricalData({
        interval: "1day", // '1minute', '5minute', '30minute', '1day'
        fromDate: "2024-06-15T07:00:00.000Z",
        toDate: "2024-07-09T07:00:00.000Z",
        stockCode: "ITC",
        exchangeCode: "NSE", // 'NSE', 'BSE', 'NFO'
        productType: "cash"
    }).then(function(resp) {
        stock = resp;
        let sumVolume = 0;
        let sumClose = 0;
        
        for (let i = 0; i < stock.Success.length; i++) {
            // Convert volume to a number if it's a string
            let volume = parseFloat(stock.Success[i].volume);
            sumVolume += volume;
            let close = parseFloat(stock.Success[i].close);
            sumClose += close;
        }
        avgVolume = sumVolume/stock.Success.length;
        avgClose = sumClose/stock.Success.length;
        console.log(stock.Success[0]);
    }).catch(function(err) {
        console.error("Error fetching historical data:", err);
    });
}
