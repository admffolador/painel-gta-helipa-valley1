// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gtsgvyjtoucimewhtcqf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0c2d2eWp0b3VjaW1ld2h0Y3FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2ODg4NDksImV4cCI6MjA1MjI2NDg0OX0.z6RNuQGPsEfyK4EVL7JihQo-VjYjP2E1dAFANtH_eiw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);