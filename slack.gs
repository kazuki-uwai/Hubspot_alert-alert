function doGet(){
  const token = "YOUR_TOKEN";
  const channel = "YOUR_CHANNEL";
  
  const urlFetchOption = {
    'method' : 'get',
    'headers':{
      'Authorization':'Bearer '+ token,
    },
    'payload': {'channel': channel}
  };
  
  const url = "https://slack.com/api/channels.history";
  const responce = UrlFetchApp.fetch(url,urlFetchOption);
  
  const json = responce.getContentText();
  const data = JSON.parse(json);
  
  //レスポンスから"text"を抜き出す
  let messages = data.messages;
  let text = messages[0].attachments[0].text;
  Logger.log(text);
  //正規表現でDeal ownerの項目を取得
  var dealOwner = text.split("\n")[3].replace("*Deal owner*: ", "");
  Logger.log(dealOwner); 
};
// spreadsheetのデータを参照してUserId 
function searchUserID(){
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName("Deal owner");
  
  const lastRow = sheet.getLastRow();
  const data = sheet.getRange(2, 1, lastRow, 2).getValues();
  for (i=0;i<lastRow;i++){
    if (dealOwner !== data[i][0]){
      return;
    }
    else {
      var slackID = data[i][1];
      Logger.log(slackID);
    };
  };
};


function doPost(){
 //webhookを用いてpost
  const webhookUrl = "YOUR_WEBHOOK_URL";
  
  const channel = "YOUR_CHANNEL";
  let message = "<@" + slackID + ">さん!\nHubspotの入力項目に漏れがあります！！直ちに修正してください！！";
  let jsonData = {
    "channel": "#" + channel,
    "text": message,
    "icon_emoji":":警官:"
  };
  const payload = JSON.stringify(jsonData);
  let urlFetchOption = {
    "method": "post",
    "contentType": "application/json",
    "payload": payload
  };
  UrlFetchApp.fetch(webhookUrl, urlFetchOption);
};

function doAll(){
  doGet();
  searchUserID();
  doPost();
};
