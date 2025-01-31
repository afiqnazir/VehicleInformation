import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import { formatVehicleDetails } from './utils.js';
import { getUserSearches, incrementUserSearches, addPremiumUser } from './db.js';

const token = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_ID = process.env.ADMIN_TELEGRAM_ID;

if (!token) {
  console.error('TELEGRAM_BOT_TOKEN is not set in environment variables');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const userInfo = await getUserSearches(userId);

  const welcomeMessage = userInfo.isPremium
    ? `Welcome to Vehicle Info Bot! 🚗\n\n` +
      `You have ${userInfo.remainingSearches} premium searches remaining.\n\n` +
      `Send me a vehicle registration number to get detailed information about the vehicle.\n\n` +
      `Example: JK03N1234`
    : `Welcome to Vehicle Info Bot! 🚗\n\n` +
      `You have ${userInfo.remainingSearches} free searches to try the service.\n\n` +
      `Send me a vehicle registration number to get detailed information about the vehicle.\n\n` +
      `Example: JK03N1234\n\n` +
      `For premium access (50 searches for ₹50), contact @MRXISBACK`;

  bot.sendMessage(chatId, welcomeMessage);
});

// Admin command to add premium user
bot.onText(/\/addpremium (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  
  // Check if the command is from admin
  if (msg.from.id.toString() !== ADMIN_ID) {
    bot.sendMessage(chatId, '⚠️ You are not authorized to use this command.');
    return;
  }

  const userId = match[1];
  try {
    await addPremiumUser(userId);
    bot.sendMessage(chatId, `✅ Successfully added premium access for user ${userId}`);
    // Notify the user
    bot.sendMessage(userId, '🎉 Premium access activated! You now have 50 searches available.');
  } catch (error) {
    bot.sendMessage(chatId, '❌ Failed to add premium user: ' + error.message);
  }
});

bot.onText(/^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{1,4}$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const registrationNumber = match[0];

  try {
    // Check user's search limits
    const userInfo = await getUserSearches(userId);
    
    if (userInfo.remainingSearches <= 0) {
      bot.sendMessage(
        chatId,
        '⚠️ You have used all your searches.\n\n' +
        'For premium access (50 searches for ₹50), please contact @MRXISBACK'
      );
      return;
    }

    bot.sendMessage(chatId, '🔍 Searching for vehicle details...');

    const response = await fetch(`https://codex-ml.tech/api/rc.php?regno=${registrationNumber}`);
    const data = await response.json();

    if (!data.data.success) {
      throw new Error(data.data.message || 'Failed to fetch vehicle details');
    }

    const formattedDetails = formatVehicleDetails(data.data.detail);
    
    // Send vehicle image if available
    if (data.data.detail.modelImageUrl) {
      await bot.sendPhoto(chatId, data.data.detail.modelImageUrl, {
        caption: `${data.data.detail.brand?.make_display || ''} ${data.data.detail.model?.model_display || ''}\n${registrationNumber}`
      });
    }

    // Update user's search count
    const updatedUserInfo = await incrementUserSearches(userId);

    // Send detailed information with remaining searches info
    const searchesInfo = updatedUserInfo.isPremium
      ? `\n\n🌟 Premium Searches Remaining: ${updatedUserInfo.remainingSearches}`
      : `\n\n📝 Free Searches Remaining: ${updatedUserInfo.remainingSearches}\n` +
        `For premium access (50 searches for ₹50), contact @MRXISBACK`;

    await bot.sendMessage(
      chatId,
      formattedDetails + searchesInfo + '\n\nBot By @MRXISBACK',
      { parse_mode: 'HTML' }
    );
  } catch (error) {
    bot.sendMessage(
      chatId,
      '❌ Error: ' + (error.message || 'Failed to fetch vehicle details. Please try again later.')
    );
  }
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text && !text.startsWith('/') && !/^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{1,4}$/.test(text)) {
    bot.sendMessage(
      chatId,
      '⚠️ Please enter a valid vehicle registration number.\n\nFormat: XX00XX0000\nExample: JK03N1234'
    );
  }
});

console.log('🤖 Vehicle Info Bot is running...');