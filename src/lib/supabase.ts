import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function getPhotoUrl(path: string): string {
  const { data } = supabase.storage.from('trip-photos').getPublicUrl(path)
  return data.publicUrl
}

export async function uploadPhoto(file: File, cardId: string): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = `cards/${cardId}/${Date.now()}.${ext}`
  const { error } = await supabase.storage
    .from('trip-photos')
    .upload(path, file, { cacheControl: '3600', upsert: false })
  if (error) throw error
  return path
}
