#!/usr/bin/python
# -*- coding: UTF-8 -*-
#import chardet
import os
import sys 
import time
import subprocess
import threading
import spidev as SPI
sys.path.append("..")
from lib import LCD_1inch47
from PIL import Image,ImageDraw,ImageFont
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration from environment variables
API_BASE_URL = os.getenv('API_BASE_URL', 'https://attendance.adamsc.xyz')
API_KEY = os.getenv('API_KEY', '')
DEFAULT_CLASS_ID = os.getenv('DEFAULT_CLASS_ID', 'anyclass')

if not API_KEY:
    print("ERROR: API_KEY environment variable is required!")
    sys.exit(1)

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

# Function to print messages on the screen
def print_message(message, position, duration=5, font=font):
    image = Image.new("RGB", (lcd.width, lcd.height), "BLACK")
    draw = ImageDraw.Draw(image)
    text = message
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_width, text_height = text_bbox[2], text_bbox[3]
    
    if position == "center":
        x = (lcd.width - text_height) // 2
        y = (lcd.height - text_width) // 2
    elif position == "top":
        x = 10
        y = text_width // 2
    elif position == "bottom":
        x = 40
        y = lcd.height - text_width // 2
    else:
        x = (lcd.width - text_height) // 2
        y = (lcd.height - text_width) // 2
        
    text_image = Image.new('RGB', (text_width, text_height), 'BLACK')
    text_draw = ImageDraw.Draw(text_image)
    text_draw.text((0, 0), text, font=font, fill="WHITE")
    rotated = text_image.rotate(90, expand=1)
    image.paste(rotated, (x, y))
    lcd.ShowImage(image)
    
    # Wait, then clear the display
    time.sleep(duration)
    
    # If duration is 0, don't clear the display
    if duration != 0:
        lcd.clear()
    

# Default Command Handler
def handle_input():
    global user_input
    try:
        user_input = input("Enter Command or Student ID: ")
    except KeyboardInterrupt:
        print("\nShutting down scanner...")
        lcd.clear()
        sys.exit(0)
    except Exception as e:
        print(f"Input error: {e}")
        user_input = None

# Wifi Configuration Handler
def handle_wifi_input():
    global wifi_ssid
    global wifi_password
    # Display prompt on the LCD
    print_message("Enter WiFi SSID:", "center", duration=0, font=font)
    wifi_ssid = input("Enter WiFi SSID: ")
    
    # Display prompt on the LCD
    print_message("Enter WiFi Password:", "center", duration=0, font=font)
    wifi_password = input("Enter WiFi Password: ")
    
    # Connect to the WiFi network
    subprocess.call(f"sudo nmcli device wifi connect {wifi_ssid} password {wifi_password}", shell=True)
    
# IP Display Handler
def handle_ip_display():
    # Get the IP address
    ip_address = subprocess.check_output("hostname -I | cut -d' ' -f1", shell=True).decode("utf-8").strip()
    
    # Display the IP address on the LCD
    print_message(f"IP Address: {ip_address}", "center", duration=10, font=smfont)
input_thread = threading.Thread(target=handle_input)
input_thread.start()


while True:
    # Create a new image with black background
    image = Image.new("RGB", (lcd.width, lcd.height), "BLACK")
    draw = ImageDraw.Draw(image)

    # Check if WiFi is connected
    wifi_status = subprocess.call("ping -c 1 google.com > /dev/null 2>&1", shell=True) == 0

    if wifi_status:
        # Get the current time in 12-hour format
        current_time = time.strftime("%I:%M:%S %p")

        # Get the size of the text
        text_bbox = draw.textbbox((0, 0), current_time, font=font)
        text_width, text_height = text_bbox[2], text_bbox[3]

        y = (lcd.height - text_width) // 2  # This is actually the x-coordinate in landscape mode
        x = 10 # This is actually the y-coordinate in landscape mode

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
        text_bbox = draw.textbbox((0, 0), error_message, font=smfont)
        text_width, text_height = text_bbox[2], text_bbox[3]

        x = 10
        y = (lcd.height - text_width) // 2

        # Rotate the text and draw it centered
        text_image = Image.new('RGB', (text_width, text_height), 'BLACK')
        text_draw = ImageDraw.Draw(text_image)
        text_draw.text((0, 0), error_message, font=smfont, fill="WHITE")
        rotated = text_image.rotate(90, expand=1)
        image.paste(rotated, (x, y))
    
    # Check Server Connection

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
        elif user_input == 'exit':
            lcd.clear()
            break
        elif user_input == 'X0034LPXZP':
            # Clear the display
            lcd.clear()
            
            # Display test scan message
            test_message = "Test Scan Successful"
            print_message(test_message, "center", duration=5, font=font)

        # Handle Student ID Inputs
        else:
            try:
                # Make a request to the server
                print(f"Recording attendance for ID: {user_input}")
                response = requests.post(
                    f"{API_BASE_URL}/api/record?studentId={user_input}&apikey={API_KEY}&classId={DEFAULT_CLASS_ID}",
                    timeout=10
                )
                
                # Check if the request was successful
                if response.status_code == 200:
                    # Clear the display
                    lcd.clear()
                    
                    # Check type of response
                    response_data = response.json()
                    if response_data["status"] == "error":
                        # Display an error message
                        error_message = response_data["message"]
                        print(f"Server error: {error_message}")
                        print_message(error_message, "center", duration=5, font=font)
                        continue
                    
                    # Display the student's name
                    student_name = response_data["studentName"]
                    record_status = response_data.get("recordstatus", "PRESENT")
                    print(f"Success: {student_name} - {record_status}")
                    print_message(f"{student_name}\n{record_status}", "center", duration=5, font=font)
                else:
                    # Display an error message
                    error_message = f"Server Error ({response.status_code})\nPlease try again"
                    print(f"HTTP Error {response.status_code}: {response.text}")
                    print_message(error_message, "center", duration=5, font=font)
                    
            except requests.exceptions.Timeout:
                error_message = "Request Timeout\nCheck connection"
                print("Request timeout - check network connection")
                print_message(error_message, "center", duration=5, font=font)
            except requests.exceptions.ConnectionError:
                error_message = "Connection Error\nCheck network"
                print("Connection error - check network and server")
                print_message(error_message, "center", duration=5, font=font)
            except requests.exceptions.RequestException as e:
                error_message = "Network Error\nPlease try again"
                print(f"Network error: {e}")
                print_message(error_message, "center", duration=5, font=font)
            except Exception as e:
                error_message = "Unexpected Error\nCheck logs"
                print(f"Unexpected error: {e}")
                print_message(error_message, "center", duration=5, font=font)
           
        user_input = None

        # Start a new input thread
        input_thread = threading.Thread(target=handle_input)
        input_thread.start()
