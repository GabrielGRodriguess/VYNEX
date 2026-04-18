/**
 * A/B Testing Service
 * Handles variant assignment and persistence for users.
 */
export const abService = {
  VARIANTS: {
    CONTROL: 'control',
    URGENCY: 'urgency_copy',
    AUTHORITY: 'authority_copy'
  },

  /**
   * Assigns a variant to a user based on their ID.
   * Ensures deterministic assignment (same user = same variant).
   */
  getVariant(userId) {
    if (!userId) return this.VARIANTS.CONTROL;
    
    // Simple deterministic hash based on userId
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const variantKeys = Object.values(this.VARIANTS);
    return variantKeys[hash % variantKeys.length];
  },

  /**
   * Tracks which variant was viewed in the current session.
   */
  logVariantView(userId, componentName) {
    const variant = this.getVariant(userId);
    console.log(`[VYNEX A/B] User ${userId} viewing ${componentName} with variant: ${variant}`);
    return variant;
  }
};
