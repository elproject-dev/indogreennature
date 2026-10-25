import { NextResponse } from 'next/server';
import { adminMessaging } from '@/lib/firebase-admin';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, body: messageBody, imageUrl } = body;

    if (!title || !messageBody) {
      return NextResponse.json({ error: 'Title and body are required' }, { status: 400 });
    }

    const payloadNotification = {
      title,
      body: messageBody,
      ...(imageUrl && { image: imageUrl }),
    };

    const webpushConfig = {
      headers: {
        Urgency: 'high',
      },
      notification: {
        title,
        body: messageBody,
        icon: '/pwa-icon.png',
        badge: '/badge-icon.png',
        ...(imageUrl && { image: imageUrl }),
        vibrate: [200, 100, 200],
        requireInteraction: true,
        tag: 'ign-broadcast',
      },
      fcmOptions: {
        link: '/',
      },
    };

    const dataPayload = {
      title,
      body: messageBody,
      ...(imageUrl && { image: imageUrl }),
      url: '/',
    };

    // 1. Ambil semua token perangkat yang terdaftar di database Supabase
    let directTokens: string[] = [];
    try {
      const { data: tokenRows } = await supabase
        .from('fcm_tokens')
        .select('token');
      if (tokenRows && tokenRows.length > 0) {
        directTokens = tokenRows.map((r: { token: string }) => r.token).filter(Boolean);
      }
    } catch (dbErr) {
      console.warn('Error fetching fcm_tokens from Supabase:', dbErr);
    }

    let directSuccessCount = 0;
    let directFailureCount = 0;
    let topicMessageId: string | null = null;

    // 2. Kirim pesan: jika ada token tersimpan, kirim via Direct Multicast
    // JANGAN kirim ke topik jika directTokens ada, agar perangkat tidak menerima pesan ganda!
    if (directTokens.length > 0) {
      try {
        const multicastResponse = await adminMessaging.sendEachForMulticast({
          tokens: directTokens,
          notification: payloadNotification,
          webpush: webpushConfig,
          data: dataPayload,
          android: {
            priority: 'high',
          },
        });

        directSuccessCount = multicastResponse.successCount;
        directFailureCount = multicastResponse.failureCount;

        // Bersihkan token yang sudah tidak aktif / di-uninstall
        if (multicastResponse.failureCount > 0) {
          const invalidTokens: string[] = [];
          multicastResponse.responses.forEach((resp, idx) => {
            if (!resp.success) {
              const errCode = resp.error?.code;
              if (
                errCode === 'messaging/registration-token-not-registered' ||
                errCode === 'messaging/invalid-registration-token'
              ) {
                invalidTokens.push(directTokens[idx]);
              }
            }
          });

          if (invalidTokens.length > 0) {
            await supabase
              .from('fcm_tokens')
              .delete()
              .in('token', invalidTokens);
            console.log(`Membersihkan ${invalidTokens.length} token yang sudah kadaluarsa`);
          }
        }
      } catch (multiErr) {
        console.warn('Multicast direct send error:', multiErr);
      }
    } else {
      // 3. Hanya gunakan topik sebagai fallback jika belum ada token di database
      try {
        topicMessageId = await adminMessaging.send({
          topic: 'sbagiamu_all_users',
          notification: payloadNotification,
          webpush: webpushConfig,
          data: dataPayload,
          android: {
            priority: 'high',
          },
        });
      } catch (topicErr: any) {
        console.warn('Error sending to FCM topic:', topicErr?.message || topicErr);
      }
    }

    return NextResponse.json({
      success: true,
      directSuccessCount,
      directFailureCount,
      topicMessageId,
      totalRegisteredDevices: directTokens.length,
    });
  } catch (error: any) {
    console.error('Error sending broadcast:', error);
    return NextResponse.json({ error: error.message || 'Failed to send broadcast' }, { status: 500 });
  }
}

