import React from 'react';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersIcon, EyeIcon, ClockIcon, UserCheck, Users, UserCog, Activity } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { CityTable } from '@/components/analytics/city-table';
import { SourceBarChart } from '@/components/analytics/source-bar-chart';
import { RealtimeBarChart } from '@/components/analytics/realtime-bar-chart';

export const revalidate = 60; // Cache data for 1 minute for near realtime

async function getAnalyticsData() {
  const propertyId = process.env.GA_PROPERTY_ID;
  if (!propertyId || propertyId === 'isi_dengan_property_id_google_analytics_anda') {
    return { error: 'GA_PROPERTY_ID belum dikonfigurasi. Pastikan untuk menambahkannya di Environment Variables Vercel.' };
  }

  try {
    // Check if we have direct credentials (for Vercel) or fallback to Application Default Credentials (local JSON file)
    let clientOptions = {};
    if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      clientOptions = {
        credentials: {
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
          // Replace escaped newlines from Vercel env vars
          private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }
      };
    }

    const analyticsDataClient = new BetaAnalyticsDataClient(clientOptions);
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      metrics: [
        { name: 'activeUsers' },
        { name: 'screenPageViews' },
        { name: 'sessions' }
      ],
    });

    // City Report
    const [cityResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        { startDate: '30daysAgo', endDate: 'today' },
      ],
      dimensions: [
        { name: 'city' }
      ],
      metrics: [
        { name: 'activeUsers' }
      ],
      orderBys: [
        {
          metric: { metricName: 'activeUsers' },
          desc: true,
        }
      ],
      limit: 10,
    });

    const cityData = cityResponse.rows?.map(row => ({
      city: row.dimensionValues?.[0]?.value || 'Unknown',
      activeUsers: parseInt(row.metricValues?.[0]?.value || '0', 10)
    })) || [];

    // Source Report
    const [sourceResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        { startDate: '30daysAgo', endDate: 'today' },
      ],
      dimensions: [
        { name: 'firstUserSourceMedium' }
      ],
      metrics: [
        { name: 'activeUsers' }
      ],
      orderBys: [
        {
          metric: { metricName: 'activeUsers' },
          desc: true,
        }
      ],
      limit: 10,
    });

    const sourceData = sourceResponse.rows?.map(row => ({
      source: row.dimensionValues?.[0]?.value || 'Unknown',
      activeUsers: parseInt(row.metricValues?.[0]?.value || '0', 10)
    })) || [];

    // Trend Report
    const [trendResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        { startDate: '30daysAgo', endDate: 'today' },
      ],
      dimensions: [
        { name: 'date' }
      ],
      metrics: [
        { name: 'activeUsers' },
        { name: 'screenPageViews' }
      ],
      orderBys: [
        {
          dimension: { dimensionName: 'date' },
        }
      ],
    });

    const trendData = trendResponse.rows?.map(row => {
      const rawDate = row.dimensionValues?.[0]?.value || '';
      let formattedDate = rawDate;
      if (rawDate.length === 8) {
        const month = rawDate.substring(4, 6);
        const day = rawDate.substring(6, 8);
        formattedDate = `${day}/${month}`;
      }
      return {
        date: formattedDate,
        activeUsers: parseInt(row.metricValues?.[0]?.value || '0', 10),
        pageViews: parseInt(row.metricValues?.[1]?.value || '0', 10)
      };
    }) || [];

    // Realtime Report
    let realtimeUsers = '0';
    let realtimeMinutesData: any[] = [];
    let total30Min = 0;
    try {
      const [realtimeResponse] = await analyticsDataClient.runRealtimeReport({
        property: `properties/${propertyId}`,
        dimensions: [
          { name: 'minutesAgo' }
        ],
        metrics: [
          { name: 'activeUsers' },
        ],
      });

      let total = 0;
      const minutesMap = new Map();
      realtimeResponse.rows?.forEach(row => {
        const minsAgo = parseInt(row.dimensionValues?.[0]?.value || '0', 10);
        const users = parseInt(row.metricValues?.[0]?.value || '0', 10);
        minutesMap.set(minsAgo, users);
        total += users;
        if (minsAgo >= 0 && minsAgo < 30) {
          total30Min += users;
        }
      });
      realtimeUsers = total.toString();

      for (let i = 29; i >= 0; i--) {
        realtimeMinutesData.push({
          minute: i === 0 ? 'Sekarang' : `${i} mnt`,
          users: minutesMap.get(i) || 0
        });
      }
    } catch (e) {
      console.error('Error fetching realtime GA data:', e);
    }

    if (response.rows && response.rows.length > 0) {
      const row = response.rows[0];
      return {
        overview: {
          activeUsers: row.metricValues?.[0]?.value || '0',
          pageViews: row.metricValues?.[1]?.value || '0',
          sessions: row.metricValues?.[2]?.value || '0',
          realtimeUsers,
        },
        cityData,
        sourceData,
        trendData,
        realtimeMinutesData,
        total30Min: total30Min.toString()
      };
    }

    return {
      overview: {
        activeUsers: '0',
        pageViews: '0',
        sessions: '0',
        realtimeUsers: realtimeUsers,
      },
      cityData,
      sourceData,
      trendData,
      realtimeMinutesData
    };
  } catch (error: any) {
    console.error('Error fetching GA data:', error);
    return { error: error.message || 'Gagal mengambil data dari Google Analytics. Pastikan Property ID benar dan Service Account JSON memiliki akses minimal Viewer.' };
  }
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  // Fetch DB metrics

  const { count: totalMember } = await supabase.from('customers')
    .select('*', { count: 'exact', head: true })
    .neq('membership_type', 'Umum')
    .not('membership_type', 'is', null);

  // Fetch Google Users
  let googleUsersCount = 0;
  try {
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();
      if (!authError && authData?.users) {
        const googleUsers = authData.users.filter(u =>
          u.app_metadata?.providers?.includes('google') ||
          u.identities?.some(id => id.provider === 'google')
        );
        googleUsersCount = googleUsers.length;
      }
    }
  } catch (err) {
    console.error("Error fetching google users:", err);
  }
  // const { count: totalStaf } = await supabase.from('staf').select('*', { count: 'exact', head: true });
  return (
    <div className="flex-1 space-y-4 p-3 md:p-8 pt-4 md:pt-6">
      {data.error ? (
        <div className="rounded-md bg-destructive/15 p-4 border border-destructive/20">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-destructive">Konfigurasi Dibutuhkan</h3>
              <div className="mt-2 text-sm text-destructive/90">
                <p>{data.error}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-3 rounded-sm">
          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-md border-none gap-0 py-2 md:py-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 px-3 md:px-4 py-1">
              <CardTitle className="text-xs md:text-sm font-medium text-white/90">
                Total Pelanggan
              </CardTitle>
              <UserCheck className="h-4 w-4 text-white/80 hidden sm:block" />
            </CardHeader>
            <CardContent className="px-3 md:px-4 py-1">
              <div className="text-lg md:text-2xl font-bold">{totalMember || 0}</div>
              <p className="text-[10px] md:text-xs text-white/70 mt-0 leading-tight md:leading-normal">
                Member terdaftar
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-violet-500 to-violet-700 text-white shadow-md border-none gap-0 py-2 md:py-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 px-3 md:px-4 py-1">
              <CardTitle className="text-xs md:text-sm font-medium text-white/90">
                Pengguna Aktif
              </CardTitle>
              <UsersIcon className="h-4 w-4 text-white/80 hidden sm:block" />
            </CardHeader>
            <CardContent className="px-3 md:px-4 py-1">
              <div className="text-lg md:text-2xl font-bold">{data.overview?.activeUsers || '0'}</div>
              <p className="text-[10px] md:text-xs text-white/70 mt-0 leading-tight md:leading-normal">
                Pengguna aktif
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-md border-none gap-0 py-2 md:py-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 px-3 md:px-4 py-1">
              <CardTitle className="text-xs md:text-sm font-medium text-white/90">
                Tayangan Halaman
              </CardTitle>
              <EyeIcon className="h-4 w-4 text-white/80 hidden sm:block" />
            </CardHeader>
            <CardContent className="px-3 md:px-4 py-1">
              <div className="text-lg md:text-2xl font-bold">{data.overview?.pageViews || '0'}</div>
              <p className="text-[10px] md:text-xs text-white/70 mt-0 leading-tight md:leading-normal">
                Total halaman yang dilihat
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-500 to-cyan-700 text-white shadow-md border-none gap-0 py-2 md:py-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 px-3 md:px-4 py-1">
              <CardTitle className="text-xs md:text-sm font-medium text-white/90">
                Sesi
              </CardTitle>
              <ClockIcon className="h-4 w-4 text-white/80 hidden sm:block" />
            </CardHeader>
            <CardContent className="px-3 md:px-4 py-1">
              <div className="text-lg md:text-2xl font-bold">{data.overview?.sessions || '0'}</div>
              <p className="text-[10px] md:text-xs text-white/70 mt-0 leading-tight md:leading-normal">
                Total sesi kunjungan
              </p>
            </CardContent>
          </Card>

          {/* New Card for Active Users in Last 30 Minutes */}
          <Card className="bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-md border-none gap-0 py-2 md:py-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 px-3 md:px-4 py-1">
              <CardTitle className="text-xs md:text-sm font-medium text-white/90">
                Pengguna Aktif
              </CardTitle>
              <Activity className="h-4 w-4 text-white/80 hidden sm:block" />
            </CardHeader>
            <CardContent className="px-3 md:px-4 py-1">
              <div className="text-lg md:text-2xl font-bold">{data.total30Min || '0'}</div>
              <p className="text-[10px] md:text-xs text-white/70 mt-0 leading-tight md:leading-normal">
                30 menit terakhir
              </p>
            </CardContent>
          </Card>

          {/* New Card for Google Users */}
          <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md border-none gap-0 py-2 md:py-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 px-3 md:px-4 py-1">
              <CardTitle className="text-xs md:text-sm font-medium text-white/90">
                Login Google
              </CardTitle>
              <svg className="h-4 w-4 text-white/80 hidden sm:block fill-current" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor" />
              </svg>
            </CardHeader>
            <CardContent className="px-3 md:px-4 py-1">
              <div className="text-lg md:text-2xl font-bold">{googleUsersCount}</div>
              <p className="text-[10px] md:text-xs text-white/70 mt-0 leading-tight md:leading-normal">
                Total login dengan Google
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chart Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mt-4 items-stretch">

        {!data.error && (
          <>
            <CityTable data={data.cityData || []} />
            <SourceBarChart data={data.sourceData || []} />
          </>
        )}
      </div>

      {!data.error && (
        <div className="mt-4 pb-4 md:pb-0">
          <RealtimeBarChart data={data.realtimeMinutesData || []} />
        </div>
      )}
    </div>
  );
}
