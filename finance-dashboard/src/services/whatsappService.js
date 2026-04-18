/**
 * WhatsApp Bridge Service
 * Constructs parameterized URLs for handover to automated agents on WhatsApp.
 */
export const whatsappService = {
  PHONE_NUMBER: '5511999999999', // Placeholder - should be configurable

  /**
   * Generates a deep link to WhatsApp with a pre-filled message.
   * @param {string} intent The text intent (URL encoded).
   */
  generateLink(intent) {
    const baseUrl = 'https://wa.me/';
    const fullUrl = `${baseUrl}${this.PHONE_NUMBER}?text=${intent}`;
    return fullUrl;
  },

  /**
   * Opens the WhatsApp link in a new tab and tracks the conversion event.
   */
  async openConversation(intent, userProfile = {}) {
    console.log("[VYNEX] Tracking WhatsApp Conversion:", { intent, user: userProfile.id });
    
    // Future: Analytics / DB logging here
    
    const link = this.generateLink(intent);
    window.open(link, '_blank');
  }
};
