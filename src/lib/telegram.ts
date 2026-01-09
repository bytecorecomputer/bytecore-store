const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

export const sendTelegramMessage = async (message: string) => {
    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'HTML',
            }),
        });
        return response.ok;
    } catch (error) {
        console.error('Error sending Telegram message:', error);
        return false;
    }
};

export const formatOrderMessage = (order: any) => {
    const itemsList = order.items.map((item: any) =>
        `🔹 <b>${item.title}</b>\n   └ <i>Qty: ${item.quantity} • ₹${item.price.toLocaleString()}</i>`
    ).join('\n\n');

    const divider = "━━━━━━━━━━━━━━━━━━━━━━";

    return `
✨ <b>NEW ORDER RECEIVED!</b> ✨
${divider}

🆔 <b>Order ID:</b> <code>${order.id}</code>
👤 <b>Customer:</b> <code>${order.customerName}</code>
📞 <b>Phone:</b> <code>${order.customerPhone}</code>
📍 <b>Address:</b> <code>${order.customerAddress}</code>

📦 <b>ITEMS ORDERED:</b>
${itemsList}

${divider}
💰 <b>TOTAL AMOUNT:</b> <b>₹${order.total.toLocaleString()}</b>
💳 <b>PAYMENT:</b> <code>${order.paymentMethod}</code>
⚡ <b>STATUS:</b> <code>${order.status}</code>
${divider}

🚀 <b>Bytecore Cloud Sync Active</b>
<i>Login to Admin Panel to manage this order.</i>
    `.trim();
};
