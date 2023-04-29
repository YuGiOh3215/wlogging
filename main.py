import weatherbit
#from math import *
#from serial import *

from tkinter import *
#from threaded import *
from time import *
#from logging import *



def on_button_pressed_a():
    global TurnLoggingOnOff
    TurnLoggingOnOff = not (TurnLoggingOnOff)
input.on_button_pressed(Button.A, on_button_pressed_a)

current_WindDirection_List = ""
current_WindSpeed = 0
tempC = 0
TurnLoggingOnOff = False
szLine = ""

#serial.redirect_to_usb()
serial.redirect(SerialPin.P15, SerialPin.P14, BaudRate.BAUD_RATE115200)
weatherbit.start_wind_monitoring()
weatherbit.start_weather_monitoring()
TurnLoggingOnOff = True
"""

Note: If "???" is displayed, direction is unknown!

"""
doLog = False
iCount = 0

def on_forever():
    global current_WindSpeed, current_WindDirection_List
    global tempC, szLine

    # -------- wind --------
    current_WindSpeed = weatherbit.wind_speed() * 3600 / 1000

    if (current_WindSpeed > 5.0):
        doLog = True
    elif (iCount < 20):
        iCount = iCount + 1
    else:
        doLog = False
    
    if TurnLoggingOnOff == True:
        doLog = False
     
    if doLog:
        basic.show_leds("""
            . . . . .
                        . . . . #
                        . . . # .
                        # . # . .
                        . # . . .
        """)
    
    
        current_WindDirection_List = weatherbit.wind_direction()

        # -------- temperature --------
        StempC = (weatherbit.soil_temperature() / 100)
        tempC = (weatherbit.temperature()/ 100)
        # -------- humidity --------

        humid = (weatherbit.humidity()/ 1024)
        # -------- pressure --------
        pressure = (weatherbit.pressure()/ 25600)
            
        szLine = current_WindSpeed + ',' + \
            current_WindSpeed + ',' + \
            current_WindDirection_List + ',' + \
            StempC + ',' + \
            tempC + ',' + \
            humid + ',' + \
            pressure

        datalogger.log(
            datalogger.create_cv("ws", current_WindSpeed),
            datalogger.create_cv('wd', current_WindDirection_List),
            datalogger.create_cv('stc', StempC),
            datalogger.create_cv('tc', tempC),
            datalogger.create_cv('hmd' , humid),
            datalogger.create_cv('prs' , pressure))

        serial.write_line(szLine)
    else:
        basic.show_leds("""
            # . . . #
                        . # . # .
                        . . # . .
                        . # . # .
                        # . . . #
        """)
        
    basic.pause(5000)
    
while True:
    on_forever()
