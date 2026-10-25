"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  type OurProductsSettingsData,
  getInitialOurProductsSettings,
  sanitizeOurProductsSettings,
  DEFAULT_OUR_PRODUCTS_SETTINGS,
  OUR_PRODUCTS_SETTINGS_KEY,
  OUR_PRODUCTS_PREVIEW_CHANNEL,
} from "@/lib/our-products-settings";
import { outfit, jockey, poppins, getHeroFontClass, getHeroFontSizeClass, getHeroFontSizeStyle, getHeroImageAspectClass, parseHeroImageSizeNumber, getHeroImageContainerStyle, parseHeroFontWeightNumber, getHeroFontWeightClass } from "@/lib/fonts"
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import {
  DEFAULT_HOME_BLOCKS,
  HOME_LAYOUT_EVENT,
  HOME_LAYOUT_KEY,
  HOME_LAYOUT_PREVIEW_KEY,
  loadHomeLayout,
  normalizeHomeBlocks,
  type HomeBlock,
  type HomeBlockType,
  DEFAULT_HERO_TEXT,
  DEFAULT_HERO_FONT,
  DEFAULT_HERO_FONT_WEIGHT,
  DEFAULT_HERO_FONT_SIZE,
  DEFAULT_HERO_TEXT_COLOR,
  DEFAULT_HERO_SUBTEXT,
  DEFAULT_HERO_SUBTEXT_COLOR,
  DEFAULT_HERO_SUBTEXT_SIZE,
  DEFAULT_HERO_SUBTEXT_FONT_WEIGHT,
  DEFAULT_HERO_DESC,
  DEFAULT_HERO_DESC_COLOR,
  DEFAULT_HERO_POINTS,
  DEFAULT_HERO_POINTS_FONT_WEIGHT,
  DEFAULT_HERO_POINTS_COLOR,
  DEFAULT_HERO_IMAGE,
  DEFAULT_HERO_IMAGE_POSITION,
  DEFAULT_HERO_IMAGE_ASPECT,
  DEFAULT_HERO_IMAGE_SIZE,
  DEFAULT_HERO_IMAGE_TRANSPARENT,
  DEFAULT_HERO_IMAGE_FIT,
  DEFAULT_PENGENALAN_TITLE,
  DEFAULT_PENGENALAN_TITLE_SIZE,
  DEFAULT_PENGENALAN_TITLE_COLOR,
  DEFAULT_PENGENALAN_DESC,
  DEFAULT_PENGENALAN_DESC_SIZE,
  DEFAULT_PENGENALAN_DESC_COLOR,
  DEFAULT_PENGENALAN_IMAGE,
  DEFAULT_PENGENALAN_IMAGE_FIT,
  DEFAULT_PENGENALAN_IMAGE_POSITION,
  DEFAULT_PENGENALAN_IMAGE_SIZE,
  DEFAULT_PENGENALAN_IMAGE_SCALE,
  DEFAULT_PENGENALAN_TITLE_FONT,
  DEFAULT_PENGENALAN_TITLE_FONT_WEIGHT,
  SolusiBisnisCard,
  DEFAULT_SOLUSI_BISNIS_TITLE,
  DEFAULT_SOLUSI_BISNIS_TITLE_COLOR,
  DEFAULT_SOLUSI_BISNIS_TITLE_SIZE,
  DEFAULT_SOLUSI_BISNIS_TITLE_FONT,
  DEFAULT_SOLUSI_BISNIS_TITLE_FONT_WEIGHT,
  DEFAULT_SOLUSI_BISNIS_DESC_ALIGN,
  DEFAULT_SOLUSI_BISNIS_VALIGN,
  DEFAULT_SOLUSI_BISNIS_CARDS,
  DEFAULT_SOLUSI_BISNIS_CARD_TITLE_COLOR,
  DEFAULT_SOLUSI_BISNIS_CARD_TITLE_SIZE,
  DEFAULT_SOLUSI_BISNIS_CARD_TITLE_FONT_WEIGHT,
  DEFAULT_SOLUSI_BISNIS_CARD_TITLE_FONT,
  JenisProdukCard,
  DEFAULT_JENIS_PRODUK_TITLE,
  DEFAULT_JENIS_PRODUK_TITLE_COLOR,
  DEFAULT_JENIS_PRODUK_TITLE_SIZE,
  DEFAULT_JENIS_PRODUK_TITLE_FONT,
  DEFAULT_JENIS_PRODUK_TITLE_FONT_WEIGHT,
  DEFAULT_JENIS_PRODUK_DESC,
  DEFAULT_JENIS_PRODUK_DESC_COLOR,
  DEFAULT_JENIS_PRODUK_DESC_SIZE,
  DEFAULT_JENIS_PRODUK_CARDS,
  DEFAULT_JENIS_PRODUK_CARD_DESC,
  getDarkCardOverlay,
  getDarkCardShadowColor,
  renderFormattedText,
  PeluangItem,
  DEFAULT_PELUANG_TITLE,
  DEFAULT_PELUANG_TITLE_SIZE,
  DEFAULT_PELUANG_TITLE_COLOR,
  DEFAULT_PELUANG_TITLE_FONT,
  DEFAULT_PELUANG_TITLE_FONT_WEIGHT,
  DEFAULT_PELUANG_DESC,
  DEFAULT_PELUANG_DESC_SIZE,
  DEFAULT_PELUANG_DESC_COLOR,
  DEFAULT_PELUANG_DESC_ALIGN,
  DEFAULT_PELUANG_VALIGN,
  DEFAULT_PELUANG_BOX_TITLE,
  DEFAULT_PELUANG_BOX_BG_COLOR,
  DEFAULT_PELUANG_BOX_TITLE_COLOR,
  DEFAULT_PELUANG_ITEMS,
  MengapaMemilihCard,
  DEFAULT_MENGAPA_TITLE,
  DEFAULT_MENGAPA_TITLE_SIZE,
  DEFAULT_MENGAPA_TITLE_COLOR,
  DEFAULT_MENGAPA_TITLE_FONT,
  DEFAULT_MENGAPA_TITLE_FONT_WEIGHT,
  DEFAULT_MENGAPA_SUBTITLE,
  DEFAULT_MENGAPA_SUBTITLE_SIZE,
  DEFAULT_MENGAPA_SUBTITLE_COLOR,
  DEFAULT_MENGAPA_SUBTITLE_ALIGN,
  DEFAULT_MENGAPA_CARD_BG,
  DEFAULT_MENGAPA_CARD_TITLE_COLOR,
  DEFAULT_MENGAPA_CARD_DESC_COLOR,
  DEFAULT_MENGAPA_CARDS,
  LegalitasItem,
  DEFAULT_LEGALITAS_TITLE,
  DEFAULT_LEGALITAS_TITLE_SIZE,
  DEFAULT_LEGALITAS_TITLE_COLOR,
  DEFAULT_LEGALITAS_TITLE_FONT,
  DEFAULT_LEGALITAS_TITLE_FONT_WEIGHT,
  DEFAULT_LEGALITAS_SUBTITLE,
  DEFAULT_LEGALITAS_SUBTITLE_SIZE,
  DEFAULT_LEGALITAS_SUBTITLE_COLOR,
  DEFAULT_LEGALITAS_SUBTITLE_ALIGN,
  DEFAULT_LEGALITAS_CARD_BG,
  DEFAULT_LEGALITAS_ITEMS,
  DipercayaBrandItem,
  DEFAULT_DIPERCAYA_BRAND_TITLE,
  DEFAULT_DIPERCAYA_BRAND_TITLE_SIZE,
  DEFAULT_DIPERCAYA_BRAND_TITLE_COLOR,
  DEFAULT_DIPERCAYA_BRAND_TITLE_FONT,
  DEFAULT_DIPERCAYA_BRAND_TITLE_FONT_WEIGHT,
  DEFAULT_DIPERCAYA_BRAND_SUBTITLE,
  DEFAULT_DIPERCAYA_BRAND_SUBTITLE_SIZE,
  DEFAULT_DIPERCAYA_BRAND_SUBTITLE_COLOR,
  DEFAULT_DIPERCAYA_BRAND_SUBTITLE_ALIGN,
  DEFAULT_DIPERCAYA_BRAND_CARD_BG,
  DEFAULT_DIPERCAYA_BRAND_ITEMS,
  ProsesMaklonItem,
  DEFAULT_PROSES_MAKLON_TITLE,
  DEFAULT_PROSES_MAKLON_TITLE_SIZE,
  DEFAULT_PROSES_MAKLON_TITLE_COLOR,
  DEFAULT_PROSES_MAKLON_TITLE_FONT,
  DEFAULT_PROSES_MAKLON_TITLE_FONT_WEIGHT,
  DEFAULT_PROSES_MAKLON_SUBTITLE,
  DEFAULT_PROSES_MAKLON_SUBTITLE_SIZE,
  DEFAULT_PROSES_MAKLON_SUBTITLE_COLOR,
  DEFAULT_PROSES_MAKLON_SUBTITLE_ALIGN,
  DEFAULT_PROSES_MAKLON_CARD_BG,
  DEFAULT_PROSES_MAKLON_CARD_TEXT_COLOR,
  DEFAULT_PROSES_MAKLON_ITEMS,
  DEFAULT_KONSULTASI_BANNER_TEXT,
  DEFAULT_KONSULTASI_BANNER_TEXT_SIZE,
  DEFAULT_KONSULTASI_BANNER_TEXT_COLOR,
  DEFAULT_KONSULTASI_BANNER_TEXT_FONT,
  DEFAULT_KONSULTASI_BANNER_TEXT_FONT_WEIGHT,
  DEFAULT_KONSULTASI_BANNER_BG_COLOR,
  DEFAULT_KONSULTASI_BANNER_BORDER_RADIUS,
  DEFAULT_KONSULTASI_BANNER_BTN_TEXT,
  DEFAULT_KONSULTASI_BANNER_BTN_BG_COLOR,
  DEFAULT_KONSULTASI_BANNER_BTN_TEXT_COLOR,
  DEFAULT_KONSULTASI_BANNER_BTN_TEXT_SIZE,
  DEFAULT_KONSULTASI_BANNER_BTN_FONT_WEIGHT,
  DEFAULT_KONSULTASI_BANNER_LINK_TYPE,
  DEFAULT_KONSULTASI_BANNER_WA_NUMBER,
  DEFAULT_KONSULTASI_BANNER_WA_MESSAGE,
  DEFAULT_KONSULTASI_BANNER_CUSTOM_URL,
  DEFAULT_KONSULTASI_BANNER_OPEN_NEW_TAB,
  buildKonsultasiBannerUrl,
  DEFAULT_MELAYANI_KLIEN_TITLE,
  DEFAULT_MELAYANI_KLIEN_TITLE_SIZE,
  DEFAULT_MELAYANI_KLIEN_TITLE_COLOR,
  DEFAULT_MELAYANI_KLIEN_TITLE_FONT,
  DEFAULT_MELAYANI_KLIEN_TITLE_FONT_WEIGHT,
  DEFAULT_MELAYANI_KLIEN_SUBTITLE,
  DEFAULT_MELAYANI_KLIEN_SUBTITLE_SIZE,
  DEFAULT_MELAYANI_KLIEN_SUBTITLE_COLOR,
  DEFAULT_MELAYANI_KLIEN_SUBTITLE_ALIGN,
  DEFAULT_MELAYANI_KLIEN_PILL_BG,
  DEFAULT_MELAYANI_KLIEN_PILL_TEXT_COLOR,
  DEFAULT_MELAYANI_KLIEN_PILL_SIZE,
  DEFAULT_MELAYANI_KLIEN_PILL_FONT_WEIGHT,
  DEFAULT_MELAYANI_KLIEN_CITIES,
  DEFAULT_ULASAN_KLIEN_TITLE,
  DEFAULT_ULASAN_KLIEN_TITLE_COLOR,
  DEFAULT_ULASAN_KLIEN_TITLE_SIZE,
  DEFAULT_ULASAN_KLIEN_TITLE_FONT,
  DEFAULT_ULASAN_KLIEN_TITLE_FONT_WEIGHT,
  DEFAULT_ULASAN_KLIEN_SUBTITLE,
  DEFAULT_ULASAN_KLIEN_SUBTITLE_SIZE,
  DEFAULT_ULASAN_KLIEN_SUBTITLE_COLOR,
  DEFAULT_ULASAN_KLIEN_BG,
  DEFAULT_ULASAN_KLIEN_CARD_BG,
  DEFAULT_ULASAN_KLIEN_CARD_BORDER,
  DEFAULT_ULASAN_KLIEN_ITEMS,
  type UlasanKlienItem,
  DEFAULT_FAQ_TITLE,
  DEFAULT_FAQ_TITLE_COLOR,
  DEFAULT_FAQ_TITLE_SIZE,
  DEFAULT_FAQ_TITLE_FONT,
  DEFAULT_FAQ_TITLE_FONT_WEIGHT,
  DEFAULT_FAQ_SUBTITLE,
  DEFAULT_FAQ_SUBTITLE_SIZE,
  DEFAULT_FAQ_SUBTITLE_COLOR,
  DEFAULT_FAQ_BG,
  DEFAULT_FAQ_CARD_BG,
  DEFAULT_FAQ_CARD_BORDER,
  DEFAULT_FAQ_ACTIVE_BORDER,
  DEFAULT_FAQ_QUESTION_COLOR,
  DEFAULT_FAQ_QUESTION_ACTIVE_COLOR,
  DEFAULT_FAQ_ANSWER_COLOR,
  DEFAULT_FAQ_ITEMS,
  type FaqItem,
  DEFAULT_VIDEO_PROFIL_TITLE,
  DEFAULT_VIDEO_PROFIL_TITLE_SIZE,
  DEFAULT_VIDEO_PROFIL_TITLE_COLOR,
  DEFAULT_VIDEO_PROFIL_TITLE_FONT,
  DEFAULT_VIDEO_PROFIL_TITLE_FONT_WEIGHT,
  DEFAULT_VIDEO_PROFIL_DESC,
  DEFAULT_VIDEO_PROFIL_DESC_SIZE,
  DEFAULT_VIDEO_PROFIL_DESC_COLOR,
  DEFAULT_VIDEO_PROFIL_THUMBNAIL,
  DEFAULT_VIDEO_PROFIL_URL,
  DEFAULT_VIDEO_PROFIL_POSITION,
  DEFAULT_VIDEO_PROFIL_FRAME_SIZE,
  getEmbedVideoUrl,
  DEFAULT_SOSIAL_MEDIA_TITLE,
  DEFAULT_SOSIAL_MEDIA_TITLE_SIZE,
  DEFAULT_SOSIAL_MEDIA_TITLE_COLOR,
  DEFAULT_SOSIAL_MEDIA_TITLE_FONT,
  DEFAULT_SOSIAL_MEDIA_TITLE_FONT_WEIGHT,
  DEFAULT_SOSIAL_MEDIA_LABEL,
  DEFAULT_SOSIAL_MEDIA_LABEL_SIZE,
  DEFAULT_SOSIAL_MEDIA_LABEL_COLOR,
  DEFAULT_SOSIAL_MEDIA_BG_COLOR,
  DEFAULT_SOSIAL_MEDIA_BORDER_RADIUS,
  DEFAULT_SOSIAL_MEDIA_ITEMS,
  type SosialMediaItem,
} from "@/lib/home-blocks";
import { AiFillTikTok, AiFillInstagram } from "react-icons/ai";
import { FaFacebook, FaYoutube } from "react-icons/fa";
import { BsBrowserChrome } from "react-icons/bs";
import { CalendarDays, MapPin, Star, Check, Image as ImageIcon, ShieldCheck, ChevronDown, Play, X } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem, CarouselDots, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/loading-spinner";

