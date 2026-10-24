"use server";

// Action ini berjalan di sisi server (Server Action)
// Nantinya ini bisa memanggil API dari sistem POS Kasir yang berbeda
export async function checkMemberPoints(memberId: string) {
  // Simulasi delay jaringan
  await new Promise((resolve) => setTimeout(resolve, 800));

  const posApiUrl = process.env.POS_API_URL;
  const posApiKey = process.env.POS_API_KEY;

  if (posApiUrl && posApiKey) {
    // ---------------------------------------------------------
    // TODO: IMPLEMENTASI ASLI KETIKA ENV SUDAH ADA
    // ---------------------------------------------------------
    // try {
    //   const response = await fetch(`${posApiUrl}/api/members/${memberId}/points`, {
    //     headers: {
    //       'Authorization': `Bearer ${posApiKey}`,
    //       'Content-Type': 'application/json'
    //     }
    //   });
    //   if (!response.ok) throw new Error("Gagal mengambil data dari POS");
    //   const data = await response.json();
    //   return { success: true, name: data.name, points: data.points };
    // } catch (error) {
    //   return { success: false, message: "Terjadi kesalahan sistem POS" };
    // }
  }

  // ---------------------------------------------------------
  // MOCK DATA: Digunakan saat ENV belum dikonfigurasi
  // ---------------------------------------------------------
  console.log(`[MOCK] Fetching points for member: ${memberId}`);
  
  // Data dummy
  const mockDatabase: Record<string, { name: string, points: number }> = {
    "08123456789": { name: "Budi Santoso", points: 1250 },
    "08987654321": { name: "Siti Aminah", points: 450 },
    "MEMBER-001": { name: "Andi Saputra", points: 8900 }
  };

  const member = mockDatabase[memberId];

  if (member) {
    return {
      success: true,
      name: member.name,
      points: member.points,
      isMock: true // penanda bahwa ini masih data dummy
    };
  }

  return {
    success: false,
    message: "Member tidak ditemukan. Pastikan nomor/ID benar.",
    isMock: true
  };
}
