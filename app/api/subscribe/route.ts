import { NextResponse } from 'next/server';
import { adminMessaging } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Subscribe the device token to the 'all_users' topic
    const response = await adminMessaging.subscribeToTopic([token], 'sbagiamu_all_users');
    
    if (response.failureCount > 0) {
      const errorDetail = response.errors[0]?.error;
      console.warn('FCM Subscription warning:', errorDetail?.message || 'Unknown error');
      
      // Jika token tidak valid (biasanya karena sisa cache project lama di browser),
      // kita abaikan saja agar tidak memicu error 500 di terminal.
      if (errorDetail?.code === 'messaging/invalid-registration-token') {
        return NextResponse.json({ success: false, note: 'Invalid token ignored' });
      }

      return NextResponse.json({ error: 'Failed to subscribe to topic' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in topic subscription:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
