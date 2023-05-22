import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
 // @ts-ignore
import {SUPABASE_URL,SUPABASE_ANON_KEY} from '@env'
import { Database } from '../types/typesSupabase'

const supabaseUrl = SUPABASE_URL
const supabaseAnonKey = SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})