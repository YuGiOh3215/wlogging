// from math import *
// from serial import *
// from threaded import *
// from logging import *
function showLoggingLED() {
    basic.showLeds(`
        . . . . .
        . . . . #
        . . . # .
        # . # . .
        . # . . .
    `)
}

function showNotLoggingLED() {
    basic.showLeds(`
        # . . . #
        . # . # .
        . . # . .
        . # . # .
        # . . . #
    `)
}

function showWindLevel() {
    
    if (i == 0) {
        basic.showLeds(`
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            # # # # #
            `)
    } else if (i == 1) {
        basic.showLeds(`
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            . . # . .
            `)
    } else if (i == 2) {
        basic.showLeds(`
            . . . . .
            . . . . .
            . . . . .
            . . # . .
            . . # . .
            `)
    } else if (i == 3) {
        basic.showLeds(`
            . . . . .
            . . . . .
            . . # . .
            . . # . .
            . . # . .
            `)
    } else if (i == 4) {
        basic.showLeds(`
            . . . . .
            . . # . .
            . . # . .
            . . # . .
            . . # . .
            `)
    } else if (i == 5) {
        basic.showLeds(`
            . . # . .
            . . # . .
            . . # . .
            . . # . .
            . . # . .
            `)
    }
    
}

datalogger.onLogFull(function on_log_full() {
    
    TurnLoggingOnOff = true
    basic.showIcon(IconNames.Skull)
})
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    
    TurnLoggingOnOff = !TurnLoggingOnOff
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    
    if (i == listWindSpeed.length - 1) {
        i = 0
    } else {
        i = i + 1
    }
    
    minWindSpeed = listWindSpeed[i]
})
input.onButtonPressed(Button.AB, function on_button_pressed_ab() {
    
    if (input.logoIsPressed()) {
        basic.showIcon(IconNames.No)
        datalogger.deleteLog()
        TurnLoggingOnOff = true
        datalogger.setColumnTitles("wd", "wd", "stc", "tc", "hmd", "prs")
    }
    
})
let listWindSpeed = [5, 10, 20, 30, 40, 50]
let i = 0
let current_WindDirection_List = ""
let current_WindSpeed = 0
let tempC = 0
let TurnLoggingOnOff = true
let szLine = ""
let doLog = false
let iCount = 0
let idefaultLogInterv = 5000
let iHighLogInterv = 1000
let minWindSpeed = listWindSpeed[i]
let iLogInterval = idefaultLogInterv
// serial.redirect_to_usb()
serial.redirect(SerialPin.P15, SerialPin.P14, BaudRate.BaudRate9600)
weatherbit.startWindMonitoring()
weatherbit.startWeatherMonitoring()
datalogger.setColumnTitles("wd", "wd", "tc", "hmd", "prs")
TurnLoggingOnOff = false
/** Note: If "???" is displayed, direction is unknown! */
function on_forever() {
    let doLog: boolean;
    let iCount: number;
    let humid: number;
    let pressure: number;
    
    
    //  -------- wind --------
    current_WindSpeed = weatherbit.windSpeed() * 3600 / 1000
    if (current_WindSpeed > minWindSpeed) {
        doLog = true
        iLogInterval = iHighLogInterv
    } else if (iCount < 20) {
        iCount = iCount + 1
    } else {
        doLog = false
        iLogInterval = idefaultLogInterv
    }
    
    if (TurnLoggingOnOff == true) {
        doLog = false
        iLogInterval = idefaultLogInterv
    }
    
    if (doLog) {
        showLoggingLED()
        current_WindDirection_List = weatherbit.windDirection()
        //  -------- temperature --------
        tempC = weatherbit.temperature() / 100
        //  -------- humidity --------
        humid = weatherbit.humidity() / 1024
        //  -------- pressure --------
        pressure = weatherbit.pressure() / 25600
        szLine = current_WindSpeed + "," + current_WindSpeed + "," + current_WindDirection_List + "," + tempC + "," + humid + "," + pressure
        datalogger.log(datalogger.createCV("ws", current_WindSpeed), datalogger.createCV("wd", current_WindDirection_List), datalogger.createCV("tc", tempC), datalogger.createCV("hmd", humid), datalogger.createCV("prs", pressure))
        serial.writeLine(szLine)
    } else {
        showNotLoggingLED()
    }
    
    basic.pause(iLogInterval)
}

while (true) {
    on_forever()
}
