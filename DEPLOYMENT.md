# Deployment Guide

This guide covers deploying the Attendance Scanner system to production.

## Frontend Deployment (Vercel)

### Prerequisites

- Vercel account
- Vercel Postgres database (or external PostgreSQL)
- Google OAuth credentials (optional)
- AWS SES credentials (for email notifications)

### Steps

1. **Fork/Clone the repository**

   ```bash
   git clone https://github.com/adamsanclemente/AttendanceScanner.git
   ```

2. **Connect to Vercel**
   - Import project in Vercel dashboard
   - Connect to GitHub repository
   - Set root directory to `app/`

3. **Environment Variables**

   Set the following in Vercel dashboard:

   ```env
   DATABASE_URL=postgresql://username:password@host:port/database
   SCANNER_API_KEY=your-secure-random-api-key
   GOOGLE_CLIENT_ID=your-google-oauth-client-id
   GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
   FROM_EMAIL=noreply@yourdomain.com
   AWS_ACCESS_KEY_ID=your-aws-access-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret-key
   AWS_REGION=us-east-1
   ```

4. **Database Setup**

   ```bash
   # Run locally with production DB URL
   cd app
   pnpm install
   pnpm run generate
   pnpm run migrate
   ```

5. **Deploy**

   ```bash
   git push origin main
   # Vercel will automatically deploy
   ```

## Scanner Deployment (Raspberry Pi)

### Hardware Setup

1. Flash Raspberry Pi OS to SD card
2. Enable SSH and I2C in raspi-config
3. Connect 1.47" LCD display to SPI pins
4. Connect USB barcode scanner

### Software Installation

1. **System Updates**

   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install python3-pip git -y
   ```

2. **Clone and Setup**

   ```bash
   git clone https://github.com/adamsanclemente/AttendanceScanner.git
   cd AttendanceScanner/backend
   pip3 install -r requirements.txt
   ```

3. **Environment Configuration**

   ```bash
   cp .env.example .env
   nano .env
   ```

   Configure:

   ```env
   API_BASE_URL=https://your-app.vercel.app
   API_KEY=your-secure-random-api-key
   DEFAULT_CLASS_ID=anyclass
   ```

4. **Service Setup** (Auto-start on boot)

   ```bash
   sudo cp scripts/attendance-scanner.service /etc/systemd/system/
   sudo systemctl enable attendance-scanner
   sudo systemctl start attendance-scanner
   ```

### Systemd Service File

Create `/etc/systemd/system/attendance-scanner.service`:

```ini
[Unit]
Description=Attendance Scanner
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/AttendanceScanner/backend
Environment=PYTHONPATH=/home/pi/AttendanceScanner/backend
ExecStart=/usr/bin/python3 /home/pi/AttendanceScanner/backend/main.py
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

## Security Considerations

### Production Checklist

- [ ] Use strong, unique API keys
- [ ] Enable HTTPS (Vercel handles this automatically)
- [ ] Configure CORS properly
- [ ] Set up proper database permissions
- [ ] Use environment variables for all secrets
- [ ] Enable database connection encryption
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy

### API Key Generation

Generate secure API keys:

```bash
# Generate a secure 32-character key
openssl rand -hex 32
```

## Monitoring

### Frontend (Vercel)

- Built-in analytics and error tracking
- Configure external monitoring (e.g., Sentry)

### Scanner (Raspberry Pi)

- Check service status: `sudo systemctl status attendance-scanner`
- View logs: `sudo journalctl -u attendance-scanner -f`
- Monitor system resources: `htop`, `df -h`

## Backup Strategy

### Database

```bash
# Backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore
psql $DATABASE_URL < backup_file.sql
```

### Configuration

- Store environment files securely
- Document hardware setup
- Keep spare Raspberry Pi configured

## Troubleshooting

### Common Issues

1. **Scanner not connecting to API**
   - Check network connectivity
   - Verify API_BASE_URL and API_KEY
   - Check server logs

2. **Database connection issues**
   - Verify DATABASE_URL format
   - Check firewall settings
   - Ensure database is accessible

3. **Display not working**
   - Check SPI connections
   - Verify I2C is enabled
   - Test with simple display script

4. **Barcode scanner not recognized**
   - Check USB connection
   - Verify scanner is in keyboard emulation mode
   - Test with simple input script
