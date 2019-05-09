var template_message_their = [];
var template_message_our = [];
var idUser = Date.now().toString()
var client = null

$(document).ready(function(){
    initSocket();
 });

template_message_our = $('#template-message-our').clone().attr('id', '').removeClass('hidden');
$('#template-message-our').remove();
template_message_their = $('#template-message-their').clone().attr('id', '').removeClass('hidden');
$('#template-message-their').remove();

console.log(template_message_our)
function initSocket(){
    client = mqtt.connect('wss://test.mosquitto.org:8081');
    //const client = mqtt.connect('mqtt://test.mosquitto.org');
    
    client.on('connect', function(){
       console.log('message broker connected');
 
       client.subscribe("chat123", function (err) {
          if (err) {
             console.log(err);
          }
       });
    });
    
    client.on('message', function(topic, payload, packet){
       var message = JSON.parse(payload.toString());
 
       renderMessage(message);
    });
    
    client.on('error', function(error){
       console.log(error);
    });
 }

 function renderMessage(message){
    if(message.timestamp){
       lastRenderedTimestamp = message.timestamp;
    }
 
    if(message.fromUserId === idUser){
       if(message.type === 'text'){
          renderTextMessageOur(message);
       }
    }else{
       if(message.type === 'text'){
          renderTextMessageTheir(message);
       }
    }
 
    scrollDown();
 }

 function scrollDown(){
    if($(document).height() - window.innerHeight > 70){
       window.scrollBy(0, 100);
    }
 }
 
 function renderTextMessageOur(message){
    var timestamp = new Date(message.timestamp);
    var time = "";
 
    if(timestamp.getHours() < 10){
        time += '0';
     }
     time += timestamp.getHours() + ':';
     if(timestamp.getMinutes() < 10){
        time += '0';
     }
     time += timestamp.getMinutes();

    var html = template_message_our.clone();
    html.attr('id', message._id);
 
    html.find('.chat-message').text(message.text);
    html.find('.message-time').text(time);
 
    html.appendTo('#list-chat');
 }
 
 function renderTextMessageTheir(message){
    var timestamp = new Date(message.timestamp);
    var time = "";
 
    if(timestamp.getHours() < 10){
        time += '0';
     }
     time += timestamp.getHours() + ':';
     if(timestamp.getMinutes() < 10){
        time += '0';
     }
     time += timestamp.getMinutes();

    var html = template_message_their.clone();
    html.attr('id', message._id);
 
    html.find('.message-from').text(message.fromName);
    html.find('.chat-message').text(message.text);
    html.find('.message-time').text(time);
 
    html.appendTo('#list-chat');
 }

 function sendMessage(){
    var messageText = $('#input-message').val();
    //reset val
    $('#input-message').val('')
 
    var message = {
       fromName: "user-" + idUser,
       fromUserId: idUser,
       toUserId:"",
       idRoom: "chat123",
       mode: "group",
       type: "text",
       text: messageText,
       fileUrl: "",
        timestamp: Date.now()
    }
    
    if(client === null){
        return;
    } 
    client.publish('chat123', JSON.stringify(message))
 }

 