// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://crofntqtplmapqlqwcze.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyb2ZudHF0cGxtYXBxbHF3Y3plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4MjUwNDIsImV4cCI6MjA1MjQwMTA0Mn0.QEAwPvGTNBw-Af6hS-TI0oGeFRoUFl2E385_4S9YMx8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
