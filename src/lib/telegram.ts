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
        `• ${item.title} (x${item.quantity}) - ₹${item.price.toLocaleString()}`
    ).join('\n');

    return `
<b>🚀 NEW ORDER PLACED!</b>
---------------------------
<b>Order ID:</b> #${order.id}
<b>Customer:</b> ${order.customerName}
<b>Phone:</b> ${order.customerPhone}
<b>Address:</b> ${order.customerAddress}

<b>Products:</b>
${itemsList}

<b>Total Amount:</b> ₹${order.total.toLocaleString()}
<b>Payment Method:</b> ${order.paymentMethod}
<b>Status:</b> ${order.status}
---------------------------
<i>Check Admin Dashboard for details.</i>
    `.trim();
};
