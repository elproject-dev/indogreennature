import React from "react";
import { outfit } from "@/lib/fonts"


export function Banner() {
  return (
    <div className={`flex flex-col items-center w-full max-w-[816px] mx-auto ${outfit.className}`}>
      {/* Selamat Datang di */}
      <div className="text-4xl sm:text-4xl lg:text-[64px] font-bold lg:leading-[81px] text-foreground text-center mb-8 lg:mb-[25px] whitespace-nowrap">
        Selamat Datang
      </div>

      {/* Logo (logo-maga2 1) */}
      <div
        className="w-[230px] h-[77px] sm:w-[250px] sm:h-[85px] lg:w-[330px] lg:h-[112px] bg-no-repeat bg-center bg-contain mb-4 lg:mb-[25px]"
        style={{ backgroundImage: "url('/logo-maga2.png')" }}
      />

      {/* Nikmati Diskon khusus member setia CV. Indo Green Nature */}
      <div className="text-sm md:text-2xl lg:text-[48px] font-bold leading-snug lg:leading-[60px] text-center text-foreground px-4 lg:px-0">
        Nikmati Diskon khusus member setia{" "}
        <span className="block lg:inline font-[800] tracking-normal lg:tracking-[0.1em] text-destructive mt-1 lg:mt-0 text-xl md:text-4xl lg:text-4xl">CV. INDO GREEN NATURE</span>
      </div>
    </div>
  );
}
