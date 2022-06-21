// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: green;

/* --------------------------------------------------------------
Script: uptime-robot-widget.js
Author: michaelschort
Version: 1.0.0
Description:
Displays the current status of your Monitors based on the data of Uptimerobot API v2.
Changelog:
1.0.0: Initialization
-------------------------------------------------------------- */

// Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
// INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER
// IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE
// OF THIS SOFTWARE.

let apikey = "your-read-only-api-key";
//Go to 'My Settings' in your Uptime-Robot account and copy your API key.
//Use the Read-Only API key to access the Uptime-Robot API.
//You can find your API key in your Uptime-Robot account at https://uptimerobot.com/dashboard#mySettings.


let param = args.widgetParameter
if (param != null && param.length > 0) {
    apikey = param
}

const url = `https://api.uptimerobot.com/v2/getMonitors?api_key=${apikey}&format=json`
const req = new Request(url)
    req.method = 'post'
const res = await req.loadJSON()


/*
status:
2 = Online
9 = Offline
0 = Paused
*/
const isUp = res.monitors.filter(e=>e.status===2);

const isDown = res.monitors.filter(e=>e.status===9);

const isPaused = res.monitors.filter(e=>e.status===0);

const allMonitors = res.monitors.length;
const allUnpausedMonitors = res.monitors.length - isPaused.length;



var message = 'oops!';
var detail = 'something went wrong';
var color = "#bfbfbf";
var symbol = '❔';

/*
green #25c450
red #ff1f1f
grey #bfbfbf
darkblue #1c315c
*/



//no connection to API
if (res.stat != 'ok') {
    message = 'no connection to API';
    detail = 'Please check your internet connection and try again.';
    color = "#bfbfbf";
    symbol = '🔄';
}
//all Monitors Up
if ((isDown.length === 0)&&(isUp.length > 0)) {
    message = 'everything is up';
    detail = ((isUp.length>1)?`All ${isUp.length} monitors are OK!`:`${isUp[0].friendly_name} is OK!`);
    color = "#25c450";
    symbol = '✅';
}
//only Paused monitors
if (isPaused.length == allMonitors) {
    message = 'all monitors paused';
    detail = 'Activate some monitors';
    color = "#bfbfbf";
    symbol = '⏸';
}
//one Monitor Down
if (isDown.length > 0) {
    message  = `1 of ${isUp.length + 1} is down`;
    detail = `${isDown[0].friendly_name} is down`;
    color = "#ff1f1f";
    symbol = '🛑';
}
//more than one Monitor Down
if (isDown.length > 1) {
    message = `${isDown.length} Monitors are down`;
    detail = `${isDown[0].friendly_name} and ${isDown.length - 1} other`;
    color = "#ff1f1f";
    symbol = '🛑';
}
//no Monitors setUp
if (allMonitors.length === 0) {
    message = 'no Monitors setUp';
    detail = 'Set some monitors and get notified';
    color = "#bfbfbf";
    symbol = '🤷';
}




let widget = createWidget(message, detail, color, symbol)
if (config.runsInWidget) {
  // create and show widget
  Script.setWidget(widget)
  Script.complete()
}
else {
  widget.presentSmall()
}


// Assemble widget layout 
function createWidget(message, detail, color) {
    let w = new ListWidget()
    w.backgroundColor = new Color("#1c315c")
  
  
    w.addSpacer(8)
  
    let messageText = w.addText(message)
    messageText.textColor = new Color(color)
    messageText.font = Font.boldSystemFont(18)
    messageText.centerAlignText()
  
    w.addSpacer(8)

    let symbolText = w.addText(symbol)
    symbolText.font = Font.systemFont(24)
    symbolText.centerAlignText()

    w.addSpacer(8)
  
    let detailText = w.addText(detail)
    detailText.textColor = Color.white()
    detailText.font = Font.systemFont(16)
    detailText.centerAlignText()
  
  
    w.addSpacer(8)
  
  
    w.setPadding(0, 0, 0, 0)
    return w
  }