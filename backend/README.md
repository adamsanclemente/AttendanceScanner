# Attendance Scanner Client (Raspberry Pi)

A Python application that runs on a Raspberry Pi with an OLED display and barcode scanner for student attendance tracking.

## Hardware Requirements

- Raspberry Pi (any model with GPIO)
- 1.47" LCD Display (ST7789 driver)
- USB Barcode Scanner
- MicroSD card (8GB+)

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/adamsanclemente/AttendanceScanner.git
   cd AttendanceScanner/backend
   ```

2. **Install Python Dependencies**

   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables**

   ```bash
   cp .env.example .env
   nano .env
   ```
  
   Fill in your values:
   - `API_BASE_URL`: URL of your deployed frontend application
   - `API_KEY`: Secure API key (must match frontend configuration)
   - `DEFAULT_CLASS_ID`: Default class ID for attendance (use "anyclass" for auto-detection)

4. **Set up the startup script** (Optional)

   ```bash
   chmod +x scripts/startup.sh
   # Add to crontab or systemd for auto-start on boot
   ```

5. **Test the application**

   ```bash
   python main.py
   ```

## Usage

### Commands

- `configure_wifi` - Set up WiFi connection
- `show_ip` - Display current IP address
- `reboot` - Restart the system
- `exit` - Exit the application
- **Student ID** - Scan or enter student ID to record attendance

### Display States

- **Connected**: Shows current time and "Ready to Scan!" message
- **Disconnected**: Shows "No WiFi Connection" error
- **Scanning**: Displays student name confirmation after successful scan

## Configuration

The application uses environment variables for configuration:

- `API_BASE_URL`: Backend API endpoint
- `API_KEY`: Authentication key for API requests
- `DEFAULT_CLASS_ID`: Class to record attendance for

## Security Note

⚠️ **This project was created for educational purposes and does not follow strict security guidelines. Use at your own risk.**
