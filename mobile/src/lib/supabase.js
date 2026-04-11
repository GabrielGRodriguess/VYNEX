import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';

const SUPABASE_URL = 'https://qyopwekntbvhdjmigdmh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5b3B3ZWtudGJ2aGRqbWlnZG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MzQ3NzAsImV4cCI6MjA5MTMxMDc3MH0.jNxb6i1mydX6sxTctfQ8NuqQtJXQuEhZh8UN0kxyDus';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: Platform.OS === 'web' ? undefined : AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
