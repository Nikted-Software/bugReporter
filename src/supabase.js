import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vyboiwqlakirsycnjmze.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5Ym9pd3FsYWtpcnN5Y25qbXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM5NTk4MDcsImV4cCI6MjAzOTUzNTgwN30.X4a1B4xdDOJmEKMOiYyjALfFaCstysUM-thbTfAEKJw'

export const supabase = createClient(supabaseUrl, supabaseKey)
