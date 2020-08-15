const LINE_MESSAGING_API = '';
const LINE_TOKEN = '';
const LINE_HEADER = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${LINE_TOKEN}`
};

const functions = require('firebase-functions');
const request = require('request-promise');
const mqtt = require('mqtt');
const options = {
    port: ,
    host: '',
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: '',
    password: '',
    keepalive: 60,
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
}
const client  = mqtt.connect('', options);

exports.LineGasBot = functions.https.onRequest((req, res) => {
 	

  if (req.body.events[0].message.type !== 'text') {
    console.log("Not Text");
    reply(req.body, 'ไม่พบสิ่งที่คุณต้องการค้นหา');

}
else{
  
const contentText = req.body.events[0].message.text;
 console.log(contentText);
switch (contentText.toLowerCase()) {
  case "status":
        client.on('connect', function () {
          client.publish('ControlVale','status', function(err) {
            if(!err){
              reply(req.body, "กำลังทำการตรวจสอบสถานะ กรุณารอสักครู่");
            }else{
              reply(req.body, "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
            }
            console.log("Message is published");
            client.end(); // Close the connection when published
          });

        });

        break;

        case "สถานะการณ์":
          client.on('connect', function () {
            client.publish('ControlVale','status', function(err) {
              if(!err){
                reply(req.body, "กำลังทำการตรวจสอบสถานะ กรุณารอสักครู่");
              }else{
                  reply(req.body, "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
              }
              console.log("Message is published");
             client.end(); // Close the connection when published
            });
  
          });
  
          break;
        
    case "openvalve":
        client.on('connect', function () {
          client.publish('ControlVale','ON', function(err) {
            if(!err){
                openValve(req.body);
            }else{
                reply(req.body, "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
            }
            console.log("Message is published");
           client.end(); // Close the connection when published
          });
        });
        break;

        case "เปิดวาวล์":
          client.on('connect', function () {
            client.publish('ControlVale','ON', function(err) {
              if(!err){
                  openValve(req.body);
              }else{
                  reply(req.body, "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
              }
              console.log("Message is published");
              client.end(); // Close the connection when published
            });
          });
          break;

    case "closevalve":
      client.on('connect', function () {
        client.publish('ControlVale', 'OFF', function(err) {
          if(!err){
            closeValve(req.body);
          }else{
              reply(req.body, "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
          }
          console.log("Message is published");
         client.end()
  
        });
      });
  
        
        break;

        case "ปิดวาวล์":
          client.on('connect', function () {
            client.publish('ControlVale', 'OFF', function(err) {
              if(!err){
                closeValve(req.body);
              }else{
                  reply(req.body, "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
              }
              console.log("Message is published");
             client.end()
      
            });
          });
      
            
            break;
    

    case "manual":
      	reply(req.body, "คู่มือการใช้\nสั่งเปิดวาวล์ => openvalve , เปิดวาวล์\nสั่งปิดวาวล์ => closevalve,ปิดวาวล์ \nสั่งตรวจสอบสถานะการณ์ => status,สถานะการณ์\n***รับคำสั่งด้วยตัวอักษรพิมพ์เล็ก,พิมพ์ใหญ่หรือผสมได้");
        console.log("reply:manual");
    	break;
        
    case "คู่มือการใช้":
     reply(req.body, "คู่มือการใช้\nสั่งเปิดวาวล์ => openvalve , เปิดวาวล์\nสั่งปิดวาวล์ => closevalve,ปิดวาวล์ \nสั่งตรวจสอบสถานะการณ์ => status,สถานะการณ์\n***รับคำสั่งด้วยตัวอักษรพิมพ์เล็ก,พิมพ์ใหญ่หรือผสมได้");
    console.log("reply:manual");  
    break;

    default:
        reply(req.body, "ไม่มีคำสั่งที่กำหนดไว้");
     	console.log("reply:Not command");  
}
}
});



function openValve (bodyResponse)  {
  reply(bodyResponse, 'กำลังทำการเปิดวาวล์ กรุณารอสักครู่')
}

function closeValve (bodyResponse)  {
  reply(bodyResponse, 'กำลังทำการปิดวาวล์ กรุณารอสักครู่')
}

function reply (bodyResponse,msg)  {
  return request({
    method: `POST`,
    uri: `${LINE_MESSAGING_API}/reply`,
    headers: LINE_HEADER,
    body: JSON.stringify({
      replyToken: bodyResponse.events[0].replyToken,
      messages: [
        {
          type: `text`,
          text: msg
        }
	  ]
    })
  });
};

