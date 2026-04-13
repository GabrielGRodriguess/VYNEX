import React, { createContext, useState, useEffect, useContext } from 'react';
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

      if (error && error.code === 'PGRST116') {
        // Create initial profile
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert([{ 
            user_id: user.id, 
            plan_id: 'free', 
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
    
    if (!error) {
      setProfile(prev => ({ ...prev, plan_id: planId }));
    }
  };

  const toggleAgent = async (agentId) => {
    if (!user) return;
    
    const currentPrefs = profile?.preferences?.activeAgents || {};
    const newPrefs = {
      ...currentPrefs,
      [agentId]: !currentPrefs[agentId]
    };

    const { error } = await supabase
      .from('user_profiles')
      .update({ 
        preferences: { 
          ...profile?.preferences,
          activeAgents: newPrefs 
        } 
      })
      .eq('user_id', user.id);

    if (!error) {
      setProfile(prev => ({
        ...prev,
        preferences: {
          ...prev?.preferences,
          activeAgents: newPrefs
        }
      }));
    }
    
    return !error;
  };

  const completeOnboarding = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('user_profiles')
      .update({ onboarding_completed: true })
      .eq('user_id', user.id);
    
    if (!error) {
      setProfile(prev => ({ ...prev, onboarding_completed: true }));
    }
  };

  return (
    <UserContext.Provider value={{
      profile,
      loading,
      updatePlan,
      toggleAgent,
      completeOnboarding,
      currentPlan: planService.getPlanById(profile?.plan_id || 'free'),
      activeAgents: profile?.preferences?.activeAgents || {}
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
