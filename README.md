# MTN Management System

A comprehensive web-based system for managing MTN operations, including MPOS requisitions, tracking, and SIM card registration.

## Features

### Admin Features
- Complete system management
- User management (Add, Edit, Delete, Block users)
- Access to all forms and data:
  - MPOS Code Requisition
  - New MPOS Tracking
  - Offline MPOS Addition
  - Wau South Freelancers
  - Wau North Freelancers
  - 1GSM & 1MoMo Addition
  - Time Table Management
  - Number for Flexen Addition
  - SIM Registration & Onboarding

### User Features
- SIM Registration & Onboarding
- Share registration details via SMS and WhatsApp
- View and manage personal registration history
- Edit and delete own registrations

## Default Credentials

### Admin Account
- Username: admin
- Password: admin123

### User Account
- Username: user
- Password: user123

## Setup Instructions

1. Clone or download this repository to your local machine.
2. Ensure you have a modern web browser installed.
3. Open the `index.html` file in your web browser.
4. Log in using the default credentials provided above.

## System Requirements

- Modern web browser (Chrome, Firefox, Safari, or Edge)
- JavaScript enabled
- Internet connection (for FontAwesome icons)

## Data Storage

The system uses browser's localStorage for data persistence. This means:
- Data is stored locally in the user's browser
- Data persists between sessions
- Data is not shared between different browsers or devices
- Clearing browser data will erase all stored information

## Security Notes

- Change default passwords after first login
- Do not share admin credentials
- Log out after each session
- Regularly backup important data

## Forms and Their Fields

### MPOS Code Requisition
- TSC Name
- Date
- Signature
- RSM Name
- Freelancer/POS Name
- Location/Market
- MPOS Code
- MSISDN

### SIM Registration & Onboarding
- Date
- Freelancer/POS Name
- MPOS Code
- MPOS MSISDN
- Total SIM Registered
- SIMCards Onboarded on MoMo
- Rejection (Network/MPOS issues/Documents)
- Remarks (Excellent/Good/Fair/Poor)

## Contributing

To contribute to this project:
1. Fork the repository
2. Create a new branch for your feature
3. Commit your changes
4. Create a pull request

## Support

For support or questions, please contact the system administrator. 