export default function HomePage() {
  const router = useRouter();
  const [banners, setBanners] = useState<any[]>([]);
  const [promos, setPromos] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [heroText, setHeroText] = useState(DEFAULT_HERO_TEXT);
  const [heroFont, setHeroFont] = useState(DEFAULT_HERO_FONT);
  const [heroFontWeight, setHeroFontWeight] = useState(DEFAULT_HERO_FONT_WEIGHT);
  const [heroFontSize, setHeroFontSize] = useState(DEFAULT_HERO_FONT_SIZE);
  const [heroTextColor, setHeroTextColor] = useState(DEFAULT_HERO_TEXT_COLOR);
  const [heroSubtext, setHeroSubtext] = useState(DEFAULT_HERO_SUBTEXT);
  const [heroSubtextColor, setHeroSubtextColor] = useState(DEFAULT_HERO_SUBTEXT_COLOR);
  const [heroSubtextSize, setHeroSubtextSize] = useState<number>(DEFAULT_HERO_SUBTEXT_SIZE);
  const [heroSubtextFontWeight, setHeroSubtextFontWeight] = useState(DEFAULT_HERO_SUBTEXT_FONT_WEIGHT);
  const [heroDesc, setHeroDesc] = useState(DEFAULT_HERO_DESC);
  const [heroDescColor, setHeroDescColor] = useState(DEFAULT_HERO_DESC_COLOR);
  const [heroDescSize, setHeroDescSize] = useState<number | null>(null);
  const [heroPoints, setHeroPoints] = useState<string[]>(DEFAULT_HERO_POINTS);
  const [heroPointsFontWeight, setHeroPointsFontWeight] = useState(DEFAULT_HERO_POINTS_FONT_WEIGHT);
  const [heroPointsColor, setHeroPointsColor] = useState(DEFAULT_HERO_POINTS_COLOR);
  const [heroImagePosition, setHeroImagePosition] = useState<"left" | "right">(DEFAULT_HERO_IMAGE_POSITION);
  const [heroImageAspect, setHeroImageAspect] = useState(DEFAULT_HERO_IMAGE_ASPECT);
  const [heroImageSize, setHeroImageSize] = useState(DEFAULT_HERO_IMAGE_SIZE);
  const [heroImage, setHeroImage] = useState(DEFAULT_HERO_IMAGE);
  const [heroImageTransparent, setHeroImageTransparent] = useState<boolean>(DEFAULT_HERO_IMAGE_TRANSPARENT);
  const [heroImageFit, setHeroImageFit] = useState<"cover" | "contain">(DEFAULT_HERO_IMAGE_FIT);
  const [hero2Text, setHero2Text] = useState("Nikmati Kualitas Herbal Pilihan Premium \nCV. Indo Green Nature \n100 % Alami & Terpercaya");
  const [hero2Font, setHero2Font] = useState("jockey");
  const [hero2FontSize, setHero2FontSize] = useState<number | null>(null);
  const [hero2Image, setHero2Image] = useState("");
  // Pengenalan (Mengenal Indo Green Nature) states
  const [pengenalanTitle, setPengenalanTitle] = useState(DEFAULT_PENGENALAN_TITLE);
  const [pengenalanTitleSize, setPengenalanTitleSize] = useState<number>(DEFAULT_PENGENALAN_TITLE_SIZE);
  const [pengenalanTitleColor, setPengenalanTitleColor] = useState(DEFAULT_PENGENALAN_TITLE_COLOR);
  const [pengenalanTitleFont, setPengenalanTitleFont] = useState(DEFAULT_PENGENALAN_TITLE_FONT);
  const [pengenalanTitleFontWeight, setPengenalanTitleFontWeight] = useState(DEFAULT_PENGENALAN_TITLE_FONT_WEIGHT);
  const [pengenalanDesc, setPengenalanDesc] = useState(DEFAULT_PENGENALAN_DESC);
  const [pengenalanDescSize, setPengenalanDescSize] = useState<number>(DEFAULT_PENGENALAN_DESC_SIZE);
  const [pengenalanDescColor, setPengenalanDescColor] = useState(DEFAULT_PENGENALAN_DESC_COLOR);
  const [pengenalanImage, setPengenalanImage] = useState(DEFAULT_PENGENALAN_IMAGE);
  const [pengenalanImageFit, setPengenalanImageFit] = useState<"cover" | "contain" | "fill">(DEFAULT_PENGENALAN_IMAGE_FIT);
  const [pengenalanImagePosition, setPengenalanImagePosition] = useState<"left" | "right">(DEFAULT_PENGENALAN_IMAGE_POSITION);
  const [pengenalanImageSize, setPengenalanImageSize] = useState<number>(DEFAULT_PENGENALAN_IMAGE_SIZE);
  const [pengenalanImageScale, setPengenalanImageScale] = useState<number>(DEFAULT_PENGENALAN_IMAGE_SCALE);
  // Solusi Bisnis Maklon states
  const [solusiBisnisTitle, setSolusiBisnisTitle] = useState(DEFAULT_SOLUSI_BISNIS_TITLE);
  const [solusiBisnisTitleSize, setSolusiBisnisTitleSize] = useState<number>(DEFAULT_SOLUSI_BISNIS_TITLE_SIZE);
  const [solusiBisnisTitleColor, setSolusiBisnisTitleColor] = useState(DEFAULT_SOLUSI_BISNIS_TITLE_COLOR);
  const [solusiBisnisTitleFont, setSolusiBisnisTitleFont] = useState(DEFAULT_SOLUSI_BISNIS_TITLE_FONT);
  const [solusiBisnisTitleFontWeight, setSolusiBisnisTitleFontWeight] = useState(DEFAULT_SOLUSI_BISNIS_TITLE_FONT_WEIGHT);
  const [solusiBisnisDescAlign, setSolusiBisnisDescAlign] = useState<"center" | "left" | "justify">(DEFAULT_SOLUSI_BISNIS_DESC_ALIGN);
  const [solusiBisnisValign, setSolusiBisnisValign] = useState<"center" | "top">(DEFAULT_SOLUSI_BISNIS_VALIGN);
  const [solusiBisnisCards, setSolusiBisnisCards] = useState<SolusiBisnisCard[]>(DEFAULT_SOLUSI_BISNIS_CARDS);
  const [solusiBisnisCardTitleColor, setSolusiBisnisCardTitleColor] = useState(DEFAULT_SOLUSI_BISNIS_CARD_TITLE_COLOR);
  const [solusiBisnisCardTitleSize, setSolusiBisnisCardTitleSize] = useState<number>(DEFAULT_SOLUSI_BISNIS_CARD_TITLE_SIZE);
  const [solusiBisnisCardTitleFontWeight, setSolusiBisnisCardTitleFontWeight] = useState(DEFAULT_SOLUSI_BISNIS_CARD_TITLE_FONT_WEIGHT);
  const [solusiBisnisCardTitleFont, setSolusiBisnisCardTitleFont] = useState(DEFAULT_SOLUSI_BISNIS_CARD_TITLE_FONT);
  // Jenis Produk Maklon states
  const [jenisProdukTitle, setJenisProdukTitle] = useState(DEFAULT_JENIS_PRODUK_TITLE);
  const [jenisProdukTitleSize, setJenisProdukTitleSize] = useState<number>(DEFAULT_JENIS_PRODUK_TITLE_SIZE);
  const [jenisProdukTitleColor, setJenisProdukTitleColor] = useState(DEFAULT_JENIS_PRODUK_TITLE_COLOR);
  const [jenisProdukTitleFont, setJenisProdukTitleFont] = useState(DEFAULT_JENIS_PRODUK_TITLE_FONT);
  const [jenisProdukTitleFontWeight, setJenisProdukTitleFontWeight] = useState(DEFAULT_JENIS_PRODUK_TITLE_FONT_WEIGHT);
  const [jenisProdukDesc, setJenisProdukDesc] = useState(DEFAULT_JENIS_PRODUK_DESC);
  const [jenisProdukDescColor, setJenisProdukDescColor] = useState(DEFAULT_JENIS_PRODUK_DESC_COLOR);
  const [jenisProdukDescSize, setJenisProdukDescSize] = useState<number>(DEFAULT_JENIS_PRODUK_DESC_SIZE);
  const [jenisProdukCards, setJenisProdukCards] = useState<JenisProdukCard[]>(DEFAULT_JENIS_PRODUK_CARDS);
  // Peluang Pasar Global states
  const [peluangTitle, setPeluangTitle] = useState(DEFAULT_PELUANG_TITLE);
  const [peluangTitleSize, setPeluangTitleSize] = useState<number>(DEFAULT_PELUANG_TITLE_SIZE);
  const [peluangTitleColor, setPeluangTitleColor] = useState(DEFAULT_PELUANG_TITLE_COLOR);
  const [peluangTitleFont, setPeluangTitleFont] = useState(DEFAULT_PELUANG_TITLE_FONT);
  const [peluangTitleFontWeight, setPeluangTitleFontWeight] = useState(DEFAULT_PELUANG_TITLE_FONT_WEIGHT);
  const [peluangDesc, setPeluangDesc] = useState(DEFAULT_PELUANG_DESC);
  const [peluangDescColor, setPeluangDescColor] = useState(DEFAULT_PELUANG_DESC_COLOR);
  const [peluangDescSize, setPeluangDescSize] = useState<number>(DEFAULT_PELUANG_DESC_SIZE);
  const [peluangDescAlign, setPeluangDescAlign] = useState<"left" | "center" | "justify">(DEFAULT_PELUANG_DESC_ALIGN);
  const [peluangValign, setPeluangValign] = useState<"center" | "top">(DEFAULT_PELUANG_VALIGN);
  const [peluangBoxTitle, setPeluangBoxTitle] = useState(DEFAULT_PELUANG_BOX_TITLE);
  const [peluangBoxBgColor, setPeluangBoxBgColor] = useState(DEFAULT_PELUANG_BOX_BG_COLOR);
  const [peluangBoxTitleColor, setPeluangBoxTitleColor] = useState(DEFAULT_PELUANG_BOX_TITLE_COLOR);
  const [peluangItems, setPeluangItems] = useState<PeluangItem[]>(DEFAULT_PELUANG_ITEMS);

  // Our Products Settings untuk Frame Gambar Animasi Peluang (Inisialisasi SSR stabil dengan DEFAULT untuk mencegah Hydration Mismatch)
  const [ourProductsSettings, setOurProductsSettings] = useState<OurProductsSettingsData>(DEFAULT_OUR_PRODUCTS_SETTINGS);

  useEffect(() => {
    // Muat cache lokal setelah mount di client secara instan
    try {
      const cached = getInitialOurProductsSettings();
      if (cached) {
        setOurProductsSettings(cached);
      }
    } catch {}

    const handleOurProductsStorage = (e: StorageEvent) => {
      if (e.key === OUR_PRODUCTS_SETTINGS_KEY && e.newValue) {
        try {
          setOurProductsSettings(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener("storage", handleOurProductsStorage);

    let ourProductsBc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== "undefined") {
      try {
        ourProductsBc = new BroadcastChannel(OUR_PRODUCTS_PREVIEW_CHANNEL);
        ourProductsBc.onmessage = (ev) => {
          if (ev.data) setOurProductsSettings(ev.data);
        };
      } catch {}
    }

    return () => {
      window.removeEventListener("storage", handleOurProductsStorage);
      if (ourProductsBc) ourProductsBc.close();
    };
  }, []);

  const peluangSlideLeft = ourProductsSettings.slideImagesLeft && ourProductsSettings.slideImagesLeft.length > 0
    ? ourProductsSettings.slideImagesLeft
    : DEFAULT_OUR_PRODUCTS_SETTINGS.slideImagesLeft;
  const peluangSlideRight = ourProductsSettings.slideImagesRight && ourProductsSettings.slideImagesRight.length > 0
    ? ourProductsSettings.slideImagesRight
    : DEFAULT_OUR_PRODUCTS_SETTINGS.slideImagesRight;
  const duplicatedPeluangLeft = [...peluangSlideLeft, ...peluangSlideLeft];
  const duplicatedPeluangRight = [...peluangSlideRight, ...peluangSlideRight];
  const peluangAnimDuration = Math.max(8, ourProductsSettings.slideSpeed || 18);

  // Mengapa Memilih INDO GREEN NATURE states
  const [mengapaTitle, setMengapaTitle] = useState(DEFAULT_MENGAPA_TITLE);
  const [mengapaTitleSize, setMengapaTitleSize] = useState<number>(DEFAULT_MENGAPA_TITLE_SIZE);
  const [mengapaTitleColor, setMengapaTitleColor] = useState(DEFAULT_MENGAPA_TITLE_COLOR);
  const [mengapaTitleFont, setMengapaTitleFont] = useState(DEFAULT_MENGAPA_TITLE_FONT);
  const [mengapaTitleFontWeight, setMengapaTitleFontWeight] = useState(DEFAULT_MENGAPA_TITLE_FONT_WEIGHT);
  const [mengapaSubtitle, setMengapaSubtitle] = useState(DEFAULT_MENGAPA_SUBTITLE);
  const [mengapaSubtitleColor, setMengapaSubtitleColor] = useState(DEFAULT_MENGAPA_SUBTITLE_COLOR);
  const [mengapaSubtitleSize, setMengapaSubtitleSize] = useState<number>(DEFAULT_MENGAPA_SUBTITLE_SIZE);
  const [mengapaSubtitleAlign, setMengapaSubtitleAlign] = useState<"center" | "left" | "justify">(DEFAULT_MENGAPA_SUBTITLE_ALIGN);
  const [mengapaCardBg, setMengapaCardBg] = useState(DEFAULT_MENGAPA_CARD_BG);
  const [mengapaCardTitleColor, setMengapaCardTitleColor] = useState(DEFAULT_MENGAPA_CARD_TITLE_COLOR);
  const [mengapaCardDescColor, setMengapaCardDescColor] = useState(DEFAULT_MENGAPA_CARD_DESC_COLOR);
  const [mengapaCards, setMengapaCards] = useState<MengapaMemilihCard[]>(DEFAULT_MENGAPA_CARDS);
  // Legalitas & Standar Kualitas states
  const [legalitasTitle, setLegalitasTitle] = useState(DEFAULT_LEGALITAS_TITLE);
  const [legalitasTitleSize, setLegalitasTitleSize] = useState<number>(DEFAULT_LEGALITAS_TITLE_SIZE);
  const [legalitasTitleColor, setLegalitasTitleColor] = useState(DEFAULT_LEGALITAS_TITLE_COLOR);
  const [legalitasTitleFont, setLegalitasTitleFont] = useState(DEFAULT_LEGALITAS_TITLE_FONT);
  const [legalitasTitleFontWeight, setLegalitasTitleFontWeight] = useState(DEFAULT_LEGALITAS_TITLE_FONT_WEIGHT);
  const [legalitasSubtitle, setLegalitasSubtitle] = useState(DEFAULT_LEGALITAS_SUBTITLE);
  const [legalitasSubtitleColor, setLegalitasSubtitleColor] = useState(DEFAULT_LEGALITAS_SUBTITLE_COLOR);
  const [legalitasSubtitleSize, setLegalitasSubtitleSize] = useState<number>(DEFAULT_LEGALITAS_SUBTITLE_SIZE);
  const [legalitasSubtitleAlign, setLegalitasSubtitleAlign] = useState<"center" | "left" | "justify">(DEFAULT_LEGALITAS_SUBTITLE_ALIGN);
  const [legalitasCardBg, setLegalitasCardBg] = useState(DEFAULT_LEGALITAS_CARD_BG);
  const [legalitasItems, setLegalitasItems] = useState<LegalitasItem[]>(DEFAULT_LEGALITAS_ITEMS);
  // Dipercaya Oleh Berbagai Brand states
  const [dipercayaBrandTitle, setDipercayaBrandTitle] = useState(DEFAULT_DIPERCAYA_BRAND_TITLE);
  const [dipercayaBrandTitleSize, setDipercayaBrandTitleSize] = useState<number>(DEFAULT_DIPERCAYA_BRAND_TITLE_SIZE);
  const [dipercayaBrandTitleColor, setDipercayaBrandTitleColor] = useState(DEFAULT_DIPERCAYA_BRAND_TITLE_COLOR);
  const [dipercayaBrandTitleFont, setDipercayaBrandTitleFont] = useState(DEFAULT_DIPERCAYA_BRAND_TITLE_FONT);
  const [dipercayaBrandTitleFontWeight, setDipercayaBrandTitleFontWeight] = useState(DEFAULT_DIPERCAYA_BRAND_TITLE_FONT_WEIGHT);
  const [dipercayaBrandSubtitle, setDipercayaBrandSubtitle] = useState(DEFAULT_DIPERCAYA_BRAND_SUBTITLE);
  const [dipercayaBrandSubtitleColor, setDipercayaBrandSubtitleColor] = useState(DEFAULT_DIPERCAYA_BRAND_SUBTITLE_COLOR);
  const [dipercayaBrandSubtitleSize, setDipercayaBrandSubtitleSize] = useState<number>(DEFAULT_DIPERCAYA_BRAND_SUBTITLE_SIZE);
  const [dipercayaBrandSubtitleAlign, setDipercayaBrandSubtitleAlign] = useState<"center" | "left" | "justify">(DEFAULT_DIPERCAYA_BRAND_SUBTITLE_ALIGN);
  const [dipercayaBrandCardBg, setDipercayaBrandCardBg] = useState(DEFAULT_DIPERCAYA_BRAND_CARD_BG);
  const [dipercayaBrandItems, setDipercayaBrandItems] = useState<DipercayaBrandItem[]>(DEFAULT_DIPERCAYA_BRAND_ITEMS);
  // Proses Jasa Maklon Herbal states
  const [prosesMaklonTitle, setProsesMaklonTitle] = useState(DEFAULT_PROSES_MAKLON_TITLE);
  const [prosesMaklonTitleSize, setProsesMaklonTitleSize] = useState<number>(DEFAULT_PROSES_MAKLON_TITLE_SIZE);
  const [prosesMaklonTitleColor, setProsesMaklonTitleColor] = useState(DEFAULT_PROSES_MAKLON_TITLE_COLOR);
  const [prosesMaklonTitleFont, setProsesMaklonTitleFont] = useState(DEFAULT_PROSES_MAKLON_TITLE_FONT);
  const [prosesMaklonTitleFontWeight, setProsesMaklonTitleFontWeight] = useState(DEFAULT_PROSES_MAKLON_TITLE_FONT_WEIGHT);
  const [prosesMaklonSubtitle, setProsesMaklonSubtitle] = useState(DEFAULT_PROSES_MAKLON_SUBTITLE);
  const [prosesMaklonSubtitleColor, setProsesMaklonSubtitleColor] = useState(DEFAULT_PROSES_MAKLON_SUBTITLE_COLOR);
  const [prosesMaklonSubtitleSize, setProsesMaklonSubtitleSize] = useState<number>(DEFAULT_PROSES_MAKLON_SUBTITLE_SIZE);
  const [prosesMaklonSubtitleAlign, setProsesMaklonSubtitleAlign] = useState<"center" | "left" | "justify">(DEFAULT_PROSES_MAKLON_SUBTITLE_ALIGN);
  const [prosesMaklonCardBg, setProsesMaklonCardBg] = useState(DEFAULT_PROSES_MAKLON_CARD_BG);
  const [prosesMaklonCardTextColor, setProsesMaklonCardTextColor] = useState(DEFAULT_PROSES_MAKLON_CARD_TEXT_COLOR);
  const [prosesMaklonItems, setProsesMaklonItems] = useState<ProsesMaklonItem[]>(DEFAULT_PROSES_MAKLON_ITEMS);
  const [konsultasiBannerText, setKonsultasiBannerText] = useState(DEFAULT_KONSULTASI_BANNER_TEXT);
  const [konsultasiBannerTextSize, setKonsultasiBannerTextSize] = useState<number>(DEFAULT_KONSULTASI_BANNER_TEXT_SIZE);
  const [konsultasiBannerTextColor, setKonsultasiBannerTextColor] = useState(DEFAULT_KONSULTASI_BANNER_TEXT_COLOR);
  const [konsultasiBannerTextFont, setKonsultasiBannerTextFont] = useState(DEFAULT_KONSULTASI_BANNER_TEXT_FONT);
  const [konsultasiBannerTextFontWeight, setKonsultasiBannerTextFontWeight] = useState(DEFAULT_KONSULTASI_BANNER_TEXT_FONT_WEIGHT);
  const [konsultasiBannerBgColor, setKonsultasiBannerBgColor] = useState(DEFAULT_KONSULTASI_BANNER_BG_COLOR);
  const [konsultasiBannerBorderRadius, setKonsultasiBannerBorderRadius] = useState<number>(DEFAULT_KONSULTASI_BANNER_BORDER_RADIUS);
  const [konsultasiBannerBtnText, setKonsultasiBannerBtnText] = useState(DEFAULT_KONSULTASI_BANNER_BTN_TEXT);
  const [konsultasiBannerBtnBgColor, setKonsultasiBannerBtnBgColor] = useState(DEFAULT_KONSULTASI_BANNER_BTN_BG_COLOR);
  const [konsultasiBannerBtnTextColor, setKonsultasiBannerBtnTextColor] = useState(DEFAULT_KONSULTASI_BANNER_BTN_TEXT_COLOR);
  const [konsultasiBannerBtnTextSize, setKonsultasiBannerBtnTextSize] = useState<number>(DEFAULT_KONSULTASI_BANNER_BTN_TEXT_SIZE);
  const [konsultasiBannerBtnFontWeight, setKonsultasiBannerBtnFontWeight] = useState(DEFAULT_KONSULTASI_BANNER_BTN_FONT_WEIGHT);
  const [konsultasiBannerLinkType, setKonsultasiBannerLinkType] = useState<"whatsapp" | "custom">(DEFAULT_KONSULTASI_BANNER_LINK_TYPE);
  const [konsultasiBannerWaNumber, setKonsultasiBannerWaNumber] = useState(DEFAULT_KONSULTASI_BANNER_WA_NUMBER);
  const [konsultasiBannerWaMessage, setKonsultasiBannerWaMessage] = useState(DEFAULT_KONSULTASI_BANNER_WA_MESSAGE);
  const [konsultasiBannerCustomUrl, setKonsultasiBannerCustomUrl] = useState(DEFAULT_KONSULTASI_BANNER_CUSTOM_URL);
  const [konsultasiBannerOpenNewTab, setKonsultasiBannerOpenNewTab] = useState(DEFAULT_KONSULTASI_BANNER_OPEN_NEW_TAB);
  const [melayaniKlienTitle, setMelayaniKlienTitle] = useState(DEFAULT_MELAYANI_KLIEN_TITLE);
  const [melayaniKlienTitleSize, setMelayaniKlienTitleSize] = useState<number>(DEFAULT_MELAYANI_KLIEN_TITLE_SIZE);
  const [melayaniKlienTitleColor, setMelayaniKlienTitleColor] = useState(DEFAULT_MELAYANI_KLIEN_TITLE_COLOR);
  const [melayaniKlienTitleFont, setMelayaniKlienTitleFont] = useState(DEFAULT_MELAYANI_KLIEN_TITLE_FONT);
  const [melayaniKlienTitleFontWeight, setMelayaniKlienTitleFontWeight] = useState(DEFAULT_MELAYANI_KLIEN_TITLE_FONT_WEIGHT);
  const [melayaniKlienSubtitle, setMelayaniKlienSubtitle] = useState(DEFAULT_MELAYANI_KLIEN_SUBTITLE);
  const [melayaniKlienSubtitleSize, setMelayaniKlienSubtitleSize] = useState<number>(DEFAULT_MELAYANI_KLIEN_SUBTITLE_SIZE);
  const [melayaniKlienSubtitleColor, setMelayaniKlienSubtitleColor] = useState(DEFAULT_MELAYANI_KLIEN_SUBTITLE_COLOR);
  const [melayaniKlienSubtitleAlign, setMelayaniKlienSubtitleAlign] = useState<"center" | "left" | "justify">(DEFAULT_MELAYANI_KLIEN_SUBTITLE_ALIGN);
  const [melayaniKlienPillBg, setMelayaniKlienPillBg] = useState(DEFAULT_MELAYANI_KLIEN_PILL_BG);
  const [melayaniKlienPillTextColor, setMelayaniKlienPillTextColor] = useState(DEFAULT_MELAYANI_KLIEN_PILL_TEXT_COLOR);
  const [melayaniKlienPillSize, setMelayaniKlienPillSize] = useState<number>(DEFAULT_MELAYANI_KLIEN_PILL_SIZE);
  const [melayaniKlienPillFontWeight, setMelayaniKlienPillFontWeight] = useState(DEFAULT_MELAYANI_KLIEN_PILL_FONT_WEIGHT);
  const [melayaniKlienCities, setMelayaniKlienCities] = useState<string[]>(DEFAULT_MELAYANI_KLIEN_CITIES);
  const [ulasanKlienTitle, setUlasanKlienTitle] = useState(DEFAULT_ULASAN_KLIEN_TITLE);
  const [ulasanKlienTitleSize, setUlasanKlienTitleSize] = useState<number>(DEFAULT_ULASAN_KLIEN_TITLE_SIZE);
  const [ulasanKlienTitleColor, setUlasanKlienTitleColor] = useState(DEFAULT_ULASAN_KLIEN_TITLE_COLOR);
  const [ulasanKlienTitleFont, setUlasanKlienTitleFont] = useState(DEFAULT_ULASAN_KLIEN_TITLE_FONT);
  const [ulasanKlienTitleFontWeight, setUlasanKlienTitleFontWeight] = useState(DEFAULT_ULASAN_KLIEN_TITLE_FONT_WEIGHT);
  const [ulasanKlienSubtitle, setUlasanKlienSubtitle] = useState(DEFAULT_ULASAN_KLIEN_SUBTITLE);
  const [ulasanKlienSubtitleSize, setUlasanKlienSubtitleSize] = useState<number>(DEFAULT_ULASAN_KLIEN_SUBTITLE_SIZE);
  const [ulasanKlienSubtitleColor, setUlasanKlienSubtitleColor] = useState(DEFAULT_ULASAN_KLIEN_SUBTITLE_COLOR);
  const [ulasanKlienItems, setUlasanKlienItems] = useState<UlasanKlienItem[]>(DEFAULT_ULASAN_KLIEN_ITEMS);
  const [faqTitle, setFaqTitle] = useState(DEFAULT_FAQ_TITLE);
  const [faqTitleSize, setFaqTitleSize] = useState<number>(DEFAULT_FAQ_TITLE_SIZE);
  const [faqTitleColor, setFaqTitleColor] = useState(DEFAULT_FAQ_TITLE_COLOR);
  const [faqTitleFont, setFaqTitleFont] = useState(DEFAULT_FAQ_TITLE_FONT);
  const [faqTitleFontWeight, setFaqTitleFontWeight] = useState(DEFAULT_FAQ_TITLE_FONT_WEIGHT);
  const [faqSubtitle, setFaqSubtitle] = useState(DEFAULT_FAQ_SUBTITLE);
  const [faqSubtitleSize, setFaqSubtitleSize] = useState<number>(DEFAULT_FAQ_SUBTITLE_SIZE);
  const [faqSubtitleColor, setFaqSubtitleColor] = useState(DEFAULT_FAQ_SUBTITLE_COLOR);
  const [faqQuestionColor, setFaqQuestionColor] = useState(DEFAULT_FAQ_QUESTION_COLOR);
  const [faqQuestionActiveColor, setFaqQuestionActiveColor] = useState(DEFAULT_FAQ_QUESTION_ACTIVE_COLOR);
  const [faqAnswerColor, setFaqAnswerColor] = useState(DEFAULT_FAQ_ANSWER_COLOR);
  const [faqItems, setFaqItems] = useState<FaqItem[]>(DEFAULT_FAQ_ITEMS);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null); // default semua tertutup saat halaman dimuat/direfresh
  
  // Video Profil Mengenal IGN states
  const [videoProfilTitle, setVideoProfilTitle] = useState(DEFAULT_VIDEO_PROFIL_TITLE);
  const [videoProfilTitleSize, setVideoProfilTitleSize] = useState<number>(DEFAULT_VIDEO_PROFIL_TITLE_SIZE);
  const [videoProfilTitleColor, setVideoProfilTitleColor] = useState(DEFAULT_VIDEO_PROFIL_TITLE_COLOR);
  const [videoProfilTitleFont, setVideoProfilTitleFont] = useState(DEFAULT_VIDEO_PROFIL_TITLE_FONT);
  const [videoProfilTitleFontWeight, setVideoProfilTitleFontWeight] = useState(DEFAULT_VIDEO_PROFIL_TITLE_FONT_WEIGHT);
  const [videoProfilDesc, setVideoProfilDesc] = useState(DEFAULT_VIDEO_PROFIL_DESC);
  const [videoProfilDescSize, setVideoProfilDescSize] = useState<number>(DEFAULT_VIDEO_PROFIL_DESC_SIZE);
  const [videoProfilDescColor, setVideoProfilDescColor] = useState(DEFAULT_VIDEO_PROFIL_DESC_COLOR);
  const [videoProfilThumbnail, setVideoProfilThumbnail] = useState(DEFAULT_VIDEO_PROFIL_THUMBNAIL);
  const [videoProfilUrl, setVideoProfilUrl] = useState(DEFAULT_VIDEO_PROFIL_URL);
  const [videoProfilPosition, setVideoProfilPosition] = useState<"left" | "right">(DEFAULT_VIDEO_PROFIL_POSITION);
  const [videoProfilFrameSize, setVideoProfilFrameSize] = useState<number>(DEFAULT_VIDEO_PROFIL_FRAME_SIZE);

  // Banner Tautan Sosial Media states
  const [sosialMediaTitle, setSosialMediaTitle] = useState(DEFAULT_SOSIAL_MEDIA_TITLE);
  const [sosialMediaTitleSize, setSosialMediaTitleSize] = useState<number>(DEFAULT_SOSIAL_MEDIA_TITLE_SIZE);
  const [sosialMediaTitleColor, setSosialMediaTitleColor] = useState(DEFAULT_SOSIAL_MEDIA_TITLE_COLOR);
  const [sosialMediaTitleFont, setSosialMediaTitleFont] = useState(DEFAULT_SOSIAL_MEDIA_TITLE_FONT);
  const [sosialMediaTitleFontWeight, setSosialMediaTitleFontWeight] = useState(DEFAULT_SOSIAL_MEDIA_TITLE_FONT_WEIGHT);
  const [sosialMediaLabel, setSosialMediaLabel] = useState(DEFAULT_SOSIAL_MEDIA_LABEL);
  const [sosialMediaLabelSize, setSosialMediaLabelSize] = useState<number>(DEFAULT_SOSIAL_MEDIA_LABEL_SIZE);
  const [sosialMediaLabelColor, setSosialMediaLabelColor] = useState(DEFAULT_SOSIAL_MEDIA_LABEL_COLOR);
  const [sosialMediaBgColor, setSosialMediaBgColor] = useState(DEFAULT_SOSIAL_MEDIA_BG_COLOR);
  const [sosialMediaBorderRadius, setSosialMediaBorderRadius] = useState<number>(DEFAULT_SOSIAL_MEDIA_BORDER_RADIUS);
  const [sosialMediaItems, setSosialMediaItems] = useState<SosialMediaItem[]>(DEFAULT_SOSIAL_MEDIA_ITEMS);

  // Pop Up Video Modal
  const [activeVideoModalUrl, setActiveVideoModalUrl] = useState<string | null>(null);
  const [activeVideoModalTitle, setActiveVideoModalTitle] = useState<string>("Video Profil");
  
  // State loading menutup layar penuh z-[200] agar transisi reload mulus tanpa flashback top bar (sama seperti About & Contact)
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState<any[]>([]);
  const [runningTexts, setRunningTexts] = useState<any[]>([
    { id: 1, text: "Selamat datang di CV. Indo Green Nature!", is_active: true },
    { id: 4, text: "Kami buka setiap hari pukul 07.00 – 22.00 WIB. Terima kasih telah berbelanja bersama kami!", is_active: true },
    { id: 5, text: "Promo akhir pekan! Dapatkan diskon hingga 50% untuk produk pilihan setiap Sabtu & Minggu.", is_active: true }
  ]);
  const [rtConfig, setRtConfig] = useState({ is_enabled: true, speed: 'slow' });
  const [homeBlocks, setHomeBlocks] = useState<HomeBlock[]>(DEFAULT_HOME_BLOCKS);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [extLinks, setExtLinks] = useState<Record<string, string>>({});
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const orderPlatforms = [
    { name: "GrabFood", src: "/grabfood.png", href: extLinks.grabfood_link },
    { name: "ShopeeFood", src: "/shopeefood.png", href: extLinks.shopeefood_link },
    { name: "GoFood", src: "/gofood.png", href: extLinks.gofood_link },
  ].filter((p) => Boolean(p.href && p.href.trim() !== ""));

  const bannerPlugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));
  const productPlugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));
  const ulasanPlugin = useRef(Autoplay({ delay: 3500, stopOnInteraction: false }));
  const jenisProdukPlugin = useRef(Autoplay({ delay: 3500, stopOnInteraction: true }));
  const mengapaPlugin = useRef(Autoplay({ delay: 3500, stopOnInteraction: true }));
  const prosesMaklonPlugin = useRef(Autoplay({ delay: 3500, stopOnInteraction: true }));

  useEffect(() => {
    const isPreview = typeof window !== "undefined" && window.location.search.includes("preview=true");
    if (isPreview) {
      setIsPreviewMode(true);
    }
    const layoutKey = isPreview ? HOME_LAYOUT_PREVIEW_KEY : HOME_LAYOUT_KEY;

    const refreshLayout = () => {
      setHomeBlocks(loadHomeLayout(layoutKey));
      if (isPreview) {
        const pText = localStorage.getItem("hero_banner_preview_text");
        if (pText !== null) setHeroText(pText);
        const pFont = localStorage.getItem("hero_banner_preview_font");
        if (pFont !== null) setHeroFont(pFont);
        const pWeight = localStorage.getItem("hero_banner_preview_font_weight");
        if (pWeight !== null) setHeroFontWeight(pWeight);
        const pSize = localStorage.getItem("hero_banner_preview_font_size");
        if (pSize !== null) setHeroFontSize(pSize);
        const pColor = localStorage.getItem("hero_banner_preview_text_color");
        if (pColor !== null) setHeroTextColor(pColor);
        const pSubtext = localStorage.getItem("hero_banner_preview_subtext");
        if (pSubtext !== null) setHeroSubtext(pSubtext);
        const pSubColor = localStorage.getItem("hero_banner_preview_subtext_color");
        if (pSubColor !== null) setHeroSubtextColor(pSubColor);
        const pSubSize = localStorage.getItem("hero_banner_preview_subtext_size");
        if (pSubSize !== null) {
          const num = parseInt(pSubSize, 10);
          if (!isNaN(num)) setHeroSubtextSize(num);
        }
        const pSubWeight = localStorage.getItem("hero_banner_preview_subtext_font_weight");
        if (pSubWeight !== null) setHeroSubtextFontWeight(pSubWeight);
        const pDesc = localStorage.getItem("hero_banner_preview_desc");
        if (pDesc !== null) setHeroDesc(pDesc);
        const pDescColor = localStorage.getItem("hero_banner_preview_desc_color");
        if (pDescColor !== null) setHeroDescColor(pDescColor);
        const pPoints = localStorage.getItem("hero_banner_preview_points");
        if (pPoints !== null) {
          try {
            const parsed = JSON.parse(pPoints);
            if (Array.isArray(parsed)) setHeroPoints(parsed);
          } catch (e) { }
        }
        const pPos = localStorage.getItem("hero_banner_preview_image_position") as "left" | "right" | null;
        if (pPos === "left" || pPos === "right") setHeroImagePosition(pPos);
        const pAspect = localStorage.getItem("hero_banner_preview_image_aspect");
        if (pAspect !== null) setHeroImageAspect(pAspect);
        const pImgSize = localStorage.getItem("hero_banner_preview_image_size");
        if (pImgSize !== null) setHeroImageSize(pImgSize);
        const pImg = localStorage.getItem("hero_banner_preview_image");
        if (pImg !== null) setHeroImage(pImg);
        const pTrans = localStorage.getItem("hero_banner_preview_image_transparent");
        if (pTrans !== null) setHeroImageTransparent(pTrans === "true");
        const pFit = localStorage.getItem("hero_banner_preview_image_fit");
        if (pFit === "contain" || pFit === "cover") setHeroImageFit(pFit);
        const pPTitle = localStorage.getItem("pengenalan_preview_title");
        if (pPTitle !== null) setPengenalanTitle(pPTitle);
        const pPTitleSize = localStorage.getItem("pengenalan_preview_title_size");
        if (pPTitleSize !== null) { const num = parseInt(pPTitleSize, 10); if (!isNaN(num)) setPengenalanTitleSize(num); }
        const pPTitleColor = localStorage.getItem("pengenalan_preview_title_color");
        if (pPTitleColor !== null) setPengenalanTitleColor(pPTitleColor);
        const pPTitleFont = localStorage.getItem("pengenalan_preview_title_font");
        if (pPTitleFont !== null) setPengenalanTitleFont(pPTitleFont);
        const pPTitleWeight = localStorage.getItem("pengenalan_preview_title_font_weight");
        if (pPTitleWeight !== null) setPengenalanTitleFontWeight(pPTitleWeight);
        const pPDesc = localStorage.getItem("pengenalan_preview_desc");
        if (pPDesc !== null) setPengenalanDesc(pPDesc);
        const pPDescSize = localStorage.getItem("pengenalan_preview_desc_size");
        if (pPDescSize !== null) { const num = parseInt(pPDescSize, 10); if (!isNaN(num)) setPengenalanDescSize(num); }
        const pPDescColor = localStorage.getItem("pengenalan_preview_desc_color");
        if (pPDescColor !== null) setPengenalanDescColor(pPDescColor);
        const pPImage = localStorage.getItem("pengenalan_preview_image");
        if (pPImage !== null) setPengenalanImage(pPImage);
        const pPImageFit = localStorage.getItem("pengenalan_preview_image_fit");
        if (pPImageFit === "cover" || pPImageFit === "contain" || pPImageFit === "fill") setPengenalanImageFit(pPImageFit);
        const pPImagePos = localStorage.getItem("pengenalan_preview_image_position");
        if (pPImagePos === "left" || pPImagePos === "right") setPengenalanImagePosition(pPImagePos);
        const pPImageSize = localStorage.getItem("pengenalan_preview_image_size");
        if (pPImageSize !== null) { const num = parseInt(pPImageSize, 10); if (!isNaN(num)) setPengenalanImageSize(num); }
        const pPImageScale = localStorage.getItem("pengenalan_preview_image_scale");
        if (pPImageScale !== null) { const num = parseInt(pPImageScale, 10); if (!isNaN(num)) setPengenalanImageScale(num); }
        // Solusi Bisnis Preview
        const pSTitle = localStorage.getItem("solusi_bisnis_preview_title");
        if (pSTitle !== null) setSolusiBisnisTitle(pSTitle);
        const pSTitleSize = localStorage.getItem("solusi_bisnis_preview_title_size");
        if (pSTitleSize !== null) { const num = parseInt(pSTitleSize, 10); if (!isNaN(num)) setSolusiBisnisTitleSize(num); }
        const pSTitleColor = localStorage.getItem("solusi_bisnis_preview_title_color");
        if (pSTitleColor !== null) setSolusiBisnisTitleColor(pSTitleColor);
        const pSTitleFont = localStorage.getItem("solusi_bisnis_preview_title_font");
        if (pSTitleFont !== null) setSolusiBisnisTitleFont(pSTitleFont);
        const pSTitleWeight = localStorage.getItem("solusi_bisnis_preview_title_font_weight");
        if (pSTitleWeight !== null) setSolusiBisnisTitleFontWeight(pSTitleWeight);
        const pSDescAlign = localStorage.getItem("solusi_bisnis_preview_desc_align") as "center" | "left" | "justify" | null;
        if (pSDescAlign === "center" || pSDescAlign === "left" || pSDescAlign === "justify") setSolusiBisnisDescAlign(pSDescAlign);
        const pSValign = localStorage.getItem("solusi_bisnis_preview_valign") as "center" | "top" | null;
        if (pSValign === "center" || pSValign === "top") setSolusiBisnisValign(pSValign);
        const pSCards = localStorage.getItem("solusi_bisnis_preview_cards");
        if (pSCards !== null) {
          try {
            const parsed = JSON.parse(pSCards);
            if (Array.isArray(parsed)) setSolusiBisnisCards(parsed);
          } catch (e) {}
        }
        const pSCTColor = localStorage.getItem("solusi_bisnis_preview_card_title_color");
        if (pSCTColor !== null) setSolusiBisnisCardTitleColor(pSCTColor);
        const pSCTSize = localStorage.getItem("solusi_bisnis_preview_card_title_size");
        if (pSCTSize !== null) { const num = parseInt(pSCTSize, 10); if (!isNaN(num)) setSolusiBisnisCardTitleSize(num); }
        const pSCTWeight = localStorage.getItem("solusi_bisnis_preview_card_title_font_weight");
        if (pSCTWeight !== null) setSolusiBisnisCardTitleFontWeight(pSCTWeight);
        const pSCTFont = localStorage.getItem("solusi_bisnis_preview_card_title_font");
        if (pSCTFont !== null) setSolusiBisnisCardTitleFont(pSCTFont);

        // Jenis Produk Preview
        const pJTitle = localStorage.getItem("jenis_produk_preview_title");
        if (pJTitle !== null) setJenisProdukTitle(pJTitle);
        const pJTitleSize = localStorage.getItem("jenis_produk_preview_title_size");
        if (pJTitleSize !== null) { const num = parseInt(pJTitleSize, 10); if (!isNaN(num)) setJenisProdukTitleSize(num); }
        const pJTitleColor = localStorage.getItem("jenis_produk_preview_title_color");
        if (pJTitleColor !== null) setJenisProdukTitleColor(pJTitleColor);
        const pJTitleFont = localStorage.getItem("jenis_produk_preview_title_font");
        if (pJTitleFont !== null) setJenisProdukTitleFont(pJTitleFont);
        const pJTitleWeight = localStorage.getItem("jenis_produk_preview_title_font_weight");
        if (pJTitleWeight !== null) setJenisProdukTitleFontWeight(pJTitleWeight);
        const pJDesc = localStorage.getItem("jenis_produk_preview_desc");
        if (pJDesc !== null) setJenisProdukDesc(pJDesc);
        const pJDescColor = localStorage.getItem("jenis_produk_preview_desc_color");
        if (pJDescColor !== null) setJenisProdukDescColor(pJDescColor);
        const pJDescSize = localStorage.getItem("jenis_produk_preview_desc_size");
        if (pJDescSize !== null) { const num = parseInt(pJDescSize, 10); if (!isNaN(num)) setJenisProdukDescSize(num); }
        const pJCards = localStorage.getItem("jenis_produk_preview_cards");
        if (pJCards !== null) {
          try {
            const parsed = JSON.parse(pJCards);
            if (Array.isArray(parsed)) {
              if (parsed.length === 6 && parsed.every((c: any) => !c.description && (!c.image || c.image === ""))) {
                setJenisProdukCards(DEFAULT_JENIS_PRODUK_CARDS);
              } else {
                setJenisProdukCards(parsed);
              }
            }
          } catch (e) {}
        }
        const pPlTitle = localStorage.getItem("peluang_preview_title");
        if (pPlTitle !== null) setPeluangTitle(pPlTitle);
        const pPlTitleSize = localStorage.getItem("peluang_preview_title_size");
        if (pPlTitleSize !== null) { const num = parseInt(pPlTitleSize, 10); if (!isNaN(num)) setPeluangTitleSize(num); }
        const pPlTitleColor = localStorage.getItem("peluang_preview_title_color");
        if (pPlTitleColor !== null) setPeluangTitleColor(pPlTitleColor);
        const pPlTitleFont = localStorage.getItem("peluang_preview_title_font");
        if (pPlTitleFont !== null) setPeluangTitleFont(pPlTitleFont);
        const pPlTitleWeight = localStorage.getItem("peluang_preview_title_font_weight");
        if (pPlTitleWeight !== null) setPeluangTitleFontWeight(pPlTitleWeight);
        const pPlDesc = localStorage.getItem("peluang_preview_desc");
        if (pPlDesc !== null) setPeluangDesc(pPlDesc);
        const pPlDescColor = localStorage.getItem("peluang_preview_desc_color");
        if (pPlDescColor !== null) setPeluangDescColor(pPlDescColor);
        const pPlDescSize = localStorage.getItem("peluang_preview_desc_size");
        if (pPlDescSize !== null) { const num = parseInt(pPlDescSize, 10); if (!isNaN(num)) setPeluangDescSize(num); }
        const pPlDescAlign = localStorage.getItem("peluang_preview_desc_align");
        if (pPlDescAlign === "left" || pPlDescAlign === "center" || pPlDescAlign === "justify") setPeluangDescAlign(pPlDescAlign);
        const pPlValign = localStorage.getItem("peluang_preview_valign");
        if (pPlValign === "center" || pPlValign === "top") setPeluangValign(pPlValign);
        const pPlBoxTitle = localStorage.getItem("peluang_preview_box_title");
        if (pPlBoxTitle !== null) setPeluangBoxTitle(pPlBoxTitle);
        const pPlBoxBgColor = localStorage.getItem("peluang_preview_box_bg_color");
        if (pPlBoxBgColor !== null) setPeluangBoxBgColor(pPlBoxBgColor);
        const pPlBoxTitleColor = localStorage.getItem("peluang_preview_box_title_color");
        if (pPlBoxTitleColor !== null) setPeluangBoxTitleColor(pPlBoxTitleColor);
        const pPlItems = localStorage.getItem("peluang_preview_items");
        if (pPlItems !== null) {
          try {
            const parsed = JSON.parse(pPlItems);
            if (Array.isArray(parsed) && parsed.length > 0) setPeluangItems(parsed);
          } catch (e) {}
        }
        const pMmTitle = localStorage.getItem("mengapa_preview_title");
        if (pMmTitle !== null) setMengapaTitle(pMmTitle);
        const pMmTitleSize = localStorage.getItem("mengapa_preview_title_size");
        if (pMmTitleSize !== null) { const num = parseInt(pMmTitleSize, 10); if (!isNaN(num)) setMengapaTitleSize(num); }
        const pMmTitleColor = localStorage.getItem("mengapa_preview_title_color");
        if (pMmTitleColor !== null) setMengapaTitleColor(pMmTitleColor);
        const pMmTitleFont = localStorage.getItem("mengapa_preview_title_font");
        if (pMmTitleFont !== null) setMengapaTitleFont(pMmTitleFont);
        const pMmTitleWeight = localStorage.getItem("mengapa_preview_title_font_weight");
        if (pMmTitleWeight !== null) setMengapaTitleFontWeight(pMmTitleWeight);
        const pMmSubtitle = localStorage.getItem("mengapa_preview_subtitle");
        if (pMmSubtitle !== null) setMengapaSubtitle(pMmSubtitle);
        const pMmSubtitleColor = localStorage.getItem("mengapa_preview_subtitle_color");
        if (pMmSubtitleColor !== null) setMengapaSubtitleColor(pMmSubtitleColor);
        const pMmSubtitleSize = localStorage.getItem("mengapa_preview_subtitle_size");
        if (pMmSubtitleSize !== null) { const num = parseInt(pMmSubtitleSize, 10); if (!isNaN(num)) setMengapaSubtitleSize(num); }
        const pMmSubtitleAlign = localStorage.getItem("mengapa_preview_subtitle_align");
        if (pMmSubtitleAlign === "left" || pMmSubtitleAlign === "center" || pMmSubtitleAlign === "justify") setMengapaSubtitleAlign(pMmSubtitleAlign);
        const pMmCardBg = localStorage.getItem("mengapa_preview_card_bg");
        if (pMmCardBg !== null) setMengapaCardBg(pMmCardBg);
        const pMmCardTitleColor = localStorage.getItem("mengapa_preview_card_title_color");
        if (pMmCardTitleColor !== null) setMengapaCardTitleColor(pMmCardTitleColor);
        const pMmCardDescColor = localStorage.getItem("mengapa_preview_card_desc_color");
        if (pMmCardDescColor !== null) setMengapaCardDescColor(pMmCardDescColor);
        const pMmCards = localStorage.getItem("mengapa_preview_cards");
        if (pMmCards !== null) {
          try {
            const parsed = JSON.parse(pMmCards);
            if (Array.isArray(parsed) && parsed.length > 0) setMengapaCards(parsed);
          } catch (e) {}
        }
        const pLegTitle = localStorage.getItem("legalitas_preview_title");
        if (pLegTitle !== null) setLegalitasTitle(pLegTitle);
        const pLegTitleSize = localStorage.getItem("legalitas_preview_title_size");
        if (pLegTitleSize !== null) { const num = parseInt(pLegTitleSize, 10); if (!isNaN(num)) setLegalitasTitleSize(num); }
        const pLegTitleColor = localStorage.getItem("legalitas_preview_title_color");
        if (pLegTitleColor !== null) setLegalitasTitleColor(pLegTitleColor);
        const pLegTitleFont = localStorage.getItem("legalitas_preview_title_font");
        if (pLegTitleFont !== null) setLegalitasTitleFont(pLegTitleFont);
        const pLegTitleWeight = localStorage.getItem("legalitas_preview_title_font_weight");
        if (pLegTitleWeight !== null) setLegalitasTitleFontWeight(pLegTitleWeight);
        const pLegSubtitle = localStorage.getItem("legalitas_preview_subtitle");
        if (pLegSubtitle !== null) setLegalitasSubtitle(pLegSubtitle);
        const pLegSubtitleColor = localStorage.getItem("legalitas_preview_subtitle_color");
        if (pLegSubtitleColor !== null) setLegalitasSubtitleColor(pLegSubtitleColor);
        const pLegSubtitleSize = localStorage.getItem("legalitas_preview_subtitle_size");
        if (pLegSubtitleSize !== null) { const num = parseInt(pLegSubtitleSize, 10); if (!isNaN(num)) setLegalitasSubtitleSize(num); }
        const pLegSubtitleAlign = localStorage.getItem("legalitas_preview_subtitle_align");
        if (pLegSubtitleAlign === "left" || pLegSubtitleAlign === "center" || pLegSubtitleAlign === "justify") setLegalitasSubtitleAlign(pLegSubtitleAlign);
        const pLegCardBg = localStorage.getItem("legalitas_preview_card_bg");
        if (pLegCardBg !== null) setLegalitasCardBg(pLegCardBg);
        const pLegItems = localStorage.getItem("legalitas_preview_items");
        if (pLegItems !== null) {
          try {
            const parsed = JSON.parse(pLegItems);
            if (Array.isArray(parsed) && parsed.length > 0) setLegalitasItems(parsed);
          } catch (e) {}
        }
        // Dipercaya Brand Preview localStorage
        const pBrandTitle = localStorage.getItem("dipercaya_brand_preview_title");
        if (pBrandTitle !== null) setDipercayaBrandTitle(pBrandTitle);
        const pBrandTitleSize = localStorage.getItem("dipercaya_brand_preview_title_size");
        if (pBrandTitleSize !== null) { const num = parseInt(pBrandTitleSize, 10); if (!isNaN(num)) setDipercayaBrandTitleSize(num); }
        const pBrandTitleColor = localStorage.getItem("dipercaya_brand_preview_title_color");
        if (pBrandTitleColor !== null) setDipercayaBrandTitleColor(pBrandTitleColor);
        const pBrandTitleFont = localStorage.getItem("dipercaya_brand_preview_title_font");
        if (pBrandTitleFont !== null) setDipercayaBrandTitleFont(pBrandTitleFont);
        const pBrandTitleWeight = localStorage.getItem("dipercaya_brand_preview_title_font_weight");
        if (pBrandTitleWeight !== null) setDipercayaBrandTitleFontWeight(pBrandTitleWeight);
        const pBrandSubtitle = localStorage.getItem("dipercaya_brand_preview_subtitle");
        if (pBrandSubtitle !== null) setDipercayaBrandSubtitle(pBrandSubtitle);
        const pBrandSubtitleColor = localStorage.getItem("dipercaya_brand_preview_subtitle_color");
        if (pBrandSubtitleColor !== null) setDipercayaBrandSubtitleColor(pBrandSubtitleColor);
        const pBrandSubtitleSize = localStorage.getItem("dipercaya_brand_preview_subtitle_size");
        if (pBrandSubtitleSize !== null) { const num = parseInt(pBrandSubtitleSize, 10); if (!isNaN(num)) setDipercayaBrandSubtitleSize(num); }
        const pBrandSubtitleAlign = localStorage.getItem("dipercaya_brand_preview_subtitle_align");
        if (pBrandSubtitleAlign === "left" || pBrandSubtitleAlign === "center" || pBrandSubtitleAlign === "justify") setDipercayaBrandSubtitleAlign(pBrandSubtitleAlign);
        const pBrandCardBg = localStorage.getItem("dipercaya_brand_preview_card_bg");
        if (pBrandCardBg !== null) setDipercayaBrandCardBg(pBrandCardBg);
        const pBrandItems = localStorage.getItem("dipercaya_brand_preview_items");
        if (pBrandItems !== null) {
          try {
            const parsed = JSON.parse(pBrandItems);
            if (Array.isArray(parsed) && parsed.length > 0) setDipercayaBrandItems(parsed);
          } catch (e) {}
        }
        // Proses Maklon Preview localStorage
        const pProsesTitle = localStorage.getItem("proses_maklon_preview_title");
        if (pProsesTitle !== null) setProsesMaklonTitle(pProsesTitle);
        const pProsesTitleSize = localStorage.getItem("proses_maklon_preview_title_size");
        if (pProsesTitleSize !== null) { const num = parseInt(pProsesTitleSize, 10); if (!isNaN(num)) setProsesMaklonTitleSize(num); }
        const pProsesTitleColor = localStorage.getItem("proses_maklon_preview_title_color");
        if (pProsesTitleColor !== null) setProsesMaklonTitleColor(pProsesTitleColor);
        const pProsesTitleFont = localStorage.getItem("proses_maklon_preview_title_font");
        if (pProsesTitleFont !== null) setProsesMaklonTitleFont(pProsesTitleFont);
        const pProsesTitleWeight = localStorage.getItem("proses_maklon_preview_title_font_weight");
        if (pProsesTitleWeight !== null) setProsesMaklonTitleFontWeight(pProsesTitleWeight);
        const pProsesSubtitle = localStorage.getItem("proses_maklon_preview_subtitle");
        if (pProsesSubtitle !== null) setProsesMaklonSubtitle(pProsesSubtitle);
        const pProsesSubtitleColor = localStorage.getItem("proses_maklon_preview_subtitle_color");
        if (pProsesSubtitleColor !== null) setProsesMaklonSubtitleColor(pProsesSubtitleColor);
        const pProsesSubtitleSize = localStorage.getItem("proses_maklon_preview_subtitle_size");
        if (pProsesSubtitleSize !== null) { const num = parseInt(pProsesSubtitleSize, 10); if (!isNaN(num)) setProsesMaklonSubtitleSize(num); }
        const pProsesSubtitleAlign = localStorage.getItem("proses_maklon_preview_subtitle_align");
        if (pProsesSubtitleAlign === "left" || pProsesSubtitleAlign === "center" || pProsesSubtitleAlign === "justify") setProsesMaklonSubtitleAlign(pProsesSubtitleAlign);
        const pProsesCardBg = localStorage.getItem("proses_maklon_preview_card_bg");
        if (pProsesCardBg !== null) setProsesMaklonCardBg(pProsesCardBg);
        const pProsesCardTextColor = localStorage.getItem("proses_maklon_preview_card_text_color");
        if (pProsesCardTextColor !== null) setProsesMaklonCardTextColor(pProsesCardTextColor);
        const pProsesItems = localStorage.getItem("proses_maklon_preview_items");
        if (pProsesItems !== null) {
          try {
            const parsed = JSON.parse(pProsesItems);
            if (Array.isArray(parsed) && parsed.length > 0) setProsesMaklonItems(parsed);
          } catch (e) {}
        }
        // Konsultasi Banner Preview localStorage
        const pKonsulText = localStorage.getItem("konsultasi_banner_preview_text");
        if (pKonsulText !== null) setKonsultasiBannerText(pKonsulText);
        const pKonsulTextSize = localStorage.getItem("konsultasi_banner_preview_text_size");
        if (pKonsulTextSize !== null) { const num = parseInt(pKonsulTextSize, 10); if (!isNaN(num)) setKonsultasiBannerTextSize(num); }
        const pKonsulTextColor = localStorage.getItem("konsultasi_banner_preview_text_color");
        if (pKonsulTextColor !== null) setKonsultasiBannerTextColor(pKonsulTextColor);
        const pKonsulTextFont = localStorage.getItem("konsultasi_banner_preview_text_font");
        if (pKonsulTextFont !== null) setKonsultasiBannerTextFont(pKonsulTextFont);
        const pKonsulTextWeight = localStorage.getItem("konsultasi_banner_preview_text_font_weight");
        if (pKonsulTextWeight !== null) setKonsultasiBannerTextFontWeight(pKonsulTextWeight);
        const pKonsulBgColor = localStorage.getItem("konsultasi_banner_preview_bg_color");
        if (pKonsulBgColor !== null) setKonsultasiBannerBgColor(pKonsulBgColor);
        const pKonsulBorderRadius = localStorage.getItem("konsultasi_banner_preview_border_radius");
        if (pKonsulBorderRadius !== null) { const num = parseInt(pKonsulBorderRadius, 10); if (!isNaN(num)) setKonsultasiBannerBorderRadius(num); }
        const pKonsulBtnText = localStorage.getItem("konsultasi_banner_preview_btn_text");
        if (pKonsulBtnText !== null) setKonsultasiBannerBtnText(pKonsulBtnText);
        const pKonsulBtnBgColor = localStorage.getItem("konsultasi_banner_preview_btn_bg_color");
        if (pKonsulBtnBgColor !== null) setKonsultasiBannerBtnBgColor(pKonsulBtnBgColor);
        const pKonsulBtnTextColor = localStorage.getItem("konsultasi_banner_preview_btn_text_color");
        if (pKonsulBtnTextColor !== null) setKonsultasiBannerBtnTextColor(pKonsulBtnTextColor);
        const pKonsulBtnTextSize = localStorage.getItem("konsultasi_banner_preview_btn_text_size");
        if (pKonsulBtnTextSize !== null) { const num = parseInt(pKonsulBtnTextSize, 10); if (!isNaN(num)) setKonsultasiBannerBtnTextSize(num); }
        const pKonsulLinkType = localStorage.getItem("konsultasi_banner_preview_link_type");
        if (pKonsulLinkType === "whatsapp" || pKonsulLinkType === "custom") setKonsultasiBannerLinkType(pKonsulLinkType);
        const pKonsulWaNumber = localStorage.getItem("konsultasi_banner_preview_wa_number");
        if (pKonsulWaNumber !== null) setKonsultasiBannerWaNumber(pKonsulWaNumber);
        const pKonsulWaMessage = localStorage.getItem("konsultasi_banner_preview_wa_message");
        if (pKonsulWaMessage !== null) setKonsultasiBannerWaMessage(pKonsulWaMessage);
        const pKonsulCustomUrl = localStorage.getItem("konsultasi_banner_preview_custom_url");
        if (pKonsulCustomUrl !== null) setKonsultasiBannerCustomUrl(pKonsulCustomUrl);
        const pKonsulOpenNewTab = localStorage.getItem("konsultasi_banner_preview_open_new_tab");
        if (pKonsulOpenNewTab !== null) setKonsultasiBannerOpenNewTab(pKonsulOpenNewTab === "true");

        const pMelayaniTitle = localStorage.getItem("melayani_klien_preview_title");
        if (pMelayaniTitle !== null) setMelayaniKlienTitle(pMelayaniTitle);
        const pMelayaniTitleSize = localStorage.getItem("melayani_klien_preview_title_size");
        if (pMelayaniTitleSize !== null) { const num = parseInt(pMelayaniTitleSize, 10); if (!isNaN(num)) setMelayaniKlienTitleSize(num); }
        const pMelayaniTitleColor = localStorage.getItem("melayani_klien_preview_title_color");
        if (pMelayaniTitleColor !== null) setMelayaniKlienTitleColor(pMelayaniTitleColor);
        const pMelayaniTitleFont = localStorage.getItem("melayani_klien_preview_title_font");
        if (pMelayaniTitleFont !== null) setMelayaniKlienTitleFont(pMelayaniTitleFont);
        const pMelayaniTitleWeight = localStorage.getItem("melayani_klien_preview_title_font_weight");
        if (pMelayaniTitleWeight !== null) setMelayaniKlienTitleFontWeight(pMelayaniTitleWeight);
        const pMelayaniSubtitle = localStorage.getItem("melayani_klien_preview_subtitle");
        if (pMelayaniSubtitle !== null) setMelayaniKlienSubtitle(pMelayaniSubtitle);
        const pMelayaniSubtitleSize = localStorage.getItem("melayani_klien_preview_subtitle_size");
        if (pMelayaniSubtitleSize !== null) { const num = parseInt(pMelayaniSubtitleSize, 10); if (!isNaN(num)) setMelayaniKlienSubtitleSize(num); }
        const pMelayaniSubtitleColor = localStorage.getItem("melayani_klien_preview_subtitle_color");
        if (pMelayaniSubtitleColor !== null) setMelayaniKlienSubtitleColor(pMelayaniSubtitleColor);
        const pMelayaniSubtitleAlign = localStorage.getItem("melayani_klien_preview_subtitle_align");
        if (pMelayaniSubtitleAlign === "center" || pMelayaniSubtitleAlign === "left" || pMelayaniSubtitleAlign === "justify") setMelayaniKlienSubtitleAlign(pMelayaniSubtitleAlign);
        const pMelayaniPillBg = localStorage.getItem("melayani_klien_preview_pill_bg");
        if (pMelayaniPillBg !== null) setMelayaniKlienPillBg(pMelayaniPillBg);
        const pMelayaniPillTextColor = localStorage.getItem("melayani_klien_preview_pill_text_color");
        if (pMelayaniPillTextColor !== null) setMelayaniKlienPillTextColor(pMelayaniPillTextColor);
        const pMelayaniPillSize = localStorage.getItem("melayani_klien_preview_pill_size");
        if (pMelayaniPillSize !== null) { const num = parseInt(pMelayaniPillSize, 10); if (!isNaN(num)) setMelayaniKlienPillSize(num); }
        const pMelayaniPillWeight = localStorage.getItem("melayani_klien_preview_pill_font_weight");
        if (pMelayaniPillWeight !== null) setMelayaniKlienPillFontWeight(pMelayaniPillWeight);
        const pMelayaniCities = localStorage.getItem("melayani_klien_preview_cities");
        if (pMelayaniCities !== null) {
          try {
            const parsed = JSON.parse(pMelayaniCities);
            if (Array.isArray(parsed) && parsed.length > 0) setMelayaniKlienCities(parsed);
          } catch (e) { }
        }
        // FAQ Preview localStorage
        const pFaqTitle = localStorage.getItem("faq_preview_title");
        if (pFaqTitle !== null) setFaqTitle(pFaqTitle);
        const pFaqTitleSize = localStorage.getItem("faq_preview_title_size");
        if (pFaqTitleSize !== null) { const num = parseInt(pFaqTitleSize, 10); if (!isNaN(num)) setFaqTitleSize(num); }
        const pFaqTitleColor = localStorage.getItem("faq_preview_title_color");
        if (pFaqTitleColor !== null) setFaqTitleColor(pFaqTitleColor);
        const pFaqTitleFont = localStorage.getItem("faq_preview_title_font");
        if (pFaqTitleFont !== null) setFaqTitleFont(pFaqTitleFont);
        const pFaqTitleWeight = localStorage.getItem("faq_preview_title_font_weight");
        if (pFaqTitleWeight !== null) setFaqTitleFontWeight(pFaqTitleWeight);
        const pFaqSubtitle = localStorage.getItem("faq_preview_subtitle");
        if (pFaqSubtitle !== null) setFaqSubtitle(pFaqSubtitle);
        const pFaqSubtitleSize = localStorage.getItem("faq_preview_subtitle_size");
        if (pFaqSubtitleSize !== null) { const num = parseInt(pFaqSubtitleSize, 10); if (!isNaN(num)) setFaqSubtitleSize(num); }
        const pFaqSubtitleColor = localStorage.getItem("faq_preview_subtitle_color");
        if (pFaqSubtitleColor !== null) setFaqSubtitleColor(pFaqSubtitleColor);
        const pFaqQColor = localStorage.getItem("faq_preview_question_color");
        if (pFaqQColor !== null) setFaqQuestionColor(pFaqQColor);
        const pFaqQActiveColor = localStorage.getItem("faq_preview_question_active_color");
        if (pFaqQActiveColor !== null) setFaqQuestionActiveColor(pFaqQActiveColor);
        const pFaqAColor = localStorage.getItem("faq_preview_answer_color");
        if (pFaqAColor !== null) setFaqAnswerColor(pFaqAColor);
        const pFaqItems = localStorage.getItem("faq_preview_items");
        if (pFaqItems !== null) {
          try {
            const parsed = JSON.parse(pFaqItems);
            if (Array.isArray(parsed) && parsed.length > 0) setFaqItems(parsed);
          } catch (e) { }
        }

        const pVpTitle = localStorage.getItem("video_profil_preview_title");
        if (pVpTitle !== null) setVideoProfilTitle(pVpTitle);
        const pVpTitleSize = localStorage.getItem("video_profil_preview_title_size");
        if (pVpTitleSize !== null) { const num = parseInt(pVpTitleSize, 10); if (!isNaN(num)) setVideoProfilTitleSize(num); }
        const pVpTitleColor = localStorage.getItem("video_profil_preview_title_color");
        if (pVpTitleColor !== null) setVideoProfilTitleColor(pVpTitleColor);
        const pVpTitleFont = localStorage.getItem("video_profil_preview_title_font");
        if (pVpTitleFont !== null) setVideoProfilTitleFont(pVpTitleFont);
        const pVpTitleWeight = localStorage.getItem("video_profil_preview_title_font_weight");
        if (pVpTitleWeight !== null) setVideoProfilTitleFontWeight(pVpTitleWeight);
        const pVpDesc = localStorage.getItem("video_profil_preview_desc");
        if (pVpDesc !== null) setVideoProfilDesc(pVpDesc);
        const pVpDescSize = localStorage.getItem("video_profil_preview_desc_size");
        if (pVpDescSize !== null) { const num = parseInt(pVpDescSize, 10); if (!isNaN(num)) setVideoProfilDescSize(num); }
        const pVpDescColor = localStorage.getItem("video_profil_preview_desc_color");
        if (pVpDescColor !== null) setVideoProfilDescColor(pVpDescColor);
        const pVpThumb = localStorage.getItem("video_profil_preview_thumbnail");
        if (pVpThumb !== null) setVideoProfilThumbnail(pVpThumb);
        const pVpUrl = localStorage.getItem("video_profil_preview_url");
        if (pVpUrl !== null) setVideoProfilUrl(pVpUrl);
        const pVpPos = localStorage.getItem("video_profil_preview_position") as "left" | "right" | null;
        if (pVpPos !== null) setVideoProfilPosition(pVpPos);
        const pVpFrameSize = localStorage.getItem("video_profil_preview_frame_size");
        if (pVpFrameSize !== null) { const num = parseInt(pVpFrameSize, 10); if (!isNaN(num)) setVideoProfilFrameSize(num); }
      } else {
        const sText = localStorage.getItem("hero_banner_text");
        if (sText !== null) setHeroText(sText);
        const sFont = localStorage.getItem("hero_banner_font");
        if (sFont !== null) setHeroFont(sFont);
        const sWeight = localStorage.getItem("hero_banner_font_weight");
        if (sWeight !== null) setHeroFontWeight(sWeight);
        const sSize = localStorage.getItem("hero_banner_font_size");
        if (sSize !== null) setHeroFontSize(sSize);
        const sColor = localStorage.getItem("hero_banner_text_color");
        if (sColor !== null) setHeroTextColor(sColor);
        const sSubtext = localStorage.getItem("hero_banner_subtext");
        if (sSubtext !== null) setHeroSubtext(sSubtext);
        const sSubColor = localStorage.getItem("hero_banner_subtext_color");
        if (sSubColor !== null) setHeroSubtextColor(sSubColor);
        const sSubSize = localStorage.getItem("hero_banner_subtext_size");
        if (sSubSize !== null) {
          const num = parseInt(sSubSize, 10);
          if (!isNaN(num)) setHeroSubtextSize(num);
        }
        const sSubWeight = localStorage.getItem("hero_banner_subtext_font_weight");
        if (sSubWeight !== null) setHeroSubtextFontWeight(sSubWeight);
        const sDesc = localStorage.getItem("hero_banner_desc");
        if (sDesc !== null) setHeroDesc(sDesc);
        const sDescColor = localStorage.getItem("hero_banner_desc_color");
        if (sDescColor !== null) setHeroDescColor(sDescColor);
        const sDescSize = localStorage.getItem("hero_banner_desc_size");
        if (sDescSize !== null) {
          const num = parseInt(sDescSize, 10);
          if (!isNaN(num)) setHeroDescSize(num);
        }
        const sPoints = localStorage.getItem("hero_banner_points");
        if (sPoints !== null) {
          try {
            const parsed = JSON.parse(sPoints);
            if (Array.isArray(parsed)) setHeroPoints(parsed);
          } catch (e) { }
        }
        const sPointsWeight = localStorage.getItem("hero_banner_points_font_weight");
        if (sPointsWeight !== null) setHeroPointsFontWeight(sPointsWeight);
        const sPointsColor = localStorage.getItem("hero_banner_points_color");
        if (sPointsColor !== null) setHeroPointsColor(sPointsColor);
        const sPos = localStorage.getItem("hero_banner_image_position") as "left" | "right" | null;
        if (sPos === "left" || sPos === "right") setHeroImagePosition(sPos);
        const sAspect = localStorage.getItem("hero_banner_image_aspect");
        if (sAspect !== null) setHeroImageAspect(sAspect);
        const sImgSize = localStorage.getItem("hero_banner_image_size");
        if (sImgSize !== null) setHeroImageSize(sImgSize);
        const sImg = localStorage.getItem("hero_banner_image");
        if (sImg !== null) setHeroImage(sImg);
        const sTrans = localStorage.getItem("hero_banner_image_transparent");
        if (sTrans !== null) setHeroImageTransparent(sTrans === "true");
        const sFit = localStorage.getItem("hero_banner_image_fit");
        if (sFit === "contain" || sFit === "cover") setHeroImageFit(sFit);
        const sPTitle = localStorage.getItem("pengenalan_title");
        if (sPTitle !== null) setPengenalanTitle(sPTitle);
        const sPTitleSize = localStorage.getItem("pengenalan_title_size");
        if (sPTitleSize !== null) { const num = parseInt(sPTitleSize, 10); if (!isNaN(num)) setPengenalanTitleSize(num); }
        const sPTitleColor = localStorage.getItem("pengenalan_title_color");
        if (sPTitleColor !== null) setPengenalanTitleColor(sPTitleColor);
        const sPTitleFont = localStorage.getItem("pengenalan_title_font");
        if (sPTitleFont !== null) setPengenalanTitleFont(sPTitleFont);
        const sPTitleWeight = localStorage.getItem("pengenalan_title_font_weight");
        if (sPTitleWeight !== null) setPengenalanTitleFontWeight(sPTitleWeight);
        const sPDesc = localStorage.getItem("pengenalan_desc");
        if (sPDesc !== null) setPengenalanDesc(sPDesc);
        const sPDescSize = localStorage.getItem("pengenalan_desc_size");
        if (sPDescSize !== null) { const num = parseInt(sPDescSize, 10); if (!isNaN(num)) setPengenalanDescSize(num); }
        const sPDescColor = localStorage.getItem("pengenalan_desc_color");
        if (sPDescColor !== null) setPengenalanDescColor(sPDescColor);
        const sPImage = localStorage.getItem("pengenalan_image");
        if (sPImage !== null) setPengenalanImage(sPImage);
        const sPImageFit = localStorage.getItem("pengenalan_image_fit");
        if (sPImageFit === "cover" || sPImageFit === "contain" || sPImageFit === "fill") setPengenalanImageFit(sPImageFit);
        const sPImagePos = localStorage.getItem("pengenalan_image_position");
        if (sPImagePos === "left" || sPImagePos === "right") setPengenalanImagePosition(sPImagePos);
        const sPImageSize = localStorage.getItem("pengenalan_image_size");
        if (sPImageSize !== null) { const num = parseInt(sPImageSize, 10); if (!isNaN(num)) setPengenalanImageSize(num); }
        const sPImageScale = localStorage.getItem("pengenalan_image_scale");
        if (sPImageScale !== null) { const num = parseInt(sPImageScale, 10); if (!isNaN(num)) setPengenalanImageScale(num); }
        // Solusi Bisnis Normal
        const sSTitle = localStorage.getItem("solusi_bisnis_title");
        if (sSTitle !== null) setSolusiBisnisTitle(sSTitle);
        const sSTitleSize = localStorage.getItem("solusi_bisnis_title_size");
        if (sSTitleSize !== null) { const num = parseInt(sSTitleSize, 10); if (!isNaN(num)) setSolusiBisnisTitleSize(num); }
        const sSTitleColor = localStorage.getItem("solusi_bisnis_title_color");
        if (sSTitleColor !== null) setSolusiBisnisTitleColor(sSTitleColor);
        const sSTitleFont = localStorage.getItem("solusi_bisnis_title_font");
        if (sSTitleFont !== null) setSolusiBisnisTitleFont(sSTitleFont);
        const sSTitleWeight = localStorage.getItem("solusi_bisnis_title_font_weight");
        if (sSTitleWeight !== null) setSolusiBisnisTitleFontWeight(sSTitleWeight);
        const sSDescAlign = localStorage.getItem("solusi_bisnis_desc_align") as "center" | "left" | "justify" | null;
        if (sSDescAlign === "center" || sSDescAlign === "left" || sSDescAlign === "justify") setSolusiBisnisDescAlign(sSDescAlign);
        const sSValign = localStorage.getItem("solusi_bisnis_valign") as "center" | "top" | null;
        if (sSValign === "center" || sSValign === "top") setSolusiBisnisValign(sSValign);
        const sSCards = localStorage.getItem("solusi_bisnis_cards");
        if (sSCards !== null) {
          try {
            const parsed = JSON.parse(sSCards);
            if (Array.isArray(parsed)) setSolusiBisnisCards(parsed);
          } catch (e) {}
        }
        const sSCTColor = localStorage.getItem("solusi_bisnis_card_title_color");
        if (sSCTColor !== null) setSolusiBisnisCardTitleColor(sSCTColor);
        const sSCTSize = localStorage.getItem("solusi_bisnis_card_title_size");
        if (sSCTSize !== null) { const num = parseInt(sSCTSize, 10); if (!isNaN(num)) setSolusiBisnisCardTitleSize(num); }
        const sSCTWeight = localStorage.getItem("solusi_bisnis_card_title_font_weight");
        if (sSCTWeight !== null) setSolusiBisnisCardTitleFontWeight(sSCTWeight);
        const sSCTFont = localStorage.getItem("solusi_bisnis_card_title_font");
        if (sSCTFont !== null) setSolusiBisnisCardTitleFont(sSCTFont);

        // Hero Banner 2
        const sH2Text = localStorage.getItem("hero_banner2_text");
        if (sH2Text !== null) setHero2Text(sH2Text);
        const sH2Font = localStorage.getItem("hero_banner2_font");
        if (sH2Font !== null) setHero2Font(sH2Font);
        const sH2FontSize = localStorage.getItem("hero_banner2_font_size");
        if (sH2FontSize !== null) {
          const num = parseInt(sH2FontSize, 10);
          if (!isNaN(num)) setHero2FontSize(num);
        }
        const sH2Image = localStorage.getItem("hero_banner2_image");
        if (sH2Image !== null) setHero2Image(sH2Image);

        // Jenis Produk Normal
        const sJTitle = localStorage.getItem("jenis_produk_title");
        if (sJTitle !== null) setJenisProdukTitle(sJTitle);
        const sJTitleSize = localStorage.getItem("jenis_produk_title_size");
        if (sJTitleSize !== null) { const num = parseInt(sJTitleSize, 10); if (!isNaN(num)) setJenisProdukTitleSize(num); }
        const sJTitleColor = localStorage.getItem("jenis_produk_title_color");
        if (sJTitleColor !== null) setJenisProdukTitleColor(sJTitleColor);
        const sJTitleFont = localStorage.getItem("jenis_produk_title_font");
        if (sJTitleFont !== null) setJenisProdukTitleFont(sJTitleFont);
        const sJTitleWeight = localStorage.getItem("jenis_produk_title_font_weight");
        if (sJTitleWeight !== null) setJenisProdukTitleFontWeight(sJTitleWeight);
        const sJDesc = localStorage.getItem("jenis_produk_desc");
        if (sJDesc !== null) setJenisProdukDesc(sJDesc);
        const sJDescColor = localStorage.getItem("jenis_produk_desc_color");
        if (sJDescColor !== null) setJenisProdukDescColor(sJDescColor);
        const sJDescSize = localStorage.getItem("jenis_produk_desc_size");
        if (sJDescSize !== null) { const num = parseInt(sJDescSize, 10); if (!isNaN(num)) setJenisProdukDescSize(num); }
        const sJCards = localStorage.getItem("jenis_produk_cards");
        if (sJCards !== null) {
          try {
            const parsed = JSON.parse(sJCards);
            if (Array.isArray(parsed)) {
              if (parsed.length === 6 && parsed.every((c: any) => !c.description && (!c.image || c.image === ""))) {
                setJenisProdukCards(DEFAULT_JENIS_PRODUK_CARDS);
              } else {
                setJenisProdukCards(parsed);
              }
            }
          } catch (e) {}
        }
        const sPlTitle = localStorage.getItem("peluang_title");
        if (sPlTitle !== null) setPeluangTitle(sPlTitle);
        const sPlTitleSize = localStorage.getItem("peluang_title_size");
        if (sPlTitleSize !== null) { const num = parseInt(sPlTitleSize, 10); if (!isNaN(num)) setPeluangTitleSize(num); }
        const sPlTitleColor = localStorage.getItem("peluang_title_color");
        if (sPlTitleColor !== null) setPeluangTitleColor(sPlTitleColor);
        const sPlTitleFont = localStorage.getItem("peluang_title_font");
        if (sPlTitleFont !== null) setPeluangTitleFont(sPlTitleFont);
        const sPlTitleWeight = localStorage.getItem("peluang_title_font_weight");
        if (sPlTitleWeight !== null) setPeluangTitleFontWeight(sPlTitleWeight);
        const sPlDesc = localStorage.getItem("peluang_desc");
        if (sPlDesc !== null) setPeluangDesc(sPlDesc);
        const sPlDescColor = localStorage.getItem("peluang_desc_color");
        if (sPlDescColor !== null) setPeluangDescColor(sPlDescColor);
        const sPlDescSize = localStorage.getItem("peluang_desc_size");
        if (sPlDescSize !== null) { const num = parseInt(sPlDescSize, 10); if (!isNaN(num)) setPeluangDescSize(num); }
        const sPlDescAlign = localStorage.getItem("peluang_desc_align");
        if (sPlDescAlign === "left" || sPlDescAlign === "center" || sPlDescAlign === "justify") setPeluangDescAlign(sPlDescAlign);
        const sPlValign = localStorage.getItem("peluang_valign");
        if (sPlValign === "center" || sPlValign === "top") setPeluangValign(sPlValign);
        const sPlBoxTitle = localStorage.getItem("peluang_box_title");
        if (sPlBoxTitle !== null) setPeluangBoxTitle(sPlBoxTitle);
        const sPlBoxBgColor = localStorage.getItem("peluang_box_bg_color");
        if (sPlBoxBgColor !== null) setPeluangBoxBgColor(sPlBoxBgColor);
        const sPlBoxTitleColor = localStorage.getItem("peluang_box_title_color");
        if (sPlBoxTitleColor !== null) setPeluangBoxTitleColor(sPlBoxTitleColor);
        const sPlItems = localStorage.getItem("peluang_items");
        if (sPlItems !== null) {
          try {
            const parsed = JSON.parse(sPlItems);
            if (Array.isArray(parsed) && parsed.length > 0) setPeluangItems(parsed);
          } catch (e) {}
        }
        const sMmTitle = localStorage.getItem("mengapa_title");
        if (sMmTitle !== null) setMengapaTitle(sMmTitle);
        const sMmTitleSize = localStorage.getItem("mengapa_title_size");
        if (sMmTitleSize !== null) { const num = parseInt(sMmTitleSize, 10); if (!isNaN(num)) setMengapaTitleSize(num); }
        const sMmTitleColor = localStorage.getItem("mengapa_title_color");
        if (sMmTitleColor !== null) setMengapaTitleColor(sMmTitleColor);
        const sMmTitleFont = localStorage.getItem("mengapa_title_font");
        if (sMmTitleFont !== null) setMengapaTitleFont(sMmTitleFont);
        const sMmTitleWeight = localStorage.getItem("mengapa_title_font_weight");
        if (sMmTitleWeight !== null) setMengapaTitleFontWeight(sMmTitleWeight);
        const sMmSubtitle = localStorage.getItem("mengapa_subtitle");
        if (sMmSubtitle !== null) setMengapaSubtitle(sMmSubtitle);
        const sMmSubtitleColor = localStorage.getItem("mengapa_subtitle_color");
        if (sMmSubtitleColor !== null) setMengapaSubtitleColor(sMmSubtitleColor);
        const sMmSubtitleSize = localStorage.getItem("mengapa_subtitle_size");
        if (sMmSubtitleSize !== null) { const num = parseInt(sMmSubtitleSize, 10); if (!isNaN(num)) setMengapaSubtitleSize(num); }
        const sMmSubtitleAlign = localStorage.getItem("mengapa_subtitle_align");
        if (sMmSubtitleAlign === "left" || sMmSubtitleAlign === "center" || sMmSubtitleAlign === "justify") setMengapaSubtitleAlign(sMmSubtitleAlign);
        const sMmCardBg = localStorage.getItem("mengapa_card_bg");
        if (sMmCardBg !== null) setMengapaCardBg(sMmCardBg);
        const sMmCardTitleColor = localStorage.getItem("mengapa_card_title_color");
        if (sMmCardTitleColor !== null) setMengapaCardTitleColor(sMmCardTitleColor);
        const sMmCardDescColor = localStorage.getItem("mengapa_card_desc_color");
        if (sMmCardDescColor !== null) setMengapaCardDescColor(sMmCardDescColor);
        const sMmCards = localStorage.getItem("mengapa_cards");
        if (sMmCards !== null) {
          try {
            const parsed = JSON.parse(sMmCards);
            if (Array.isArray(parsed) && parsed.length > 0) setMengapaCards(parsed);
          } catch (e) {}
        }
        const sLegTitle = localStorage.getItem("legalitas_title");
        if (sLegTitle !== null) setLegalitasTitle(sLegTitle);
        const sLegTitleSize = localStorage.getItem("legalitas_title_size");
        if (sLegTitleSize !== null) { const num = parseInt(sLegTitleSize, 10); if (!isNaN(num)) setLegalitasTitleSize(num); }
        const sLegTitleColor = localStorage.getItem("legalitas_title_color");
        if (sLegTitleColor !== null) setLegalitasTitleColor(sLegTitleColor);
        const sLegTitleFont = localStorage.getItem("legalitas_title_font");
        if (sLegTitleFont !== null) setLegalitasTitleFont(sLegTitleFont);
        const sLegTitleWeight = localStorage.getItem("legalitas_title_font_weight");
        if (sLegTitleWeight !== null) setLegalitasTitleFontWeight(sLegTitleWeight);
        const sLegSubtitle = localStorage.getItem("legalitas_subtitle");
        if (sLegSubtitle !== null) setLegalitasSubtitle(sLegSubtitle);
        const sLegSubtitleColor = localStorage.getItem("legalitas_subtitle_color");
        if (sLegSubtitleColor !== null) setLegalitasSubtitleColor(sLegSubtitleColor);
        const sLegSubtitleSize = localStorage.getItem("legalitas_subtitle_size");
        if (sLegSubtitleSize !== null) { const num = parseInt(sLegSubtitleSize, 10); if (!isNaN(num)) setLegalitasSubtitleSize(num); }
        const sLegSubtitleAlign = localStorage.getItem("legalitas_subtitle_align");
        if (sLegSubtitleAlign === "left" || sLegSubtitleAlign === "center" || sLegSubtitleAlign === "justify") setLegalitasSubtitleAlign(sLegSubtitleAlign);
        const sLegCardBg = localStorage.getItem("legalitas_card_bg");
        if (sLegCardBg !== null) setLegalitasCardBg(sLegCardBg);
        const sLegItems = localStorage.getItem("legalitas_items");
        if (sLegItems !== null) {
          try {
            const parsed = JSON.parse(sLegItems);
            if (Array.isArray(parsed) && parsed.length > 0) setLegalitasItems(parsed);
          } catch (e) {}
        }
        // Dipercaya Brand Normal localStorage
        const sBrandTitle = localStorage.getItem("dipercaya_brand_title");
        if (sBrandTitle !== null) setDipercayaBrandTitle(sBrandTitle);
        const sBrandTitleSize = localStorage.getItem("dipercaya_brand_title_size");
        if (sBrandTitleSize !== null) { const num = parseInt(sBrandTitleSize, 10); if (!isNaN(num)) setDipercayaBrandTitleSize(num); }
        const sBrandTitleColor = localStorage.getItem("dipercaya_brand_title_color");
        if (sBrandTitleColor !== null) setDipercayaBrandTitleColor(sBrandTitleColor);
        const sBrandTitleFont = localStorage.getItem("dipercaya_brand_title_font");
        if (sBrandTitleFont !== null) setDipercayaBrandTitleFont(sBrandTitleFont);
        const sBrandTitleWeight = localStorage.getItem("dipercaya_brand_title_font_weight");
        if (sBrandTitleWeight !== null) setDipercayaBrandTitleFontWeight(sBrandTitleWeight);
        const sBrandSubtitle = localStorage.getItem("dipercaya_brand_subtitle");
        if (sBrandSubtitle !== null) setDipercayaBrandSubtitle(sBrandSubtitle);
        const sBrandSubtitleColor = localStorage.getItem("dipercaya_brand_subtitle_color");
        if (sBrandSubtitleColor !== null) setDipercayaBrandSubtitleColor(sBrandSubtitleColor);
        const sBrandSubtitleSize = localStorage.getItem("dipercaya_brand_subtitle_size");
        if (sBrandSubtitleSize !== null) { const num = parseInt(sBrandSubtitleSize, 10); if (!isNaN(num)) setDipercayaBrandSubtitleSize(num); }
        const sBrandSubtitleAlign = localStorage.getItem("dipercaya_brand_subtitle_align");
        if (sBrandSubtitleAlign === "left" || sBrandSubtitleAlign === "center" || sBrandSubtitleAlign === "justify") setDipercayaBrandSubtitleAlign(sBrandSubtitleAlign);
        const sBrandCardBg = localStorage.getItem("dipercaya_brand_card_bg");
        if (sBrandCardBg !== null) setDipercayaBrandCardBg(sBrandCardBg);
        const sBrandItems = localStorage.getItem("dipercaya_brand_items");
        if (sBrandItems !== null) {
          try {
            const parsed = JSON.parse(sBrandItems);
            if (Array.isArray(parsed) && parsed.length > 0) setDipercayaBrandItems(parsed);
          } catch (e) {}
        }
        // Proses Maklon Normal localStorage
        const sProsesTitle = localStorage.getItem("proses_maklon_title");
        if (sProsesTitle !== null) setProsesMaklonTitle(sProsesTitle);
        const sProsesTitleSize = localStorage.getItem("proses_maklon_title_size");
        if (sProsesTitleSize !== null) { const num = parseInt(sProsesTitleSize, 10); if (!isNaN(num)) setProsesMaklonTitleSize(num); }
        const sProsesTitleColor = localStorage.getItem("proses_maklon_title_color");
        if (sProsesTitleColor !== null) setProsesMaklonTitleColor(sProsesTitleColor);
        const sProsesTitleFont = localStorage.getItem("proses_maklon_title_font");
        if (sProsesTitleFont !== null) setProsesMaklonTitleFont(sProsesTitleFont);
        const sProsesTitleWeight = localStorage.getItem("proses_maklon_title_font_weight");
        if (sProsesTitleWeight !== null) setProsesMaklonTitleFontWeight(sProsesTitleWeight);
        const sProsesSubtitle = localStorage.getItem("proses_maklon_subtitle");
        if (sProsesSubtitle !== null) setProsesMaklonSubtitle(sProsesSubtitle);
        const sProsesSubtitleColor = localStorage.getItem("proses_maklon_subtitle_color");
        if (sProsesSubtitleColor !== null) setProsesMaklonSubtitleColor(sProsesSubtitleColor);
        const sProsesSubtitleSize = localStorage.getItem("proses_maklon_subtitle_size");
        if (sProsesSubtitleSize !== null) { const num = parseInt(sProsesSubtitleSize, 10); if (!isNaN(num)) setProsesMaklonSubtitleSize(num); }
        const sProsesSubtitleAlign = localStorage.getItem("proses_maklon_subtitle_align");
        if (sProsesSubtitleAlign === "left" || sProsesSubtitleAlign === "center" || sProsesSubtitleAlign === "justify") setProsesMaklonSubtitleAlign(sProsesSubtitleAlign);
        const sProsesCardBg = localStorage.getItem("proses_maklon_card_bg");
        if (sProsesCardBg !== null) setProsesMaklonCardBg(sProsesCardBg);
        const sProsesCardTextColor = localStorage.getItem("proses_maklon_card_text_color");
        if (sProsesCardTextColor !== null) setProsesMaklonCardTextColor(sProsesCardTextColor);
        const sProsesItems = localStorage.getItem("proses_maklon_items");
        if (sProsesItems !== null) {
          try {
            const parsed = JSON.parse(sProsesItems);
            if (Array.isArray(parsed) && parsed.length > 0) setProsesMaklonItems(parsed);
          } catch (e) {}
        }
        // Konsultasi Banner Normal localStorage
        const sKonsulText = localStorage.getItem("konsultasi_banner_text");
        if (sKonsulText !== null) setKonsultasiBannerText(sKonsulText);
        const sKonsulTextSize = localStorage.getItem("konsultasi_banner_text_size");
        if (sKonsulTextSize !== null) { const num = parseInt(sKonsulTextSize, 10); if (!isNaN(num)) setKonsultasiBannerTextSize(num); }
        const sKonsulTextColor = localStorage.getItem("konsultasi_banner_text_color");
        if (sKonsulTextColor !== null) setKonsultasiBannerTextColor(sKonsulTextColor);
        const sKonsulTextFont = localStorage.getItem("konsultasi_banner_text_font");
        if (sKonsulTextFont !== null) setKonsultasiBannerTextFont(sKonsulTextFont);
        const sKonsulTextWeight = localStorage.getItem("konsultasi_banner_text_font_weight");
        if (sKonsulTextWeight !== null) setKonsultasiBannerTextFontWeight(sKonsulTextWeight);
        const sKonsulBgColor = localStorage.getItem("konsultasi_banner_bg_color");
        if (sKonsulBgColor !== null) setKonsultasiBannerBgColor(sKonsulBgColor);
        const sKonsulBorderRadius = localStorage.getItem("konsultasi_banner_border_radius");
        if (sKonsulBorderRadius !== null) { const num = parseInt(sKonsulBorderRadius, 10); if (!isNaN(num)) setKonsultasiBannerBorderRadius(num); }
        const sKonsulBtnText = localStorage.getItem("konsultasi_banner_btn_text");
        if (sKonsulBtnText !== null) setKonsultasiBannerBtnText(sKonsulBtnText);
        const sKonsulBtnBgColor = localStorage.getItem("konsultasi_banner_btn_bg_color");
        if (sKonsulBtnBgColor !== null) setKonsultasiBannerBtnBgColor(sKonsulBtnBgColor);
        const sKonsulBtnTextColor = localStorage.getItem("konsultasi_banner_btn_text_color");
        if (sKonsulBtnTextColor !== null) setKonsultasiBannerBtnTextColor(sKonsulBtnTextColor);
        const sKonsulBtnTextSize = localStorage.getItem("konsultasi_banner_btn_text_size");
        if (sKonsulBtnTextSize !== null) { const num = parseInt(sKonsulBtnTextSize, 10); if (!isNaN(num)) setKonsultasiBannerBtnTextSize(num); }
        const sKonsulLinkType = localStorage.getItem("konsultasi_banner_link_type");
        if (sKonsulLinkType === "whatsapp" || sKonsulLinkType === "custom") setKonsultasiBannerLinkType(sKonsulLinkType);
        const sKonsulWaNumber = localStorage.getItem("konsultasi_banner_wa_number");
        if (sKonsulWaNumber !== null) setKonsultasiBannerWaNumber(sKonsulWaNumber);
        const sKonsulWaMessage = localStorage.getItem("konsultasi_banner_wa_message");
        if (sKonsulWaMessage !== null) setKonsultasiBannerWaMessage(sKonsulWaMessage);
        const sKonsulCustomUrl = localStorage.getItem("konsultasi_banner_custom_url");
        if (sKonsulCustomUrl !== null) setKonsultasiBannerCustomUrl(sKonsulCustomUrl);
        const sKonsulOpenNewTab = localStorage.getItem("konsultasi_banner_open_new_tab");
        if (sKonsulOpenNewTab !== null) setKonsultasiBannerOpenNewTab(sKonsulOpenNewTab === "true");

        // Melayani Klien Normal localStorage
        const sMelayaniTitle = localStorage.getItem("melayani_klien_title");
        if (sMelayaniTitle !== null) setMelayaniKlienTitle(sMelayaniTitle);
        const sMelayaniTitleSize = localStorage.getItem("melayani_klien_title_size");
        if (sMelayaniTitleSize !== null) { const num = parseInt(sMelayaniTitleSize, 10); if (!isNaN(num)) setMelayaniKlienTitleSize(num); }
        const sMelayaniTitleColor = localStorage.getItem("melayani_klien_title_color");
        if (sMelayaniTitleColor !== null) setMelayaniKlienTitleColor(sMelayaniTitleColor);
        const sMelayaniTitleFont = localStorage.getItem("melayani_klien_title_font");
        if (sMelayaniTitleFont !== null) setMelayaniKlienTitleFont(sMelayaniTitleFont);
        const sMelayaniTitleWeight = localStorage.getItem("melayani_klien_title_font_weight");
        if (sMelayaniTitleWeight !== null) setMelayaniKlienTitleFontWeight(sMelayaniTitleWeight);
        const sMelayaniSubtitle = localStorage.getItem("melayani_klien_subtitle");
        if (sMelayaniSubtitle !== null) setMelayaniKlienSubtitle(sMelayaniSubtitle);
        const sMelayaniSubtitleSize = localStorage.getItem("melayani_klien_subtitle_size");
        if (sMelayaniSubtitleSize !== null) { const num = parseInt(sMelayaniSubtitleSize, 10); if (!isNaN(num)) setMelayaniKlienSubtitleSize(num); }
        const sMelayaniSubtitleColor = localStorage.getItem("melayani_klien_subtitle_color");
        if (sMelayaniSubtitleColor !== null) setMelayaniKlienSubtitleColor(sMelayaniSubtitleColor);
        const sMelayaniSubtitleAlign = localStorage.getItem("melayani_klien_subtitle_align");
        if (sMelayaniSubtitleAlign === "center" || sMelayaniSubtitleAlign === "left" || sMelayaniSubtitleAlign === "justify") setMelayaniKlienSubtitleAlign(sMelayaniSubtitleAlign);
        const sMelayaniPillBg = localStorage.getItem("melayani_klien_pill_bg");
        if (sMelayaniPillBg !== null) setMelayaniKlienPillBg(sMelayaniPillBg);
        const sMelayaniPillTextColor = localStorage.getItem("melayani_klien_pill_text_color");
        if (sMelayaniPillTextColor !== null) setMelayaniKlienPillTextColor(sMelayaniPillTextColor);
        const sMelayaniPillSize = localStorage.getItem("melayani_klien_pill_size");
        if (sMelayaniPillSize !== null) { const num = parseInt(sMelayaniPillSize, 10); if (!isNaN(num)) setMelayaniKlienPillSize(num); }
        const sMelayaniPillWeight = localStorage.getItem("melayani_klien_pill_font_weight");
        if (sMelayaniPillWeight !== null) setMelayaniKlienPillFontWeight(sMelayaniPillWeight);
        const sMelayaniCities = localStorage.getItem("melayani_klien_cities");
        if (sMelayaniCities !== null) {
          try {
            const parsed = JSON.parse(sMelayaniCities);
            if (Array.isArray(parsed) && parsed.length > 0) setMelayaniKlienCities(parsed);
          } catch (e) { }
        }
        const sUlasanTitle = localStorage.getItem("ulasan_klien_title");
        if (sUlasanTitle !== null) setUlasanKlienTitle(sUlasanTitle);
        const sUlasanTitleSize = localStorage.getItem("ulasan_klien_title_size");
        if (sUlasanTitleSize !== null) { const num = parseInt(sUlasanTitleSize, 10); if (!isNaN(num)) setUlasanKlienTitleSize(num); }
        const sUlasanTitleColor = localStorage.getItem("ulasan_klien_title_color");
        if (sUlasanTitleColor !== null) setUlasanKlienTitleColor(sUlasanTitleColor);
        const sUlasanTitleFont = localStorage.getItem("ulasan_klien_title_font");
        if (sUlasanTitleFont !== null) setUlasanKlienTitleFont(sUlasanTitleFont);
        const sUlasanTitleWeight = localStorage.getItem("ulasan_klien_title_font_weight");
        if (sUlasanTitleWeight !== null) setUlasanKlienTitleFontWeight(sUlasanTitleWeight);
        const sUlasanSubtitle = localStorage.getItem("ulasan_klien_subtitle");
        if (sUlasanSubtitle !== null) setUlasanKlienSubtitle(sUlasanSubtitle);
        const sUlasanSubtitleSize = localStorage.getItem("ulasan_klien_subtitle_size");
        if (sUlasanSubtitleSize !== null) { const num = parseInt(sUlasanSubtitleSize, 10); if (!isNaN(num)) setUlasanKlienSubtitleSize(num); }
        const sUlasanSubtitleColor = localStorage.getItem("ulasan_klien_subtitle_color");
        if (sUlasanSubtitleColor !== null) setUlasanKlienSubtitleColor(sUlasanSubtitleColor);
        const sUlasanItems = localStorage.getItem("ulasan_klien_items");
        if (sUlasanItems !== null) {
          try {
            const parsed = JSON.parse(sUlasanItems);
            if (Array.isArray(parsed) && parsed.length > 0) setUlasanKlienItems(parsed);
          } catch (e) { }
        }
        // FAQ Normal localStorage
        const sFaqTitle = localStorage.getItem("faq_title");
        if (sFaqTitle !== null) setFaqTitle(sFaqTitle);
        const sFaqTitleSize = localStorage.getItem("faq_title_size");
        if (sFaqTitleSize !== null) { const num = parseInt(sFaqTitleSize, 10); if (!isNaN(num)) setFaqTitleSize(num); }
        const sFaqTitleColor = localStorage.getItem("faq_title_color");
        if (sFaqTitleColor !== null) setFaqTitleColor(sFaqTitleColor);
        const sFaqTitleFont = localStorage.getItem("faq_title_font");
        if (sFaqTitleFont !== null) setFaqTitleFont(sFaqTitleFont);
        const sFaqTitleWeight = localStorage.getItem("faq_title_font_weight");
        if (sFaqTitleWeight !== null) setFaqTitleFontWeight(sFaqTitleWeight);
        const sFaqSubtitle = localStorage.getItem("faq_subtitle");
        if (sFaqSubtitle !== null) setFaqSubtitle(sFaqSubtitle);
        const sFaqSubtitleSize = localStorage.getItem("faq_subtitle_size");
        if (sFaqSubtitleSize !== null) { const num = parseInt(sFaqSubtitleSize, 10); if (!isNaN(num)) setFaqSubtitleSize(num); }
        const sFaqSubtitleColor = localStorage.getItem("faq_subtitle_color");
        if (sFaqSubtitleColor !== null) setFaqSubtitleColor(sFaqSubtitleColor);
        const sFaqQColor = localStorage.getItem("faq_question_color");
        if (sFaqQColor !== null) setFaqQuestionColor(sFaqQColor);
        const sFaqQActiveColor = localStorage.getItem("faq_question_active_color");
        if (sFaqQActiveColor !== null) setFaqQuestionActiveColor(sFaqQActiveColor);
        const sFaqAColor = localStorage.getItem("faq_answer_color");
        if (sFaqAColor !== null) setFaqAnswerColor(sFaqAColor);
        const sFaqItems = localStorage.getItem("faq_items");
        if (sFaqItems !== null) {
          try {
            const parsed = JSON.parse(sFaqItems);
            if (Array.isArray(parsed) && parsed.length > 0) setFaqItems(parsed);
          } catch (e) { }
        }

        const sVpTitle = localStorage.getItem("video_profil_title");
        if (sVpTitle !== null) setVideoProfilTitle(sVpTitle);
        const sVpTitleSize = localStorage.getItem("video_profil_title_size");
        if (sVpTitleSize !== null) { const num = parseInt(sVpTitleSize, 10); if (!isNaN(num)) setVideoProfilTitleSize(num); }
        const sVpTitleColor = localStorage.getItem("video_profil_title_color");
        if (sVpTitleColor !== null) setVideoProfilTitleColor(sVpTitleColor);
        const sVpTitleFont = localStorage.getItem("video_profil_title_font");
        if (sVpTitleFont !== null) setVideoProfilTitleFont(sVpTitleFont);
        const sVpTitleWeight = localStorage.getItem("video_profil_title_font_weight");
        if (sVpTitleWeight !== null) setVideoProfilTitleFontWeight(sVpTitleWeight);
        const sVpDesc = localStorage.getItem("video_profil_desc");
        if (sVpDesc !== null) setVideoProfilDesc(sVpDesc);
        const sVpDescSize = localStorage.getItem("video_profil_desc_size");
        if (sVpDescSize !== null) { const num = parseInt(sVpDescSize, 10); if (!isNaN(num)) setVideoProfilDescSize(num); }
        const sVpDescColor = localStorage.getItem("video_profil_desc_color");
        if (sVpDescColor !== null) setVideoProfilDescColor(sVpDescColor);
        const sVpThumb = localStorage.getItem("video_profil_thumbnail");
        if (sVpThumb !== null) setVideoProfilThumbnail(sVpThumb);
        const sVpUrl = localStorage.getItem("video_profil_url");
        if (sVpUrl !== null) setVideoProfilUrl(sVpUrl);
        const sVpPos = localStorage.getItem("video_profil_position") as "left" | "right" | null;
        if (sVpPos !== null) setVideoProfilPosition(sVpPos);
        const sVpFrameSize = localStorage.getItem("video_profil_frame_size");
        if (sVpFrameSize !== null) { const num = parseInt(sVpFrameSize, 10); if (!isNaN(num)) setVideoProfilFrameSize(num); }

        // Sosial Media Banner localStorage
        const sSmTitle = isPreview ? localStorage.getItem("sosial_media_preview_title") || localStorage.getItem("sosial_media_title") : localStorage.getItem("sosial_media_title");
        if (sSmTitle !== null) setSosialMediaTitle(sSmTitle);
        const sSmTitleSize = isPreview ? localStorage.getItem("sosial_media_preview_title_size") || localStorage.getItem("sosial_media_title_size") : localStorage.getItem("sosial_media_title_size");
        if (sSmTitleSize !== null) { const num = parseInt(sSmTitleSize, 10); if (!isNaN(num)) setSosialMediaTitleSize(num); }
        const sSmTitleColor = isPreview ? localStorage.getItem("sosial_media_preview_title_color") || localStorage.getItem("sosial_media_title_color") : localStorage.getItem("sosial_media_title_color");
        if (sSmTitleColor !== null) setSosialMediaTitleColor(sSmTitleColor);
        const sSmTitleFont = isPreview ? localStorage.getItem("sosial_media_preview_title_font") || localStorage.getItem("sosial_media_title_font") : localStorage.getItem("sosial_media_title_font");
        if (sSmTitleFont !== null) setSosialMediaTitleFont(sSmTitleFont);
        const sSmTitleWeight = isPreview ? localStorage.getItem("sosial_media_preview_title_font_weight") || localStorage.getItem("sosial_media_title_font_weight") : localStorage.getItem("sosial_media_title_font_weight");
        if (sSmTitleWeight !== null) setSosialMediaTitleFontWeight(sSmTitleWeight);
        const sSmLabel = isPreview ? localStorage.getItem("sosial_media_preview_label") || localStorage.getItem("sosial_media_label") : localStorage.getItem("sosial_media_label");
        if (sSmLabel !== null) setSosialMediaLabel(sSmLabel);
        const sSmLabelSize = isPreview ? localStorage.getItem("sosial_media_preview_label_size") || localStorage.getItem("sosial_media_label_size") : localStorage.getItem("sosial_media_label_size");
        if (sSmLabelSize !== null) { const num = parseInt(sSmLabelSize, 10); if (!isNaN(num)) setSosialMediaLabelSize(num); }
        const sSmLabelColor = isPreview ? localStorage.getItem("sosial_media_preview_label_color") || localStorage.getItem("sosial_media_label_color") : localStorage.getItem("sosial_media_label_color");
        if (sSmLabelColor !== null) setSosialMediaLabelColor(sSmLabelColor);
        const sSmBgColor = isPreview ? localStorage.getItem("sosial_media_preview_bg_color") || localStorage.getItem("sosial_media_bg_color") : localStorage.getItem("sosial_media_bg_color");
        if (sSmBgColor !== null) setSosialMediaBgColor(sSmBgColor);
        const sSmBorderRadius = isPreview ? localStorage.getItem("sosial_media_preview_border_radius") || localStorage.getItem("sosial_media_border_radius") : localStorage.getItem("sosial_media_border_radius");
        if (sSmBorderRadius !== null) { const num = parseInt(sSmBorderRadius, 10); if (!isNaN(num)) setSosialMediaBorderRadius(num); }
        const sSmItems = isPreview ? localStorage.getItem("sosial_media_preview_items") || localStorage.getItem("sosial_media_items") : localStorage.getItem("sosial_media_items");
        if (sSmItems !== null) {
          try {
            const parsed = JSON.parse(sSmItems);
            if (Array.isArray(parsed) && parsed.length > 0) setSosialMediaItems(parsed);
          } catch (e) { }
        }
      }
    };
    refreshLayout();

    const startTime = Date.now();
    // Safety fallback agar spinner tidak hang selamanya jika ada kendala koneksi
    const safetyTimer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    window.addEventListener(HOME_LAYOUT_EVENT, refreshLayout);
    window.addEventListener("storage", refreshLayout);

    let bc: BroadcastChannel | null = null;
    if (isPreview && typeof BroadcastChannel !== "undefined") {
      try {
        bc = new BroadcastChannel("hero_banner_preview_channel");
        bc.onmessage = (ev) => {
          const data = ev.data;
          if (!data) return;
          if (data.text !== undefined) setHeroText(data.text);
          if (data.font !== undefined) setHeroFont(data.font);
          if (data.fontWeight !== undefined) setHeroFontWeight(data.fontWeight);
          if (data.fontSize !== undefined) setHeroFontSize(data.fontSize.toString());
          if (data.textColor !== undefined) setHeroTextColor(data.textColor);
          if (data.subtext !== undefined) setHeroSubtext(data.subtext);
          if (data.subtextColor !== undefined) setHeroSubtextColor(data.subtextColor);
          if (data.subtextSize !== undefined) {
            const num = parseInt(data.subtextSize.toString(), 10);
            if (!isNaN(num)) setHeroSubtextSize(num);
          }
          if (data.subtextFontWeight !== undefined) setHeroSubtextFontWeight(data.subtextFontWeight);
          if (data.desc !== undefined) setHeroDesc(data.desc);
          if (data.descColor !== undefined) setHeroDescColor(data.descColor);
          if (data.descSize !== undefined) {
            const num = parseInt(data.descSize.toString(), 10);
            if (!isNaN(num)) setHeroDescSize(num);
          }
          if (data.points !== undefined && Array.isArray(data.points)) setHeroPoints(data.points);
          if (data.pointsFontWeight !== undefined) setHeroPointsFontWeight(data.pointsFontWeight);
          if (data.pointsColor !== undefined) setHeroPointsColor(data.pointsColor);
          if (data.position !== undefined) setHeroImagePosition(data.position);
          if (data.aspect !== undefined) setHeroImageAspect(data.aspect);
          if (data.imageSize !== undefined) setHeroImageSize(data.imageSize.toString());
          if (data.transparent !== undefined) setHeroImageTransparent(data.transparent === true || data.transparent === "true");
          if (data.fit !== undefined && (data.fit === "contain" || data.fit === "cover")) setHeroImageFit(data.fit);
          if (data.image !== undefined) setHeroImage(data.image);
        };
      } catch (e) { }
    }

    let pengenalanBc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== "undefined") {
      try {
        pengenalanBc = new BroadcastChannel("pengenalan_preview_channel");
        pengenalanBc.onmessage = (ev) => {
          const data = ev.data;
          if (!data) return;
          if (data.title !== undefined) setPengenalanTitle(data.title);
          if (data.titleSize !== undefined) setPengenalanTitleSize(data.titleSize);
          if (data.titleColor !== undefined) setPengenalanTitleColor(data.titleColor);
          if (data.titleFont !== undefined) setPengenalanTitleFont(data.titleFont);
          if (data.titleFontWeight !== undefined) setPengenalanTitleFontWeight(data.titleFontWeight);
          if (data.desc !== undefined) setPengenalanDesc(data.desc);
          if (data.descSize !== undefined) setPengenalanDescSize(data.descSize);
          if (data.descColor !== undefined) setPengenalanDescColor(data.descColor);
          if (data.image !== undefined) setPengenalanImage(data.image);
          if (data.imageFit !== undefined) setPengenalanImageFit(data.imageFit);
          if (data.imagePosition !== undefined && (data.imagePosition === "left" || data.imagePosition === "right")) {
            setPengenalanImagePosition(data.imagePosition);
          }
          if (data.imageSize !== undefined) setPengenalanImageSize(data.imageSize);
          if (data.imageScale !== undefined) setPengenalanImageScale(data.imageScale);
        };
      } catch (e) { }
    }

    let solusiBc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== "undefined") {
      try {
        solusiBc = new BroadcastChannel("solusi_bisnis_preview_channel");
        solusiBc.onmessage = (ev) => {
          const data = ev.data;
          if (!data) return;
          if (data.title !== undefined) setSolusiBisnisTitle(data.title);
          if (data.titleSize !== undefined) setSolusiBisnisTitleSize(data.titleSize);
          if (data.titleColor !== undefined) setSolusiBisnisTitleColor(data.titleColor);
          if (data.titleFont !== undefined) setSolusiBisnisTitleFont(data.titleFont);
          if (data.titleFontWeight !== undefined) setSolusiBisnisTitleFontWeight(data.titleFontWeight);
          if (data.cards !== undefined && Array.isArray(data.cards)) setSolusiBisnisCards(data.cards);
          if (data.descAlign !== undefined) setSolusiBisnisDescAlign(data.descAlign);
          if (data.valign !== undefined) setSolusiBisnisValign(data.valign);
          if (data.cardTitleColor !== undefined) setSolusiBisnisCardTitleColor(data.cardTitleColor);
          if (data.cardTitleSize !== undefined) setSolusiBisnisCardTitleSize(data.cardTitleSize);
          if (data.cardTitleFontWeight !== undefined) setSolusiBisnisCardTitleFontWeight(data.cardTitleFontWeight);
          if (data.cardTitleFont !== undefined) setSolusiBisnisCardTitleFont(data.cardTitleFont);
        };
      } catch (e) { }
    }

    let jenisProdukBc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== "undefined") {
      try {
        jenisProdukBc = new BroadcastChannel("jenis_produk_preview_channel");
        jenisProdukBc.onmessage = (ev) => {
          const data = ev.data;
          if (!data) return;
          if (data.title !== undefined) setJenisProdukTitle(data.title);
          if (data.titleSize !== undefined) setJenisProdukTitleSize(data.titleSize);
          if (data.titleColor !== undefined) setJenisProdukTitleColor(data.titleColor);
          if (data.titleFont !== undefined) setJenisProdukTitleFont(data.titleFont);
          if (data.titleFontWeight !== undefined) setJenisProdukTitleFontWeight(data.titleFontWeight);
          if (data.desc !== undefined) setJenisProdukDesc(data.desc);
          if (data.descColor !== undefined) setJenisProdukDescColor(data.descColor);
          if (data.descSize !== undefined) setJenisProdukDescSize(data.descSize);
          if (data.cards !== undefined && Array.isArray(data.cards)) setJenisProdukCards(data.cards);
        };
      } catch (e) { }
    }

    let peluangBc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== "undefined") {
      try {
        peluangBc = new BroadcastChannel("peluang_preview_channel");
        peluangBc.onmessage = (ev) => {
          const data = ev.data;
          if (!data) return;
          if (data.title !== undefined) setPeluangTitle(data.title);
          if (data.titleSize !== undefined) setPeluangTitleSize(data.titleSize);
          if (data.titleColor !== undefined) setPeluangTitleColor(data.titleColor);
          if (data.titleFont !== undefined) setPeluangTitleFont(data.titleFont);
          if (data.titleFontWeight !== undefined) setPeluangTitleFontWeight(data.titleFontWeight);
          if (data.desc !== undefined) setPeluangDesc(data.desc);
          if (data.descColor !== undefined) setPeluangDescColor(data.descColor);
          if (data.descSize !== undefined) setPeluangDescSize(data.descSize);
          if (data.descAlign !== undefined) setPeluangDescAlign(data.descAlign);
          if (data.valign !== undefined) setPeluangValign(data.valign);
          if (data.boxTitle !== undefined) setPeluangBoxTitle(data.boxTitle);
          if (data.boxBgColor !== undefined) setPeluangBoxBgColor(data.boxBgColor);
          if (data.boxTitleColor !== undefined) setPeluangBoxTitleColor(data.boxTitleColor);
          if (data.items !== undefined && Array.isArray(data.items)) setPeluangItems(data.items);
        };
      } catch (e) { }
    }

    let mengapaBc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== "undefined") {
      try {
        mengapaBc = new BroadcastChannel("mengapa_memilih_preview_channel");
        mengapaBc.onmessage = (ev) => {
          const data = ev.data;
          if (!data) return;
          if (data.title !== undefined) setMengapaTitle(data.title);
          if (data.titleSize !== undefined) setMengapaTitleSize(data.titleSize);
          if (data.titleColor !== undefined) setMengapaTitleColor(data.titleColor);
          if (data.titleFont !== undefined) setMengapaTitleFont(data.titleFont);
          if (data.titleFontWeight !== undefined) setMengapaTitleFontWeight(data.titleFontWeight);
          if (data.subtitle !== undefined) setMengapaSubtitle(data.subtitle);
          if (data.subtitleColor !== undefined) setMengapaSubtitleColor(data.subtitleColor);
          if (data.subtitleSize !== undefined) setMengapaSubtitleSize(data.subtitleSize);
          if (data.subtitleAlign !== undefined) setMengapaSubtitleAlign(data.subtitleAlign);
          if (data.cardBg !== undefined) setMengapaCardBg(data.cardBg);
          if (data.cardTitleColor !== undefined) setMengapaCardTitleColor(data.cardTitleColor);
          if (data.cardDescColor !== undefined) setMengapaCardDescColor(data.cardDescColor);
          if (data.cards !== undefined && Array.isArray(data.cards)) setMengapaCards(data.cards);
        };
      } catch (e) { }
    }

    let legalitasBc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== "undefined") {
      try {
        legalitasBc = new BroadcastChannel("legalitas_preview_channel");
        legalitasBc.onmessage = (ev) => {
          const data = ev.data;
          if (!data) return;
          if (data.title !== undefined) setLegalitasTitle(data.title);
          if (data.titleSize !== undefined) setLegalitasTitleSize(data.titleSize);
          if (data.titleColor !== undefined) setLegalitasTitleColor(data.titleColor);
          if (data.titleFont !== undefined) setLegalitasTitleFont(data.titleFont);
          if (data.titleFontWeight !== undefined) setLegalitasTitleFontWeight(data.titleFontWeight);
          if (data.subtitle !== undefined) setLegalitasSubtitle(data.subtitle);
          if (data.subtitleColor !== undefined) setLegalitasSubtitleColor(data.subtitleColor);
          if (data.subtitleSize !== undefined) setLegalitasSubtitleSize(data.subtitleSize);
          if (data.subtitleAlign !== undefined) setLegalitasSubtitleAlign(data.subtitleAlign);
          if (data.cardBg !== undefined) setLegalitasCardBg(data.cardBg);
          if (data.items !== undefined && Array.isArray(data.items)) setLegalitasItems(data.items);
        };
      } catch (e) { }
    }

    let dipercayaBrandBc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== "undefined") {
      try {
        dipercayaBrandBc = new BroadcastChannel("dipercaya_brand_preview_channel");
        dipercayaBrandBc.onmessage = (ev) => {
          const data = ev.data;
          if (!data) return;
          if (data.title !== undefined) setDipercayaBrandTitle(data.title);
          if (data.titleSize !== undefined) setDipercayaBrandTitleSize(data.titleSize);
          if (data.titleColor !== undefined) setDipercayaBrandTitleColor(data.titleColor);
          if (data.titleFont !== undefined) setDipercayaBrandTitleFont(data.titleFont);
          if (data.titleFontWeight !== undefined) setDipercayaBrandTitleFontWeight(data.titleFontWeight);
          if (data.subtitle !== undefined) setDipercayaBrandSubtitle(data.subtitle);
          if (data.subtitleColor !== undefined) setDipercayaBrandSubtitleColor(data.subtitleColor);
          if (data.subtitleSize !== undefined) setDipercayaBrandSubtitleSize(data.subtitleSize);
          if (data.subtitleAlign !== undefined) setDipercayaBrandSubtitleAlign(data.subtitleAlign);
          if (data.cardBg !== undefined) setDipercayaBrandCardBg(data.cardBg);
          if (data.items !== undefined && Array.isArray(data.items)) setDipercayaBrandItems(data.items);
        };
      } catch (e) { }
    }

    let prosesMaklonBc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== "undefined") {
      try {
        prosesMaklonBc = new BroadcastChannel("proses_maklon_preview_channel");
        prosesMaklonBc.onmessage = (ev) => {
          const data = ev.data;
          if (!data) return;
          if (data.title !== undefined) setProsesMaklonTitle(data.title);
          if (data.titleSize !== undefined) setProsesMaklonTitleSize(data.titleSize);
          if (data.titleColor !== undefined) setProsesMaklonTitleColor(data.titleColor);
          if (data.titleFont !== undefined) setProsesMaklonTitleFont(data.titleFont);
          if (data.titleFontWeight !== undefined) setProsesMaklonTitleFontWeight(data.titleFontWeight);
          if (data.subtitle !== undefined) setProsesMaklonSubtitle(data.subtitle);
          if (data.subtitleColor !== undefined) setProsesMaklonSubtitleColor(data.subtitleColor);
          if (data.subtitleSize !== undefined) setProsesMaklonSubtitleSize(data.subtitleSize);
          if (data.subtitleAlign !== undefined) setProsesMaklonSubtitleAlign(data.subtitleAlign);
          if (data.cardBg !== undefined) setProsesMaklonCardBg(data.cardBg);
          if (data.cardTextColor !== undefined) setProsesMaklonCardTextColor(data.cardTextColor);
          if (data.items !== undefined && Array.isArray(data.items)) setProsesMaklonItems(data.items);
        };
      } catch (e) { }
    }

    let konsultasiBannerBc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== "undefined") {
      try {
        konsultasiBannerBc = new BroadcastChannel("konsultasi_banner_preview_channel");
        konsultasiBannerBc.onmessage = (ev) => {
          const data = ev.data;
          if (!data) return;
          if (data.text !== undefined) setKonsultasiBannerText(data.text);
          if (data.textSize !== undefined) setKonsultasiBannerTextSize(data.textSize);
          if (data.textColor !== undefined) setKonsultasiBannerTextColor(data.textColor);
          if (data.textFont !== undefined) setKonsultasiBannerTextFont(data.textFont);
          if (data.textFontWeight !== undefined) setKonsultasiBannerTextFontWeight(data.textFontWeight);
          if (data.bgColor !== undefined) setKonsultasiBannerBgColor(data.bgColor);
          if (data.borderRadius !== undefined) setKonsultasiBannerBorderRadius(data.borderRadius);
          if (data.btnText !== undefined) setKonsultasiBannerBtnText(data.btnText);
          if (data.btnBgColor !== undefined) setKonsultasiBannerBtnBgColor(data.btnBgColor);
          if (data.btnTextColor !== undefined) setKonsultasiBannerBtnTextColor(data.btnTextColor);
          if (data.btnTextSize !== undefined) setKonsultasiBannerBtnTextSize(data.btnTextSize);
          if (data.btnFontWeight !== undefined) setKonsultasiBannerBtnFontWeight(data.btnFontWeight);
          if (data.linkType !== undefined) setKonsultasiBannerLinkType(data.linkType);
          if (data.waNumber !== undefined) setKonsultasiBannerWaNumber(data.waNumber);
          if (data.waMessage !== undefined) setKonsultasiBannerWaMessage(data.waMessage);
          if (data.customUrl !== undefined) setKonsultasiBannerCustomUrl(data.customUrl);
          if (data.openNewTab !== undefined) setKonsultasiBannerOpenNewTab(data.openNewTab);
        };
      } catch (e) { }
    }

    let melayaniKlienBc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== "undefined") {
      try {
        melayaniKlienBc = new BroadcastChannel("melayani_klien_preview_channel");
        melayaniKlienBc.onmessage = (ev) => {
          const data = ev.data;
          if (!data) return;
          if (data.title !== undefined) setMelayaniKlienTitle(data.title);
          if (data.titleSize !== undefined) setMelayaniKlienTitleSize(data.titleSize);
          if (data.titleColor !== undefined) setMelayaniKlienTitleColor(data.titleColor);
          if (data.titleFont !== undefined) setMelayaniKlienTitleFont(data.titleFont);
          if (data.titleFontWeight !== undefined) setMelayaniKlienTitleFontWeight(data.titleFontWeight);
          if (data.subtitle !== undefined) setMelayaniKlienSubtitle(data.subtitle);
          if (data.subtitleColor !== undefined) setMelayaniKlienSubtitleColor(data.subtitleColor);
          if (data.subtitleSize !== undefined) setMelayaniKlienSubtitleSize(data.subtitleSize);
          if (data.subtitleAlign !== undefined) setMelayaniKlienSubtitleAlign(data.subtitleAlign);
          if (data.pillBg !== undefined) setMelayaniKlienPillBg(data.pillBg);
          if (data.pillTextColor !== undefined) setMelayaniKlienPillTextColor(data.pillTextColor);
          if (data.pillSize !== undefined) setMelayaniKlienPillSize(data.pillSize);
          if (data.pillFontWeight !== undefined) setMelayaniKlienPillFontWeight(data.pillFontWeight);
          if (data.cities !== undefined && Array.isArray(data.cities)) setMelayaniKlienCities(data.cities);
        };
      } catch (e) { }
    }

    let ulasanKlienBc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== "undefined") {
      try {
        ulasanKlienBc = new BroadcastChannel("ulasan_klien_preview_channel");
        ulasanKlienBc.onmessage = (ev) => {
          const data = ev.data;
          if (!data) return;
          if (data.title !== undefined) setUlasanKlienTitle(data.title);
          if (data.titleSize !== undefined) setUlasanKlienTitleSize(data.titleSize);
          if (data.titleColor !== undefined) setUlasanKlienTitleColor(data.titleColor);
          if (data.titleFont !== undefined) setUlasanKlienTitleFont(data.titleFont);
          if (data.titleFontWeight !== undefined) setUlasanKlienTitleFontWeight(data.titleFontWeight);
          if (data.subtitle !== undefined) setUlasanKlienSubtitle(data.subtitle);
          if (data.subtitleColor !== undefined) setUlasanKlienSubtitleColor(data.subtitleColor);
          if (data.subtitleSize !== undefined) setUlasanKlienSubtitleSize(data.subtitleSize);
          if (data.items !== undefined && Array.isArray(data.items)) setUlasanKlienItems(data.items);
        };
      } catch (e) { }
    }

    let faqBc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== "undefined") {
      try {
        faqBc = new BroadcastChannel("faq_preview_channel");
        faqBc.onmessage = (ev) => {
          const data = ev.data;
          if (!data) return;
          if (data.title !== undefined) setFaqTitle(data.title);
          if (data.titleSize !== undefined) setFaqTitleSize(data.titleSize);
          if (data.titleColor !== undefined) setFaqTitleColor(data.titleColor);
          if (data.titleFont !== undefined) setFaqTitleFont(data.titleFont);
          if (data.titleFontWeight !== undefined) setFaqTitleFontWeight(data.titleFontWeight);
          if (data.subtitle !== undefined) setFaqSubtitle(data.subtitle);
          if (data.subtitleColor !== undefined) setFaqSubtitleColor(data.subtitleColor);
          if (data.subtitleSize !== undefined) setFaqSubtitleSize(data.subtitleSize);
          if (data.questionColor !== undefined) setFaqQuestionColor(data.questionColor);
          if (data.questionActiveColor !== undefined) setFaqQuestionActiveColor(data.questionActiveColor);
          if (data.answerColor !== undefined) setFaqAnswerColor(data.answerColor);
          if (data.items !== undefined && Array.isArray(data.items)) setFaqItems(data.items);
        };
      } catch (e) { }
    }

    let videoProfilBc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== "undefined") {
      try {
        videoProfilBc = new BroadcastChannel("video_profil_preview_channel");
        videoProfilBc.onmessage = (ev) => {
          const data = ev.data;
          if (!data) return;
          if (data.title !== undefined) setVideoProfilTitle(data.title);
          if (data.titleSize !== undefined) setVideoProfilTitleSize(data.titleSize);
          if (data.titleColor !== undefined) setVideoProfilTitleColor(data.titleColor);
          if (data.titleFont !== undefined) setVideoProfilTitleFont(data.titleFont);
          if (data.titleFontWeight !== undefined) setVideoProfilTitleFontWeight(data.titleFontWeight);
          if (data.desc !== undefined) setVideoProfilDesc(data.desc);
          if (data.descSize !== undefined) setVideoProfilDescSize(data.descSize);
          if (data.descColor !== undefined) setVideoProfilDescColor(data.descColor);
          if (data.thumbnail !== undefined) setVideoProfilThumbnail(data.thumbnail);
          if (data.url !== undefined) setVideoProfilUrl(data.url);
          if (data.position !== undefined) setVideoProfilPosition(data.position);
          if (data.frameSize !== undefined) setVideoProfilFrameSize(data.frameSize);
        };
      } catch (e) { }
    }

    let sosialMediaBc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== "undefined") {
      try {
        sosialMediaBc = new BroadcastChannel("sosial_media_preview_channel");
        sosialMediaBc.onmessage = (ev) => {
          const data = ev.data;
          if (!data) return;
          if (data.title !== undefined) setSosialMediaTitle(data.title);
          if (data.titleSize !== undefined) setSosialMediaTitleSize(data.titleSize);
          if (data.titleColor !== undefined) setSosialMediaTitleColor(data.titleColor);
          if (data.titleFont !== undefined) setSosialMediaTitleFont(data.titleFont);
          if (data.titleFontWeight !== undefined) setSosialMediaTitleFontWeight(data.titleFontWeight);
          if (data.label !== undefined) setSosialMediaLabel(data.label);
          if (data.labelSize !== undefined) setSosialMediaLabelSize(data.labelSize);
          if (data.labelColor !== undefined) setSosialMediaLabelColor(data.labelColor);
          if (data.bgColor !== undefined) setSosialMediaBgColor(data.bgColor);
          if (data.borderRadius !== undefined) setSosialMediaBorderRadius(data.borderRadius);
          if (data.items !== undefined && Array.isArray(data.items)) setSosialMediaItems(data.items);
        };
      } catch (e) { }
    }

    let heroBanner2Bc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== "undefined") {
      try {
        heroBanner2Bc = new BroadcastChannel("hero_banner2_preview_channel");
        heroBanner2Bc.onmessage = (ev) => {
          const data = ev.data;
          if (!data) return;
          if (data.text !== undefined) setHero2Text(data.text);
          if (data.font !== undefined) setHero2Font(data.font);
          if (data.fontSize !== undefined) {
            const num = parseInt(data.fontSize.toString(), 10);
            if (!isNaN(num)) setHero2FontSize(num);
          }
          if (data.image !== undefined) setHero2Image(data.image);
        };
      } catch (e) { }
    }

    const handleWindowMessage = (ev: MessageEvent) => {
      if (isPreview && ev.data && ev.data.type === "HERO_BANNER_PREVIEW_SYNC") {
        const data = ev.data.payload;
        if (!data) return;
        if (data.text !== undefined) setHeroText(data.text);
        if (data.font !== undefined) setHeroFont(data.font);
        if (data.fontWeight !== undefined) setHeroFontWeight(data.fontWeight);
        if (data.fontSize !== undefined) setHeroFontSize(data.fontSize.toString());
        if (data.textColor !== undefined) setHeroTextColor(data.textColor);
        if (data.subtext !== undefined) setHeroSubtext(data.subtext);
        if (data.subtextColor !== undefined) setHeroSubtextColor(data.subtextColor);
        if (data.subtextSize !== undefined) {
          const num = parseInt(data.subtextSize.toString(), 10);
          if (!isNaN(num)) setHeroSubtextSize(num);
        }
        if (data.subtextFontWeight !== undefined) setHeroSubtextFontWeight(data.subtextFontWeight);
        if (data.desc !== undefined) setHeroDesc(data.desc);
        if (data.descColor !== undefined) setHeroDescColor(data.descColor);
        if (data.descSize !== undefined) {
          const num = parseInt(data.descSize.toString(), 10);
          if (!isNaN(num)) setHeroDescSize(num);
        }
        if (data.points !== undefined && Array.isArray(data.points)) setHeroPoints(data.points);
        if (data.pointsFontWeight !== undefined) setHeroPointsFontWeight(data.pointsFontWeight);
        if (data.pointsColor !== undefined) setHeroPointsColor(data.pointsColor);
        if (data.position !== undefined) setHeroImagePosition(data.position);
        if (data.aspect !== undefined) setHeroImageAspect(data.aspect);
        if (data.imageSize !== undefined) setHeroImageSize(data.imageSize.toString());
        if (data.transparent !== undefined) setHeroImageTransparent(data.transparent === true || data.transparent === "true");
        if (data.fit !== undefined && (data.fit === "contain" || data.fit === "cover")) setHeroImageFit(data.fit);
        if (data.image !== undefined) setHeroImage(data.image);
      }
    };
    if (isPreview) {
      window.addEventListener("message", handleWindowMessage);
      try {
        if (typeof BroadcastChannel !== "undefined") {
          const reqBc = new BroadcastChannel("hero_banner_preview_channel");
          reqBc.postMessage({ type: "HERO_BANNER_PREVIEW_READY" });
          reqBc.close();
        }
      } catch (e) { }
      try {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage({ type: "HERO_BANNER_PREVIEW_READY" }, "*");
        }
      } catch (e) { }
    }

    // 1. Restore dari cache jika ada — matikan spinner langsung (instant load)
    let hasCachedData = false;
    try {
      const cached = sessionStorage.getItem("indo_green_nature_home_cache");
      if (cached) {
        hasCachedData = true;
        const parsed = JSON.parse(cached);
        if (parsed.banners) setBanners(parsed.banners);
        if (parsed.promos) setPromos(parsed.promos);
        if (parsed.products) setProducts(parsed.products);
        if (parsed.articles) setArticles(parsed.articles);
        if (!isPreview) {
          if (parsed.heroText) setHeroText(parsed.heroText);
          if (parsed.heroFont) setHeroFont(parsed.heroFont);
          if (parsed.heroFontWeight) setHeroFontWeight(parsed.heroFontWeight);
          if (parsed.heroFontSize) setHeroFontSize(parsed.heroFontSize);
          if (parsed.heroTextColor) setHeroTextColor(parsed.heroTextColor);
          if (parsed.heroSubtext !== undefined) setHeroSubtext(parsed.heroSubtext);
          if (parsed.heroSubtextColor) setHeroSubtextColor(parsed.heroSubtextColor);
          if (parsed.heroSubtextSize) setHeroSubtextSize(parsed.heroSubtextSize);
          if (parsed.heroSubtextFontWeight) setHeroSubtextFontWeight(parsed.heroSubtextFontWeight);
          if (parsed.heroDesc !== undefined) setHeroDesc(parsed.heroDesc || DEFAULT_HERO_DESC);
          if (parsed.heroDescColor) setHeroDescColor(parsed.heroDescColor);
          if (parsed.heroPoints && Array.isArray(parsed.heroPoints)) setHeroPoints(parsed.heroPoints);
          if (parsed.heroPointsFontWeight) setHeroPointsFontWeight(parsed.heroPointsFontWeight);
          if (parsed.heroPointsColor) setHeroPointsColor(parsed.heroPointsColor);
          if (parsed.heroImagePosition) setHeroImagePosition(parsed.heroImagePosition);
          if (parsed.heroImageAspect) setHeroImageAspect(parsed.heroImageAspect);
          if (parsed.heroImageSize) setHeroImageSize(parsed.heroImageSize);
          if (parsed.heroImage) {
            const isLegacy = parsed.heroImage.startsWith("/LOGO AI NEW") || parsed.heroImage.startsWith("/2sbagiamu") || parsed.heroImage.startsWith("/logo");
            if (!isLegacy) setHeroImage(parsed.heroImage);
          }
          if (parsed.heroImageTransparent !== undefined) setHeroImageTransparent(parsed.heroImageTransparent);
          if (parsed.heroImageFit) setHeroImageFit(parsed.heroImageFit);
          if (parsed.hero2Text) setHero2Text(parsed.hero2Text);
          if (parsed.hero2Font) setHero2Font(parsed.hero2Font);
          if (parsed.hero2Image) setHero2Image(parsed.hero2Image);
        }
        if (parsed.extLinks) setExtLinks(parsed.extLinks);
        if (parsed.runningTexts) setRunningTexts(parsed.runningTexts);
        if (parsed.rtConfig) setRtConfig(parsed.rtConfig);
        // Cache dimuat untuk mencegah layout shift, spinner tetap tampil sampai data siap
      }
    } catch {
      // ignore
    }

    // 2. Fetch all data in one parallel request
    async function fetchData() {
      try {
        const [
          configRes,
          rtRes,
          rtConfRes
        ] = await Promise.all([
          supabase.from("app_config").select("key, value").in("key", [
            "hero_banner_text", "hero_banner_image", "hero_banner_font", "hero_banner_font_weight", "hero_banner_font_size", "hero_banner_text_color",
            "hero_banner_subtext", "hero_banner_subtext_color", "hero_banner_subtext_size", "hero_banner_subtext_font_weight",
            "hero_banner_desc", "hero_banner_desc_color", "hero_banner_desc_size", "hero_banner_points", "hero_banner_points_font_weight", "hero_banner_points_color",
            "hero_banner_image_position", "hero_banner_image_aspect", "hero_banner_image_size", "hero_banner_image_transparent", "hero_banner_image_fit",
            "hero_banner2_text", "hero_banner2_image", "hero_banner2_font", "hero_banner2_font_size",
            "pengenalan_title", "pengenalan_title_size", "pengenalan_title_color",
            "pengenalan_title_font", "pengenalan_title_font_weight",
            "pengenalan_desc", "pengenalan_desc_size", "pengenalan_desc_color",
            "pengenalan_image", "pengenalan_image_fit", "pengenalan_image_position",
            "pengenalan_image_size", "pengenalan_image_scale",
            "solusi_bisnis_title", "solusi_bisnis_title_size", "solusi_bisnis_title_color",
            "solusi_bisnis_title_font", "solusi_bisnis_title_font_weight", "solusi_bisnis_cards",
            "solusi_bisnis_desc_align", "solusi_bisnis_valign",
            "solusi_bisnis_card_title_color", "solusi_bisnis_card_title_size", "solusi_bisnis_card_title_font_weight", "solusi_bisnis_card_title_font",
            "jenis_produk_title", "jenis_produk_title_size", "jenis_produk_title_color",
            "jenis_produk_title_font", "jenis_produk_title_font_weight",
            "jenis_produk_desc", "jenis_produk_desc_color", "jenis_produk_desc_size",
            "jenis_produk_cards",
            "peluang_title", "peluang_title_size", "peluang_title_color",
            "peluang_title_font", "peluang_title_font_weight",
            "peluang_desc", "peluang_desc_color", "peluang_desc_size",
            "peluang_desc_align", "peluang_valign",
            "peluang_box_title", "peluang_box_bg_color", "peluang_box_title_color",
            "peluang_items",
            "mengapa_title", "mengapa_title_size", "mengapa_title_color",
            "mengapa_title_font", "mengapa_title_font_weight",
            "mengapa_subtitle", "mengapa_subtitle_color", "mengapa_subtitle_size",
            "mengapa_subtitle_align", "mengapa_card_bg",
            "mengapa_card_title_color", "mengapa_card_desc_color",
            "mengapa_cards",
            "legalitas_title", "legalitas_title_size", "legalitas_title_color",
            "legalitas_title_font", "legalitas_title_font_weight",
            "legalitas_subtitle", "legalitas_subtitle_color", "legalitas_subtitle_size",
            "legalitas_subtitle_align", "legalitas_card_bg",
            "legalitas_items",
            "dipercaya_brand_title", "dipercaya_brand_title_size", "dipercaya_brand_title_color",
            "dipercaya_brand_title_font", "dipercaya_brand_title_font_weight",
            "dipercaya_brand_subtitle", "dipercaya_brand_subtitle_color", "dipercaya_brand_subtitle_size",
            "dipercaya_brand_subtitle_align", "dipercaya_brand_card_bg",
            "dipercaya_brand_items",
            "proses_maklon_title", "proses_maklon_title_size", "proses_maklon_title_color",
            "proses_maklon_title_font", "proses_maklon_title_font_weight",
            "proses_maklon_subtitle", "proses_maklon_subtitle_color", "proses_maklon_subtitle_size",
            "proses_maklon_subtitle_align", "proses_maklon_card_bg", "proses_maklon_card_text_color",
            "proses_maklon_items",
            "konsultasi_banner_text", "konsultasi_banner_text_size", "konsultasi_banner_text_color",
            "konsultasi_banner_text_font", "konsultasi_banner_text_font_weight",
            "konsultasi_banner_bg_color", "konsultasi_banner_border_radius",
            "konsultasi_banner_btn_text", "konsultasi_banner_btn_bg_color", "konsultasi_banner_btn_text_color", "konsultasi_banner_btn_text_size",
            "konsultasi_banner_link_type", "konsultasi_banner_wa_number", "konsultasi_banner_wa_message", "konsultasi_banner_custom_url", "konsultasi_banner_open_new_tab",
            "melayani_klien_title", "melayani_klien_title_size", "melayani_klien_title_color",
            "melayani_klien_title_font", "melayani_klien_title_font_weight",
            "melayani_klien_subtitle", "melayani_klien_subtitle_color", "melayani_klien_subtitle_size",
            "melayani_klien_subtitle_align", "melayani_klien_pill_bg", "melayani_klien_pill_text_color",
            "melayani_klien_pill_size", "melayani_klien_pill_font_weight", "melayani_klien_cities",
            "ulasan_klien_title", "ulasan_klien_title_size", "ulasan_klien_title_color",
            "ulasan_klien_title_font", "ulasan_klien_title_font_weight",
            "ulasan_klien_subtitle", "ulasan_klien_subtitle_color", "ulasan_klien_subtitle_size",
            "ulasan_klien_items",
            "faq_title", "faq_title_size", "faq_title_color",
            "faq_title_font", "faq_title_font_weight",
            "faq_subtitle", "faq_subtitle_color", "faq_subtitle_size",
            "faq_question_color", "faq_question_active_color", "faq_answer_color",
            "faq_items",
            "video_profil_title", "video_profil_title_size", "video_profil_title_color",
            "video_profil_title_font", "video_profil_title_font_weight",
            "video_profil_desc", "video_profil_desc_size", "video_profil_desc_color",
            "video_profil_thumbnail", "video_profil_url", "video_profil_position", "video_profil_frame_size",
            "sosial_media_title", "sosial_media_title_size", "sosial_media_title_color",
            "sosial_media_title_font", "sosial_media_title_font_weight",
            "sosial_media_label", "sosial_media_label_size", "sosial_media_label_color",
            "sosial_media_bg_color", "sosial_media_border_radius", "sosial_media_items",
            "grabfood_link", "shopeefood_link", "gofood_link", "google_review_link", "instagram_link", "facebook_link", "tiktok_link", "youtube_link", "website_link", "home_layout", "our_products_page_config"
          ]),
          supabase.from("running_text").select("*").eq("is_active", true).order("created_at", { ascending: true }),
          supabase.from("running_text_config").select("*").eq("id", 1).maybeSingle()
        ]);

        if (rtRes.data) setRunningTexts(rtRes.data);
        if (rtConfRes.data) setRtConfig(rtConfRes.data);

        let hText = heroText;
        let hImage = heroImage;
        let hFont = heroFont;
        let hFontWeight = heroFontWeight;
        let hFontSize = heroFontSize;
        let hTextColor = heroTextColor;
        let hSubtext = heroSubtext;
        let hSubtextColor = heroSubtextColor;
        let hSubtextSize = heroSubtextSize;
        let hSubtextFontWeight = heroSubtextFontWeight;
        let hDesc = heroDesc;
        let hDescColor = heroDescColor;
        let hPoints = heroPoints;
        let hPointsFontWeight = heroPointsFontWeight;
        let hPointsColor = heroPointsColor;
        let hImagePosition = heroImagePosition;
        let hImageAspect = heroImageAspect;
        let hImageSize = heroImageSize;
        let hImageTransparent = heroImageTransparent;
        let hImageFit = heroImageFit;
        let h2Text = hero2Text;
        let h2Image = hero2Image;
        let h2Font = hero2Font;
        const linksObj: Record<string, string> = {};

        if (configRes.data) {
          configRes.data.forEach(item => {
            if (item.key === 'hero_banner_text') {
              if (!isPreview) {
                setHeroText(item.value);
                hText = item.value;
                localStorage.setItem('hero_banner_text', item.value);
              }
            }
            else if (item.key === 'hero_banner_image') {
              if (!isPreview) {
                setHeroImage(item.value);
                hImage = item.value;
                localStorage.setItem('hero_banner_image', item.value);
              }
            }
            else if (item.key === 'hero_banner_font') {
              if (!isPreview) {
                setHeroFont(item.value);
                hFont = item.value;
                localStorage.setItem('hero_banner_font', item.value);
              }
            }
            else if (item.key === 'hero_banner_font_weight' && item.value) {
              hFontWeight = item.value;
              if (!isPreview) {
                setHeroFontWeight(item.value);
                localStorage.setItem('hero_banner_font_weight', item.value);
              }
            }
            else if (item.key === 'hero_banner_font_size' && item.value) {
              hFontSize = item.value;
              if (!isPreview) {
                setHeroFontSize(item.value);
                localStorage.setItem('hero_banner_font_size', item.value);
              }
            }
            else if (item.key === 'hero_banner_text_color' && item.value) {
              hTextColor = item.value;
              if (!isPreview) {
                setHeroTextColor(item.value);
                localStorage.setItem('hero_banner_text_color', item.value);
              }
            }
            else if (item.key === 'hero_banner_subtext' && item.value !== undefined) {
              hSubtext = item.value;
              if (!isPreview) {
                setHeroSubtext(item.value);
                localStorage.setItem('hero_banner_subtext', item.value);
              }
            }
            else if (item.key === 'hero_banner_subtext_color' && item.value) {
              hSubtextColor = item.value;
              if (!isPreview) {
                setHeroSubtextColor(item.value);
                localStorage.setItem('hero_banner_subtext_color', item.value);
              }
            }
            else if (item.key === 'hero_banner_subtext_size' && item.value) {
              const num = parseInt(item.value, 10);
              if (!isNaN(num)) {
                hSubtextSize = num;
                if (!isPreview) {
                  setHeroSubtextSize(num);
                  localStorage.setItem('hero_banner_subtext_size', item.value);
                }
              }
            }
            else if (item.key === 'hero_banner_subtext_font_weight' && item.value) {
              hSubtextFontWeight = item.value;
              if (!isPreview) {
                setHeroSubtextFontWeight(item.value);
                localStorage.setItem('hero_banner_subtext_font_weight', item.value);
              }
            }
            else if (item.key === 'hero_banner_desc' && item.value !== undefined) {
              const val = item.value || DEFAULT_HERO_DESC;
              hDesc = val;
              if (!isPreview) {
                setHeroDesc(val);
                localStorage.setItem('hero_banner_desc', val);
              }
            }
            else if (item.key === 'hero_banner_desc_color' && item.value) {
              hDescColor = item.value;
              if (!isPreview) {
                setHeroDescColor(item.value);
                localStorage.setItem('hero_banner_desc_color', item.value);
              }
            }
            else if (item.key === 'hero_banner_desc_size' && item.value) {
              const num = parseInt(item.value, 10);
              if (!isNaN(num)) {
                if (!isPreview) {
                  setHeroDescSize(num);
                  localStorage.setItem('hero_banner_desc_size', item.value);
                }
              }
            }
            else if (item.key === 'hero_banner_points' && item.value) {
              try {
                const parsed = JSON.parse(item.value);
                if (Array.isArray(parsed)) {
                  hPoints = parsed;
                  if (!isPreview) {
                    setHeroPoints(parsed);
                    localStorage.setItem('hero_banner_points', item.value);
                  }
                }
              } catch (e) { }
            }
            else if (item.key === 'hero_banner_points_font_weight' && item.value) {
              hPointsFontWeight = item.value;
              if (!isPreview) {
                setHeroPointsFontWeight(item.value);
                localStorage.setItem('hero_banner_points_font_weight', item.value);
              }
            }
            else if (item.key === 'hero_banner_points_color' && item.value) {
              hPointsColor = item.value;
              if (!isPreview) {
                setHeroPointsColor(item.value);
                localStorage.setItem('hero_banner_points_color', item.value);
              }
            }
            else if (item.key === 'hero_banner_image_position' && (item.value === 'left' || item.value === 'right')) {
              hImagePosition = item.value as 'left' | 'right';
              if (!isPreview) {
                setHeroImagePosition(item.value as 'left' | 'right');
                localStorage.setItem('hero_banner_image_position', item.value);
              }
            }
            else if (item.key === 'hero_banner_image_aspect' && item.value) {
              hImageAspect = item.value;
              if (!isPreview) {
                setHeroImageAspect(item.value);
                localStorage.setItem('hero_banner_image_aspect', item.value);
              }
            }
            else if (item.key === 'hero_banner_image_size' && item.value) {
              hImageSize = item.value;
              if (!isPreview) {
                setHeroImageSize(item.value);
                localStorage.setItem('hero_banner_image_size', item.value);
              }
            }
            else if (item.key === 'hero_banner_image_transparent') {
              const isTrans = item.value === 'true';
              hImageTransparent = isTrans;
              if (!isPreview) {
                setHeroImageTransparent(isTrans);
                localStorage.setItem('hero_banner_image_transparent', isTrans ? 'true' : 'false');
              }
            }
            else if (item.key === 'hero_banner_image_fit' && (item.value === 'contain' || item.value === 'cover')) {
              hImageFit = item.value as 'contain' | 'cover';
              if (!isPreview) {
                setHeroImageFit(item.value as 'contain' | 'cover');
                localStorage.setItem('hero_banner_image_fit', item.value);
              }
            }
            else if (item.key === 'hero_banner2_text') {
              if (!isPreview) {
                setHero2Text(item.value);
                h2Text = item.value;
                localStorage.setItem('hero_banner2_text', item.value);
              }
            }
            else if (item.key === 'hero_banner2_image') {
              if (!isPreview) {
                setHero2Image(item.value);
                h2Image = item.value;
                localStorage.setItem('hero_banner2_image', item.value);
              }
            }
            else if (item.key === 'hero_banner2_font') {
              if (!isPreview) {
                setHero2Font(item.value);
                h2Font = item.value;
                localStorage.setItem('hero_banner2_font', item.value);
              }
            }
            else if (item.key === 'hero_banner2_font_size' && item.value) {
              const num = parseInt(item.value, 10);
              if (!isNaN(num)) {
                if (!isPreview) {
                  setHero2FontSize(num);
                  localStorage.setItem('hero_banner2_font_size', item.value);
                }
              }
            }
            else if (item.key === 'pengenalan_title') {
              if (!isPreview) {
                setPengenalanTitle(item.value);
                localStorage.setItem('pengenalan_title', item.value);
              }
            }
            else if (item.key === 'pengenalan_title_size') {
              const num = parseInt(item.value, 10);
              if (!isNaN(num) && !isPreview) {
                setPengenalanTitleSize(num);
                localStorage.setItem('pengenalan_title_size', item.value);
              }
            }
            else if (item.key === 'pengenalan_title_color') {
              if (!isPreview) {
                setPengenalanTitleColor(item.value);
                localStorage.setItem('pengenalan_title_color', item.value);
              }
            }
            else if (item.key === 'pengenalan_title_font' && item.value) {
              if (!isPreview) {
                setPengenalanTitleFont(item.value);
                localStorage.setItem('pengenalan_title_font', item.value);
              }
            }
            else if (item.key === 'pengenalan_title_font_weight' && item.value) {
              if (!isPreview) {
                setPengenalanTitleFontWeight(item.value);
                localStorage.setItem('pengenalan_title_font_weight', item.value);
              }
            }
            else if (item.key === 'pengenalan_desc') {
              if (!isPreview) {
                setPengenalanDesc(item.value);
                localStorage.setItem('pengenalan_desc', item.value);
              }
            }
            else if (item.key === 'pengenalan_desc_size') {
              const num = parseInt(item.value, 10);
              if (!isNaN(num) && !isPreview) {
                setPengenalanDescSize(num);
                localStorage.setItem('pengenalan_desc_size', item.value);
              }
            }
            else if (item.key === 'pengenalan_desc_color') {
              if (!isPreview) {
                setPengenalanDescColor(item.value);
                localStorage.setItem('pengenalan_desc_color', item.value);
              }
            }
            else if (item.key === 'pengenalan_image') {
              if (!isPreview) {
                setPengenalanImage(item.value);
                localStorage.setItem('pengenalan_image', item.value);
              }
            }
            else if (item.key === 'pengenalan_image_fit' && (item.value === 'cover' || item.value === 'contain' || item.value === 'fill')) {
              if (!isPreview) {
                setPengenalanImageFit(item.value as any);
                localStorage.setItem('pengenalan_image_fit', item.value);
              }
            }
            else if (item.key === 'pengenalan_image_position' && (item.value === 'left' || item.value === 'right')) {
              if (!isPreview) {
                setPengenalanImagePosition(item.value as 'left' | 'right');
                localStorage.setItem('pengenalan_image_position', item.value);
              }
            }
            else if (item.key === 'pengenalan_image_size') {
              const num = parseInt(item.value, 10);
              if (!isNaN(num) && !isPreview) {
                setPengenalanImageSize(num);
                localStorage.setItem('pengenalan_image_size', item.value);
              }
            }
            else if (item.key === 'pengenalan_image_scale') {
              const num = parseInt(item.value, 10);
              if (!isNaN(num) && !isPreview) {
                setPengenalanImageScale(num);
                localStorage.setItem('pengenalan_image_scale', item.value);
              }
            }
            else if (item.key === 'solusi_bisnis_title') {
              if (!isPreview) {
                setSolusiBisnisTitle(item.value);
                localStorage.setItem('solusi_bisnis_title', item.value);
              }
            }
            else if (item.key === 'solusi_bisnis_title_size') {
              const num = parseInt(item.value, 10);
              if (!isNaN(num) && !isPreview) {
                setSolusiBisnisTitleSize(num);
                localStorage.setItem('solusi_bisnis_title_size', item.value);
              }
            }
            else if (item.key === 'solusi_bisnis_title_color') {
              if (!isPreview) {
                setSolusiBisnisTitleColor(item.value);
                localStorage.setItem('solusi_bisnis_title_color', item.value);
              }
            }
            else if (item.key === 'solusi_bisnis_title_font' && item.value) {
              if (!isPreview) {
                setSolusiBisnisTitleFont(item.value);
                localStorage.setItem('solusi_bisnis_title_font', item.value);
              }
            }
            else if (item.key === 'solusi_bisnis_title_font_weight' && item.value) {
              if (!isPreview) {
                setSolusiBisnisTitleFontWeight(item.value);
                localStorage.setItem('solusi_bisnis_title_font_weight', item.value);
              }
            }
            else if (item.key === 'solusi_bisnis_cards' && item.value) {
              try {
                const parsed = JSON.parse(item.value);
                if (Array.isArray(parsed) && !isPreview) {
                  setSolusiBisnisCards(parsed);
                  localStorage.setItem('solusi_bisnis_cards', item.value);
                }
              } catch (e) {}
            }
            else if (item.key === 'solusi_bisnis_desc_align' && (item.value === 'center' || item.value === 'left' || item.value === 'justify')) {
              if (!isPreview) {
                setSolusiBisnisDescAlign(item.value as any);
                localStorage.setItem('solusi_bisnis_desc_align', item.value);
              }
            }
            else if (item.key === 'solusi_bisnis_valign' && (item.value === 'center' || item.value === 'top')) {
              if (!isPreview) {
                setSolusiBisnisValign(item.value as any);
                localStorage.setItem('solusi_bisnis_valign', item.value);
              }
            }
            else if (item.key === 'solusi_bisnis_card_title_color' && item.value) {
              if (!isPreview) {
                setSolusiBisnisCardTitleColor(item.value);
                localStorage.setItem('solusi_bisnis_card_title_color', item.value);
              }
            }
            else if (item.key === 'solusi_bisnis_card_title_size' && item.value) {
              const num = parseInt(item.value, 10);
              if (!isNaN(num) && !isPreview) {
                setSolusiBisnisCardTitleSize(num);
                localStorage.setItem('solusi_bisnis_card_title_size', item.value);
              }
            }
            else if (item.key === 'solusi_bisnis_card_title_font_weight' && item.value) {
              if (!isPreview) {
                setSolusiBisnisCardTitleFontWeight(item.value);
                localStorage.setItem('solusi_bisnis_card_title_font_weight', item.value);
              }
            }
            else if (item.key === 'solusi_bisnis_card_title_font' && item.value) {
              if (!isPreview) {
                setSolusiBisnisCardTitleFont(item.value);
                localStorage.setItem('solusi_bisnis_card_title_font', item.value);
              }
            }
            else if (item.key === 'jenis_produk_title') {
              if (!isPreview) {
                setJenisProdukTitle(item.value || DEFAULT_JENIS_PRODUK_TITLE);
                localStorage.setItem('jenis_produk_title', item.value);
              }
            }
            else if (item.key === 'jenis_produk_title_size') {
              if (!isPreview && item.value) {
                const s = parseInt(item.value, 10);
                if (!isNaN(s)) setJenisProdukTitleSize(s);
                localStorage.setItem('jenis_produk_title_size', item.value);
              }
            }
            else if (item.key === 'jenis_produk_title_color') {
              if (!isPreview) {
                setJenisProdukTitleColor(item.value || DEFAULT_JENIS_PRODUK_TITLE_COLOR);
                localStorage.setItem('jenis_produk_title_color', item.value);
              }
            }
            else if (item.key === 'jenis_produk_title_font' && item.value) {
              if (!isPreview) {
                setJenisProdukTitleFont(item.value);
                localStorage.setItem('jenis_produk_title_font', item.value);
              }
            }
            else if (item.key === 'jenis_produk_title_font_weight' && item.value) {
              if (!isPreview) {
                setJenisProdukTitleFontWeight(item.value);
                localStorage.setItem('jenis_produk_title_font_weight', item.value);
              }
            }
            else if (item.key === 'jenis_produk_desc') {
              if (!isPreview) {
                setJenisProdukDesc(item.value || DEFAULT_JENIS_PRODUK_DESC);
                localStorage.setItem('jenis_produk_desc', item.value);
              }
            }
            else if (item.key === 'jenis_produk_desc_color') {
              if (!isPreview) {
                setJenisProdukDescColor(item.value || DEFAULT_JENIS_PRODUK_DESC_COLOR);
                localStorage.setItem('jenis_produk_desc_color', item.value);
              }
            }
            else if (item.key === 'jenis_produk_desc_size') {
              if (!isPreview && item.value) {
                const s = parseInt(item.value, 10);
                if (!isNaN(s)) setJenisProdukDescSize(s);
                localStorage.setItem('jenis_produk_desc_size', item.value);
              }
            }
            else if (item.key === 'jenis_produk_cards' && item.value) {
              try {
                const cards = JSON.parse(item.value);
                if (Array.isArray(cards)) {
                  if (!isPreview) setJenisProdukCards(cards);
                  localStorage.setItem('jenis_produk_cards', item.value);
                }
              } catch (e) { }
            }
            else if (item.key === 'peluang_title') {
              if (!isPreview) {
                setPeluangTitle(item.value || DEFAULT_PELUANG_TITLE);
                localStorage.setItem('peluang_title', item.value);
              }
            }
            else if (item.key === 'peluang_title_size') {
              if (!isPreview && item.value) {
                const s = parseInt(item.value, 10);
                if (!isNaN(s)) setPeluangTitleSize(s);
                localStorage.setItem('peluang_title_size', item.value);
              }
            }
            else if (item.key === 'peluang_title_color') {
              if (!isPreview) {
                setPeluangTitleColor(item.value || DEFAULT_PELUANG_TITLE_COLOR);
                localStorage.setItem('peluang_title_color', item.value);
              }
            }
            else if (item.key === 'peluang_title_font' && item.value) {
              if (!isPreview) {
                setPeluangTitleFont(item.value);
                localStorage.setItem('peluang_title_font', item.value);
              }
            }
            else if (item.key === 'peluang_title_font_weight' && item.value) {
              if (!isPreview) {
                setPeluangTitleFontWeight(item.value);
                localStorage.setItem('peluang_title_font_weight', item.value);
              }
            }
            else if (item.key === 'peluang_desc') {
              if (!isPreview) {
                setPeluangDesc(item.value || DEFAULT_PELUANG_DESC);
                localStorage.setItem('peluang_desc', item.value);
              }
            }
            else if (item.key === 'peluang_desc_color') {
              if (!isPreview) {
                setPeluangDescColor(item.value || DEFAULT_PELUANG_DESC_COLOR);
                localStorage.setItem('peluang_desc_color', item.value);
              }
            }
            else if (item.key === 'peluang_desc_size') {
              if (!isPreview && item.value) {
                const s = parseInt(item.value, 10);
                if (!isNaN(s)) setPeluangDescSize(s);
                localStorage.setItem('peluang_desc_size', item.value);
              }
            }
            else if (item.key === 'peluang_desc_align' && (item.value === 'center' || item.value === 'left' || item.value === 'justify')) {
              if (!isPreview) {
                setPeluangDescAlign(item.value as any);
                localStorage.setItem('peluang_desc_align', item.value);
              }
            }
            else if (item.key === 'peluang_valign' && (item.value === 'center' || item.value === 'top')) {
              if (!isPreview) {
                setPeluangValign(item.value as any);
                localStorage.setItem('peluang_valign', item.value);
              }
            }
            else if (item.key === 'peluang_box_title') {
              if (!isPreview) {
                setPeluangBoxTitle(item.value || DEFAULT_PELUANG_BOX_TITLE);
                localStorage.setItem('peluang_box_title', item.value);
              }
            }
            else if (item.key === 'peluang_box_bg_color') {
              if (!isPreview) {
                setPeluangBoxBgColor(item.value || DEFAULT_PELUANG_BOX_BG_COLOR);
                localStorage.setItem('peluang_box_bg_color', item.value);
              }
            }
            else if (item.key === 'peluang_box_title_color') {
              if (!isPreview) {
                setPeluangBoxTitleColor(item.value || DEFAULT_PELUANG_BOX_TITLE_COLOR);
                localStorage.setItem('peluang_box_title_color', item.value);
              }
            }
            else if (item.key === 'peluang_items' && item.value) {
              try {
                const items = JSON.parse(item.value);
                if (Array.isArray(items) && items.length > 0) {
                  if (!isPreview) {
                    setPeluangItems(items);
                    localStorage.setItem('peluang_items', item.value);
                  }
                }
              } catch (e) { }
            }
            else if (item.key === 'mengapa_title') {
              if (!isPreview) {
                setMengapaTitle(item.value || DEFAULT_MENGAPA_TITLE);
                localStorage.setItem('mengapa_title', item.value);
              }
            }
            else if (item.key === 'mengapa_title_size') {
              if (!isPreview && item.value) {
                const s = parseInt(item.value, 10);
                if (!isNaN(s)) setMengapaTitleSize(s);
                localStorage.setItem('mengapa_title_size', item.value);
              }
            }
            else if (item.key === 'mengapa_title_color') {
              if (!isPreview) {
                setMengapaTitleColor(item.value || DEFAULT_MENGAPA_TITLE_COLOR);
                localStorage.setItem('mengapa_title_color', item.value);
              }
            }
            else if (item.key === 'mengapa_title_font' && item.value) {
              if (!isPreview) {
                setMengapaTitleFont(item.value);
                localStorage.setItem('mengapa_title_font', item.value);
              }
            }
            else if (item.key === 'mengapa_title_font_weight' && item.value) {
              if (!isPreview) {
                setMengapaTitleFontWeight(item.value);
                localStorage.setItem('mengapa_title_font_weight', item.value);
              }
            }
            else if (item.key === 'mengapa_subtitle') {
              if (!isPreview) {
                setMengapaSubtitle(item.value || DEFAULT_MENGAPA_SUBTITLE);
                localStorage.setItem('mengapa_subtitle', item.value);
              }
            }
            else if (item.key === 'mengapa_subtitle_color') {
              if (!isPreview) {
                setMengapaSubtitleColor(item.value || DEFAULT_MENGAPA_SUBTITLE_COLOR);
                localStorage.setItem('mengapa_subtitle_color', item.value);
              }
            }
            else if (item.key === 'mengapa_subtitle_size') {
              if (!isPreview && item.value) {
                const s = parseInt(item.value, 10);
                if (!isNaN(s)) setMengapaSubtitleSize(s);
                localStorage.setItem('mengapa_subtitle_size', item.value);
              }
            }
            else if (item.key === 'mengapa_subtitle_align' && (item.value === 'center' || item.value === 'left' || item.value === 'justify')) {
              if (!isPreview) {
                setMengapaSubtitleAlign(item.value as any);
                localStorage.setItem('mengapa_subtitle_align', item.value);
              }
            }
            else if (item.key === 'mengapa_card_bg') {
              if (!isPreview) {
                setMengapaCardBg(item.value || DEFAULT_MENGAPA_CARD_BG);
                localStorage.setItem('mengapa_card_bg', item.value);
              }
            }
            else if (item.key === 'mengapa_card_title_color') {
              if (!isPreview) {
                setMengapaCardTitleColor(item.value || DEFAULT_MENGAPA_CARD_TITLE_COLOR);
                localStorage.setItem('mengapa_card_title_color', item.value);
              }
            }
            else if (item.key === 'mengapa_card_desc_color') {
              if (!isPreview) {
                setMengapaCardDescColor(item.value || DEFAULT_MENGAPA_CARD_DESC_COLOR);
                localStorage.setItem('mengapa_card_desc_color', item.value);
              }
            }
            else if (item.key === 'mengapa_cards' && item.value) {
              try {
                const parsed = JSON.parse(item.value);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  if (!isPreview) setMengapaCards(parsed);
                  localStorage.setItem('mengapa_cards', item.value);
                }
              } catch (e) { }
            }
            else if (item.key === 'legalitas_title') {
              if (!isPreview) {
                setLegalitasTitle(item.value || DEFAULT_LEGALITAS_TITLE);
                localStorage.setItem('legalitas_title', item.value);
              }
            }
            else if (item.key === 'legalitas_title_size') {
              if (!isPreview && item.value) {
                const s = parseInt(item.value, 10);
                if (!isNaN(s)) setLegalitasTitleSize(s);
                localStorage.setItem('legalitas_title_size', item.value);
              }
            }
            else if (item.key === 'legalitas_title_color') {
              if (!isPreview) {
                setLegalitasTitleColor(item.value || DEFAULT_LEGALITAS_TITLE_COLOR);
                localStorage.setItem('legalitas_title_color', item.value);
              }
            }
            else if (item.key === 'legalitas_title_font' && item.value) {
              if (!isPreview) {
                setLegalitasTitleFont(item.value);
                localStorage.setItem('legalitas_title_font', item.value);
              }
            }
            else if (item.key === 'legalitas_title_font_weight' && item.value) {
              if (!isPreview) {
                setLegalitasTitleFontWeight(item.value);
                localStorage.setItem('legalitas_title_font_weight', item.value);
              }
            }
            else if (item.key === 'legalitas_subtitle') {
              if (!isPreview) {
                setLegalitasSubtitle(item.value || DEFAULT_LEGALITAS_SUBTITLE);
                localStorage.setItem('legalitas_subtitle', item.value);
              }
            }
            else if (item.key === 'legalitas_subtitle_color') {
              if (!isPreview) {
                setLegalitasSubtitleColor(item.value || DEFAULT_LEGALITAS_SUBTITLE_COLOR);
                localStorage.setItem('legalitas_subtitle_color', item.value);
              }
            }
            else if (item.key === 'legalitas_subtitle_size') {
              if (!isPreview && item.value) {
                const s = parseInt(item.value, 10);
                if (!isNaN(s)) setLegalitasSubtitleSize(s);
                localStorage.setItem('legalitas_subtitle_size', item.value);
              }
            }
            else if (item.key === 'legalitas_subtitle_align' && (item.value === 'center' || item.value === 'left' || item.value === 'justify')) {
              if (!isPreview) {
                setLegalitasSubtitleAlign(item.value as any);
                localStorage.setItem('legalitas_subtitle_align', item.value);
              }
            }
            else if (item.key === 'legalitas_card_bg') {
              if (!isPreview) {
                setLegalitasCardBg(item.value || DEFAULT_LEGALITAS_CARD_BG);
                localStorage.setItem('legalitas_card_bg', item.value);
              }
            }
            else if (item.key === 'legalitas_items' && item.value) {
              try {
                const parsed = JSON.parse(item.value);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  if (!isPreview) setLegalitasItems(parsed);
                  localStorage.setItem('legalitas_items', item.value);
                }
              } catch (e) { }
            }
            else if (item.key === 'dipercaya_brand_title') {
              if (!isPreview) {
                setDipercayaBrandTitle(item.value || DEFAULT_DIPERCAYA_BRAND_TITLE);
                localStorage.setItem('dipercaya_brand_title', item.value);
              }
            }
            else if (item.key === 'dipercaya_brand_title_size') {
              if (!isPreview && item.value) {
                const s = parseInt(item.value, 10);
                if (!isNaN(s)) setDipercayaBrandTitleSize(s);
                localStorage.setItem('dipercaya_brand_title_size', item.value);
              }
            }
            else if (item.key === 'dipercaya_brand_title_color') {
              if (!isPreview) {
                setDipercayaBrandTitleColor(item.value || DEFAULT_DIPERCAYA_BRAND_TITLE_COLOR);
                localStorage.setItem('dipercaya_brand_title_color', item.value);
              }
            }
            else if (item.key === 'dipercaya_brand_title_font' && item.value) {
              if (!isPreview) {
                setDipercayaBrandTitleFont(item.value);
                localStorage.setItem('dipercaya_brand_title_font', item.value);
              }
            }
            else if (item.key === 'dipercaya_brand_title_font_weight' && item.value) {
              if (!isPreview) {
                setDipercayaBrandTitleFontWeight(item.value);
                localStorage.setItem('dipercaya_brand_title_font_weight', item.value);
              }
            }
            else if (item.key === 'dipercaya_brand_subtitle') {
              if (!isPreview) {
                setDipercayaBrandSubtitle(item.value || DEFAULT_DIPERCAYA_BRAND_SUBTITLE);
                localStorage.setItem('dipercaya_brand_subtitle', item.value);
              }
            }
            else if (item.key === 'dipercaya_brand_subtitle_color') {
              if (!isPreview) {
                setDipercayaBrandSubtitleColor(item.value || DEFAULT_DIPERCAYA_BRAND_SUBTITLE_COLOR);
                localStorage.setItem('dipercaya_brand_subtitle_color', item.value);
              }
            }
            else if (item.key === 'dipercaya_brand_subtitle_size') {
              if (!isPreview && item.value) {
                const s = parseInt(item.value, 10);
                if (!isNaN(s)) setDipercayaBrandSubtitleSize(s);
                localStorage.setItem('dipercaya_brand_subtitle_size', item.value);
              }
            }
            else if (item.key === 'dipercaya_brand_subtitle_align' && (item.value === 'center' || item.value === 'left' || item.value === 'justify')) {
              if (!isPreview) {
                setDipercayaBrandSubtitleAlign(item.value as any);
                localStorage.setItem('dipercaya_brand_subtitle_align', item.value);
              }
            }
            else if (item.key === 'dipercaya_brand_card_bg') {
              if (!isPreview) {
                setDipercayaBrandCardBg(item.value || DEFAULT_DIPERCAYA_BRAND_CARD_BG);
                localStorage.setItem('dipercaya_brand_card_bg', item.value);
              }
            }
            else if (item.key === 'dipercaya_brand_items' && item.value) {
              try {
                const parsed = JSON.parse(item.value);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  if (!isPreview) setDipercayaBrandItems(parsed);
                  localStorage.setItem('dipercaya_brand_items', item.value);
                }
              } catch (e) { }
            }
            else if (item.key === 'proses_maklon_title') {
              if (!isPreview) {
                setProsesMaklonTitle(item.value || DEFAULT_PROSES_MAKLON_TITLE);
                localStorage.setItem('proses_maklon_title', item.value);
              }
            }
            else if (item.key === 'proses_maklon_title_size') {
              const s = parseInt(item.value, 10);
              if (!isNaN(s) && !isPreview) {
                setProsesMaklonTitleSize(s);
                localStorage.setItem('proses_maklon_title_size', item.value);
              }
            }
            else if (item.key === 'proses_maklon_title_color') {
              if (!isPreview) {
                setProsesMaklonTitleColor(item.value || DEFAULT_PROSES_MAKLON_TITLE_COLOR);
                localStorage.setItem('proses_maklon_title_color', item.value);
              }
            }
            else if (item.key === 'proses_maklon_title_font' && item.value) {
              if (!isPreview) {
                setProsesMaklonTitleFont(item.value);
                localStorage.setItem('proses_maklon_title_font', item.value);
              }
            }
            else if (item.key === 'proses_maklon_title_font_weight' && item.value) {
              if (!isPreview) {
                setProsesMaklonTitleFontWeight(item.value);
                localStorage.setItem('proses_maklon_title_font_weight', item.value);
              }
            }
            else if (item.key === 'proses_maklon_subtitle') {
              if (!isPreview) {
                setProsesMaklonSubtitle(item.value || DEFAULT_PROSES_MAKLON_SUBTITLE);
                localStorage.setItem('proses_maklon_subtitle', item.value);
              }
            }
            else if (item.key === 'proses_maklon_subtitle_color') {
              if (!isPreview) {
                setProsesMaklonSubtitleColor(item.value || DEFAULT_PROSES_MAKLON_SUBTITLE_COLOR);
                localStorage.setItem('proses_maklon_subtitle_color', item.value);
              }
            }
            else if (item.key === 'proses_maklon_subtitle_size') {
              const s = parseInt(item.value, 10);
              if (!isNaN(s) && !isPreview) {
                setProsesMaklonSubtitleSize(s);
                localStorage.setItem('proses_maklon_subtitle_size', item.value);
              }
            }
            else if (item.key === 'proses_maklon_subtitle_align' && (item.value === 'center' || item.value === 'left' || item.value === 'justify')) {
              if (!isPreview) {
                setProsesMaklonSubtitleAlign(item.value as any);
                localStorage.setItem('proses_maklon_subtitle_align', item.value);
              }
            }
            else if (item.key === 'proses_maklon_card_bg') {
              if (!isPreview) {
                setProsesMaklonCardBg(item.value || DEFAULT_PROSES_MAKLON_CARD_BG);
                localStorage.setItem('proses_maklon_card_bg', item.value);
              }
            }
            else if (item.key === 'proses_maklon_card_text_color') {
              if (!isPreview) {
                setProsesMaklonCardTextColor(item.value || DEFAULT_PROSES_MAKLON_CARD_TEXT_COLOR);
                localStorage.setItem('proses_maklon_card_text_color', item.value);
              }
            }
            else if (item.key === 'proses_maklon_items' && item.value) {
              try {
                const parsed = JSON.parse(item.value);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  if (!isPreview) setProsesMaklonItems(parsed);
                  localStorage.setItem('proses_maklon_items', item.value);
                }
              } catch (e) { }
            }
            else if (item.key === 'konsultasi_banner_text') {
              if (!isPreview) {
                setKonsultasiBannerText(item.value || DEFAULT_KONSULTASI_BANNER_TEXT);
                localStorage.setItem('konsultasi_banner_text', item.value);
              }
            }
            else if (item.key === 'konsultasi_banner_text_size') {
              if (!isPreview) {
                const num = parseInt(item.value, 10);
                if (!isNaN(num)) {
                  setKonsultasiBannerTextSize(num);
                  localStorage.setItem('konsultasi_banner_text_size', item.value);
                }
              }
            }
            else if (item.key === 'konsultasi_banner_text_color') {
              if (!isPreview) {
                setKonsultasiBannerTextColor(item.value || DEFAULT_KONSULTASI_BANNER_TEXT_COLOR);
                localStorage.setItem('konsultasi_banner_text_color', item.value);
              }
            }
            else if (item.key === 'konsultasi_banner_text_font' && item.value) {
              if (!isPreview) {
                setKonsultasiBannerTextFont(item.value);
                localStorage.setItem('konsultasi_banner_text_font', item.value);
              }
            }
            else if (item.key === 'konsultasi_banner_text_font_weight' && item.value) {
              if (!isPreview) {
                setKonsultasiBannerTextFontWeight(item.value);
                localStorage.setItem('konsultasi_banner_text_font_weight', item.value);
              }
            }
            else if (item.key === 'konsultasi_banner_bg_color') {
              if (!isPreview) {
                setKonsultasiBannerBgColor(item.value || DEFAULT_KONSULTASI_BANNER_BG_COLOR);
                localStorage.setItem('konsultasi_banner_bg_color', item.value);
              }
            }
            else if (item.key === 'konsultasi_banner_border_radius') {
              if (!isPreview) {
                const num = parseInt(item.value, 10);
                if (!isNaN(num)) {
                  setKonsultasiBannerBorderRadius(num);
                  localStorage.setItem('konsultasi_banner_border_radius', item.value);
                }
              }
            }
            else if (item.key === 'konsultasi_banner_btn_text') {
              if (!isPreview) {
                setKonsultasiBannerBtnText(item.value || DEFAULT_KONSULTASI_BANNER_BTN_TEXT);
                localStorage.setItem('konsultasi_banner_btn_text', item.value);
              }
            }
            else if (item.key === 'konsultasi_banner_btn_bg_color') {
              if (!isPreview) {
                setKonsultasiBannerBtnBgColor(item.value || DEFAULT_KONSULTASI_BANNER_BTN_BG_COLOR);
                localStorage.setItem('konsultasi_banner_btn_bg_color', item.value);
              }
            }
            else if (item.key === 'konsultasi_banner_btn_text_color') {
              if (!isPreview) {
                setKonsultasiBannerBtnTextColor(item.value || DEFAULT_KONSULTASI_BANNER_BTN_TEXT_COLOR);
                localStorage.setItem('konsultasi_banner_btn_text_color', item.value);
              }
            }
            else if (item.key === 'konsultasi_banner_btn_text_size') {
              if (!isPreview) {
                const num = parseInt(item.value, 10);
                if (!isNaN(num)) {
                  setKonsultasiBannerBtnTextSize(num);
                  localStorage.setItem('konsultasi_banner_btn_text_size', item.value);
                }
              }
            }
            else if (item.key === 'konsultasi_banner_link_type') {
              if (!isPreview) {
                if (item.value === 'whatsapp' || item.value === 'custom') {
                  setKonsultasiBannerLinkType(item.value);
                  localStorage.setItem('konsultasi_banner_link_type', item.value);
                }
              }
            }
            else if (item.key === 'konsultasi_banner_wa_number') {
              if (!isPreview) {
                setKonsultasiBannerWaNumber(item.value || DEFAULT_KONSULTASI_BANNER_WA_NUMBER);
                localStorage.setItem('konsultasi_banner_wa_number', item.value);
              }
            }
            else if (item.key === 'konsultasi_banner_wa_message') {
              if (!isPreview) {
                setKonsultasiBannerWaMessage(item.value || DEFAULT_KONSULTASI_BANNER_WA_MESSAGE);
                localStorage.setItem('konsultasi_banner_wa_message', item.value);
              }
            }
            else if (item.key === 'konsultasi_banner_custom_url') {
              if (!isPreview) {
                setKonsultasiBannerCustomUrl(item.value || DEFAULT_KONSULTASI_BANNER_CUSTOM_URL);
                localStorage.setItem('konsultasi_banner_custom_url', item.value);
              }
            }
            else if (item.key === 'konsultasi_banner_open_new_tab') {
              if (!isPreview) {
                setKonsultasiBannerOpenNewTab(item.value === 'true');
                localStorage.setItem('konsultasi_banner_open_new_tab', item.value);
              }
            }
            else if (item.key === 'melayani_klien_title') {
              if (!isPreview) {
                setMelayaniKlienTitle(item.value || DEFAULT_MELAYANI_KLIEN_TITLE);
                localStorage.setItem('melayani_klien_title', item.value);
              }
            }
            else if (item.key === 'melayani_klien_title_size') {
              if (!isPreview) {
                const num = parseInt(item.value, 10);
                if (!isNaN(num)) {
                  setMelayaniKlienTitleSize(num);
                  localStorage.setItem('melayani_klien_title_size', item.value);
                }
              }
            }
            else if (item.key === 'melayani_klien_title_color') {
              if (!isPreview) {
                setMelayaniKlienTitleColor(item.value || DEFAULT_MELAYANI_KLIEN_TITLE_COLOR);
                localStorage.setItem('melayani_klien_title_color', item.value);
              }
            }
            else if (item.key === 'melayani_klien_title_font' && item.value) {
              if (!isPreview) {
                setMelayaniKlienTitleFont(item.value);
                localStorage.setItem('melayani_klien_title_font', item.value);
              }
            }
            else if (item.key === 'melayani_klien_title_font_weight' && item.value) {
              if (!isPreview) {
                setMelayaniKlienTitleFontWeight(item.value);
                localStorage.setItem('melayani_klien_title_font_weight', item.value);
              }
            }
            else if (item.key === 'melayani_klien_subtitle') {
              if (!isPreview) {
                setMelayaniKlienSubtitle(item.value || DEFAULT_MELAYANI_KLIEN_SUBTITLE);
                localStorage.setItem('melayani_klien_subtitle', item.value);
              }
            }
            else if (item.key === 'melayani_klien_subtitle_size') {
              if (!isPreview) {
                const num = parseInt(item.value, 10);
                if (!isNaN(num)) {
                  setMelayaniKlienSubtitleSize(num);
                  localStorage.setItem('melayani_klien_subtitle_size', item.value);
                }
              }
            }
            else if (item.key === 'melayani_klien_subtitle_color') {
              if (!isPreview) {
                setMelayaniKlienSubtitleColor(item.value || DEFAULT_MELAYANI_KLIEN_SUBTITLE_COLOR);
                localStorage.setItem('melayani_klien_subtitle_color', item.value);
              }
            }
            else if (item.key === 'melayani_klien_subtitle_align' && (item.value === 'center' || item.value === 'left' || item.value === 'justify')) {
              if (!isPreview) {
                setMelayaniKlienSubtitleAlign(item.value as any);
                localStorage.setItem('melayani_klien_subtitle_align', item.value);
              }
            }
            else if (item.key === 'melayani_klien_pill_bg') {
              if (!isPreview) {
                setMelayaniKlienPillBg(item.value || DEFAULT_MELAYANI_KLIEN_PILL_BG);
                localStorage.setItem('melayani_klien_pill_bg', item.value);
              }
            }
            else if (item.key === 'melayani_klien_pill_text_color') {
              if (!isPreview) {
                setMelayaniKlienPillTextColor(item.value || DEFAULT_MELAYANI_KLIEN_PILL_TEXT_COLOR);
                localStorage.setItem('melayani_klien_pill_text_color', item.value);
              }
            }
            else if (item.key === 'melayani_klien_pill_size') {
              if (!isPreview) {
                const num = parseInt(item.value, 10);
                if (!isNaN(num)) {
                  setMelayaniKlienPillSize(num);
                  localStorage.setItem('melayani_klien_pill_size', item.value);
                }
              }
            }
            else if (item.key === 'melayani_klien_pill_font_weight' && item.value) {
              if (!isPreview) {
                setMelayaniKlienPillFontWeight(item.value);
                localStorage.setItem('melayani_klien_pill_font_weight', item.value);
              }
            }
            else if (item.key === 'melayani_klien_cities' && item.value) {
              try {
                const parsed = JSON.parse(item.value);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  if (!isPreview) setMelayaniKlienCities(parsed);
                  localStorage.setItem('melayani_klien_cities', item.value);
                }
              } catch (e) { }
            }
            else if (item.key === 'ulasan_klien_title') {
              if (!isPreview) {
                setUlasanKlienTitle(item.value || DEFAULT_ULASAN_KLIEN_TITLE);
                localStorage.setItem('ulasan_klien_title', item.value);
              }
            }
            else if (item.key === 'ulasan_klien_title_size') {
              if (!isPreview) {
                const num = parseInt(item.value, 10);
                if (!isNaN(num)) {
                  setUlasanKlienTitleSize(num);
                  localStorage.setItem('ulasan_klien_title_size', item.value);
                }
              }
            }
            else if (item.key === 'ulasan_klien_title_color') {
              if (!isPreview) {
                setUlasanKlienTitleColor(item.value || DEFAULT_ULASAN_KLIEN_TITLE_COLOR);
                localStorage.setItem('ulasan_klien_title_color', item.value);
              }
            }
            else if (item.key === 'ulasan_klien_title_font' && item.value) {
              if (!isPreview) {
                setUlasanKlienTitleFont(item.value);
                localStorage.setItem('ulasan_klien_title_font', item.value);
              }
            }
            else if (item.key === 'ulasan_klien_title_font_weight' && item.value) {
              if (!isPreview) {
                setUlasanKlienTitleFontWeight(item.value);
                localStorage.setItem('ulasan_klien_title_font_weight', item.value);
              }
            }
            else if (item.key === 'ulasan_klien_subtitle') {
              if (!isPreview) {
                setUlasanKlienSubtitle(item.value || DEFAULT_ULASAN_KLIEN_SUBTITLE);
                localStorage.setItem('ulasan_klien_subtitle', item.value);
              }
            }
            else if (item.key === 'ulasan_klien_subtitle_size') {
              if (!isPreview) {
                const num = parseInt(item.value, 10);
                if (!isNaN(num)) {
                  setUlasanKlienSubtitleSize(num);
                  localStorage.setItem('ulasan_klien_subtitle_size', item.value);
                }
              }
            }
            else if (item.key === 'ulasan_klien_subtitle_color') {
              if (!isPreview) {
                setUlasanKlienSubtitleColor(item.value || DEFAULT_ULASAN_KLIEN_SUBTITLE_COLOR);
                localStorage.setItem('ulasan_klien_subtitle_color', item.value);
              }
            }
            else if (item.key === 'ulasan_klien_items' && item.value) {
              try {
                const parsed = JSON.parse(item.value);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  if (!isPreview) setUlasanKlienItems(parsed);
                  localStorage.setItem('ulasan_klien_items', item.value);
                }
              } catch (e) { }
            }
            else if (item.key === 'faq_title') {
              if (!isPreview) {
                setFaqTitle(item.value || DEFAULT_FAQ_TITLE);
                localStorage.setItem('faq_title', item.value);
              }
            }
            else if (item.key === 'faq_title_size') {
              if (!isPreview) {
                const num = parseInt(item.value, 10);
                if (!isNaN(num)) {
                  setFaqTitleSize(num);
                  localStorage.setItem('faq_title_size', item.value);
                }
              }
            }
            else if (item.key === 'faq_title_color') {
              if (!isPreview) {
                setFaqTitleColor(item.value || DEFAULT_FAQ_TITLE_COLOR);
                localStorage.setItem('faq_title_color', item.value);
              }
            }
            else if (item.key === 'faq_title_font' && item.value) {
              if (!isPreview) {
                setFaqTitleFont(item.value);
                localStorage.setItem('faq_title_font', item.value);
              }
            }
            else if (item.key === 'faq_title_font_weight' && item.value) {
              if (!isPreview) {
                setFaqTitleFontWeight(item.value);
                localStorage.setItem('faq_title_font_weight', item.value);
              }
            }
            else if (item.key === 'faq_subtitle') {
              if (!isPreview) {
                setFaqSubtitle(item.value || DEFAULT_FAQ_SUBTITLE);
                localStorage.setItem('faq_subtitle', item.value);
              }
            }
            else if (item.key === 'faq_subtitle_size') {
              if (!isPreview) {
                const num = parseInt(item.value, 10);
                if (!isNaN(num)) {
                  setFaqSubtitleSize(num);
                  localStorage.setItem('faq_subtitle_size', item.value);
                }
              }
            }
            else if (item.key === 'faq_subtitle_color') {
              if (!isPreview) {
                setFaqSubtitleColor(item.value || DEFAULT_FAQ_SUBTITLE_COLOR);
                localStorage.setItem('faq_subtitle_color', item.value);
              }
            }
            else if (item.key === 'faq_question_color') {
              if (!isPreview) {
                setFaqQuestionColor(item.value || DEFAULT_FAQ_QUESTION_COLOR);
                localStorage.setItem('faq_question_color', item.value);
              }
            }
            else if (item.key === 'faq_question_active_color') {
              if (!isPreview) {
                setFaqQuestionActiveColor(item.value || DEFAULT_FAQ_QUESTION_ACTIVE_COLOR);
                localStorage.setItem('faq_question_active_color', item.value);
              }
            }
            else if (item.key === 'faq_answer_color') {
              if (!isPreview) {
                setFaqAnswerColor(item.value || DEFAULT_FAQ_ANSWER_COLOR);
                localStorage.setItem('faq_answer_color', item.value);
              }
            }
            else if (item.key === 'faq_items' && item.value) {
              try {
                const parsed = JSON.parse(item.value);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  if (!isPreview) setFaqItems(parsed);
                  localStorage.setItem('faq_items', item.value);
                }
              } catch (e) { }
            }
            else if (item.key === 'video_profil_title') {
              if (!isPreview) {
                setVideoProfilTitle(item.value || DEFAULT_VIDEO_PROFIL_TITLE);
                localStorage.setItem('video_profil_title', item.value);
              }
            }
            else if (item.key === 'video_profil_title_size') {
              if (!isPreview) {
                const num = parseInt(item.value, 10);
                if (!isNaN(num)) {
                  setVideoProfilTitleSize(num);
                  localStorage.setItem('video_profil_title_size', item.value);
                }
              }
            }
            else if (item.key === 'video_profil_title_color') {
              if (!isPreview) {
                setVideoProfilTitleColor(item.value || DEFAULT_VIDEO_PROFIL_TITLE_COLOR);
                localStorage.setItem('video_profil_title_color', item.value);
              }
            }
            else if (item.key === 'video_profil_title_font' && item.value) {
              if (!isPreview) {
                setVideoProfilTitleFont(item.value);
                localStorage.setItem('video_profil_title_font', item.value);
              }
            }
            else if (item.key === 'video_profil_title_font_weight' && item.value) {
              if (!isPreview) {
                setVideoProfilTitleFontWeight(item.value);
                localStorage.setItem('video_profil_title_font_weight', item.value);
              }
            }
            else if (item.key === 'video_profil_desc') {
              if (!isPreview) {
                setVideoProfilDesc(item.value || DEFAULT_VIDEO_PROFIL_DESC);
                localStorage.setItem('video_profil_desc', item.value);
              }
            }
            else if (item.key === 'video_profil_desc_size') {
              if (!isPreview) {
                const num = parseInt(item.value, 10);
                if (!isNaN(num)) {
                  setVideoProfilDescSize(num);
                  localStorage.setItem('video_profil_desc_size', item.value);
                }
              }
            }
            else if (item.key === 'video_profil_desc_color') {
              if (!isPreview) {
                setVideoProfilDescColor(item.value || DEFAULT_VIDEO_PROFIL_DESC_COLOR);
                localStorage.setItem('video_profil_desc_color', item.value);
              }
            }
            else if (item.key === 'video_profil_thumbnail') {
              if (!isPreview) {
                setVideoProfilThumbnail(item.value || DEFAULT_VIDEO_PROFIL_THUMBNAIL);
                localStorage.setItem('video_profil_thumbnail', item.value);
              }
            }
            else if (item.key === 'video_profil_url') {
              if (!isPreview) {
                setVideoProfilUrl(item.value || DEFAULT_VIDEO_PROFIL_URL);
                localStorage.setItem('video_profil_url', item.value);
              }
            }
            else if (item.key === 'video_profil_position') {
              if (!isPreview && (item.value === 'left' || item.value === 'right')) {
                setVideoProfilPosition(item.value);
                localStorage.setItem('video_profil_position', item.value);
              }
            }
            else if (item.key === 'video_profil_frame_size') {
              if (!isPreview) {
                const num = parseInt(item.value, 10);
                if (!isNaN(num)) {
                  setVideoProfilFrameSize(num);
                  localStorage.setItem('video_profil_frame_size', item.value);
                }
              }
            }
            else if (item.key === 'sosial_media_title') {
              if (!isPreview) {
                setSosialMediaTitle(item.value || DEFAULT_SOSIAL_MEDIA_TITLE);
                localStorage.setItem('sosial_media_title', item.value);
              }
            }
            else if (item.key === 'sosial_media_title_size') {
              if (!isPreview) {
                const num = parseInt(item.value, 10);
                if (!isNaN(num)) {
                  setSosialMediaTitleSize(num);
                  localStorage.setItem('sosial_media_title_size', item.value);
                }
              }
            }
            else if (item.key === 'sosial_media_title_color') {
              if (!isPreview) {
                setSosialMediaTitleColor(item.value || DEFAULT_SOSIAL_MEDIA_TITLE_COLOR);
                localStorage.setItem('sosial_media_title_color', item.value);
              }
            }
            else if (item.key === 'sosial_media_title_font' && item.value) {
              if (!isPreview) {
                setSosialMediaTitleFont(item.value);
                localStorage.setItem('sosial_media_title_font', item.value);
              }
            }
            else if (item.key === 'sosial_media_title_font_weight' && item.value) {
              if (!isPreview) {
                setSosialMediaTitleFontWeight(item.value);
                localStorage.setItem('sosial_media_title_font_weight', item.value);
              }
            }
            else if (item.key === 'sosial_media_label' && item.value !== undefined) {
              if (!isPreview) {
                setSosialMediaLabel(item.value);
                localStorage.setItem('sosial_media_label', item.value);
              }
            }
            else if (item.key === 'sosial_media_label_size') {
              if (!isPreview) {
                const num = parseInt(item.value, 10);
                if (!isNaN(num)) {
                  setSosialMediaLabelSize(num);
                  localStorage.setItem('sosial_media_label_size', item.value);
                }
              }
            }
            else if (item.key === 'sosial_media_label_color') {
              if (!isPreview) {
                setSosialMediaLabelColor(item.value || DEFAULT_SOSIAL_MEDIA_LABEL_COLOR);
                localStorage.setItem('sosial_media_label_color', item.value);
              }
            }
            else if (item.key === 'sosial_media_bg_color') {
              if (!isPreview) {
                setSosialMediaBgColor(item.value || DEFAULT_SOSIAL_MEDIA_BG_COLOR);
                localStorage.setItem('sosial_media_bg_color', item.value);
              }
            }
            else if (item.key === 'sosial_media_border_radius') {
              if (!isPreview) {
                const num = parseInt(item.value, 10);
                if (!isNaN(num)) {
                  setSosialMediaBorderRadius(num);
                  localStorage.setItem('sosial_media_border_radius', item.value);
                }
              }
            }
            else if (item.key === 'sosial_media_items' && item.value) {
              if (!isPreview) {
                try {
                  const parsed = JSON.parse(item.value);
                  if (Array.isArray(parsed) && parsed.length > 0) {
                    setSosialMediaItems(parsed);
                    localStorage.setItem('sosial_media_items', item.value);
                  }
                } catch (e) { }
              }
            }
            else if (item.key === 'home_layout' && item.value) {
              try {
                const parsed = JSON.parse(item.value);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  if (!isPreview) {
                    const normalized = normalizeHomeBlocks(parsed);
                    setHomeBlocks(normalized);
                    localStorage.setItem(HOME_LAYOUT_KEY, JSON.stringify(normalized));
                  }
                }
              } catch (e) { }
            }
            else if (item.key === 'our_products_page_config' && item.value) {
              try {
                const parsed = typeof item.value === 'string' ? JSON.parse(item.value) : item.value;
                if (parsed) {
                  setOurProductsSettings(sanitizeOurProductsSettings(parsed));
                }
              } catch {}
            }
            else linksObj[item.key] = item.value;
          });
          setExtLinks(linksObj);
        }

        if (!isPreview) {
          try {
            sessionStorage.setItem("indo_green_nature_home_cache", JSON.stringify({
              banners: [],
              promos: [],
              products: [],
              articles: [],
              heroText: hText,
              heroFont: hFont,
              heroFontWeight: hFontWeight,
              heroFontSize: hFontSize,
              heroTextColor: hTextColor,
              heroSubtext: hSubtext,
              heroSubtextColor: hSubtextColor,
              heroSubtextSize: hSubtextSize,
              heroSubtextFontWeight: hSubtextFontWeight,
              heroDesc: hDesc,
              heroDescColor: hDescColor,
              heroPoints: hPoints,
              heroPointsFontWeight: hPointsFontWeight,
              heroPointsColor: hPointsColor,
              heroImage: hImage,
              heroImagePosition: hImagePosition,
              heroImageAspect: hImageAspect,
              heroImageSize: hImageSize,
              heroImageTransparent: hImageTransparent,
              heroImageFit: hImageFit,
              hero2Text: h2Text,
              hero2Font: h2Font,
              hero2Image: h2Image,
              extLinks: linksObj,
              runningTexts: rtRes.data || [],
              rtConfig: rtConfRes.data || { is_enabled: false, speed: 'normal' },
            }));
          } catch {
            // ignore
          }
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 250 - elapsed);
        setTimeout(() => {
          if (typeof document !== "undefined" && document.fonts) {
            try {
              document.fonts.ready.then(() => {
                requestAnimationFrame(() => setIsLoading(false));
              }).catch(() => {
                requestAnimationFrame(() => setIsLoading(false));
              });
              return;
            } catch {}
          }
          requestAnimationFrame(() => setIsLoading(false));
        }, remaining);
      }
    }
    fetchData();

    return () => {
      clearTimeout(safetyTimer);
      window.removeEventListener(HOME_LAYOUT_EVENT, refreshLayout);
      window.removeEventListener("storage", refreshLayout);
      if (isPreview) {
        window.removeEventListener("message", handleWindowMessage);
        if (bc) bc.close();
      }
      if (pengenalanBc) pengenalanBc.close();
      if (solusiBc) solusiBc.close();
      if (jenisProdukBc) jenisProdukBc.close();
      if (peluangBc) peluangBc.close();
      if (mengapaBc) mengapaBc.close();
      if (legalitasBc) legalitasBc.close();
      if (dipercayaBrandBc) dipercayaBrandBc.close();
      if (prosesMaklonBc) prosesMaklonBc.close();
      if (konsultasiBannerBc) konsultasiBannerBc.close();
      if (melayaniKlienBc) melayaniKlienBc.close();
      if (ulasanKlienBc) ulasanKlienBc.close();
      if (faqBc) faqBc.close();
      if (heroBanner2Bc) heroBanner2Bc.close();
    };
  }, []);

  const renderHomeBlock = (block: HomeBlock) => {
    switch (block.type) {
      case "running_text":
        if (!rtConfig.is_enabled || runningTexts.length === 0) return null;
        return (
          <div key="running_text" className="w-full bg-transparent border-y-2 border-black dark:border-white/30 text-black dark:text-white py-2 lg:py-3 mb-2 mt-2 lg:mt-2 overflow-hidden flex items-center">
            <div
              className="animate-marquee font-medium text-sm lg:text-base flex whitespace-nowrap"
              style={{ animationDuration: rtConfig.speed === 'slow' ? '400s' : rtConfig.speed === 'fast' ? '150s' : '250s' }}
            >
              <div className="flex gap-8 px-4">
                {Array(15).fill(runningTexts).flat().map((rt, idx) => (
                  <span key={idx} className="flex items-center gap-3">
                    <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-current opacity-40 shrink-0"></span>
                    {rt.text}
                  </span>
                ))}
              </div>
              <div className="flex gap-8 px-4" aria-hidden="true">
                {Array(15).fill(runningTexts).flat().map((rt, idx) => (
                  <span key={`dup1-${idx}`} className="flex items-center gap-3">
                    <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-current opacity-40 shrink-0"></span>
                    {rt.text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      case "hero_banner":
        return (
          <React.Fragment key="hero_banner">
            <section
              suppressHydrationWarning
              className={cn(
                "flex flex-col-reverse justify-between items-center w-full min-h-[180px] lg:min-h-[227px] mt-2 lg:mt-[20px] gap-6 lg:gap-8",
                heroImagePosition === 'left' ? "lg:flex-row-reverse" : "lg:flex-row"
              )}
            >
              {/* frame text */}
              <div className="flex-1 min-w-0 w-full pt-2 pb-2">
                {isLoading && !heroText ? (
                  <div className="w-full flex flex-col gap-4 items-center lg:items-start pt-4 lg:pt-0">
                    <div className="h-10 w-3/4 bg-primary/15 animate-pulse rounded" />
                    <div className="h-10 w-1/2 bg-primary/15 animate-pulse rounded" />
                    <div className="h-10 w-1/3 bg-primary/15 animate-pulse rounded" />
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 lg:gap-3.5">
                    <h1
                      suppressHydrationWarning
                      style={{
                        ...getHeroFontSizeStyle(heroFontSize),
                        fontWeight: parseHeroFontWeightNumber(heroFontWeight),
                        color: heroTextColor && heroTextColor !== 'default' ? heroTextColor : undefined,
                      }}
                      className={cn(
                        "w-full leading-[120%] transition-colors whitespace-pre-wrap break-words",
                        (!heroTextColor || heroTextColor === 'default') && "text-black dark:text-white",
                        heroImagePosition === 'left' ? "text-center lg:text-left" : "text-center lg:text-left",
                        getHeroFontClass(heroFont),
                        getHeroFontSizeClass(heroFontSize),
                        getHeroFontWeightClass(heroFontWeight)
                      )}
                    >
                      {heroText}
                    </h1>

                    {/* Sub text / Tagline */}
                    {heroSubtext && (
                      <h2
                        suppressHydrationWarning
                        style={{
                          fontSize: heroSubtextSize
                            ? `clamp(${Math.max(14, Math.round(heroSubtextSize * 0.52))}px, 3.6vw, ${heroSubtextSize}px)`
                            : undefined,
                          color: heroSubtextColor && heroSubtextColor !== 'default' ? heroSubtextColor : undefined,
                          fontWeight: parseHeroFontWeightNumber(heroSubtextFontWeight),
                        }}
                        className={cn(
                          "w-full transition-colors whitespace-pre-wrap break-words leading-snug tracking-tight",
                          getHeroFontWeightClass(heroSubtextFontWeight),
                          (!heroSubtextColor || heroSubtextColor === 'default') && "text-primary/90 dark:text-emerald-300",
                          !heroSubtextSize && "text-sm sm:text-base lg:text-xl",
                          heroImagePosition === 'left' ? "text-center lg:text-left" : "text-center lg:text-left"
                        )}
                      >
                        {renderFormattedText(heroSubtext)}
                      </h2>
                    )}

                    {/* Deskripsi Paragraf */}
                    {heroDesc && (
                      <p
                        suppressHydrationWarning
                        style={{
                          fontSize: heroDescSize
                            ? `clamp(12px, 2.5vw, ${heroDescSize}px)`
                            : undefined,
                          color: heroDescColor && heroDescColor !== 'default' ? heroDescColor : undefined,
                        }}
                        className={cn(
                          "w-full leading-relaxed transition-colors whitespace-pre-wrap break-words opacity-90 text-[12px] sm:text-xs md:text-sm lg:text-[14px]",
                          !heroDescSize && "text-[12px] sm:text-xs md:text-sm lg:text-[14px]",
                          (!heroDescColor || heroDescColor === 'default') && "text-foreground/80 dark:text-white/80",
                          heroImagePosition === 'left' ? "text-center lg:text-left" : "text-center lg:text-left"
                        )}
                      >
                        {renderFormattedText(heroDesc)}
                      </p>
                    )}

                    {/* Poin Keunggulan / Checklist Grid */}
                    {heroPoints && heroPoints.some((p: string) => p && p.trim()) && (
                      <div
                        suppressHydrationWarning
                        className={cn(
                          "grid grid-cols-2 gap-2 sm:gap-2.5 pt-2",
                          heroImagePosition === 'left' ? "text-left" : "text-left"
                        )}
                      >
                        {heroPoints.filter((p: string) => p && p.trim()).map((point: string, idx: number) => (
                          <div
                            key={idx}
                            suppressHydrationWarning
                            style={{
                              fontWeight: parseHeroFontWeightNumber(heroPointsFontWeight),
                              color: heroPointsColor && heroPointsColor !== 'default' ? heroPointsColor : undefined,
                            }}
                            className={cn(
                              "flex items-center gap-1.5 sm:gap-2.5 text-[11px] sm:text-xs md:text-sm",
                              idx % 2 === 1 && "justify-self-end ml-auto sm:justify-self-start sm:ml-0 text-right sm:text-left",
                              (!heroPointsColor || heroPointsColor === 'default') && "text-foreground dark:text-white",
                              getHeroFontWeightClass(heroPointsFontWeight)
                            )}
                          >
                            <span
                              style={{ backgroundColor: 'var(--primary)' }}
                              className="hidden sm:inline-flex w-5 h-5 sm:w-[22px] sm:h-[22px] rounded-full bg-primary text-white items-center justify-center shrink-0 aspect-square leading-none shadow-xs"
                            >
                              <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3] shrink-0" />
                            </span>
                            <span className="leading-tight">{renderFormattedText(point)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* logo banner */}
              <div
                suppressHydrationWarning
                style={getHeroImageContainerStyle(heroImageSize)}
                className={cn(
                  heroImageTransparent
                    ? "bg-transparent border-0 shadow-none p-0"
                    : "bg-primary/10 border border-primary/20 shadow-sm p-6",
                  "relative shrink-0 mx-auto lg:mx-0 overflow-hidden rounded-none flex items-center justify-center text-center transition-colors duration-200",
                  getHeroImageAspectClass(heroImageAspect)
                )}
              >
                {heroImage && (heroImage.startsWith('http') || heroImage.startsWith('data:') || heroImage.startsWith('blob:') || (heroImage.startsWith('/') && !heroImage.startsWith('/LOGO AI NEW') && !heroImage.startsWith('/logo'))) ? (
                  <Image
                    suppressHydrationWarning
                    src={heroImage}
                    alt="Banner CV. Indo Green Nature"
                    fill
                    priority
                    loading="eager"
                    fetchPriority="high"
                    unoptimized
                    sizes="(max-width: 640px) 100vw, 453px"
                    className={heroImageFit === 'contain' ? "object-contain" : "object-cover"}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-xl md:text-2xl font-black text-black dark:text-white tracking-wider">
                      CV. INDO GREEN NATURE
                    </span>
                    <span className="text-xs font-semibold text-black/70 dark:text-white/70 uppercase tracking-widest mt-1">
                      Maklon &amp; Penjualan Herbal
                    </span>
                  </div>
                )}
              </div>
            </section>
          </React.Fragment>
        );

      case "mengenal_ign":
        return (
          <React.Fragment key="mengenal_ign">
            <section
              suppressHydrationWarning
              className={cn(
                "w-full bg-white dark:bg-card/40 transition-colors pt-4 lg:pt-[16px] pb-6 lg:pb-[45px] lg:min-h-[486px] flex flex-col justify-start relative"
              )}
            >
              {/* layer- : Judul (top: 16px, 48px bold #15803D) */}
              <h2
                suppressHydrationWarning
                style={{
                  fontSize: pengenalanTitleSize
                    ? `clamp(${Math.max(18, Math.round(pengenalanTitleSize * 0.44))}px, 4.5vw, ${pengenalanTitleSize}px)`
                    : undefined,
                  color: pengenalanTitleColor || undefined,
                  fontWeight: parseHeroFontWeightNumber(pengenalanTitleFontWeight),
                }}
                className={cn(
                  "w-full text-left mb-4 sm:mb-[30px] leading-tight sm:leading-snug lg:leading-[58px] tracking-tight break-words font-semibold",
                  poppins.className,
                  getHeroFontClass(pengenalanTitleFont),
                  getHeroFontWeightClass(pengenalanTitleFontWeight),
                  !pengenalanTitleSize && "text-xl sm:text-3xl lg:text-[48px]",
                  !pengenalanTitleColor && "text-[#15803D]"
                )}
              >
                {pengenalanTitle || DEFAULT_PENGENALAN_TITLE}
              </h2>

              {/* Baris Konten: layer--2 (teks di tengah vertikal) + rectangle (preview/frame 16:9) */}
              <div className={cn(
                "flex flex-col items-center justify-between gap-6 lg:gap-[16px] w-full",
                pengenalanImagePosition === 'left' ? "lg:flex-row-reverse" : "lg:flex-row"
              )}>
                {/* layer--2: width fleksibel di desktop mengisi ruang yang tersedia (default ~808px) */}
                <div className="w-full lg:flex-1 lg:min-h-[324px] flex flex-col justify-center">
                  <p
                    suppressHydrationWarning
                    style={{
                      fontSize: (pengenalanDescSize || DEFAULT_PENGENALAN_DESC_SIZE)
                        ? `clamp(12px, 2.5vw, ${pengenalanDescSize || DEFAULT_PENGENALAN_DESC_SIZE}px)`
                        : undefined,
                      color: pengenalanDescColor || undefined,
                    }}
                    className={cn(
                      "w-full font-normal leading-relaxed lg:leading-[1.6] text-justify lg:text-left whitespace-pre-line break-words text-[12px] sm:text-base lg:text-[20px]",
                      !pengenalanDescSize && "text-[12px] sm:text-base lg:text-[20px]",
                      (!pengenalanDescColor || pengenalanDescColor === '#000000') && "text-black dark:text-white/90"
                    )}
                  >
                    {renderFormattedText(pengenalanDesc || DEFAULT_PENGENALAN_DESC)}
                  </p>
                </div>

                {/* rectangle: dynamic width min(100%, pengenalanImageSize px), height proportional via aspect-[16/9] */}
                <div
                  style={{
                    width: `min(100%, ${pengenalanImageSize}px)`,
                    maxWidth: '100%',
                  }}
                  className="aspect-[16/9] bg-[#D9D9D9] dark:bg-muted/80 shrink-0 flex flex-col items-center justify-center relative overflow-hidden"
                  title={`Frame 16:9 (${pengenalanImageSize} × ${Math.round(pengenalanImageSize / (16 / 9))} px)`}
                >
                  {pengenalanImage ? (
                    <img
                      src={pengenalanImage}
                      alt={pengenalanTitle || "Mengenal Indo Green Nature"}
                      width={pengenalanImageSize || 800}
                      height={Math.round((pengenalanImageSize || 800) / (16 / 9))}
                      loading="lazy"
                      decoding="async"
                      style={{
                        transform: pengenalanImageScale !== 100 ? `scale(${pengenalanImageScale / 100})` : undefined,
                        transformOrigin: 'center center'
                      }}
                      className={cn(
                        "w-full h-full transition-transform duration-150",
                        pengenalanImageFit === 'contain' ? "object-contain" : "object-cover"
                      )}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-600 dark:text-gray-300 text-xs font-mono p-4 text-center">
                      <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                      <span className="font-semibold text-sm">Frame 16:9</span>
                      <span className="text-[11px] opacity-75 mt-0.5">{pengenalanImageSize} × {Math.round(pengenalanImageSize / (16 / 9))} px</span>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </React.Fragment>
        );

      case "solusi_bisnis":
        return (
          <React.Fragment key={block.id || "solusi_bisnis"}>
            <section
              suppressHydrationWarning
              className={cn(
                "w-full bg-white dark:bg-card/40 transition-colors my-[20px] py-2 flex flex-col justify-start relative",
                poppins.className
              )}
            >
              {/* layer- : Judul (Solusi Maklon Sesuai Tujuan Bisnis Anda) */}
              <h2
                suppressHydrationWarning
                style={{
                  fontSize: solusiBisnisTitleSize
                    ? `clamp(${Math.max(18, Math.round(solusiBisnisTitleSize * 0.48))}px, 4.5vw, ${solusiBisnisTitleSize}px)`
                    : undefined,
                  color: solusiBisnisTitleColor || undefined,
                  fontWeight: parseHeroFontWeightNumber(solusiBisnisTitleFontWeight),
                }}
                className={cn(
                  "w-full text-center leading-tight tracking-tight mb-4 sm:mb-6 lg:mb-[32px] break-words",
                  getHeroFontClass(solusiBisnisTitleFont),
                  getHeroFontWeightClass(solusiBisnisTitleFontWeight),
                  !solusiBisnisTitleSize && "text-xl sm:text-3xl lg:text-[40px]",
                  !solusiBisnisTitleColor && "text-[#15803D]"
                )}
              >
                {solusiBisnisTitle || DEFAULT_SOLUSI_BISNIS_TITLE}
              </h2>

              {/* 4 Kartu: Grid 2x2 pada Desktop (1440px), responsive pada Mobile/Tablet */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-[21px] gap-x-[36px] w-full">
                {(solusiBisnisCards && solusiBisnisCards.length > 0 ? solusiBisnisCards : DEFAULT_SOLUSI_BISNIS_CARDS).map((card, idx) => (
                  <div
                    key={card.id || idx}
                    className="flex flex-col sm:flex-row items-center sm:items-start gap-[20px] sm:gap-[34px] w-full group text-center sm:text-left"
                  >
                    {/* rectangle-5 / 6 / 7 / 8: Square 216x216px Photo/Image */}
                    <div className="w-[216px] h-[216px] shrink-0 aspect-square overflow-hidden bg-[#D9D9D9] dark:bg-muted/80 relative shadow-xs mx-auto sm:mx-0">
                      {card.image ? (
                        <img
                          src={card.image}
                          alt={card.title || "Solusi Maklon"}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-4 text-center">
                          <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                          <span className="text-[11px] font-mono">216 × 216</span>
                        </div>
                      )}
                    </div>

                    {/* Content Box: Judul pas di sudut atas gambar, Paragraf berada di tengah vertikal & rata kiri */}
                    <div className="flex-1 sm:h-[216px] flex flex-col justify-between min-w-0 w-full pt-0 items-center sm:items-start">
                      {/* Title: Pas di titik sudut atas gambar (mt-0 pt-0, text-left) */}
                      <h3
                        suppressHydrationWarning
                        className={cn(
                          "leading-tight tracking-tight text-center sm:text-left break-words mt-0 pt-0",
                          getHeroFontClass(solusiBisnisCardTitleFont),
                          getHeroFontWeightClass(card.titleFontWeight || solusiBisnisCardTitleFontWeight),
                          !solusiBisnisCardTitleSize && "text-base sm:text-lg lg:text-[18px]"
                        )}
                        style={{
                          color: card.titleColor || solusiBisnisCardTitleColor || DEFAULT_SOLUSI_BISNIS_CARD_TITLE_COLOR,
                          fontSize: (() => {
                            const base = card.titleSize || solusiBisnisCardTitleSize || DEFAULT_SOLUSI_BISNIS_CARD_TITLE_SIZE;
                            const scaled = Math.max(15, Math.round(base * 0.9));
                            return `clamp(${Math.max(14, Math.round(scaled * 0.85))}px, 3.6vw, ${scaled}px)`;
                          })(),
                          fontWeight: parseHeroFontWeightNumber(card.titleFontWeight || solusiBisnisCardTitleFontWeight),
                        }}
                      >
                        {card.title}
                      </h3>

                      {/* Description Container: Berada di tengah vertikal, teks tetap di kiri */}
                      <div className="flex-1 flex flex-col justify-center min-w-0 py-1 w-full">
                        <p
                          suppressHydrationWarning
                          className="text-[12px] sm:text-[16px] font-normal text-black dark:text-white/90 leading-relaxed whitespace-pre-line text-center sm:text-left break-words"
                          style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 400, fontSize: "clamp(12px, 2.5vw, 16px)" }}
                        >
                          {renderFormattedText(card.desc)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </React.Fragment>
        );

      case "jenis_produk": {
        const activeJenisCards = jenisProdukCards && jenisProdukCards.length > 0 ? jenisProdukCards : DEFAULT_JENIS_PRODUK_CARDS;

        const renderJenisCard = (card: JenisProdukCard, idx: number, isMobile = false) => {
          const cardBg = card.bgColor && card.bgColor !== "#E58C05" ? card.bgColor : "#11991B";
          const cardTextColor = card.textColor || "#FFFFFF";
          const cardTitle = card.title || "Minuman Herbal";
          const cardDesc = card.description || DEFAULT_JENIS_PRODUK_CARD_DESC;

          return (
            <div
              key={card.id || `jp-card-${idx}`}
              style={{
                backgroundColor: cardBg,
              }}
              className={cn(
                "w-full aspect-square relative overflow-hidden group shadow-sm flex flex-col items-center justify-start text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-[5px]",
                isMobile && "max-w-[320px] mx-auto"
              )}
            >
              {/* Foto Latar Belakang: tersembunyi (opacity-0) pada kondisi normal, MUNCUL (opacity-100) saat di-hover */}
              {card.image && (
                <img
                  src={card.image}
                  alt={cardTitle}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 scale-100 group-hover:scale-105 transition-all duration-500 ease-out z-0"
                />
              )}

              {/* Konten Frame: Judul & Deskripsi (tampil di atas warna kartu, disembunyikan saat kursor di-hover jika ada foto) */}
              <div
                className={cn(
                  "relative z-10 w-full h-full flex flex-col items-center justify-start pt-6 sm:pt-[28px] lg:pt-[35px] px-[20px]",
                  card.image && "transition-all duration-500 group-hover:opacity-0 group-hover:scale-95 group-hover:translate-y-2 pointer-events-none"
                )}
              >
                {/* layer--2: Judul Frame */}
                <h3
                  style={{ color: cardTextColor }}
                  className="font-bold text-[18px] sm:text-[20px] leading-snug line-clamp-2 drop-shadow-xs"
                >
                  {cardTitle}
                </h3>

                {/* layer-: Deskripsi Frame */}
                <p
                  style={{ color: cardTextColor }}
                  className="mt-8 sm:mt-12 lg:mt-16 max-w-[295px] text-[13px] sm:text-[14px] font-medium leading-relaxed text-center line-clamp-6 drop-shadow-xs"
                >
                  {cardDesc}
                </p>
              </div>
            </div>
          );
        };

        return (
          <React.Fragment key={block.id || "jenis_produk"}>
            <section
              suppressHydrationWarning
              className={cn(
                "w-full bg-white dark:bg-card/40 transition-colors my-[20px] py-4 flex flex-col justify-start relative",
                poppins.className
              )}
            >
              {/* layer- : Judul (Jenis Produk yang dapat di Maklon) */}
              <div className="w-full text-center flex flex-col items-center">
                <h2
                  suppressHydrationWarning
                  style={{
                    fontSize: jenisProdukTitleSize
                      ? `clamp(${Math.max(18, Math.round(jenisProdukTitleSize * 0.48))}px, 4.5vw, ${jenisProdukTitleSize}px)`
                      : undefined,
                    color: jenisProdukTitleColor || undefined,
                    fontWeight: parseHeroFontWeightNumber(jenisProdukTitleFontWeight),
                  }}
                  className={cn(
                    "w-full text-center leading-tight tracking-tight break-words",
                    getHeroFontClass(jenisProdukTitleFont),
                    getHeroFontWeightClass(jenisProdukTitleFontWeight),
                    !jenisProdukTitleSize && "text-xl sm:text-3xl lg:text-[40px]",
                    !jenisProdukTitleColor && "text-[#15803D]"
                  )}
                >
                  {jenisProdukTitle || DEFAULT_JENIS_PRODUK_TITLE}
                </h2>

                {/* layer--2 : Deskripsi terpusat max-w-[925px] */}
                <p
                  suppressHydrationWarning
                  style={{
                    fontSize: (jenisProdukDescSize || DEFAULT_JENIS_PRODUK_DESC_SIZE)
                      ? `clamp(12px, 2.5vw, ${jenisProdukDescSize || DEFAULT_JENIS_PRODUK_DESC_SIZE}px)`
                      : undefined,
                    color: jenisProdukDescColor || undefined,
                  }}
                  className={cn(
                    "mt-2 sm:mt-4 mx-auto max-w-[925px] text-center font-normal leading-relaxed break-words px-2 sm:px-0 text-[12px] sm:text-base",
                    !jenisProdukDescSize && "text-[12px] sm:text-base",
                    !jenisProdukDescColor && "text-black dark:text-white/80"
                  )}
                >
                  {renderFormattedText(jenisProdukDesc || DEFAULT_JENIS_PRODUK_DESC)}
                </p>
              </div>

              {/* Tampilan Desktop & Tablet: Grid 2-4 Kolom • Rasio 1:1 */}
              <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full mt-4 sm:mt-8">
                {activeJenisCards.map((card, idx) => renderJenisCard(card, idx, false))}
              </div>

              {/* Tampilan Mobile: Carousel Horizontal agar tidak terlalu panjang */}
              <div className="block sm:hidden w-full mt-5 relative px-2">
                <Carousel
                  opts={{ align: "center", loop: true }}
                  plugins={[jenisProdukPlugin.current]}
                  className="w-full"
                  onMouseEnter={() => jenisProdukPlugin.current.stop()}
                  onMouseLeave={() => jenisProdukPlugin.current.reset()}
                >
                  <CarouselContent className="-ml-3 py-2">
                    {activeJenisCards.map((card, idx) => (
                      <CarouselItem key={card.id || `jp-mob-${idx}`} className="pl-3 basis-[85%] xs:basis-[80%] flex justify-center">
                        {renderJenisCard(card, idx, true)}
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {activeJenisCards.length > 1 && (
                    <div className="mt-4 flex justify-center">
                      <CarouselDots realCount={activeJenisCards.length} />
                    </div>
                  )}
                </Carousel>
              </div>
            </section>
          </React.Fragment>
        );
      }

      case "banners":
        if (!banners || banners.length === 0) {
          return null;
        }
        return (
          <React.Fragment key="banners">
            <section className="w-full mt-10">
              <div className="relative w-full rounded-sm group overflow-hidden">
                <Carousel
                  opts={{ align: "start", loop: true }}
                  plugins={[bannerPlugin.current]}
                  className="w-full"
                >
                  <CarouselContent>
                    {banners.map((item, idx) => (
                      <CarouselItem key={item.id || idx} className="md:basis-1/2 lg:basis-1/3">
                        <div className="w-full aspect-[2/1] lg:h-[226.5px] bg-primary/15 relative flex items-center justify-center text-gray-500 text-sm overflow-hidden rounded-sm">
                          {item.src ? (
                            <img src={item.src} alt={item.title} className="w-full h-full object-cover absolute inset-0" />
                          ) : (
                            item.title
                          )}
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  {/* Boba / Slider Dots via CarouselDots */}
                  {banners.length > 1 && (
                    <div className="mt-6">
                      <CarouselDots realCount={banners.length} />
                    </div>
                  )}
                </Carousel>
              </div>
            </section>
          </React.Fragment>
        );

      case "peluang":
        return (
          <React.Fragment key={block.id || "peluang"}>
            <section
              suppressHydrationWarning
              className={cn(
                "w-full bg-white dark:bg-card/40 transition-colors my-[20px] py-6 sm:py-8 flex flex-col justify-start relative",
                poppins.className
              )}
            >
              {/* Container 2 Kolom Sejajar Sudut (Desktop: 2 Kolom, Baris 1: Judul, Baris 2: Deskripsi & Frame Gambar Animasi dengan gap 20px) */}
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-x-[20px] gap-y-[20px] items-start">
                {/* 1. Judul: Kolom 1 Baris 1 */}
                <div className="lg:col-start-1 lg:row-start-1 w-full">
                  <h2
                    suppressHydrationWarning
                    style={{
                      fontSize: peluangTitleSize
                        ? `clamp(${Math.max(18, Math.round(peluangTitleSize * 0.48))}px, 4.5vw, ${peluangTitleSize}px)`
                        : undefined,
                      color: peluangTitleColor || undefined,
                      fontWeight: parseHeroFontWeightNumber(peluangTitleFontWeight),
                    }}
                    className={cn(
                      "w-full text-center lg:text-left leading-tight tracking-tight break-words mb-3 sm:mb-4 lg:mb-0",
                      getHeroFontClass(peluangTitleFont),
                      getHeroFontWeightClass(peluangTitleFontWeight),
                      !peluangTitleSize && "text-xl sm:text-3xl lg:text-[36px]",
                      !peluangTitleColor && "text-[#15803D]"
                    )}
                  >
                    {peluangTitle || DEFAULT_PELUANG_TITLE}
                  </h2>
                </div>

                {/* 2. Deskripsi: Kolom 1 Baris 2 (Di tengah vertikal mengikuti frame gambar animasi) */}
                <div
                  className={cn(
                    "lg:col-start-1 lg:row-start-2 flex flex-col h-full w-full",
                    peluangValign === "top" ? "justify-start self-start" : "justify-center self-center my-auto"
                  )}
                >
                  <p
                    suppressHydrationWarning
                    style={{
                      fontSize: (peluangDescSize || DEFAULT_PELUANG_DESC_SIZE)
                        ? `clamp(12px, 2.5vw, ${peluangDescSize || DEFAULT_PELUANG_DESC_SIZE}px)`
                        : undefined,
                      color: peluangDescColor || undefined,
                    }}
                    className={cn(
                      "font-normal leading-relaxed break-words whitespace-pre-line pt-0 text-[12px] sm:text-base",
                      peluangValign === "center" && "my-auto",
                      peluangDescAlign === "center"
                        ? "text-center"
                        : peluangDescAlign === "justify"
                        ? "text-center lg:text-justify"
                        : "text-center lg:text-left",
                      !peluangDescSize && "text-[12px] sm:text-base",
                      !peluangDescColor && "text-black dark:text-white/80"
                    )}
                  >
                    {renderFormattedText(peluangDesc || DEFAULT_PELUANG_DESC)}
                  </p>
                </div>

                {/* 3. Kolom Kanan: Frame Auto-Slide Gambar Animasi Produk (Ditarik Otomatis dari Pengaturan Our Products) */}
                <div suppressHydrationWarning className="lg:col-start-2 lg:row-start-2 w-full flex justify-center lg:justify-end self-center mt-[20px] lg:mt-0">
                  <div suppressHydrationWarning className="w-full max-w-[453px] h-[330px] sm:h-[350px] rounded-[14px] bg-transparent border-0 shadow-none relative overflow-hidden flex justify-center gap-3 sm:gap-[18px] p-0">
                    {/* Mask Fade Halus Atas & Bawah agar Foto Masuk & Keluar Terlihat Lembut */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-background via-background/60 to-transparent z-10" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />

                    {/* ─── Kolom 1 (Kiri): AUTO SLIDE NAIK KE ATAS ─── */}
                    <div suppressHydrationWarning className="w-[150px] sm:w-[197px] overflow-hidden flex flex-col">
                      <motion.div
                        animate={{ y: ["0%", "-50%"] }}
                        transition={{
                          y: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: peluangAnimDuration,
                            ease: "linear",
                          },
                        }}
                        className="flex flex-col gap-3 sm:gap-[18px]"
                      >
                        {duplicatedPeluangLeft.map((imgUrl, i) => (
                          <div
                            key={`pl-left-${i}-${imgUrl}`}
                            suppressHydrationWarning
                            className="w-[150px] sm:w-[197px] h-[150px] sm:h-[197px] shrink-0 rounded-[10px] overflow-hidden shadow-sm border border-border/50 relative group bg-card"
                          >
                            <Image
                              src={imgUrl}
                              alt={`Produk Herbal IGN ${i + 1}`}
                              fill
                              sizes="197px"
                              unoptimized
                              priority={false}
                              loading="lazy"
                              decoding="async"
                              suppressHydrationWarning
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </motion.div>
                    </div>

                    {/* ─── Kolom 2 (Kanan): AUTO SLIDE TURUN KE BAWAH ─── */}
                    <div suppressHydrationWarning className="w-[150px] sm:w-[197px] overflow-hidden flex flex-col">
                      <motion.div
                        animate={{ y: ["-50%", "0%"] }}
                        transition={{
                          y: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: peluangAnimDuration,
                            ease: "linear",
                          },
                        }}
                        className="flex flex-col gap-3 sm:gap-[18px]"
                      >
                        {duplicatedPeluangRight.map((imgUrl, i) => (
                          <div
                            key={`pl-right-${i}-${imgUrl}`}
                            suppressHydrationWarning
                            className="w-[150px] sm:w-[197px] h-[150px] sm:h-[197px] shrink-0 rounded-[10px] overflow-hidden shadow-sm border border-border/50 relative group bg-card"
                          >
                            <Image
                              src={imgUrl}
                              alt={`Produk Herbal IGN ${i + 1}`}
                              fill
                              sizes="197px"
                              unoptimized
                              priority={false}
                              loading="lazy"
                              decoding="async"
                              suppressHydrationWarning
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </React.Fragment>
        );

      case "mengapa_memilih": {
        const activeMengapaCards = mengapaCards && mengapaCards.length > 0 ? mengapaCards : DEFAULT_MENGAPA_CARDS;

        const renderMengapaCard = (card: MengapaMemilihCard, idx: number, isMobile = false) => {
          const cardBg = card.bgColor || mengapaCardBg || DEFAULT_MENGAPA_CARD_BG;
          const titleColor = card.textColor || mengapaCardTitleColor || DEFAULT_MENGAPA_CARD_TITLE_COLOR;
          const descColor = card.textColor || mengapaCardDescColor || DEFAULT_MENGAPA_CARD_DESC_COLOR;

          return (
            <div
              key={card.id || `mm-${idx}`}
              style={{
                backgroundColor: cardBg,
              }}
              className={cn(
                "w-full rounded-[5px] p-6 sm:p-7 min-h-[220px] sm:min-h-[250px] shadow-md flex flex-col items-center justify-center text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg",
                isMobile && "h-full min-h-[210px] max-w-[340px] mx-auto"
              )}
            >
              {/* Judul Kartu (layer--4 dsb) */}
              <h3
                style={{ color: titleColor }}
                className="font-bold text-lg sm:text-[20px] mb-3 leading-snug drop-shadow-xs"
              >
                {card.title}
              </h3>

              {/* Deskripsi Kartu (layer--5 dsb) */}
              <p
                style={{ color: descColor }}
                className="font-normal text-sm sm:text-base leading-relaxed opacity-95"
              >
                {renderFormattedText(card.desc)}
              </p>
            </div>
          );
        };

        return (
          <React.Fragment key={block.id || "mengapa_memilih"}>
            <section
              suppressHydrationWarning
              className={cn(
                "w-full bg-white dark:bg-card/40 transition-colors my-[20px] py-8 sm:py-10 flex flex-col items-center justify-start relative",
                poppins.className
              )}
            >
              {/* Header: Judul & Subtitle */}
              <div className="w-full max-w-[1200px] flex flex-col items-center text-center mb-6 sm:mb-10 px-4">
                {/* layer--2: Judul Section */}
                <h2
                  suppressHydrationWarning
                  style={{
                    fontSize: mengapaTitleSize
                      ? `clamp(${Math.max(18, Math.round(mengapaTitleSize * 0.48))}px, 4.5vw, ${mengapaTitleSize}px)`
                      : undefined,
                    color: mengapaTitleColor || undefined,
                    fontWeight: parseHeroFontWeightNumber(mengapaTitleFontWeight),
                  }}
                  className={cn(
                    "w-full text-center leading-tight tracking-tight break-words mb-3 sm:mb-4",
                    getHeroFontClass(mengapaTitleFont),
                    getHeroFontWeightClass(mengapaTitleFontWeight),
                    !mengapaTitleSize && "text-xl sm:text-3xl lg:text-[36px]",
                    !mengapaTitleColor && "text-[#15803D]"
                  )}
                >
                  {mengapaTitle || DEFAULT_MENGAPA_TITLE}
                </h2>

                {/* layer--3: Sub-Judul / Deskripsi */}
                <p
                  suppressHydrationWarning
                  style={{
                    fontSize: (mengapaSubtitleSize || DEFAULT_MENGAPA_SUBTITLE_SIZE)
                      ? `clamp(12px, 2.5vw, ${mengapaSubtitleSize || DEFAULT_MENGAPA_SUBTITLE_SIZE}px)`
                      : undefined,
                    color: mengapaSubtitleColor || undefined,
                  }}
                  className={cn(
                    "font-normal leading-relaxed break-words whitespace-pre-line max-w-[1164px] text-[12px] sm:text-base",
                    mengapaSubtitleAlign === "center" ? "text-center" : mengapaSubtitleAlign === "justify" ? "text-justify" : "text-left",
                    !mengapaSubtitleSize && "text-[12px] sm:text-base",
                    !mengapaSubtitleColor && "text-black dark:text-white/80"
                  )}
                >
                  {renderFormattedText(mengapaSubtitle || DEFAULT_MENGAPA_SUBTITLE)}
                </p>
              </div>

              {/* Tampilan Desktop & Tablet: Grid 2-3 Kolom */}
              <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 w-full">
                {activeMengapaCards.map((card, idx) => renderMengapaCard(card, idx, false))}
              </div>

              {/* Tampilan Mobile: Carousel Horizontal agar tidak terlalu panjang */}
              <div className="block sm:hidden w-full relative px-2">
                <Carousel
                  opts={{ align: "center", loop: true }}
                  plugins={[mengapaPlugin.current]}
                  className="w-full"
                  onMouseEnter={() => mengapaPlugin.current.stop()}
                  onMouseLeave={() => mengapaPlugin.current.reset()}
                >
                  <CarouselContent className="-ml-3 py-2">
                    {activeMengapaCards.map((card, idx) => (
                      <CarouselItem key={card.id || `mm-mob-${idx}`} className="pl-3 basis-[85%] xs:basis-[80%] flex justify-center">
                        {renderMengapaCard(card, idx, true)}
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {activeMengapaCards.length > 1 && (
                    <div className="mt-4 flex justify-center">
                      <CarouselDots realCount={activeMengapaCards.length} />
                    </div>
                  )}
                </Carousel>
              </div>
            </section>
          </React.Fragment>
        );
      }

      case "legalitas": {
        const rawLegalitasItems = legalitasItems && legalitasItems.length > 0 ? legalitasItems : DEFAULT_LEGALITAS_ITEMS;
        // User request: jika tidak upload foto, jangan tampilkan frame dan posisikan frame secara center otomatis
        const activeLegalitasItems = rawLegalitasItems.filter((item) => Boolean(item.image && item.image.trim() !== ""));

        // Jika tidak ada item yang memiliki foto:
        // Pada website live, jangan tampilkan section sama sekali agar tidak menyisakan ruang kosong.
        // Pada mode pratinjau, beri info informatif bahwa sertifikat membutuhkan foto.
        if (activeLegalitasItems.length === 0) {
          if (!isPreviewMode) return null;
          return (
            <React.Fragment key={block.id || "legalitas"}>
              <section
                suppressHydrationWarning
                className={cn(
                  "w-full bg-white dark:bg-card/40 transition-colors my-[20px] py-8 sm:py-10 flex flex-col items-center justify-start relative",
                  poppins.className
                )}
              >
                <div className="w-full max-w-[1200px] flex flex-col items-center text-center px-4">
                  <h2
                    suppressHydrationWarning
                    style={{
                      fontSize: legalitasTitleSize
                        ? `clamp(${Math.max(18, Math.round(legalitasTitleSize * 0.48))}px, 4.5vw, ${legalitasTitleSize}px)`
                        : undefined,
                      color: legalitasTitleColor || undefined,
                      fontWeight: parseHeroFontWeightNumber(legalitasTitleFontWeight),
                    }}
                    className={cn(
                      "w-full text-center leading-tight tracking-tight break-words mb-3 sm:mb-4",
                      getHeroFontClass(legalitasTitleFont),
                      getHeroFontWeightClass(legalitasTitleFontWeight),
                      !legalitasTitleSize && "text-xl sm:text-3xl lg:text-[36px]",
                      !legalitasTitleColor && "text-[#15803D]"
                    )}
                  >
                    {legalitasTitle || DEFAULT_LEGALITAS_TITLE}
                  </h2>
                  <p
                    suppressHydrationWarning
                    style={{
                      fontSize: legalitasSubtitleSize ? `${legalitasSubtitleSize}px` : undefined,
                      color: legalitasSubtitleColor || undefined,
                    }}
                    className={cn(
                      "font-normal leading-relaxed break-words whitespace-pre-line max-w-[1164px]",
                      legalitasSubtitleAlign === "center" ? "text-center" : legalitasSubtitleAlign === "justify" ? "text-justify" : "text-left",
                      !legalitasSubtitleSize && "text-sm sm:text-base",
                      !legalitasSubtitleColor && "text-black dark:text-white/80"
                    )}
                  >
                    {renderFormattedText(legalitasSubtitle || DEFAULT_LEGALITAS_SUBTITLE)}
                  </p>
                  <div className="w-full max-w-[620px] p-5 mt-6 border border-dashed border-amber-400 bg-amber-50/60 dark:bg-amber-950/20 text-center rounded-lg">
                    <p className="text-xs sm:text-sm font-medium text-amber-800 dark:text-amber-300">
                      Belum ada foto/logo sertifikat yang diunggah. Frame hanya akan ditampilkan otomatis di posisi tengah setelah foto sertifikat diunggah di menu Pengaturan.
                    </p>
                  </div>
                </div>
              </section>
            </React.Fragment>
          );
        }

        return (
          <React.Fragment key={block.id || "legalitas"}>
            <section
              suppressHydrationWarning
              className={cn(
                "w-full bg-white dark:bg-card/40 transition-colors my-[20px] py-8 sm:py-10 flex flex-col items-center justify-start relative",
                poppins.className
              )}
            >
              {/* Header: Judul & Subtitle */}
              <div className="w-full max-w-[1200px] flex flex-col items-center text-center mb-8 sm:mb-10 px-4">
                {/* layer--2: Judul Section */}
                <h2
                  suppressHydrationWarning
                  style={{
                    fontSize: legalitasTitleSize
                      ? `clamp(${Math.max(18, Math.round(legalitasTitleSize * 0.48))}px, 4.5vw, ${legalitasTitleSize}px)`
                      : undefined,
                    color: legalitasTitleColor || undefined,
                    fontWeight: parseHeroFontWeightNumber(legalitasTitleFontWeight),
                  }}
                  className={cn(
                    "w-full text-center leading-tight tracking-tight break-words mb-3 sm:mb-4",
                    getHeroFontClass(legalitasTitleFont),
                    getHeroFontWeightClass(legalitasTitleFontWeight),
                    !legalitasTitleSize && "text-xl sm:text-3xl lg:text-[36px]",
                    !legalitasTitleColor && "text-[#15803D]"
                  )}
                >
                  {legalitasTitle || DEFAULT_LEGALITAS_TITLE}
                </h2>

                {/* layer--3: Sub-Judul / Deskripsi */}
                <p
                  suppressHydrationWarning
                  style={{
                    fontSize: (legalitasSubtitleSize || DEFAULT_LEGALITAS_SUBTITLE_SIZE)
                      ? `clamp(12px, 2.5vw, ${legalitasSubtitleSize || DEFAULT_LEGALITAS_SUBTITLE_SIZE}px)`
                      : undefined,
                    color: legalitasSubtitleColor || undefined,
                  }}
                  className={cn(
                    "font-normal leading-relaxed break-words whitespace-pre-line max-w-[1164px] text-[12px] sm:text-base",
                    legalitasSubtitleAlign === "center" ? "text-center" : legalitasSubtitleAlign === "justify" ? "text-justify" : "text-left",
                    !legalitasSubtitleSize && "text-[12px] sm:text-base",
                    !legalitasSubtitleColor && "text-black dark:text-white/80"
                  )}
                >
                  {renderFormattedText(legalitasSubtitle || DEFAULT_LEGALITAS_SUBTITLE)}
                </p>
              </div>

              {/* group-5 & group-4: Kotak Sertifikasi / Legalitas - 3 kolom di mobile, 6 frame rapi dalam 1 baris di desktop dan otomatis rata tengah (justify-center) */}
              <div
                className={cn(
                  "w-full max-w-[1140px] px-2 sm:px-4 mx-auto flex flex-wrap items-center justify-center gap-3 sm:gap-3.5 md:gap-4 xl:gap-5",
                  activeLegalitasItems.length <= 6 && "lg:flex-nowrap"
                )}
              >
                {activeLegalitasItems.map((item, idx) => {
                  const cardBg = item.bgColor || legalitasCardBg || DEFAULT_LEGALITAS_CARD_BG;

                  return (
                    <div
                      key={item.id || `leg-${idx}`}
                      style={{
                        backgroundColor: cardBg,
                      }}
                      className="w-[calc((100%-1.5rem)/3)] max-w-[135px] aspect-[135/138] sm:aspect-auto sm:w-[145px] sm:h-[148px] md:w-[148px] md:h-[151px] lg:w-[150px] lg:h-[153px] xl:w-[158px] xl:h-[161px] rounded-[5px] border-0 border-transparent flex items-center justify-center p-2 sm:p-3 text-center transition-all duration-200 hover:-translate-y-1 relative overflow-hidden shrink min-w-0 group"
                    >
                      <img
                        src={item.image}
                        alt={item.title || `Sertifikasi ${idx + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          </React.Fragment>
        );
      }

      case "dipercaya_brand": {
        const rawBrandItems = dipercayaBrandItems && dipercayaBrandItems.length > 0 ? dipercayaBrandItems : DEFAULT_DIPERCAYA_BRAND_ITEMS;
        // User request: hanya tampilkan yang berfoto, posisikan frame di center otomatis, 1 baris 6 frame, dan tanpa stroke garis
        const activeBrandItems = rawBrandItems.filter((item) => Boolean(item.image && item.image.trim() !== ""));

        // Jika tidak ada item yang memiliki foto:
        // Pada website live, jangan tampilkan section sama sekali agar rapi.
        // Pada mode pratinjau, beri info bahwa logo brand membutuhkan foto.
        if (activeBrandItems.length === 0) {
          if (!isPreviewMode) return null;
          return (
            <React.Fragment key={block.id || "dipercaya_brand"}>
              <section
                suppressHydrationWarning
                className={cn(
                  "w-full bg-white dark:bg-card/40 transition-colors my-[20px] py-8 sm:py-10 flex flex-col items-center justify-start relative",
                  poppins.className
                )}
              >
                <div className="w-full max-w-[1200px] flex flex-col items-center text-center px-4">
                  <h2
                    suppressHydrationWarning
                    style={{
                      fontSize: dipercayaBrandTitleSize
                        ? `clamp(${Math.max(18, Math.round(dipercayaBrandTitleSize * 0.48))}px, 4.5vw, ${dipercayaBrandTitleSize}px)`
                        : undefined,
                      color: dipercayaBrandTitleColor || undefined,
                      fontWeight: parseHeroFontWeightNumber(dipercayaBrandTitleFontWeight),
                    }}
                    className={cn(
                      "w-full text-center leading-tight tracking-tight break-words mb-3 sm:mb-4",
                      getHeroFontClass(dipercayaBrandTitleFont),
                      getHeroFontWeightClass(dipercayaBrandTitleFontWeight),
                      !dipercayaBrandTitleSize && "text-xl sm:text-3xl lg:text-[36px]",
                      !dipercayaBrandTitleColor && "text-[#15803D]"
                    )}
                  >
                    {dipercayaBrandTitle || DEFAULT_DIPERCAYA_BRAND_TITLE}
                  </h2>
                  <p
                    suppressHydrationWarning
                    style={{
                      fontSize: dipercayaBrandSubtitleSize ? `${dipercayaBrandSubtitleSize}px` : undefined,
                      color: dipercayaBrandSubtitleColor || undefined,
                    }}
                    className={cn(
                      "font-normal leading-relaxed break-words whitespace-pre-line max-w-[1164px]",
                      dipercayaBrandSubtitleAlign === "center" ? "text-center" : dipercayaBrandSubtitleAlign === "justify" ? "text-justify" : "text-left",
                      !dipercayaBrandSubtitleSize && "text-sm sm:text-base",
                      !dipercayaBrandSubtitleColor && "text-black dark:text-white/80"
                    )}
                  >
                    {renderFormattedText(dipercayaBrandSubtitle || DEFAULT_DIPERCAYA_BRAND_SUBTITLE)}
                  </p>
                  <div className="w-full max-w-[620px] p-5 mt-6 border border-dashed border-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/20 text-center rounded-lg">
                    <p className="text-xs sm:text-sm font-medium text-emerald-800 dark:text-emerald-300">
                      Belum ada logo brand mitra yang diunggah. Frame hanya akan ditampilkan otomatis di posisi tengah setelah foto/logo brand diunggah di menu Pengaturan.
                    </p>
                  </div>
                </div>
              </section>
            </React.Fragment>
          );
        }

        return (
          <React.Fragment key={block.id || "dipercaya_brand"}>
            <section
              suppressHydrationWarning
              className={cn(
                "w-full bg-white dark:bg-card/40 transition-colors my-[20px] py-8 sm:py-10 flex flex-col items-center justify-start relative",
                poppins.className
              )}
            >
              {/* Header: Judul & Subtitle */}
              <div className="w-full max-w-[1200px] flex flex-col items-center text-center mb-8 sm:mb-10 px-4">
                <h2
                  suppressHydrationWarning
                  style={{
                    fontSize: dipercayaBrandTitleSize
                      ? `clamp(${Math.max(18, Math.round(dipercayaBrandTitleSize * 0.48))}px, 4.5vw, ${dipercayaBrandTitleSize}px)`
                      : undefined,
                    color: dipercayaBrandTitleColor || undefined,
                    fontWeight: parseHeroFontWeightNumber(dipercayaBrandTitleFontWeight),
                  }}
                  className={cn(
                    "w-full text-center leading-tight tracking-tight break-words mb-3 sm:mb-4",
                    getHeroFontClass(dipercayaBrandTitleFont),
                    getHeroFontWeightClass(dipercayaBrandTitleFontWeight),
                    !dipercayaBrandTitleSize && "text-xl sm:text-3xl lg:text-[36px]",
                    !dipercayaBrandTitleColor && "text-[#15803D]"
                  )}
                >
                  {dipercayaBrandTitle || DEFAULT_DIPERCAYA_BRAND_TITLE}
                </h2>

                <p
                  suppressHydrationWarning
                  style={{
                    fontSize: (dipercayaBrandSubtitleSize || DEFAULT_DIPERCAYA_BRAND_SUBTITLE_SIZE)
                      ? `clamp(12px, 2.5vw, ${dipercayaBrandSubtitleSize || DEFAULT_DIPERCAYA_BRAND_SUBTITLE_SIZE}px)`
                      : undefined,
                    color: dipercayaBrandSubtitleColor || undefined,
                  }}
                  className={cn(
                    "font-normal leading-relaxed break-words whitespace-pre-line max-w-[1164px] text-[12px] sm:text-base",
                    dipercayaBrandSubtitleAlign === "center" ? "text-center" : dipercayaBrandSubtitleAlign === "justify" ? "text-justify" : "text-left",
                    !dipercayaBrandSubtitleSize && "text-[12px] sm:text-base",
                    !dipercayaBrandSubtitleColor && "text-black dark:text-white/80"
                  )}
                >
                  {renderFormattedText(dipercayaBrandSubtitle || DEFAULT_DIPERCAYA_BRAND_SUBTITLE)}
                </p>
              </div>

              {/* group-5 & group-4: Kotak Logo Brand - 3 kolom di mobile, 6 frame rapi dalam 1 baris di desktop, otomatis rata tengah, tanpa garis stroke */}
              <div
                className={cn(
                  "w-full max-w-[1140px] px-2 sm:px-4 mx-auto flex flex-wrap items-center justify-center gap-3 sm:gap-3.5 md:gap-4 xl:gap-5",
                  activeBrandItems.length <= 6 && "lg:flex-nowrap"
                )}
              >
                {activeBrandItems.map((item, idx) => {
                  const cardBg = item.bgColor || dipercayaBrandCardBg || DEFAULT_DIPERCAYA_BRAND_CARD_BG;

                  return (
                    <div
                      key={item.id || `brand-${idx}`}
                      style={{
                        backgroundColor: cardBg,
                      }}
                      className="w-[calc((100%-1.5rem)/3)] max-w-[135px] aspect-[135/138] sm:aspect-auto sm:w-[145px] sm:h-[148px] md:w-[148px] md:h-[151px] lg:w-[150px] lg:h-[153px] xl:w-[158px] xl:h-[161px] rounded-[5px] border-0 border-transparent flex items-center justify-center p-2 sm:p-3 text-center transition-all duration-200 hover:-translate-y-1 relative overflow-hidden shrink min-w-0 group"
                    >
                      <img
                        src={item.image}
                        alt={item.title || `Brand Mitra ${idx + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          </React.Fragment>
        );
      }

      case "proses_maklon": {
        const rawItems = prosesMaklonItems && prosesMaklonItems.length > 0 ? prosesMaklonItems : DEFAULT_PROSES_MAKLON_ITEMS;
        const activeItems = rawItems.filter(item => (item.title && item.title.trim() !== "") || (item.desc && item.desc.trim() !== ""));

        if (!isPreviewMode && activeItems.length === 0) return null;

        const renderProsesMaklonCard = (item: ProsesMaklonItem, idx: number, isMobile = false) => {
          const cardBg = prosesMaklonCardBg || item.bgColor || DEFAULT_PROSES_MAKLON_CARD_BG;
          const cardText = prosesMaklonCardTextColor || item.textColor || DEFAULT_PROSES_MAKLON_CARD_TEXT_COLOR;
          const stepNumber = item.step || (idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`);

          return (
            <div
              key={item.id || `proses-${idx}`}
              style={{
                backgroundColor: cardBg,
                color: cardText,
              }}
              className={cn(
                "w-full min-h-[220px] sm:min-h-[250px] rounded-[5px] p-6 sm:p-7 relative flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden group",
                isMobile && "h-full min-h-[210px] max-w-[340px] mx-auto"
              )}
            >
              {/* Watermark Angka Langkah di Pojok Kanan Atas */}
              <span
                role="presentation"
                aria-hidden="true"
                className="absolute top-3 right-4 sm:top-4 sm:right-5 text-[32px] sm:text-[40px] font-bold leading-none select-none pointer-events-none transition-opacity"
                style={{
                  color: cardText,
                  opacity: 0.35,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {stepNumber}
              </span>

              {/* Judul Langkah (Konsultasi Produk, dst) */}
              <h3
                className="text-lg sm:text-[20px] font-bold leading-snug mb-3 sm:mb-3.5 tracking-wide"
                style={{ color: cardText }}
              >
                {item.title}
              </h3>

              {/* Deskripsi Langkah */}
              <p
                className="text-sm sm:text-[16px] font-medium leading-relaxed"
                style={{ color: cardText }}
              >
                {renderFormattedText(item.desc)}
              </p>
            </div>
          );
        };

        return (
          <React.Fragment key="proses_maklon">
            <section
              id="proses-maklon"
              className={cn(
                "w-full bg-white dark:bg-card/40 transition-colors my-[20px] py-10 sm:py-14 flex flex-col items-center justify-start relative",
                poppins.className
              )}
            >
              {/* Header: Judul & Subtitle */}
              <div className="w-full max-w-[1320px] flex flex-col items-center text-center mb-6 sm:mb-12 px-4">
                <h2
                  suppressHydrationWarning
                  style={{
                    fontSize: prosesMaklonTitleSize
                      ? `clamp(${Math.max(18, Math.round(prosesMaklonTitleSize * 0.48))}px, 4.5vw, ${prosesMaklonTitleSize}px)`
                      : undefined,
                    color: prosesMaklonTitleColor || undefined,
                    fontWeight: parseHeroFontWeightNumber(prosesMaklonTitleFontWeight),
                  }}
                  className={cn(
                    "w-full text-center leading-tight tracking-tight break-words mb-3 sm:mb-4",
                    getHeroFontClass(prosesMaklonTitleFont),
                    getHeroFontWeightClass(prosesMaklonTitleFontWeight),
                    !prosesMaklonTitleSize && "text-xl sm:text-3xl lg:text-[36px]",
                    !prosesMaklonTitleColor && "text-[#15803D]"
                  )}
                >
                  {prosesMaklonTitle || DEFAULT_PROSES_MAKLON_TITLE}
                </h2>

                <p
                  suppressHydrationWarning
                  style={{
                    fontSize: (prosesMaklonSubtitleSize || DEFAULT_PROSES_MAKLON_SUBTITLE_SIZE)
                      ? `clamp(12px, 2.5vw, ${prosesMaklonSubtitleSize || DEFAULT_PROSES_MAKLON_SUBTITLE_SIZE}px)`
                      : undefined,
                    color: prosesMaklonSubtitleColor || undefined,
                  }}
                  className={cn(
                    "font-normal leading-relaxed break-words whitespace-pre-line max-w-[1282px] text-[12px] sm:text-base",
                    prosesMaklonSubtitleAlign === "center" ? "text-center" : prosesMaklonSubtitleAlign === "justify" ? "text-justify" : "text-left",
                    !prosesMaklonSubtitleSize && "text-[12px] sm:text-base",
                    !prosesMaklonSubtitleColor && "text-black dark:text-white/80"
                  )}
                >
                  {renderFormattedText(prosesMaklonSubtitle || DEFAULT_PROSES_MAKLON_SUBTITLE)}
                </p>
              </div>

              {/* Tampilan Desktop & Tablet: Grid 2-3 Kolom */}
              <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 w-full">
                {activeItems.map((item, idx) => renderProsesMaklonCard(item, idx, false))}
              </div>

              {/* Tampilan Mobile: Carousel Horizontal agar tidak terlalu panjang */}
              <div className="block sm:hidden w-full relative px-2">
                <Carousel
                  opts={{ align: "center", loop: true }}
                  plugins={[prosesMaklonPlugin.current]}
                  className="w-full"
                  onMouseEnter={() => prosesMaklonPlugin.current.stop()}
                  onMouseLeave={() => prosesMaklonPlugin.current.reset()}
                >
                  <CarouselContent className="-ml-3 py-2">
                    {activeItems.map((item, idx) => (
                      <CarouselItem key={item.id || `proses-mob-${idx}`} className="pl-3 basis-[85%] xs:basis-[80%] flex justify-center">
                        {renderProsesMaklonCard(item, idx, true)}
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {activeItems.length > 1 && (
                    <div className="mt-4 flex justify-center">
                      <CarouselDots realCount={activeItems.length} />
                    </div>
                  )}
                </Carousel>
              </div>
            </section>
          </React.Fragment>
        );
      }

      case "konsultasi_banner": {
        const finalLink = buildKonsultasiBannerUrl({
          linkType: konsultasiBannerLinkType,
          waNumber: konsultasiBannerWaNumber,
          waMessage: konsultasiBannerWaMessage,
          customUrl: konsultasiBannerCustomUrl,
        });

        return (
          <React.Fragment key="konsultasi_banner">
            <section
              id="konsultasi-banner"
              className={cn(
                "w-full bg-white dark:bg-card/40 transition-colors my-4 sm:my-6 py-4 sm:py-6 flex flex-col items-center justify-center relative",
                poppins.className
              )}
            >
              <div
                style={{
                  backgroundColor: konsultasiBannerBgColor || DEFAULT_KONSULTASI_BANNER_BG_COLOR,
                  borderRadius: `${konsultasiBannerBorderRadius ?? DEFAULT_KONSULTASI_BANNER_BORDER_RADIUS}px`,
                }}
                className="w-full min-h-[150px] md:min-h-[188px] p-6 sm:p-8 md:px-12 md:py-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 shadow-md relative overflow-hidden transition-all"
              >
                {/* Teks Ajakan Konsultasi */}
                <div className="flex-1 max-w-[1006px] text-center lg:text-left z-10 w-full">
                  <h2
                    suppressHydrationWarning
                    style={{
                      fontSize: konsultasiBannerTextSize
                        ? `clamp(${Math.max(18, Math.round(konsultasiBannerTextSize * 0.55))}px, 4.5vw, ${konsultasiBannerTextSize}px)`
                        : undefined,
                      color: konsultasiBannerTextColor || DEFAULT_KONSULTASI_BANNER_TEXT_COLOR,
                      fontWeight: parseHeroFontWeightNumber(konsultasiBannerTextFontWeight),
                    }}
                    className={cn(
                      "w-full text-center lg:text-left leading-tight sm:leading-snug tracking-tight break-words whitespace-pre-line",
                      getHeroFontClass(konsultasiBannerTextFont),
                      getHeroFontWeightClass(konsultasiBannerTextFontWeight),
                      !konsultasiBannerTextSize && "text-lg sm:text-2xl lg:text-[30px]"
                    )}
                  >
                    {renderFormattedText(konsultasiBannerText || DEFAULT_KONSULTASI_BANNER_TEXT)}
                  </h2>
                </div>

                {/* Tombol CTA Konsultasi Sekarang */}
                <div className="shrink-0 flex items-center justify-center z-10 w-full sm:w-auto">
                  <a
                    href={finalLink}
                    target={konsultasiBannerOpenNewTab ? "_blank" : undefined}
                    rel={konsultasiBannerOpenNewTab ? "noopener noreferrer" : undefined}
                    style={{
                      backgroundColor: konsultasiBannerBtnBgColor || DEFAULT_KONSULTASI_BANNER_BTN_BG_COLOR,
                      color: konsultasiBannerBtnTextColor || DEFAULT_KONSULTASI_BANNER_BTN_TEXT_COLOR,
                      fontSize: konsultasiBannerBtnTextSize
                        ? `clamp(${Math.max(13, Math.round(konsultasiBannerBtnTextSize * 0.7))}px, 3.5vw, ${Math.min(konsultasiBannerBtnTextSize, 16)}px)`
                        : undefined,
                      fontWeight: parseHeroFontWeightNumber(konsultasiBannerBtnFontWeight),
                    }}
                    className={cn(
                      "w-full max-w-[260px] sm:w-auto sm:min-w-[220px] h-[46px] sm:h-[52px] px-6 sm:px-7 rounded-[100px] flex items-center justify-center text-center font-bold transition-all duration-300 hover:scale-[1.03] hover:shadow-lg active:scale-95 cursor-pointer shadow-md",
                      getHeroFontClass(konsultasiBannerTextFont),
                      !konsultasiBannerBtnTextSize && "text-sm sm:text-base"
                    )}
                  >
                    <span>{konsultasiBannerBtnText || DEFAULT_KONSULTASI_BANNER_BTN_TEXT}</span>
                  </a>
                </div>
              </div>
            </section>
          </React.Fragment>
        );
      }

      case "melayani_klien": {
        const titleFontClass = getHeroFontClass(melayaniKlienTitleFont);
        const titleWeightClass = getHeroFontWeightClass(melayaniKlienTitleFontWeight);
        const titleWeightNum = parseHeroFontWeightNumber(melayaniKlienTitleFontWeight);
        const pillWeightNum = parseHeroFontWeightNumber(melayaniKlienPillFontWeight);

        return (
          <React.Fragment key="melayani_klien">
            <section
              id="melayani-klien"
              className={cn(
                "w-full bg-white dark:bg-card/40 transition-colors my-4 sm:my-8 py-8 sm:py-12 flex flex-col items-center justify-center relative overflow-hidden",
                poppins.className
              )}
            >
              <div className="w-full max-w-[1440px] px-4 sm:px-6 md:px-8 mx-auto flex flex-col items-center">
                {/* Judul Utama */}
                <h2
                  suppressHydrationWarning
                  style={{
                    fontSize: melayaniKlienTitleSize
                      ? `clamp(${Math.max(18, Math.round(melayaniKlienTitleSize * 0.48))}px, 4.5vw, ${melayaniKlienTitleSize}px)`
                      : undefined,
                    color: melayaniKlienTitleColor || DEFAULT_MELAYANI_KLIEN_TITLE_COLOR,
                    fontWeight: titleWeightNum,
                  }}
                  className={cn(
                    "w-full text-center tracking-tight leading-tight max-w-[1200px]",
                    titleFontClass,
                    titleWeightClass,
                    !melayaniKlienTitleSize && "text-xl sm:text-3xl lg:text-[36px]"
                  )}
                >
                  {renderFormattedText(melayaniKlienTitle || DEFAULT_MELAYANI_KLIEN_TITLE)}
                </h2>

                {/* Sub-judul / Deskripsi */}
                {melayaniKlienSubtitle && (
                  <div
                    style={{
                      fontSize: (melayaniKlienSubtitleSize || DEFAULT_MELAYANI_KLIEN_SUBTITLE_SIZE)
                        ? `clamp(12px, 2.5vw, ${melayaniKlienSubtitleSize || DEFAULT_MELAYANI_KLIEN_SUBTITLE_SIZE}px)`
                        : undefined,
                      color: melayaniKlienSubtitleColor || DEFAULT_MELAYANI_KLIEN_SUBTITLE_COLOR,
                      textAlign: melayaniKlienSubtitleAlign || "center",
                    }}
                    className={cn(
                      "mt-4 sm:mt-5 max-w-[1282px] leading-relaxed dark:text-white/80 whitespace-pre-line text-[12px] sm:text-base",
                      !melayaniKlienSubtitleSize && "text-[12px] sm:text-base",
                      melayaniKlienSubtitleAlign === "center" ? "text-center" : melayaniKlienSubtitleAlign === "left" ? "text-left" : "text-justify"
                    )}
                  >
                    {renderFormattedText(melayaniKlienSubtitle)}
                  </div>
                )}

                {/* Grid / Flex Badge Kota-Kota - 2 kolom di mobile, multi-kolom di desktop */}
                <div className="w-full max-w-[1220px] flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-5 mt-8 sm:mt-10">
                  {melayaniKlienCities.map((city, idx) => {
                    const isLongText = city.trim().length > 15 || city.toUpperCase().includes("KOTA-KOTA");
                    return (
                      <div
                        key={`${city}-${idx}`}
                        style={{
                          backgroundColor: melayaniKlienPillBg || DEFAULT_MELAYANI_KLIEN_PILL_BG,
                          color: melayaniKlienPillTextColor || DEFAULT_MELAYANI_KLIEN_PILL_TEXT_COLOR,
                          fontSize: melayaniKlienPillSize
                            ? `clamp(${Math.max(12, Math.round(melayaniKlienPillSize * 0.65))}px, 3.2vw, ${melayaniKlienPillSize}px)`
                            : undefined,
                          fontWeight: pillWeightNum,
                        }}
                        className={cn(
                          "min-h-[46px] h-[48px] sm:h-[70px] rounded-[100px] flex items-center justify-center text-center px-3 sm:px-6 py-2 transition-all duration-300 hover:scale-[1.04] hover:shadow-lg shadow-sm select-none cursor-default",
                          isLongText ? "w-full sm:w-[334px]" : "w-[calc((100%-0.75rem)/2)] sm:w-[221px]",
                          !melayaniKlienPillSize && "text-xs xs:text-sm sm:text-lg md:text-[20px]"
                        )}
                      >
                        <span className="tracking-wide uppercase break-words leading-tight">{city}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </React.Fragment>
        );
      }

      case "ulasan_klien": {
        const ulasanItems: UlasanKlienItem[] = ulasanKlienItems && ulasanKlienItems.length > 0 ? ulasanKlienItems : DEFAULT_ULASAN_KLIEN_ITEMS;

        const renderStars = (rating: number) => (
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn("w-4 h-4", i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200")}
              />
            ))}
          </div>
        );

        return (
          <React.Fragment key="ulasan_klien">
            <section
              id="ulasan-klien"
              className={cn("w-full transition-colors py-12 sm:py-16 lg:py-20 overflow-hidden", poppins.className)}
              style={{ backgroundColor: DEFAULT_ULASAN_KLIEN_BG }}
            >
              <div className="w-full max-w-[1440px] px-4 sm:px-6 md:px-8 mx-auto flex flex-col items-center">

                {/* Header */}
                <div className="w-full flex flex-col items-center text-center mb-8 sm:mb-12 px-2 sm:px-4">
                  {/* Label kecil */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="h-px w-8 bg-yellow-400 block" />
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#D97706" }}>
                      Testimoni Klien
                    </span>
                    <span className="h-px w-8 bg-yellow-400 block" />
                  </div>

                  <h2
                    suppressHydrationWarning
                    className={cn(
                      "w-full text-center tracking-tight leading-tight max-w-[1200px]",
                      getHeroFontClass(ulasanKlienTitleFont || DEFAULT_ULASAN_KLIEN_TITLE_FONT),
                      getHeroFontWeightClass(ulasanKlienTitleFontWeight || DEFAULT_ULASAN_KLIEN_TITLE_FONT_WEIGHT),
                      !ulasanKlienTitleSize && "text-xl sm:text-3xl lg:text-[36px]"
                    )}
                    style={{
                      color: ulasanKlienTitleColor || DEFAULT_ULASAN_KLIEN_TITLE_COLOR,
                      fontSize: ulasanKlienTitleSize
                        ? `clamp(${Math.max(18, Math.round(ulasanKlienTitleSize * 0.48))}px, 4.5vw, ${ulasanKlienTitleSize}px)`
                        : undefined,
                      fontWeight: parseHeroFontWeightNumber(ulasanKlienTitleFontWeight || DEFAULT_ULASAN_KLIEN_TITLE_FONT_WEIGHT),
                    }}
                  >
                    {renderFormattedText(ulasanKlienTitle || DEFAULT_ULASAN_KLIEN_TITLE)}
                  </h2>

                  {/* Garis dekoratif */}
                  <div className="mt-3 flex flex-col items-center gap-1">
                    <div className="h-1 w-16 rounded-full" style={{ backgroundColor: ulasanKlienTitleColor || DEFAULT_ULASAN_KLIEN_TITLE_COLOR }} />
                    <div className="h-1 w-8 rounded-full opacity-30" style={{ backgroundColor: ulasanKlienTitleColor || DEFAULT_ULASAN_KLIEN_TITLE_COLOR }} />
                  </div>

                  {(ulasanKlienSubtitle || DEFAULT_ULASAN_KLIEN_SUBTITLE) && (
                    <div
                      className={cn(
                        "mt-4 sm:mt-5 max-w-[1282px] w-full leading-relaxed dark:text-white/80 whitespace-pre-line text-center text-[12px] sm:text-base",
                        !ulasanKlienSubtitleSize && "text-[12px] sm:text-base"
                      )}
                      style={{
                        color: ulasanKlienSubtitleColor || DEFAULT_ULASAN_KLIEN_SUBTITLE_COLOR,
                        fontSize: (ulasanKlienSubtitleSize || DEFAULT_ULASAN_KLIEN_SUBTITLE_SIZE)
                          ? `clamp(12px, 2.5vw, ${ulasanKlienSubtitleSize || DEFAULT_ULASAN_KLIEN_SUBTITLE_SIZE}px)`
                          : undefined,
                      }}
                    >
                      {renderFormattedText(ulasanKlienSubtitle || DEFAULT_ULASAN_KLIEN_SUBTITLE)}
                    </div>
                  )}
                </div>

                {/* Auto Slide Carousel — 4 Card per Baris (Desktop: lg:basis-1/4) */}
                <div className="w-full relative px-2 sm:px-4">
                  <Carousel
                    opts={{ align: "start", loop: true }}
                    plugins={[ulasanPlugin.current]}
                    className="w-full"
                    onMouseEnter={() => ulasanPlugin.current.stop()}
                    onMouseLeave={() => ulasanPlugin.current.reset()}
                  >
                    <CarouselContent className="-ml-3 sm:-ml-4 py-3">
                      {ulasanItems.map((ulasan) => (
                        <CarouselItem
                          key={ulasan.id}
                          className="pl-3 sm:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                        >
                          <div
                            className="h-full flex flex-col justify-between rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 border bg-white"
                            style={{
                              backgroundColor: DEFAULT_ULASAN_KLIEN_CARD_BG,
                              borderColor: DEFAULT_ULASAN_KLIEN_CARD_BORDER,
                              minHeight: "300px",
                            }}
                          >
                            <div>
                              {/* Header: Avatar + Info + Google icon */}
                              <div className="flex items-start justify-between gap-2.5 mb-3.5">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-xs overflow-hidden"
                                    style={{
                                      backgroundColor: ulasan.avatar_bg || "#15803D",
                                      color: ulasan.avatar_text_color || "#FFFFFF",
                                    }}
                                  >
                                    {(ulasan.image || ulasan.avatar_url) ? (
                                      <img
                                        src={ulasan.image || ulasan.avatar_url}
                                        alt={ulasan.name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      ulasan.initials || ulasan.name.slice(0, 2).toUpperCase()
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-xs sm:text-sm text-gray-900 leading-tight truncate">
                                      {ulasan.name}
                                    </p>
                                    {ulasan.role && (
                                      <p className="text-[11px] text-gray-600 font-medium mt-0.5 truncate leading-tight">
                                        {ulasan.role}
                                      </p>
                                    )}
                                    <p className="text-[10px] text-gray-600 mt-0.5">{ulasan.date}</p>
                                  </div>
                                </div>

                                {/* Google Icon SVG */}
                                <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 mt-0.5" fill="none">
                                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                              </div>

                              {/* Rating bintang + badge centang */}
                              <div className="flex items-center gap-1.5 mb-2.5">
                                {renderStars(ulasan.rating)}
                                <svg className="w-3.5 h-3.5 text-blue-500 shrink-0 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </div>

                              {/* Teks ulasan */}
                              <p className="text-xs sm:text-[13px] text-gray-700 leading-relaxed line-clamp-4">
                                "{ulasan.text}"
                              </p>
                            </div>

                            {/* Footer kartu */}
                            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                              <span className="text-[11px] text-gray-600 font-medium italic">ulasan terverifikasi</span>
                              <div className="inline-flex items-center gap-1">
                                <span className="text-xs font-bold text-amber-700 leading-none">{ulasan.rating}.0</span>
                                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
                              </div>
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>

                    {/* Tombol Navigasi Panah Kiri & Kanan */}
                    <CarouselPrevious className="hidden md:flex -left-3 lg:-left-5 bg-white/95 hover:bg-white text-gray-700 shadow-md border-gray-200 cursor-pointer" />
                    <CarouselNext className="hidden md:flex -right-3 lg:-right-5 bg-white/95 hover:bg-white text-gray-700 shadow-md border-gray-200 cursor-pointer" />

                    {/* Indikator Titik / Dots */}
                    <div className="mt-8 flex justify-center">
                      <CarouselDots realCount={ulasanItems.length} />
                    </div>
                  </Carousel>
                </div>

              </div>
            </section>
          </React.Fragment>
        );
      }

      case "faq_section": {
        const currentFaqItems: FaqItem[] = faqItems && faqItems.length > 0 ? faqItems : DEFAULT_FAQ_ITEMS;

        return (
          <React.Fragment key="faq_section">
            <section
              id="faq-section"
              className={cn("w-full transition-colors py-12 sm:py-16 lg:py-20 overflow-hidden", poppins.className)}
              style={{ backgroundColor: DEFAULT_FAQ_BG }}
            >
              <div className="w-full max-w-[1440px] px-2 sm:px-6 md:px-8 mx-auto flex flex-col items-center">

                {/* Header FAQ */}
                <div className="w-full flex flex-col items-center text-center mb-8 sm:mb-12 px-2 sm:px-4">
                  <h2
                    suppressHydrationWarning
                    className={cn(
                      "w-full text-center tracking-tight leading-tight max-w-[1200px]",
                      getHeroFontClass(faqTitleFont || DEFAULT_FAQ_TITLE_FONT),
                      getHeroFontWeightClass(faqTitleFontWeight || DEFAULT_FAQ_TITLE_FONT_WEIGHT),
                      !faqTitleSize && "text-xl sm:text-3xl lg:text-[36px]"
                    )}
                    style={{
                      color: faqTitleColor || DEFAULT_FAQ_TITLE_COLOR,
                      fontSize: faqTitleSize
                        ? `clamp(${Math.max(18, Math.round(faqTitleSize * 0.48))}px, 4.5vw, ${faqTitleSize}px)`
                        : undefined,
                      fontWeight: parseHeroFontWeightNumber(faqTitleFontWeight || DEFAULT_FAQ_TITLE_FONT_WEIGHT),
                    }}
                  >
                    {renderFormattedText(faqTitle || DEFAULT_FAQ_TITLE)}
                  </h2>

                  {(faqSubtitle || DEFAULT_FAQ_SUBTITLE) && (
                    <div
                      className={cn(
                        "mt-4 sm:mt-5 max-w-[1282px] w-full leading-relaxed dark:text-white/80 whitespace-pre-line text-center text-[12px] sm:text-base",
                        !faqSubtitleSize && "text-[12px] sm:text-base"
                      )}
                      style={{
                        color: faqSubtitleColor || DEFAULT_FAQ_SUBTITLE_COLOR,
                        fontSize: (faqSubtitleSize || DEFAULT_FAQ_SUBTITLE_SIZE)
                          ? `clamp(12px, 2.5vw, ${faqSubtitleSize || DEFAULT_FAQ_SUBTITLE_SIZE}px)`
                          : undefined,
                      }}
                    >
                      {renderFormattedText(faqSubtitle || DEFAULT_FAQ_SUBTITLE)}
                    </div>
                  )}
                </div>

                {/* Daftar Accordion FAQ - Lebar penuh (full) di mobile */}
                <div className="w-full max-w-[1100px] flex flex-col gap-3 sm:gap-4 px-0 sm:px-4">
                  {currentFaqItems.map((item, idx) => {
                    const isOpen = openFaqId === item.id;
                    return (
                      <div
                        key={item.id || idx}
                        className={cn(
                          "w-full rounded-[5px] bg-white dark:bg-card transition-all duration-300 ease-in-out overflow-hidden border-2",
                          isOpen
                            ? "border-[#16A34A] shadow-md dark:border-[#16A34A]"
                            : "border-[#E2E8F0] dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 shadow-xs"
                        )}
                      >
                        {/* Baris Pertanyaan (Clickable) */}
                        <button
                          type="button"
                          onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                          className="w-full p-4 sm:p-5 md:p-6 flex items-center justify-between gap-4 text-left cursor-pointer transition-colors duration-200 select-none"
                          aria-expanded={isOpen}
                        >
                          <span
                            className="text-sm sm:text-base md:text-[17px] font-bold leading-snug tracking-tight flex-1 transition-colors duration-300"
                            style={{
                              color: item.question_color || (isOpen ? (faqQuestionActiveColor || DEFAULT_FAQ_QUESTION_ACTIVE_COLOR) : (faqQuestionColor || DEFAULT_FAQ_QUESTION_COLOR))
                            }}
                          >
                            {item.question}
                          </span>

                          {/* Tombol Chevron Lingkaran */}
                          <div
                            className={cn(
                              "w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-350 ease-out",
                              isOpen
                                ? "text-white rotate-180 shadow-xs"
                                : "bg-[#EEF2F6] dark:bg-white/10 text-[#64748B] dark:text-gray-300 rotate-0"
                            )}
                            style={
                              isOpen
                                ? { backgroundColor: item.question_color || (faqQuestionActiveColor || DEFAULT_FAQ_QUESTION_ACTIVE_COLOR) }
                                : undefined
                            }
                          >
                            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-350" />
                          </div>
                        </button>

                        {/* Jawaban Accordion dengan Animasi Buka Tutup Halus (CSS Grid Transition) */}
                        <div
                          className={cn(
                            "grid transition-all duration-350 ease-in-out",
                            isOpen
                              ? "grid-rows-[1fr] opacity-100"
                              : "grid-rows-[0fr] opacity-0"
                          )}
                        >
                          <div className="overflow-hidden">
                            <div className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
                              <div className="pt-3 sm:pt-4 border-t border-gray-100 dark:border-white/10">
                                <p
                                  className="text-xs sm:text-sm md:text-[15px] leading-relaxed whitespace-pre-line font-normal transition-opacity duration-300"
                                  style={{
                                    color: item.answer_color || (faqAnswerColor || DEFAULT_FAQ_ANSWER_COLOR)
                                  }}
                                >
                                  {item.answer}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </section>
          </React.Fragment>
        );
      }

      case "video_profil": {
        const isLeft = (videoProfilPosition || DEFAULT_VIDEO_PROFIL_POSITION) === "left";
        return (
          <React.Fragment key="video_profil">
            <section
              suppressHydrationWarning
              className={cn(
                "w-full bg-white dark:bg-card/40 transition-colors pt-4 lg:pt-[16px] pb-6 lg:pb-[45px] flex flex-col justify-start relative"
              )}
            >
              {/* Judul Bagian */}
              <h2
                suppressHydrationWarning
                style={{
                  fontSize: videoProfilTitleSize
                    ? `clamp(${Math.max(18, Math.round(videoProfilTitleSize * 0.48))}px, 4.5vw, ${videoProfilTitleSize}px)`
                    : undefined,
                  color: videoProfilTitleColor || DEFAULT_VIDEO_PROFIL_TITLE_COLOR,
                  fontWeight: parseHeroFontWeightNumber(videoProfilTitleFontWeight || DEFAULT_VIDEO_PROFIL_TITLE_FONT_WEIGHT),
                }}
                className={cn(
                  "w-full text-left mb-4 sm:mb-[30px] leading-tight sm:leading-snug lg:leading-[58px] tracking-tight break-words font-bold",
                  poppins.className,
                  getHeroFontClass(videoProfilTitleFont),
                  getHeroFontWeightClass(videoProfilTitleFontWeight),
                  !videoProfilTitleSize && "text-xl sm:text-3xl lg:text-[40px]"
                )}
              >
                {videoProfilTitle || DEFAULT_VIDEO_PROFIL_TITLE}
              </h2>

              {/* Konten 2 Kolom: Teks Deskripsi (Kiri) + Frame Video 16:9 (Kanan Sejajar Margin Maksimal) */}
              <div
                className={cn(
                  "flex flex-col items-center justify-between gap-6 lg:gap-10 w-full",
                  isLeft ? "lg:flex-row-reverse" : "lg:flex-row"
                )}
              >
                {/* Kolom Teks Deskripsi */}
                <div className="w-full lg:flex-1 flex flex-col justify-center">
                  <div
                    suppressHydrationWarning
                    style={{
                      fontSize: (videoProfilDescSize || DEFAULT_VIDEO_PROFIL_DESC_SIZE)
                        ? `clamp(12px, 2.5vw, ${videoProfilDescSize || DEFAULT_VIDEO_PROFIL_DESC_SIZE}px)`
                        : undefined,
                      color: videoProfilDescColor || DEFAULT_VIDEO_PROFIL_DESC_COLOR,
                    }}
                    className={cn(
                      "w-full font-normal leading-relaxed lg:leading-[1.7] text-justify lg:text-left whitespace-pre-line break-words text-[12px] sm:text-base lg:text-[16px]",
                      !videoProfilDescSize && "text-[12px] sm:text-base lg:text-[16px]",
                      (!videoProfilDescColor || videoProfilDescColor === '#000000') && "text-[#334155] dark:text-white/90"
                    )}
                  >
                    {renderFormattedText(videoProfilDesc || DEFAULT_VIDEO_PROFIL_DESC)}
                  </div>
                </div>

                {/* Frame Video 16:9 dengan Play Button Overlay (Kanan Sejajar Margin Maksimal) */}
                <div
                  style={{
                    width: `min(100%, ${videoProfilFrameSize || DEFAULT_VIDEO_PROFIL_FRAME_SIZE}px)`,
                    maxWidth: "100%",
                  }}
                  onClick={() => {
                    setActiveVideoModalUrl(videoProfilUrl || DEFAULT_VIDEO_PROFIL_URL);
                    setActiveVideoModalTitle(videoProfilTitle || DEFAULT_VIDEO_PROFIL_TITLE);
                  }}
                  className="group aspect-[16/9] bg-neutral-900 rounded-[5px] overflow-hidden shadow-lg border border-gray-200 dark:border-white/10 shrink-0 relative cursor-pointer select-none transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]"
                  title="Klik untuk memutar video profil"
                >
                  {/* Thumbnail Image */}
                  <img
                    src={videoProfilThumbnail || DEFAULT_VIDEO_PROFIL_THUMBNAIL}
                    alt={videoProfilTitle || "Video Profil Indo Green Nature"}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20 group-hover:from-black/70 transition-all duration-300" />

                  {/* Center Pulsing Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative flex items-center justify-center">
                      {/* Ripple Ring */}
                      <div className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600/40 animate-ping opacity-75" />
                      
                      {/* Play Button Circle */}
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-600 group-hover:bg-red-700 text-white flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-110">
                        <Play className="w-6 h-6 sm:w-7 sm:h-7 ml-0.5 fill-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </React.Fragment>
        );
      }

      case "sosial_media": {
        const activeItems = (sosialMediaItems || DEFAULT_SOSIAL_MEDIA_ITEMS).filter((item) => item.is_active);
        return (
          <React.Fragment key="sosial_media">
            <section
              suppressHydrationWarning
              className="w-full transition-colors pt-4 lg:pt-[20px] pb-6 lg:pb-[35px] flex flex-col justify-start relative"
            >
              {/* Banner Container 1400px x 188px style */}
              <div
                suppressHydrationWarning
                style={{
                  backgroundColor: sosialMediaBgColor || DEFAULT_SOSIAL_MEDIA_BG_COLOR,
                  borderRadius: `${sosialMediaBorderRadius ?? DEFAULT_SOSIAL_MEDIA_BORDER_RADIUS}px`,
                }}
                className="w-full min-h-[120px] sm:min-h-[140px] md:min-h-[160px] lg:min-h-[188px] px-4 py-5 sm:px-8 md:px-10 lg:px-14 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 shadow-md transition-all relative overflow-hidden"
              >
                {/* Sisi Kiri: Teks & Tipografi */}
                <div className="flex-1 text-center md:text-left z-10 w-full">
                  {sosialMediaLabel && (
                    <span
                      suppressHydrationWarning
                      style={{
                        color: sosialMediaLabelColor || DEFAULT_SOSIAL_MEDIA_LABEL_COLOR,
                        fontSize: sosialMediaLabelSize ? `${sosialMediaLabelSize}px` : undefined,
                      }}
                      className="block uppercase tracking-wider font-semibold opacity-90 mb-1.5 text-xs sm:text-sm"
                    >
                      {sosialMediaLabel}
                    </span>
                  )}
                  <h2
                    suppressHydrationWarning
                    style={{
                      fontSize: sosialMediaTitleSize
                        ? `clamp(${Math.max(18, Math.round(sosialMediaTitleSize * 0.48))}px, 4.5vw, ${sosialMediaTitleSize}px)`
                        : undefined,
                      color: sosialMediaTitleColor || DEFAULT_SOSIAL_MEDIA_TITLE_COLOR,
                      fontWeight: parseHeroFontWeightNumber(sosialMediaTitleFontWeight || DEFAULT_SOSIAL_MEDIA_TITLE_FONT_WEIGHT),
                    }}
                    className={cn(
                      "w-full text-center md:text-left leading-tight sm:leading-snug tracking-tight break-words font-bold",
                      poppins.className,
                      getHeroFontClass(sosialMediaTitleFont),
                      getHeroFontWeightClass(sosialMediaTitleFontWeight),
                      !sosialMediaTitleSize && "text-xl sm:text-2xl md:text-3xl lg:text-[40px]"
                    )}
                  >
                    {renderFormattedText(sosialMediaTitle || DEFAULT_SOSIAL_MEDIA_TITLE)}
                  </h2>
                </div>

                {/* Sisi Kanan: 5 Tombol Ikon Lingkaran */}
                <div className="flex flex-wrap items-center justify-center gap-2 xs:gap-2.5 sm:gap-3.5 md:gap-4 lg:gap-4.5 z-10 shrink-0">
                  {activeItems.map((item, idx) => (
                    <a
                      key={item.id || idx}
                      href={item.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={item.name}
                      className="w-10 h-10 xs:w-11 xs:h-11 sm:w-13 sm:h-13 md:w-16 md:h-16 lg:w-[74px] lg:h-[74px] rounded-full bg-white text-zinc-900 shadow-md hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center overflow-hidden border-2 border-white/40 shrink-0 group"
                    >
                      {item.icon_image ? (
                        <img
                          src={item.icon_image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform"
                        />
                      ) : item.platform === "instagram" ? (
                        <AiFillInstagram className="w-5 h-5 xs:w-5.5 xs:h-5.5 sm:w-6.5 sm:h-6.5 md:w-8 md:h-8 lg:w-9 lg:h-9 text-[#E1306C] group-hover:scale-110 transition-transform" />
                      ) : item.platform === "facebook" ? (
                        <FaFacebook className="w-5 h-5 xs:w-5.5 xs:h-5.5 sm:w-6.5 sm:h-6.5 md:w-8 md:h-8 lg:w-9 lg:h-9 text-[#1877F2] group-hover:scale-110 transition-transform" />
                      ) : item.platform === "tiktok" ? (
                        <AiFillTikTok className="w-5 h-5 xs:w-5.5 xs:h-5.5 sm:w-6.5 sm:h-6.5 md:w-8 md:h-8 lg:w-9 lg:h-9 text-black dark:text-zinc-900 group-hover:scale-110 transition-transform" />
                      ) : item.platform === "youtube" ? (
                        <FaYoutube className="w-5 h-5 xs:w-5.5 xs:h-5.5 sm:w-6.5 sm:h-6.5 md:w-8 md:h-8 lg:w-9 lg:h-9 text-[#FF0000] group-hover:scale-110 transition-transform" />
                      ) : (
                        <BsBrowserChrome className="w-5 h-5 xs:w-5.5 xs:h-5.5 sm:w-6.5 sm:h-6.5 md:w-8 md:h-8 lg:w-9 lg:h-9 text-[#10B981] group-hover:scale-110 transition-transform" />
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </section>
          </React.Fragment>
        );
      }



      case "hero_banner2":
        return (
          <React.Fragment key="hero_banner2">
            {/* Hero Banner 2 Section */}
            <section className="flex flex-col lg:flex-row justify-between items-center w-full min-h-[180px] lg:min-h-[227px] mt-[40px] gap-6 lg:gap-8">
              {/* logo banner / image */}
              {hero2Image && (hero2Image.startsWith('http') || hero2Image.startsWith('/')) ? (
                <div className="w-full sm:w-[380px] md:w-[420px] lg:w-[380px] xl:w-[453px] aspect-[2/1] bg-primary/15 relative shrink-0 mx-auto lg:mx-0 overflow-hidden rounded-sm shadow-sm">
                  <Image
                    src={hero2Image}
                    alt="Banner 2"
                    fill
                    priority={false}
                    loading="lazy"
                    decoding="async"
                    unoptimized
                    sizes="(max-width: 640px) 100vw, 453px"
                    className="object-cover"
                  />
                </div>
              ) : null}
              {/* frame text */}
              <div className="flex-1 min-w-0 w-full pt-2 pb-2 flex justify-center lg:justify-end">
                <h1
                  style={
                    hero2FontSize
                      ? {
                          fontSize: `clamp(${Math.max(20, Math.round(hero2FontSize * 0.5))}px, 5vw, ${hero2FontSize}px)`,
                        }
                      : undefined
                  }
                  className={cn(
                    "w-full leading-[120%] text-black dark:text-white transition-colors font-normal whitespace-pre-wrap break-words",
                    !hero2FontSize && "text-xl sm:text-2xl md:text-3xl lg:text-[38px] xl:text-[48px]",
                    hero2Image ? "text-center lg:text-right" : "text-center",
                    getHeroFontClass(hero2Font)
                  )}
                >
                  {hero2Text}
                </h1>
              </div>
            </section>
          </React.Fragment>
        );

      case "products":
        return (
          <React.Fragment key="products">
            {/* New Product Title Area */}
            <div className="flex justify-between items-end mt-3">
              <div className="flex flex-col text-left">
                <h2 className={`text-[20px] md:text-[30px] leading-[1.2] text-black dark:text-white transition-colors ${outfit.className} font-[300]`}>
                  Our Menu
                </h2>
                <p className={`text-[10px] md:text-[20px] leading-[20px] md:leading-[25px] font-[300] text-black/80 dark:text-white/80 text-left transition-colors ${outfit.className}`}>
                  Temukan rasa favoritmu,temukan bahagiamu
                </p>
              </div>
              <Link
                href="/our-products"
                className={`text-[16px] md:text-[20px] leading-[20px] md:leading-[25px] font-[300] text-black/80 dark:text-white/80 hover:underline transition-colors ${outfit.className}`}
              >
                see all
              </Link>
            </div>

            {/* Product Cards */}
            <section className="w-full mt-1 md:mt-4">
              {isLoading ? (
                <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="w-full aspect-[3/4] bg-primary/15 animate-pulse transition-colors" />
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className="relative w-full">
                  <Carousel
                    opts={{ align: "start", loop: true }}
                    plugins={[productPlugin.current]}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-2 md:-ml-4 py-2 md:py-4">
                      {products.map((item, idx) => (
                        <CarouselItem key={item.id || idx} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5">
                          <div
                            className="flex flex-col w-full rounded-none overflow-hidden shadow-[0px_4px_4px_rgba(0,0,0,0.25)] border border-primary/10 bg-card transition-colors cursor-pointer group transform-gpu"
                            onClick={() => {
                              const src = item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `https://wnozfcqgcmvxvkxbxgfj.supabase.co/storage/v1/object/public/product-images/${item.image_url}`) : null;
                              setSelectedProduct({ title: item.name, price: `Rp ${Number(item.price).toLocaleString("id-ID")}`, src });
                            }}
                          >
                            <div className="w-full aspect-square bg-primary/15 relative overflow-hidden flex items-center justify-center text-gray-500 text-sm transition-colors">
                              {item.image_url ? (
                                <img
                                  src={item.image_url.startsWith('http') ? item.image_url : `https://wnozfcqgcmvxvkxbxgfj.supabase.co/storage/v1/object/public/product-images/${item.image_url}`}
                                  alt={item.name}
                                  className="w-full h-full object-cover absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                                  loading="lazy"
                                  decoding="async"
                                />
                              ) : (
                                "Produk"
                              )}
                            </div>
                            <div className="h-[60px] lg:h-[80px] w-full flex flex-col justify-center px-1 lg:px-[10px]">
                              <p className={`text-[14px] lg:text-[20px] text-black dark:text-white font-[400] truncate transition-colors ${outfit.className}`}>
                                {item.name}
                              </p>
                              <p className={`text-[14px] lg:text-[24px] text-black dark:text-white font-[800] mt-1 transition-colors ${outfit.className}`}>
                                Rp {Number(item.price).toLocaleString("id-ID")}
                              </p>
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>
              ) : (
                <div className="w-full text-center text-black/70 dark:text-white/70 py-10">Belum ada produk aktif</div>
              )}
            </section>
          </React.Fragment>
        );





      case "divider": {
        const style = block.divider_style || "solid";
        const thickness = block.divider_thickness ?? 2;
        const color = block.divider_color || "default";
        const spacing = block.divider_spacing || "md";

        const spacingClass =
          spacing === "sm" ? "my-3 md:my-4" :
            spacing === "lg" ? "my-8 md:my-12" :
              "my-5 md:my-8";

        let colorBorder = "border-black/30 dark:border-white/20";
        if (color === "primary") colorBorder = "border-primary";
        else if (color === "muted") colorBorder = "border-black/15 dark:border-white/10";

        return (
          <div key={block.id} className={cn("w-full transition-all flex items-center justify-center", spacingClass)}>
            {style === "gradient" ? (
              <div
                className="w-full"
                style={{
                  height: `${thickness}px`,
                  background: color === "primary"
                    ? "linear-gradient(90deg, transparent, #23bc00, transparent)"
                    : "linear-gradient(90deg, transparent, currentColor, transparent)",
                  opacity: 0.7,
                }}
              />
            ) : style === "double" ? (
              <div className="w-full flex flex-col gap-1">
                <div className={cn("w-full border-t", colorBorder)} style={{ borderWidth: `${Math.max(1, Math.floor(thickness / 2))}px` }} />
                <div className={cn("w-full border-t", colorBorder)} style={{ borderWidth: `${Math.max(1, Math.floor(thickness / 2))}px` }} />
              </div>
            ) : (
              <hr
                className={cn(
                  "w-full transition-colors",
                  style === "dashed" ? "border-dashed" : style === "dotted" ? "border-dotted" : "border-solid",
                  colorBorder
                )}
                style={{
                  borderTopWidth: `${thickness}px`,
                  borderBottomWidth: "0px",
                }}
              />
            )}
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="w-[90vw] max-w-sm p-0 overflow-hidden rounded-xl border-none bg-card gap-0">
          {selectedProduct && (
            <>
              <div className="w-full aspect-square bg-primary/15 relative">
                {selectedProduct.src && (
                  <img src={selectedProduct.src} alt={selectedProduct.title} className="absolute inset-0 w-full h-full object-cover" />
                )}
                <div className="absolute inset-x-0 bottom-0 px-5 pt-16 pb-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col gap-0.5">
                  <DialogTitle className={`text-[20px] font-[600] text-white text-left drop-shadow ${outfit.className}`}>
                    {selectedProduct.title}
                  </DialogTitle>
                  <p className={`text-[18px] font-[800] text-white drop-shadow ${outfit.className}`}>{selectedProduct.price}</p>
                </div>
              </div>
              {orderPlatforms.length > 0 && (
                <div className="px-5 py-4 flex flex-col gap-2">
                  <p className={`text-[13px] text-black/70 dark:text-white/70 ${outfit.className}`}>Pesan melalui</p>
                  <div className="flex items-center justify-center gap-3">
                    {orderPlatforms.map((p) => (
                      <a
                        key={p.name}
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Pesan lewat ${p.name}`}
                        className="flex items-center justify-center rounded-lg bg-primary/5 p-2 hover:bg-primary/10 hover:scale-105 transition"
                      >
                        <img src={p.src} alt={p.name} className="w-[44px] h-[44px] object-contain" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </>
          )}
        </DialogContent>
      </Dialog>

      {isLoading && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background">
          <LoadingSpinner text="Loading" />
        </div>
      )}

      <div
        className={cn(
          "w-full min-h-screen bg-background flex flex-col items-center overflow-x-hidden font-sans transition-colors duration-300",
          isLoading && "invisible"
        )}
      >
        {isPreviewMode && (
          <div className="sticky top-0 z-50 w-full bg-amber-500 text-amber-950 px-4 py-2 text-xs md:text-sm font-semibold flex items-center justify-between shadow-md border-b border-amber-600">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping inline-block" />
              <span>Mode Pratinjau Live &mdash; Menampilkan perubahan rancangan secara langsung (real-time).</span>
            </div>
            <button
              onClick={() => window.close()}
              className="px-2.5 py-1 bg-amber-950 text-white text-xs hover:bg-black transition rounded-none font-normal shrink-0 ml-3 cursor-pointer"
            >
              Tutup Pratinjau
            </button>
          </div>
        )}

        <main
          suppressHydrationWarning
          className="w-full max-w-[1440px] px-4 lg:px-[20px] pt-[10px] pb-6 flex flex-col relative z-10"
        >

          {/* Render Home Blocks according to layout and visibility */}
          {homeBlocks
            .filter((block) => !block.hidden)
            .map((block) => renderHomeBlock(block))}

          {/* Footer Social Media */}
          {(() => {
            const hasInstagram = Boolean(extLinks.instagram_link && extLinks.instagram_link.trim() !== "");
            const hasFacebook = Boolean(extLinks.facebook_link && extLinks.facebook_link.trim() !== "");
            const hasTiktok = Boolean(extLinks.tiktok_link && extLinks.tiktok_link.trim() !== "");
            const hasYoutube = Boolean(extLinks.youtube_link && extLinks.youtube_link.trim() !== "");
            const hasWebsite = Boolean(extLinks.website_link && extLinks.website_link.trim() !== "");
            const hasAnySocial = hasInstagram || hasFacebook || hasTiktok || hasYoutube || hasWebsite;

            if (!hasAnySocial) return null;

            return (
              <footer className="w-full mt-10 mb-0 flex flex-col items-center justify-center gap-4">
                <div className="w-full h-px bg-black/20 dark:bg-white/20 mb-2"></div>
                <p className={`text-[14px] md:text-[16px] text-black/70 dark:text-white/70 font-[500] ${outfit.className}`}>
                  Ikuti Kami di Media Sosial
                </p>
                <div className="flex items-center gap-4">
                  {/* Instagram */}
                  {hasInstagram && (
                    <a href={extLinks.instagram_link} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-card-alt border border-primary/20 text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white hover:bg-primary/10 transition-colors" title="Instagram">
                      <AiFillInstagram className="w-5 h-5" />
                    </a>
                  )}
                  {/* Facebook */}
                  {hasFacebook && (
                    <a href={extLinks.facebook_link} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-card-alt border border-primary/20 text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white hover:bg-primary/10 transition-colors" title="Facebook">
                      <FaFacebook className="w-5 h-5" />
                    </a>
                  )}
                  {/* TikTok */}
                  {hasTiktok && (
                    <a href={extLinks.tiktok_link} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-card-alt border border-primary/20 text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white hover:bg-primary/10 transition-colors" title="TikTok">
                      <AiFillTikTok className="w-5 h-5" />
                    </a>
                  )}
                  {/* YouTube */}
                  {hasYoutube && (
                    <a href={extLinks.youtube_link} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-card-alt border border-primary/20 text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white hover:bg-primary/10 transition-colors" title="YouTube">
                      <FaYoutube className="w-5 h-5" />
                    </a>
                  )}
                  {/* Website */}
                  {hasWebsite && (
                    <a href={extLinks.website_link} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-card-alt border border-primary/20 text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white hover:bg-primary/10 transition-colors" title="Website">
                      <BsBrowserChrome className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </footer>
            );
          })()}

        </main>
      </div>

      {/* Pop Up Video Modal 16:9 */}
      {activeVideoModalUrl && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveVideoModalUrl(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-black rounded-[5px] overflow-hidden shadow-2xl border border-white/10 flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#111827] border-b border-white/10 text-white">
              <span className="text-sm sm:text-base font-semibold truncate flex items-center gap-2">
                <Play className="w-4 h-4 text-red-600 fill-red-600" />
                {activeVideoModalTitle}
              </span>
              <button
                type="button"
                onClick={() => setActiveVideoModalUrl(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Tutup Video (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 16:9 Video Container */}
            <div className="relative w-full aspect-[16/9] bg-black">
              {(() => {
                const embedUrl = getEmbedVideoUrl(activeVideoModalUrl);
                const isEmbed = embedUrl?.includes("youtube.com/embed") || embedUrl?.includes("player.vimeo.com");
                if (isEmbed && embedUrl) {
                  return (
                    <iframe
                      src={embedUrl}
                      title={activeVideoModalTitle}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  );
                }
                return (
                  <video
                    src={activeVideoModalUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  >
                    Browser Anda tidak mendukung pemutar video HTML5.
                  </video>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
