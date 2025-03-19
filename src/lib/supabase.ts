import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = 'https://kaegngmkmeuenndcqdsx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthZWduZ21rbWV1ZW5uZGNxZHN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwMTc1MjUsImV4cCI6MjA1MzU5MzUyNX0.z7Rpj4RsAdPwitQG8NyaAdflYdedWhdKM87HgVatKLI'

if (!supabaseUrl) throw new Error('Missing VITE_SUPABASE_URL environment variable')
if (!supabaseKey) throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable')

// Configuration robuste du client Supabase avec des options améliorées
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'apikey': supabaseKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  }
})

// Amélioration des en-têtes pour toutes les requêtes
const originalFetch = supabase.rest.fetcher;
supabase.rest.fetcher = (url, options) => {
  options.headers = options.headers || {};
  
  // Ajouter l'en-tête Accept s'il n'existe pas déjà
  if (!options.headers['Accept']) {
    options.headers['Accept'] = 'application/json';
  }
  
  // Appeler la fonction fetch originale
  return originalFetch(url, options);
};

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: unknown) => {
  if (error instanceof Error) {
    console.error('Supabase error:', error.message);
    return error.message;
  }
  console.error('Unknown error:', error);
  return 'Une erreur inattendue est survenue';
};

// Types for common Supabase responses
export type SupabaseResponse<T> = {
  data: T | null;
  error: Error | null;
};

// Utility function to check if user is authenticated
export const isAuthenticated = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Auth check error:', error.message);
    return false;
  }
  return !!session;
};

// Utility function to get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Get user error:', error.message);
    return null;
  }
  return user;
};

// Fonction pour effacer complètement la session et la recréer
export const clearAuthSession = async () => {
  try {
    // Se déconnecter proprement
    await supabase.auth.signOut({ scope: 'local' });
    
    // Supprimer les données d'authentification du localStorage
    window.localStorage.removeItem('supabase.auth.token');
    
    // Autres clés potentielles
    const keys = Object.keys(window.localStorage);
    keys.forEach(key => {
      if (key.includes('supabase') || key.includes('auth') || key.includes('rakeb')) {
        window.localStorage.removeItem(key);
      }
    });
    
    console.log('Auth session cleared successfully');
    return true;
  } catch (err) {
    console.error('Failed to clear auth session:', err);
    return false;
  }
};