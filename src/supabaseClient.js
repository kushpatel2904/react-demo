import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://auuwkqxirczyohmadgkd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1dXdrcXhpcmN6eW9obWFkZ2tkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5Mzk3MzQsImV4cCI6MjA4MTUxNTczNH0.JfyDuINm-nsSMHEP69rWCnq-_0P33404u06f4_7eCXg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
