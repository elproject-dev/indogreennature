import { NextResponse } from 'next/server';
import { adminMessaging } from '@/lib/firebase-admin';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // 1. Simpan / perbarui token perangkat ke tabel database Supabase fcm_tokens
    try {
      const { error: dbError } = await supabase
        .from('fcm_tokens')
        .upsert(
          { token, updated_at: new Date().toISOString() },
          { onConflict: 'token' }
        );

      if (dbError) {
        console.warn('Gagal menyimpan token ke database fcm_tokens:', dbError.message);
      } else {
        console.log('FCM Token berhasil disimpan di Supabase');
      }
    } catch (dbErr) {
      console.warn('Database upsert error for fcm_token:', dbErr);
    }

    // 2. Daftarkan juga token ke topik FCM 'sbagiamu_all_users'
    try {
      const response = await adminMessaging.subscribeToTopic([token], 'sbagiamu_all_users');
      if (response.failureCount > 0) {
        const errorDetail = response.errors[0]?.error;
        console.warn('FCM Topic Subscription warning:', errorDetail?.message || 'Unknown error');
      }
    } catch (topicErr) {
      console.warn('Error subscribing to topic:', topicErr);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in subscribe route:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

