import weatherbit
#from math import *
#from serial import *

from tkinter import *
#from threaded import *
from time import *
#from logging import *

def on_log_full():
    global TurnLoggingOnOff
    TurnLoggingOnOff = True
    basic.show_icon(IconNames.SKULL)
datalogger.on_log_full(on_log_full)

def on_button_pressed_a():
    global TurnLoggingOnOff
    TurnLoggingOnOff = not (TurnLoggingOnOff)
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_button_pressed_ab():
    global TurnLoggingOnOff
    if input.logo_is_pressed():
        basic.show_icon(IconNames.NO)
        datalogger.delete_log()
        TurnLoggingOnOff = True
        datalogger.set_column_titles("wd", 'wd','stc', 'tc', 'hmd', 'prs')
input.on_button_pressed(Button.AB, on_button_pressed_ab)
                                           
                                           
current_WindDirection_List = ""
current_WindSpeed = 0
tempC = 0
TurnLoggingOnOff = True
szLine = ""

#serial.redirect_to_usb()

serial.redirect(SerialPin.P15, SerialPin.P14, BaudRate.BAUD_RATE115200)
weatherbit.start_wind_monitoring()
weatherbit.start_weather_monitoring()
datalogger.set_column_titles("wd", 'wd','stc', 'tc', 'hmd', 'prs')
TurnLoggingOnOff = False
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

    if (current_WindSpeed > 0.5):
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
