// from math import *
// from serial import *
// from threaded import *
// from logging import *
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    
    TurnLoggingOnOff = !TurnLoggingOnOff
})
let current_WindDirection_List = ""
let current_WindSpeed = 0
let tempC = 0
let TurnLoggingOnOff = true
let szLine = ""
// serial.redirect_to_usb()
serial.redirect(SerialPin.P15, SerialPin.P14, BaudRate.BaudRate115200)
weatherbit.startWindMonitoring()
weatherbit.startWeatherMonitoring()
TurnLoggingOnOff = false
/** Note: If "???" is displayed, direction is unknown! */
let doLog = false
let iCount = 0
function on_forever() {
    let doLog: boolean;
    let iCount: number;
    let StempC: number;
    let humid: number;
    let pressure: number;
    
    
    //  -------- wind --------
    current_WindSpeed = weatherbit.windSpeed() * 3600 / 1000
    if (current_WindSpeed > 0.5) {
        doLog = true
    } else if (iCount < 20) {
        iCount = iCount + 1
    } else {
        doLog = false
    }
    
    if (TurnLoggingOnOff == true) {
        doLog = false
    }
    
    if (doLog) {
        basic.showLeds(`
            . . . . .
                        . . . . #
                        . . . # .
                        # . # . .
                        . # . . .
        `)
        current_WindDirection_List = weatherbit.windDirection()
        //  -------- temperature --------
        StempC = weatherbit.soilTemperature() / 100
        tempC = weatherbit.temperature() / 100
        //  -------- humidity --------
        humid = weatherbit.humidity() / 1024
        //  -------- pressure --------
        pressure = weatherbit.pressure() / 25600
        szLine = current_WindSpeed + "," + current_WindSpeed + "," + current_WindDirection_List + "," + StempC + "," + tempC + "," + humid + "," + pressure
        datalogger.log(datalogger.createCV("ws", current_WindSpeed), datalogger.createCV("wd", current_WindDirection_List), datalogger.createCV("stc", StempC), datalogger.createCV("tc", tempC), datalogger.createCV("hmd", humid), datalogger.createCV("prs", pressure))
        serial.writeLine(szLine)
    } else {
        basic.showLeds(`
            # . . . #
                        . # . # .
                        . . # . .
                        . # . # .
                        # . . . #
        `)
    }
    
    basic.pause(5000)
}

while (true) {
    on_forever()
}
