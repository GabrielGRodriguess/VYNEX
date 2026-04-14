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
      
      // Load or Create Profile in Supabase
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
        
        if (!createError) setProfile(newProfile);
      } else if (!error && data) {
        setProfile(data);
      }
      
      setLoading(false);
    }

    loadProfile();
  }, [user]);

  const updatePlan = async (planId) => {
    if (!user) return;
    const { error } = await supabase
      .from('user_profiles')
      .update({ plan_id: planId })
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error updating plan:', error);
      throw error;
    }

    setProfile(prev => ({ ...prev, plan_id: planId }));
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
    const { error } = await supabase
      .from('user_profiles')
      .update({ onboarding_completed: true })
    if (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }

    setProfile(prev => ({ ...prev, onboarding_completed: true }));
  };

  const userRole = profile?.role || 'free';
  const isAdmin = userRole === 'admin';
  const isPremium = userRole === 'premium' || isAdmin || ['PRO', 'PREMIUM'].includes(profile?.plan_id?.toUpperCase());

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
        ? planService.getPlanById('PREMIUM') 
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
