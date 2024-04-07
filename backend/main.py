#!/usr/bin/python
# -*- coding: UTF-8 -*-
#import chardet
import os
import sys 
import time
import logging
import subprocess
import threading
import spidev as SPI
sys.path.append("..")
from lib import LCD_1inch47
from PIL import Image,ImageDraw,ImageFont
import requests

# Raspberry Pi pin configuration
RST = 27
DC = 25
BL = 18
bus = 0 
device = 0
user_input = None

# Initialize the LCD
lcd = LCD_1inch47.LCD_1inch47()
lcd.Init()
lcd.clear()
lcd.bl_DutyCycle(50)

# Set up the font
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 24)

smfont = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 16)

# Default Command Handler
def handle_input():
    global user_input
    user_input = input("Enter Command or Student ID: ")

# Wifi Configuration Handler
def handle_wifi_input():
    global wifi_ssid
    global wifi_password
    # Display prompt on the LCD
    image = Image.new("RGB", (lcd.width, lcd.height), "BLACK")
    draw = ImageDraw.Draw(image)
    prompt = "Enter WiFi SSID:"
    text_bbox = draw.textbbox((0, 0), prompt, font=font)
    text_width, text_height = text_bbox[2], text_bbox[3]
    x = 10
    y = (lcd.height - text_width) // 2
    text_image = Image.new('RGB', (text_width, text_height), 'BLACK')
    text_draw = ImageDraw.Draw(text_image)
    text_draw.text((0, 0), prompt, font=font, fill="WHITE")
    rotated = text_image.rotate(90, expand=1)
    image.paste(rotated, (x, y))
    lcd.ShowImage(image)
    wifi_ssid = input("Enter WiFi SSID: ")
    
    #Display prompt on the LCD
    image = Image.new("RGB", (lcd.width, lcd.height), "BLACK")
    draw = ImageDraw.Draw(image)
    prompt = "Enter WiFi Password:"
    text_bbox = draw.textbbox((0, 0), prompt, font=font)
    text_width, text_height = text_bbox[2], text_bbox[3]
    x = 10
    y = (lcd.height - text_width) // 2
    text_image = Image.new('RGB', (text_width, text_height), 'BLACK')
    text_draw = ImageDraw.Draw(text_image)
    text_draw.text((0, 0), prompt, font=font, fill="WHITE")
    rotated = text_image.rotate(90, expand=1)
    image.paste(rotated, (x, y))
    lcd.ShowImage(image)
    wifi_password = input("Enter WiFi Password: ")
    
    # Connect to the WiFi network
    subprocess.call(f"nmcli device wifi connect {wifi_ssid} password {wifi_password}", shell=True)
    
# IP Display Handler
def handle_ip_display():
    # Get the IP address
    ip_address = subprocess.check_output("hostname -I | cut -d' ' -f1", shell=True).decode("utf-8").strip()
    
    # Display the IP address on the LCD
    image = Image.new("RGB", (lcd.width, lcd.height), "BLACK")
    draw = ImageDraw.Draw(image)
    text = f"IP Address: {ip_address}"
    text_bbox = draw.textbbox((0, 0), text, font=smfont)
    text_width, text_height = text_bbox[2], text_bbox[3]
    x = (lcd.width - text_height) // 2
    y = (lcd.height - text_width) // 2
    text_image = Image.new('RGB', (text_width, text_height), 'BLACK')
    text_draw = ImageDraw.Draw(text_image)
    text_draw.text((0, 0), text, font=smfont, fill="WHITE")
    rotated = text_image.rotate(90, expand=1)
    image.paste(rotated, (x, y))
    lcd.ShowImage(image)
    
    # Wait for 10 seconds
    time.sleep(10)
    
    # Clear the display
    lcd.clear()

# Begin the input thread
input_thread = threading.Thread(target=handle_input)
input_thread.start()


