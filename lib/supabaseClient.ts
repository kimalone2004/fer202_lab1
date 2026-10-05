import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://undkjlralcaxhrucyqmo.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuZGtqbHJhbGNheGhydWN5cW1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExOTQ2MzIsImV4cCI6MjEwNjc3MDYzMn0.bkkMqymQ5eDp6GjwR5FMzxF8_rV2_nFGG7SbjDQ6tlY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
