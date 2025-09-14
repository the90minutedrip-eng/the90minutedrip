export const buildWhatsAppLink = (productName: string, productId: string, size?: string) => {
  const phoneNumber = "918139016845"; // +91 81390 16845 (format for WhatsApp API)
  const message = `Hi! I'm interested in ${productName} (${productId})${size ? `, size ${size}` : ''}. Could you help me purchase?`;
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
};