while True:
    # Create a new image with white background
    image = Image.new("RGB", (lcd.width, lcd.height), "BLACK")
    draw = ImageDraw.Draw(image)

    # Check if WiFi is connected
    wifi_status = subprocess.call("ping -c 1 google.com > /dev/null 2>&1", shell=True) == 0
    
    # Check if Server is online from custom API
    try:
        response = requests.get("https://attendance.adamsc.xyz/api/status")
        server_status = response.status_code == 200
    except requests.exceptions.RequestException:
        server_status = False

    if wifi_status:
        # Get the current time in 12-hour format
        current_time = time.strftime("%I:%M:%S %p")

        # Get the size of the text
        text_bbox = draw.textbbox((0, 0), current_time, font=font)
        text_width, text_height = text_bbox[2], text_bbox[3]

        y = (lcd.height - text_width) // 2  # This is actually the x-coordinate in landscape mode
        x = 10# This is actually the y-coordinate in landscape mode

        # Rotate the text and draw it centered
        text_image = Image.new('RGB', (text_width, text_height), 'BLACK')
        text_draw = ImageDraw.Draw(text_image)
        text_draw.text((0, 0), current_time, font=font, fill="WHITE")
        rotated = text_image.rotate(90, expand=1)
        image.paste(rotated, (x, y))

        # Add text below that says "Ready to Scan!"
        ready_text = "Ready to Scan!"
        ready_bbox = draw.textbbox((0, 0), ready_text, font=font)
        ready_width, ready_height = ready_bbox[2], ready_bbox[3]
        ready_y = (lcd.height - ready_width) // 2  # This is actually the x-coordinate in landscape mode
        ready_x = x + text_height + 30  # 10 pixels below the current time, this is actually the y-coordinate in landscape mode

        # Rotate the text and draw it centered
        ready_image = Image.new('RGB', (ready_width, ready_height), 'BLACK')
        ready_draw = ImageDraw.Draw(ready_image)
        ready_draw.text((0, 0), ready_text, font=font, fill="WHITE")
        rotated_ready = ready_image.rotate(90, expand=1)
        image.paste(rotated_ready, (ready_x, ready_y))
    else:
        # Display error message
        error_message = "No WiFi Connection\nCheck your network settings"
        text_bbox = draw.textbbox((0, 0), error_message, font=font)
        text_width, text_height = text_bbox[2], text_bbox[3]

        x = 10
        y = (lcd.height - text_width) // 2

        # Rotate the text and draw it centered
        text_image = Image.new('RGB', (text_width, text_height), 'BLACK')
        text_draw = ImageDraw.Draw(text_image)
        text_draw.text((0, 0), error_message, font=font, fill="WHITE")
        rotated = text_image.rotate(90, expand=1)
        image.paste(rotated, (x, y))
    
    # Check Server Connection // Disabled for DEV
    # if not server_status:
    #     error_message = "Server is offline\nPlease try again later"
    #     text_bbox = draw.textbbox((0, 0), error_message, font=font)
    #     text_width, text_height = text_bbox[2], text_bbox[3]

    #     x = 10
    #     y = (lcd.height - text_width) // 2

    #     # Rotate the text and draw it centered
    #     text_image = Image.new('RGB', (text_width, text_height), 'BLACK')
    #     text_draw = ImageDraw.Draw(text_image)
    #     text_draw.text((0, 0), error_message, font=font, fill="WHITE")
    #     rotated = text_image.rotate(90, expand=1)
    #     image.paste(rotated, (x, y))

    # Display the image on the LCD
    lcd.ShowImage(image)

    # Wait for a second
    time.sleep(1)
    
    # Check if user has entered something
    if user_input is not None:
        print("User entered:", user_input)
        if user_input == 'configure_wifi':
            handle_wifi_input()
        elif user_input == 'reboot':
            subprocess.call("sudo reboot", shell=True)
        elif user_input == 'show_ip':
            handle_ip_display()
            
        user_input = None

        # Start a new input thread
        input_thread = threading.Thread(target=handle_input)
        input_thread.start()