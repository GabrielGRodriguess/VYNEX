import { supabase } from '../lib/supabase';

/**
 * Analytics and Event Tracking Service
 * Records the user journey through the sales funnel.
 */
export const analyticsService = {
  EVENTS: {
    ANALYSIS_GENERATED: 'analysis_generated',
    NEX_CTA_VIEWED: 'nex_cta_viewed',
    NEX_CTA_CLICKED: 'nex_cta_clicked',
    WHATSAPP_HANDOVER: 'whatsapp_handover',
    LEAD_QUALIFIED: 'lead_qualified'
  },

  /**
   * Logs an event to the sales_events table in Supabase.
   */
  async trackEvent(eventName, userId, payload = {}, abVariant = 'control') {
    try {
      console.log(`[VYNEX Analytics] Event: ${eventName}`, { userId, payload, abVariant });
      
      const { error } = await supabase
        .from('sales_events')
        .insert([{
          event_name: eventName,
          user_id: userId,
          payload: payload,
          ab_variant: abVariant,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
    } catch (err) {
      console.error("[VYNEX Analytics] Failed to track event:", err.message);
      // Fail silently for user, but log in console
    }
  }
};
