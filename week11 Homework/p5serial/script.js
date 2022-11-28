// Creative Coding Homework 11
// 11/27/2022
// Yingying He

let serial;                             // variable to hold an instance of the serialport library
let portName = '/dev/tty.usbmodem1101';  
let inData;                             // for incoming serial data
let portSelector;

let dataMode;
let buttonData;
let potentiometerData;


function setup() {
  createCanvas(600, 600);
  serial = new p5.SerialPort();       // make a new instance of the serialport library
  serial.on('list', printList);       // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen);        // callback for the port opening
  serial.on('data', serialEvent);     // callback for when new data arrives
  serial.on('error', serialError);    // callback for errors
  serial.on('close', portClose);      // callback for the port closing

  serial.list();                      // list the serial ports
  // serial.openPort(portName);              // open a serial port
}

function draw() {
  background(225);
  //draw the background of the mood metor
  //red rect
  fill(220,0,0);
  noStroke();
  rect(0,0,300);
  
  //yellow rec
  fill(255,204,0);
  rect(300,0,300);
  
  //blue rec
  fill(0,0,220);
  rect(0,300,300);
  
  //green rec
  fill(0,220,0);
  rect(300,300,300);
  fill(255);

  // display the incoming serial data as a string:
  // text("sensor value: " + inData, 30, 50);
  // text("pot data:" + potentiometerData, 30, 90)
  // text("buttonData: " + buttonData, 30, 150)

  
  fill(255)
  if (buttonData == 0) {
   ellipse(300 - potentiometerData * 0.8, 300,80 );
   ellipse(300 + potentiometerData * 0.8,300,80);
   ellipse(300,300 - potentiometerData * 0.8,80);
   ellipse(300, 300 + potentiometerData * 0.8,80);
  
  } else {
    fill(255)
    ellipse(300,300,80) //use it as a reset function to put all the circles back in its place.
  }
  
}

// make a serial port selector object:
function printList(portList) {
  // create a select object:
  portSelector = createSelect();
  portSelector.position(10, 10);
  // portList is an array of serial port names
  for (var i = 0; i < portList.length; i++) {
    // add this port name to the select object:
    portSelector.option(portList[i]);
  }
  // set an event listener for when the port is changed:
  portSelector.changed(mySelectEvent);
}

function mySelectEvent() {
  let item = portSelector.value();
  // if there's a port open, close it:
  if (serial.serialport != null) {
    serial.close();
  }
  // open the new port:
  serial.openPort(item);
}

function serverConnected() {
  console.log('connected to server.');
}

function portOpen() {
  console.log('the serial port opened.')
}

function serialEvent() {
  // read a byte from the serial port, convert it to a number:
  let inString = serial.readLine();

  if(inString.length <= 0) return;

  if (inString === "potentiometer") {
    dataMode = "potentiometer"
  } else if(inString === "button") {
    dataMode = "button"
  } else if(dataMode === "potentiometer") {
    potentiometerData = inString
  } else if (dataMode === "button") {
    buttonData = inString
  }

  inData = inString
}

const softCopy = (i) => i

function serialError(err) {
  console.log('Something went wrong with the serial port. ' + err);
}

function portClose() {
  console.log('The serial port closed.');
}