# Telegram Weather Bot

    A Telegram bot that provides weather updates and includes an admin panel for managing users and API configurations dynamically. Built using Node.js, the bot interacts with the OpenWeatherMap API to fetch weather data and allows admins to manage user subscriptions and bot settings.

## Features

### General Features
- **Weather Updates**: Fetch current weather for any city.
- **Dynamic API Configuration**: Update API keys and bot tokens without restarting the bot.
- **User Management**: Admins can manage users (block, unblock, delete) and view the list of subscribed users.
- **User Info**: View detailed information about any user, including their ID, name, and city.

### User Commands Features
- `/userinfo`: Find user info like User ID and Name.
- `/subscribe`: Subscribe to receive weather updates.
- `/unsubscribe`: Unsubscribe from weather updates.
- `/setcity`: Update your city for weather updates.
- `/admin`: (Admins only) Access the admin panel.

### Admin Panel Features
Admins can access a set of powerful commands:
1. `/block userid` - Block a user.
2. `/unblock userid` - Unblock a user.
3. `/delete userid` - Delete a user permanently.
4. `/updateapi` - Update API keys or bot tokens dynamically.
5. `/viewusers` - View a list of all subscribed users.

### Subscribers
- Users can subscribe to the bot by interacting with it.
- Admins can view the list of subscribed users, including their city and name.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/telegram-weather-bot.git
   cd telegram-weather-bot

2. Create a .env file in the root directory and add your credentials:
   ```bash
    TELEGRAM_BOT_TOKEN=your-telegram-bot-token
    WEATHER_API_KEY=your-weather-api-key


3. Start the bot:

    ```bash
      node index.js