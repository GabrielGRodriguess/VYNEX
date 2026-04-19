import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../services/supabaseClient';
import { planService } from '../services/planService';

export const UserContext = createContext();

export function UserProvider({ user, children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      
      // 1. Try to load from LocalStorage first for instant (contingency) access
      const localProfile = localStorage.getItem(`vynex_profile_${user.id}`);
      if (localProfile) {
        try {
          console.log('[VYNEX] Loading profile from LocalStorage (Contingency)');
          const parsed = JSON.parse(localProfile);
          if (parsed && typeof parsed === 'object') {
            setProfile(parsed);
          }
        } catch (e) {
          console.error('[VYNEX] Failed to parse local profile:', e);
          localStorage.removeItem(`vynex_profile_${user.id}`);
        }
      }

      // 2. Load or Create Profile in Supabase
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && (error.code === 'PGRST116' || error.message?.includes('not found') || error.status === 404)) {
          // Create initial profile with robust defaults
          const { data: newProfile, error: createError } = await supabase
            .from('user_profiles')
            .insert([{ 
              user_id: user.id, 
              plan_id: 'free', 
              role: 'free',
              preferences: { activeAgents: {} },
              onboarding_completed: false 
            }])
            .select()
            .single();
          
          if (!createError && newProfile) {
            setProfile(newProfile);
            localStorage.setItem(`vynex_profile_${user.id}`, JSON.stringify(newProfile));
          }
        } else if (!error && data) {
          setProfile(data);
          localStorage.setItem(`vynex_profile_${user.id}`, JSON.stringify(data));
        }
      } catch (err) {
        console.warn('[VYNEX] Supabase unreachable or table missing.', err);
      }
      
      setLoading(false);
    }

    loadProfile();
  }, [user]);

  const updatePlan = async (planId) => {
    if (!user) return;
    
    // 1. Update local state immediately for snappy UI
    setProfile(prev => ({ ...prev, plan_id: planId }));
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ plan_id: planId })
        .eq('user_id', user.id);
      
      if (!error) {
        localStorage.setItem(`vynex_profile_${user.id}`, JSON.stringify({ ...profile, plan_id: planId }));
      } else {
        console.error('[VYNEX] Error updating plan in Supabase:', error);
      }
    } catch (err) {
      console.error('[VYNEX] Critical error in updatePlan:', err);
    }
  };

  const toggleAgent = async (agentId) => {
    if (!user || !profile) return false;
    
    // Ensure preferences object and activeAgents field exist
    const currentPrefs = profile.preferences || {};
    const currentActiveAgents = currentPrefs.activeAgents || {};
    
    const newActiveAgents = {
      ...currentActiveAgents,
      [agentId]: !currentActiveAgents[agentId]
    };

    const newPrefs = {
      ...currentPrefs,
      activeAgents: newActiveAgents
    };

    const { error } = await supabase
      .from('user_profiles')
      .update({ preferences: newPrefs })
      .eq('user_id', user.id);

    if (!error) {
      setProfile(prev => ({
        ...prev,
        preferences: newPrefs
      }));
      return true;
    }
    
    console.error('Error toggling agent:', error);
    return false;
  };

  const completeOnboarding = async () => {
    if (!user) return;

    // 1. Update local state immediately
    setProfile(prev => ({ ...prev, onboarding_completed: true }));

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ onboarding_completed: true })
        .eq('user_id', user.id); // FIXED: Added missing .eq filter
        
      if (!error) {
        localStorage.setItem(`vynex_profile_${user.id}`, JSON.stringify({ ...profile, onboarding_completed: true }));
      } else {
        console.error('[VYNEX] Error completing onboarding in Supabase:', error);
      }
    } catch (err) {
      console.error('[VYNEX] Critical error in completeOnboarding:', err);
    }
  };

  const userRole = profile?.role || 'free';
  const isAdmin = userRole === 'admin';
  const isPremium = userRole === 'premium' || isAdmin || ['PRO', 'PREMIUM', 'PRO_PASS'].includes(profile?.plan_id?.toUpperCase());

  return (
    <UserContext.Provider value={{
      profile,
      loading,
      updatePlan,
      toggleAgent,
      completeOnboarding,
      role: userRole,
      isAdmin,
      isPremium,
      currentPlan: isAdmin 
        ? planService.getPlanById('PRO_PASS') 
        : planService.getPlanById(profile?.plan_id || 'free'),
      activeAgents: profile?.preferences?.activeAgents || {}
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
