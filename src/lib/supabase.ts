
import { createClient } from '@supabase/supabase-js'

// Remplacer ces valeurs par les valeurs réelles de votre projet Supabase
const supabaseUrl = "https://fqskzlnssiifgcmksvgj.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxc2t6bG5zc2lpZmdjbWtzdmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk1NzI1ODAsImV4cCI6MjAyNTE0ODU4MH0.kQiBTyIznf0J5xWu3CLn1nhKGWqCinC6C5jaVtog0Gg"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
