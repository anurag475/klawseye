import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { products } from "./products";
type Props = { filter: string; saved: number[]; bagCount: number; onFilter: (value: string) => void; onAdd: (id: number) => void; onSave: (id: number) => void; onSize: (id: number, size: string) => void; onPanel: (panel: string) => void; onNewsletter: (event: FormEvent<HTMLFormElement>) => void; };
export function ReferenceScreen({filter, saved, bagCount, onFilter, onAdd, onSave, onSize, onPanel, onNewsletter}: Props) { return <div className="reference-screen">

<div className="relative overflow-hidden bg-brandBlue text-primary-foreground py-2 border-b-2 border-brandBlue z-50">
<div className="flex whitespace-nowrap animate-marquee font-body font-semibold tracking-normal text-xs uppercase items-center">
<span className="mx-6 flex items-center gap-2">{"✦ PREPAID ORDERS ONLY"}</span>
<span className="mx-6 flex items-center gap-2">{"🇮🇳 PAN-INDIA SHIPPING AVAILABLE"}</span>
<span className="mx-6 flex items-center gap-2">{"✦ HANDMADE WITH LOVE IN DELHI-NCR"}</span>
<span className="mx-6 flex items-center gap-2">{"🎀 100% REUSABLE SALON-GRADE PRESS-ONS"}</span>
<span className="mx-6 flex items-center gap-2">{"✦ DM TO CUSTOMISE & SIZING KIT FREE WITH 2+ SETS"}</span>
<span className="mx-6 flex items-center gap-2">{"✦ PREPAID ORDERS ONLY"}</span>
<span className="mx-6 flex items-center gap-2">{"🇮🇳 PAN-INDIA SHIPPING AVAILABLE"}</span>
<span className="mx-6 flex items-center gap-2">{"✦ HANDMADE WITH LOVE IN DELHI-NCR"}</span>
<span className="mx-6 flex items-center gap-2">{"🎀 100% REUSABLE SALON-GRADE PRESS-ONS"}</span>
<span className="mx-6 flex items-center gap-2">{"✦ DM TO CUSTOMISE & SIZING KIT FREE WITH 2+ SETS"}</span>
</div>
</div>


<header className="sticky top-0 z-40 bg-brandSoftWhite/95 backdrop-blur-md border-b border-brandGingham/60 transition-all duration-300">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="flex items-center justify-between h-20">

<a className="flex items-center gap-3 group" href="#" title="KLAWSEYE Homepage">
<div className="relative transition-transform duration-300 group-hover:scale-105">
<img alt="KLAWSEYE nails & lashes" className="h-16 w-auto object-contain drop-shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZxUaxzmoVW5n506Wm_hIKZCCzvKnh2Qf4si_-zcTfVziYG6YlZTTcTVeJ76EG376HZtQv_EzEzccGKZ-eNBbKlL3VTSadwojyU_kDpiVlqFNHyt--OLCbKS_4iuzt5qhK6U19lUbBJBhDpuPkz-DQ7255EI1PDg-cTMS9u6yE7MYh9heyxEvw71ScLPC6puAwxYg1xLFH4ntR8p1SYNeA4xM5ryz_0ta91XJsc2EerwqUA-SKWRUAGt19BXLxdlr9hr8" />
</div>
</a>

<nav aria-label="Main Navigation" className="hidden md:flex items-center space-x-7">
<a className="font-bold text-sm tracking-normal text-brandBlue hover:text-brandRose transition-colors" href="#shop">{"SHOP KLAWS"}</a>
<a className="font-bold text-sm tracking-normal text-brandBlue hover:text-brandRose transition-colors flex items-center gap-1" href="#custom-studio">{"\n            CUSTOM SETS\n            "}<span className="text-[10px] bg-brandBlush text-brandBlue px-1.5 py-0.5 rounded-full font-bold border border-brandGingham">{"HOT"}</span>
</a>
<a className="font-bold text-sm tracking-normal text-brandBlue hover:text-brandRose transition-colors" href="#services">{"STUDIO SERVICES"}</a>
<a className="font-bold text-sm tracking-normal text-brandBlue hover:text-brandRose transition-colors" href="#editorial">{"LOOKBOOK"}</a>
<a className="font-bold text-sm tracking-normal text-brandBlue hover:text-brandRose transition-colors" href="#klawedgang">{"#KLAWEDGANG"}</a>
<a className="font-bold text-sm tracking-normal text-brandBlue hover:text-brandRose transition-colors" href="#careers">{"JOIN TEAM"}</a>
</nav>

<div className="flex items-center gap-4">

<Button aria-label="Search" className="p-2 text-brandBlue hover:text-brandRose transition-transform hover:scale-110" onClick={() => onPanel("search")} variant="reference" size="reference">
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 6.65a7.5 7.5 0 010 10.7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
</svg>
</Button>

<Button aria-label="Wishlist" className="relative p-2 text-brandBlue hover:text-brandRose transition-transform hover:scale-110" onClick={() => onPanel("wishlist")} variant="reference" size="reference">
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
</svg>
<span className="absolute top-1 right-1 w-2 h-2 bg-brandRose rounded-full animate-ping"></span>
</Button>

<Button className="relative inline-flex items-center gap-2 bg-brandBlue text-primary-foreground font-body font-bold text-sm px-4 py-2 rounded-full border-2 border-brandBlue shadow-sticker hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all" onClick={() => onPanel("bag")} variant="reference" size="reference">
<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
</svg>
<span >{`BAG (${bagCount})`}</span>
</Button>
</div>
</div>
</div>

<div className="h-1.5 w-full bg-gingham-dense border-t border-brandGingham/40"></div>
<nav className="mobile-nav" aria-label="Mobile navigation"><a href="#shop">{"SHOP KLAWS"}</a><a href="#custom-studio">{"CUSTOM SETS"}</a><a href="#services">{"STUDIO SERVICES"}</a><a href="#editorial">{"LOOKBOOK"}</a></nav></header>

<main >

<section className="relative bg-gingham overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b-2 border-brandBlue" data-purpose="hero-editorial">

<div className="absolute top-6 left-8 hidden lg:block rotate-[-12deg] z-10 pointer-events-none">
<span className="inline-block bg-brandBlush text-brandBlue border-2 border-brandBlue px-3 py-1 rounded-full font-handwritten text-lg font-bold shadow-sticker">{"\n          🎀 100% reusable & custom fit ✨\n        "}</span>
</div>
<div className="absolute top-16 right-16 hidden lg:block rotate-[14deg] z-10 pointer-events-none">
<span className="inline-block bg-card text-brandBlue border-2 border-brandBlue px-3.5 py-1.5 rounded-lg font-handwritten text-base font-bold shadow-sticker">{"\n          📍 Delhi-NCR Certified Nail Tech\n        "}</span>
</div>
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

<div className="lg:col-span-6 space-y-6 text-left z-20">
<div className="inline-flex items-center gap-2 bg-card/90 backdrop-blur-sm border-2 border-brandBlue px-4 py-1 rounded-full shadow-sticker">
<span className="w-2.5 h-2.5 rounded-full bg-brandRose animate-pulse"></span>
<span className="font-body font-semibold text-xs tracking-normal uppercase text-brandBlue">{"HANDMADE LUXURY PRESS-ONS & LASHES"}</span>
</div>
<h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-brandBlue leading-[1.08] tracking-normal">{"\n              KLAWS THAT ARE "}<span className="text-brandRose underline decoration-wavy decoration-brandGingham underline-offset-8">{"UNIQUELY"}</span>{" YOURS\n            "}</h1>
<p className="font-body text-lg sm:text-xl text-copy max-w-xl font-normal leading-relaxed">{"\n              Your vibe. Your vision. Your klaws. Discover salon-quality reusable sets, hand-sculpted 3D art, and custom orders made for every version of you.\n            "}</p>

<div className="flex flex-wrap items-center gap-4 pt-2">
<a className="group relative inline-flex items-center gap-3 bg-brandBlue text-primary-foreground font-body font-bold text-base px-8 py-3.5 rounded-full border-2 border-brandBlue shadow-sticker-lg hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all" href="#shop">
<span >{"SHOP THE KLAWS"}</span>
<span className="transition-transform group-hover:rotate-45">{"✦"}</span>
</a>
<a className="inline-flex items-center gap-2 bg-card text-brandBlue font-body font-bold text-base px-7 py-3.5 rounded-full border-2 border-brandBlue shadow-sticker hover:bg-brandBlush/50 transition-all" href="#custom-studio">
<span >{"DESIGN YOUR OWN"}</span>
<span >{"🎀"}</span>
</a>
</div>

<div className="pt-4 flex items-center gap-6 text-sm text-brandBlue font-medium">
<div className="flex items-center gap-2">
<span className="text-brandRose text-base">{"★"}</span>
<span >{"Prepaid & Pan-India Shipping"}</span>
</div>
<div className="w-1.5 h-1.5 rounded-full bg-brandGingham"></div>
<div className="flex items-center gap-2">
<span className="text-brandRose text-base">{"💅"}</span>
<span >{"Salon Strength • Reusable 5+ times"}</span>
</div>
</div>
</div>

<div className="lg:col-span-6 relative flex justify-center items-center">

<div className="relative w-full max-w-md bg-card p-3.5 rounded-2xl border-4 border-brandBlue shadow-sticker-lg rotate-[-2deg] transition-transform hover:rotate-0 duration-300">

<div className="absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-7 washi-tape-pink z-30 opacity-90"></div>
<div className="relative overflow-hidden rounded-xl aspect-[4/5] bg-brandBlush">
<img alt="High-fashion 3D Chrome Jeweled Press On Nails" className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDehO8ctqqKbOVFHOTCKjUfppQIYHLBmSQVmXcYmcXkWVT7QIBbgNKXhIVYkCvjVZ-L7hkPuP_u4uhSv2tcsR6UXM9PSjKoleolEE5T8KVDjS3Rc21MT3wW6rZk43PjWAhdAprNGWLAzz73j1lHdofkc87MYHWNetB-oKSw4FgL7N5xjeRfz_bLeh_dS3OFHCX461eyi1MQH1FbpfyT0H21PlS0Egt7biVfyhm4wUOBLrOF_LMx4EO2Xw" />
<div className="absolute bottom-3 left-3 bg-brandBlue/90 backdrop-blur-sm text-primary-foreground px-3 py-1 rounded-full text-xs font-bold font-body">{"\n                  ✨ Hand-sculpted Chrome & Gems\n                "}</div>
</div>

<div className="pt-3 pb-1 flex justify-between items-center text-brandBlue">
<div >
<p className="font-display text-sm tracking-normal">{"THE SIREN COLLECTION"}</p>
<p className="font-body text-xs text-muted-foreground">{"Edition No. 04 · Ready to Ship"}</p>
</div>
<span className="bg-brandBlush text-brandBlue font-bold text-xs px-2.5 py-1 rounded-full border border-brandGingham">{"₹2,199"}</span>
</div>
</div>

<div className="absolute -bottom-6 -left-4 sm:-left-6 w-44 sm:w-52 bg-card p-2.5 rounded-xl border-3 border-brandBlue shadow-sticker rotate-[7deg] hover:rotate-3 transition-transform duration-300 z-20">
<div className="w-full aspect-square rounded-lg overflow-hidden bg-brandBlush">
<img alt="Macro Nail Charms and Y2K Bow Details" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlPx3O06S_J4s__7CGvZOdd3pLbFhrei9xivERb-pYvgcneIEn-rzHSyzQmtYoYQ6NdO2_Vq2IWYRTbrBBoycddiJctLSVbMN9hCcNcV7maaPt8wMXKAFji5wqpcIBLNF44i1Er7CIBZFa8rUZVs4hcceY1o53S2qYthQiGjiqzO0W0a7Pdryk_rkwhXWs8XuEWvTgQy786osZ-MO3SHXT--9YDGz76jBYOnYvqivrWMG1ldD_EJ94pA" />
</div>
<p className="font-handwritten text-brandBlue font-bold text-sm text-center pt-2">{"\n                real pearls & bows! 🎀\n              "}</p>
</div>

<div className="absolute -top-6 -right-2 sm:-right-4 w-40 sm:w-44 bg-card p-2 rounded-xl border-3 border-brandBlue shadow-sticker rotate-[9deg] hover:rotate-6 transition-transform duration-300 z-20 hidden sm:block">
<div className="w-full aspect-square rounded-lg overflow-hidden bg-secondary">
<img alt="Gothic Celestial Eye Nail Art" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCy8DiwHHl5iP13Q5d0eU2XKgMmLnT7g1RxUpWgVsScX6O02Qz97sATgih821wBvp2Yl0R9ETs80ipI6FAtK7dfgyfVCShpX2FVnblodFVJQ0Bn2rDFV6J7p8JKLySoAAG6mfv2W56mZDfDdthKBFT3DkvGUN1DdNhqtIiwXb4VW9L0gWqCCuRjpv7TiOfeqcNRfXciwZgmMhfOxsETKL334Wj4eHcYwGYwiVR0odEy1HgEvKN6oRshzQ" />
</div>
<p className="font-handwritten text-brandRose font-bold text-xs text-center pt-1.5">{"\n                custom eye amulets 👁️✨\n              "}</p>
</div>
</div>
</div>
</div>
</section>


<section className="bg-brandBlush border-b-2 border-brandBlue py-3.5 overflow-hidden" data-purpose="marquee-ticker">
<div className="flex whitespace-nowrap animate-marquee font-display text-lg sm:text-xl text-brandBlue tracking-normal uppercase">
<span className="mx-4">{"YOUR NAILS, YOUR RULES ✦"}</span>
<span className="mx-4">{"MADE FOR EVERY VERSION OF YOU ✦"}</span>
<span className="mx-4">{"LITTLE DETAILS, BIG PERSONALITY ✦"}</span>
<span className="mx-4">{"100% REUSABLE PRESS-ONS ✦"}</span>
<span className="mx-4">{"HANDMADE WITH LOVE ✦"}</span>
<span className="mx-4">{"YOUR NAILS, YOUR RULES ✦"}</span>
<span className="mx-4">{"MADE FOR EVERY VERSION OF YOU ✦"}</span>
<span className="mx-4">{"LITTLE DETAILS, BIG PERSONALITY ✦"}</span>
<span className="mx-4">{"100% REUSABLE PRESS-ONS ✦"}</span>
<span className="mx-4">{"HANDMADE WITH LOVE ✦"}</span>
</div>
</section>


<section className="py-20 bg-brandSoftWhite" data-purpose="klawseye-destinations" id="shop">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

<div className="text-center max-w-2xl mx-auto mb-14">
<span className="inline-block bg-brandBlush text-brandBlue font-body font-bold text-xs px-3.5 py-1 rounded-full border border-brandGingham uppercase tracking-normalst mb-3">{"\n            EXPLORE THE UNIVERSE\n          "}</span>
<h2 className="font-display text-3xl sm:text-4xl text-brandBlue tracking-normal">{"\n            ENTER THE KLAWSEYE WORLD\n          "}</h2>
<p className="font-body text-copy mt-3 text-base">{"\n            From ready-to-wear luxury press-on sets to in-studio lash glam and bespoke fantasy nail design.\n          "}</p>
</div>

<div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">

<div className="md:col-span-7 bg-card rounded-3xl p-8 border-3 border-brandBlue shadow-sticker-lg relative overflow-hidden group">
<div className="absolute -right-12 -top-12 w-48 h-48 bg-brandBlush/50 rounded-full blur-2xl pointer-events-none"></div>
<div className="flex flex-col sm:flex-row justify-between items-start gap-6 relative z-10">
<div className="max-w-xs space-y-4">
<span className="inline-block bg-brandRose text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-normal">{"\n                  ⚡ 10-Min Application\n                "}</span>
<h3 className="font-display text-2xl sm:text-3xl text-brandBlue leading-tight">{"\n                  READY-TO-SHIP PRESS-ON SETS\n                "}</h3>
<p className="font-body text-sm text-muted-foreground leading-relaxed">{"\n                  Handcrafted coffin, almond & square sets. Includes complete prep buffer, adhesive tabs, glue, and wood stick.\n                "}</p>
<div className="pt-2">
<a className="inline-flex items-center gap-2 font-body font-bold text-sm text-brandBlue hover:text-brandRose transition-colors group-hover:translate-x-1 duration-200" href="#editorial">
<span >{"EXPLORE READY SETS"}</span>
<span className="text-lg">{"→"}</span>
</a>
</div>
</div>

<div className="relative w-full sm:w-56 h-56 rounded-2xl overflow-hidden border-2 border-brandBlue bg-pink-50 flex-shrink-0">
<img alt="Ready to ship luxury press on nails set" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdmpnZEhUhFd029ypJZ0uho0j3R_imSqMB50GUg8FGpLPKOBRBKvI26u2bavTTCUub1riNSoAGHUKkMRROA9ZxjITqX-uGLGnzOokhn4yADmGCsl3GkQ62xXOPBI8XW0k-pcHkiFb_83WHenjiz7SFu0C_T-L_50P-tO-KJfv3Nw6ZFEEMpVJLDI0dB1dcc6cMK4_ABmZWuEvfebclr9lC3FPBVDgbCzZkhVPNakuyQ5VbfaZQwndnjQ" />
<div className="absolute top-2 right-2 bg-card/95 px-2 py-0.5 rounded-full text-[11px] font-bold text-brandBlue border border-brandBlue">{"\n                  Ready in 24h\n                "}</div>
</div>
</div>
</div>

<div className="md:col-span-5 bg-gingham rounded-3xl p-7 border-3 border-brandBlue shadow-sticker-lg relative flex flex-col justify-between group">
<div className="washi-tape-pink w-24 h-6 absolute -top-3 left-8 rotate-[-3deg]"></div>
<div className="space-y-4 relative z-10">
<span className="inline-block bg-card text-brandBlue border border-brandBlue text-xs font-bold px-3 py-1 rounded-full uppercase">{"\n                📌 Send us Pinterest Pins\n              "}</span>
<h3 className="font-display text-2xl text-brandBlue leading-tight">{"\n                CUSTOM NAIL STUDIO\n              "}</h3>
<p className="font-body text-sm text-copy leading-relaxed">{"\n                Have a dream set saved? We custom sculpt your exact sizing, shape, charms, and 3D textures.\n              "}</p>
</div>
<div className="mt-6 pt-4 border-t border-brandGingham flex items-center justify-between">
<span className="font-handwritten text-base font-bold text-brandRose">{"Your size, 100% bespoke ✨"}</span>
<a className="bg-brandBlue text-primary-foreground px-4 py-2 rounded-full font-body font-bold text-xs hover:bg-brandRose transition-colors" href="#custom-studio">{"\n                START CUSTOM ORDER\n              "}</a>
</div>
</div>

<div className="md:col-span-5 bg-card rounded-3xl p-7 border-3 border-brandBlue shadow-sticker-lg relative flex flex-col justify-between group">
<div className="space-y-4">
<span className="inline-block bg-studio text-brandBlue border border-brandBlue/30 text-xs font-bold px-3 py-1 rounded-full uppercase">{"\n                📍 Delhi-NCR In-Studio\n              "}</span>
<h3 className="font-display text-2xl text-brandBlue leading-tight">{"\n                STUDIO NAILS & LASHES\n              "}</h3>
<p className="font-body text-sm text-muted-foreground leading-relaxed">{"\n                Russian manicure, hard gel sculpted extensions, wispy anime lash extensions, and custom press-on fitting dates.\n              "}</p>
</div>
<div className="mt-6 flex items-center gap-3">
<div className="flex -space-x-2">
<span className="w-8 h-8 rounded-full bg-brandBlush border-2 border-white flex items-center justify-center text-xs">{"💅"}</span>
<span className="w-8 h-8 rounded-full bg-pink-200 border-2 border-white flex items-center justify-center text-xs">{"👁️"}</span>
<span className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs">{"✨"}</span>
</div>
<a className="inline-flex items-center gap-1 font-body font-bold text-sm text-brandBlue hover:text-brandRose ml-auto" href="#services">
<span >{"BOOK APPOINTMENT"}</span>
<span >{"→"}</span>
</a>
</div>
</div>

<div className="md:col-span-7 bg-secondary rounded-3xl p-8 border-3 border-brandBlue shadow-sticker-lg relative overflow-hidden group">
<div className="flex flex-col sm:flex-row items-center justify-between gap-6">
<div className="space-y-4">
<span className="inline-block bg-brandBlue text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase">{"\n                  💖 3,400+ Nail Lovers\n                "}</span>
<h3 className="font-display text-2xl sm:text-3xl text-brandBlue leading-tight">{"\n                  JOIN THE #KLAWEDGANG\n                "}</h3>
<p className="font-body text-sm text-muted-foreground max-w-sm">{"\n                  Tag @klawseye on Instagram for monthly free nail set giveaways, sneak drop peeks, and viral nail inspo reels.\n                "}</p>
<a className="inline-block bg-card text-brandBlue border-2 border-brandBlue px-5 py-2.5 rounded-full font-body font-bold text-sm shadow-sticker hover:translate-x-0.5 hover:translate-y-0.5 transition-all" href="#klawedgang">{"\n                  SEE GANG LOOKS 📸\n                "}</a>
</div>

<div className="relative w-40 h-40 flex-shrink-0">
<div className="w-28 h-28 bg-card p-1.5 rounded-lg border-2 border-brandBlue shadow-sticker rotate-[-8deg] absolute top-0 left-0">
<img alt="Customer Selfie" className="w-full h-full object-cover rounded" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6v7yGpHbUGbK-FbGrVV6JStKo6rBGpl7nJhJyqH1zlflh81s5V6lfWjSkCVr_pevVbNhWQA_Xmken2pQXxdzadvFACcXbUWolQBnZRHasG7Wat8sPXQTN9RcN2b3jG0hqLRLHdTOJvdpp2Eqhto4PIb0OC7CePxhKgXVMxeXcwPY-6iy2V2LA19pc8z-DJC0fC4dYKSzqirwjNpj1gotSnAmXql4zMmC952wOHymmzNOn_cJjILx0Fg" />
</div>
<div className="w-28 h-28 bg-card p-1.5 rounded-lg border-2 border-brandBlue shadow-sticker rotate-[10deg] absolute bottom-0 right-0">
<img alt="Customer Hands Nail Art" className="w-full h-full object-cover rounded" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlEOu2oIg5rwfTLM7ysNuTcln5qKjv0GMCCoUTV_ZPiXPGIdia4ylUW2UbgcCmailHBMk7jjrgs6mljGADxLSl6ulV1Du2mrs9n1lG7z2T142hkgXhN4ZtZtvdHcU0hOixyHy0zqgAyMJri5Qm8ysiIhxCiroOWhrHUABYTt-oDF8JL1GuyniD2sq0YpCdsUdOAfxzVTG_UXEL29DJqQHhqPTdL5NyFL8zECz2Znf9g5JhrNI5wnIF7A" />
</div>
</div>
</div>
</div>
</div>
</div>
</section>


<section className="py-20 bg-gingham border-y-2 border-brandBlue" data-purpose="editorial-gallery" id="editorial">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
<div >
<div className="inline-flex items-center gap-1.5 text-brandRose font-body font-bold text-xs uppercase tracking-normalst mb-2">
<span >{"✦"}</span>{" CURRENT RUNWAY INSPIRATION "}<span >{"✦"}</span>
</div>
<h2 className="font-display text-3xl sm:text-5xl text-brandBlue tracking-normal">{"\n              NAIL ART WITH AN ATTITUDE.\n            "}</h2>
</div>

<div className="flex flex-wrap gap-2">
<Button className={filter === "ALL SETS" ? "filter-button filter-active" : "filter-button"} onClick={() => onFilter("ALL SETS")} variant="reference" size="reference">{"ALL SETS"}</Button>
<Button className={filter === "3D CHROME" ? "filter-button filter-active" : "filter-button"} onClick={() => onFilter("3D CHROME")} variant="reference" size="reference">{"3D CHROME"}</Button>
<Button className={filter === "COQUETTE BOWS" ? "filter-button filter-active" : "filter-button"} onClick={() => onFilter("COQUETTE BOWS")} variant="reference" size="reference">{"COQUETTE BOWS"}</Button>
<Button className={filter === "CYBER GOTHIC" ? "filter-button filter-active" : "filter-button"} onClick={() => onFilter("CYBER GOTHIC")} variant="reference" size="reference">{"CYBER GOTHIC"}</Button>
</div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 items-start">

<div className="lg:col-span-5 bg-card p-4 rounded-3xl border-3 border-brandBlue shadow-sticker-lg collection-product" data-product-card="0" hidden={filter !== "ALL SETS" && filter !== products[0]?.category}>
<div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-brandBlush mb-4 group">
<img alt="Liquid Chrome Siren Nails" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDb2PnilTaEeFKccfwKkFAviVCFz2jrPvQVORaFQ6qP-R6xiaocfoeVvDk0hQH2ljfyifj8VXTUqS6YZxC7aBEO50beiyhuJp3RbHUAKezj9xrZOmZxowzgQZ4yT2LizLPOFCGrV4tf317bVEjXnqnnkVskhKoue03KYGhG3CjFbLbbBqykBwh4fmYfBWaJHQaaUNFo-OTRFGtUABlQIciF5xRq_HEgY8tFsXD_vpNSWBJoXWO-UcXDOQ" />
<span className="absolute top-3 left-3 bg-card/95 text-brandBlue text-[11px] font-bold px-3 py-1 rounded-full border border-brandBlue">{"\n                BESTSELLER\n              "}</span>
</div>
<div className="flex justify-between items-start">
<div >
<h4 className="font-display text-lg text-brandBlue">{"LIQUID CHROME SIREN"}</h4>
<p className="font-body text-xs text-muted-foreground">{"3D silver droplets, molten chrome accents"}</p>
</div>
<span className="font-body font-bold text-base text-brandBlue bg-brandBlush px-3 py-1 rounded-full">{"₹2,199"}</span>
</div>
<Button className="mt-4 w-full bg-brandBlue text-primary-foreground font-bold text-xs py-3 rounded-full hover:bg-brandRose transition-colors" data-product="0" onClick={() => onAdd(0)} variant="reference" size="reference">{"\n              ADD TO BAG 🛍️\n            "}</Button>
<Button variant="reference" size="reference" className="product-heart" aria-label={`Save LIQUID CHROME SIREN`} onClick={() => onSave(0)}>{saved.includes(0) ? "♥" : "♡"}</Button></div>

<div className="lg:col-span-4 bg-card p-4 rounded-3xl border-3 border-brandBlue shadow-sticker rotate-[1deg] hover:rotate-0 transition-transform collection-product" data-product-card="1" hidden={filter !== "ALL SETS" && filter !== products[1]?.category}>
<div className="relative rounded-2xl overflow-hidden aspect-square bg-pink-50 mb-4 group">
<img alt="Strawberry Milk Tartan" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZVl0gbApkWsj3BHy2Je9d_pV_KSRs90Q6fgkyKE8lB2gO9HONHHJypzk_t8hZzSf_GtPNOu8EjSzSuFIy67miKJyAkCBbSHdMCh1dwTH70BO-iNVZWanH2Mh25ikFaXRG2GRd2yFoXmDSgdCefOCZwDJ6MeTWQZ9JBbr2lQ8tVzwwWaJFxop57hFj90yESHfJ3NYoWX89VHfAKG2sovt_iyBpeiwA-dx0kBX837UgldLo4CkEfcNViA" />
<span className="absolute bottom-3 left-3 bg-brandBlush text-brandBlue text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-brandBlue">{"\n                🎀 Hand-drawn Plaid\n              "}</span>
</div>
<div className="flex justify-between items-start">
<div >
<h4 className="font-display text-base text-brandBlue">{"STRAWBERRY MILK TARTAN"}</h4>
<p className="font-body text-xs text-muted-foreground">{"Blush gingham with hand-sculpted pearl bows"}</p>
</div>
<span className="font-body font-bold text-sm text-brandBlue">{"₹1,899"}</span>
</div>
<Button className="mt-4 w-full bg-brandSoftWhite text-brandBlue border-2 border-brandBlue font-bold text-xs py-2.5 rounded-full hover:bg-brandBlush transition-colors" data-product="1" onClick={() => onAdd(1)} variant="reference" size="reference">{"\n              ADD TO BAG\n            "}</Button>
<Button variant="reference" size="reference" className="product-heart" aria-label={`Save STRAWBERRY MILK TARTAN`} onClick={() => onSave(1)}>{saved.includes(1) ? "♥" : "♡"}</Button></div>

<div className="lg:col-span-3 bg-card p-4 rounded-3xl border-3 border-brandBlue shadow-sticker rotate-[-1.5deg] hover:rotate-0 transition-transform collection-product" data-product-card="2" hidden={filter !== "ALL SETS" && filter !== products[2]?.category}>
<div className="relative rounded-2xl overflow-hidden aspect-square bg-blue-50 mb-4 group">
<img alt="Gothic Celestial Eye" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-4U75usVPJcyGozt6wSzdPkwB42jycBkloAbeekYfB5XohbBq5svfDVs4uez1PEQFyNOEfLjM79O5Xl2r5K3iaKPZZvS5x0MmQZYXg-ZWWvY5h3sRi6WtjmfebmO4-tFHBGmpcL0lojxCc3ZnTBGH3FiPhk4N0dSoFyghRXEN8yuwk0o7Eue0DFY9lY510pfBl-Wknohlpt7O_KxUz_6EhXcTQ91CSO-2fTFLe2Jl-IDjsNu2I7-EYQ" />
<span className="absolute top-3 right-3 bg-brandBlue text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">{"\n                👁️ Signature Art\n              "}</span>
</div>
<div className="flex justify-between items-start">
<div >
<h4 className="font-display text-sm text-brandBlue">{"GOTHIC CELESTIAL EYE"}</h4>
<p className="font-body text-[11px] text-muted-foreground">{"Gold wire wrapped amulets"}</p>
</div>
<span className="font-body font-bold text-xs text-brandBlue">{"₹2,499"}</span>
</div>
<Button className="mt-4 w-full bg-brandSoftWhite text-brandBlue border-2 border-brandBlue font-bold text-xs py-2.5 rounded-full hover:bg-brandBlush transition-colors" data-product="2" onClick={() => onAdd(2)} variant="reference" size="reference">{"\n              ADD TO BAG\n            "}</Button>
<Button variant="reference" size="reference" className="product-heart" aria-label={`Save GOTHIC CELESTIAL EYE`} onClick={() => onSave(2)}>{saved.includes(2) ? "♥" : "♡"}</Button></div>

<div className="lg:col-span-6 bg-card p-4 rounded-3xl border-3 border-brandBlue shadow-sticker">
<div className="flex flex-col sm:flex-row gap-4 items-center">
<div className="relative rounded-2xl overflow-hidden w-full sm:w-44 aspect-square bg-teal-50 flex-shrink-0 group">
<img alt="Ocean Glass Mermaid Nails" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBd4AHn9HS_fWBfjQs5p3WOzxN-PKrUfPS-wJNbtLYOVo52bgfTGcZEdF4BTsfM_blI6ATDXLXc-vUsx2AXun9aukoazqK3ql034XwqG51npOTVqqG-AmOAlLr-NDKqgjHXRP-OduGsJdUwikrQ9zdo_xMG7amxzIsoaB8ZWWibUWiDaYTLXFU3laPEyWRqxL04dsTpX4uqkX9i29vGkefz9dIsn1K8g86OMEGwwuXlYNb_PqDNSgFMw" />
</div>
<div className="space-y-2 w-full collection-product" data-product-card="3" hidden={filter !== "ALL SETS" && filter !== products[3]?.category}>
<span className="inline-block bg-teal-50 text-teal-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-teal-200">{"\n                  Sea Glass Aurora\n                "}</span>
<h4 className="font-display text-lg text-brandBlue">{"OCEAN GLASS MERMAID"}</h4>
<p className="font-body text-xs text-gray-600">{"Turquoise stones, liquid gold cages, opalescent chrome base."}</p>
<div className="flex items-center justify-between pt-2">
<span className="font-body font-bold text-base text-brandBlue">{"₹2,299"}</span>
<Button className="bg-brandBlue text-primary-foreground font-bold text-xs px-4 py-2 rounded-full hover:bg-brandRose transition-colors" data-product="3" onClick={() => onAdd(3)} variant="reference" size="reference">{"\n                    ADD TO BAG\n                  "}</Button>
</div>
<Button variant="reference" size="reference" className="product-heart" aria-label={`Save OCEAN GLASS MERMAID`} onClick={() => onSave(3)}>{saved.includes(3) ? "♥" : "♡"}</Button></div>
</div>
</div>

<div className="lg:col-span-6 bg-card p-4 rounded-3xl border-3 border-brandBlue shadow-sticker">
<div className="flex flex-col sm:flex-row gap-4 items-center">
<div className="relative rounded-2xl overflow-hidden w-full sm:w-44 aspect-square bg-neutral-100 flex-shrink-0 group">
<img alt="Cyber Punkette Nails" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBf1mZY5CSwl8r3aKEbvf9dyyVOpanSETWomkWeA5T63NBRjmsbCZcy9QtrFfDY88G5BUZdSUbZVRoOI4Rn5Hp1n1InBY4qaaCM6q6yIxyT3TJBpg1SXpsHU54D8IFcjU_z1hUpubtmV-GBBzAvw9jIftTQplDhQRarMuqKdqU8CJjypqePoAEiJ-bAZ29kJiBF3SGKmVU1oZoCsplAM7kWwrKg7N5J5BtX5XFO-zhxuWqslvc1yZ65HA" />
</div>
<div className="space-y-2 w-full collection-product" data-product-card="4" hidden={filter !== "ALL SETS" && filter !== products[4]?.category}>
<span className="inline-block bg-secondary text-brandRose text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-rose-200">{"\n                  Bloody Spikes & Crosses\n                "}</span>
<h4 className="font-display text-lg text-brandBlue">{"CYBER PUNKETTE"}</h4>
<p className="font-body text-xs text-gray-600">{"Black French tip gradient with 3D sculpted thorn bands & crimson aura."}</p>
<div className="flex items-center justify-between pt-2">
<span className="font-body font-bold text-base text-brandBlue">{"₹1,999"}</span>
<Button className="bg-brandBlue text-primary-foreground font-bold text-xs px-4 py-2 rounded-full hover:bg-brandRose transition-colors" data-product="4" onClick={() => onAdd(4)} variant="reference" size="reference">{"\n                    ADD TO BAG\n                  "}</Button>
</div>
<Button variant="reference" size="reference" className="product-heart" aria-label={`Save CYBER PUNKETTE`} onClick={() => onSave(4)}>{saved.includes(4) ? "♥" : "♡"}</Button></div>
</div>
</div>
</div>
<div className="text-center mt-12">
<a className="inline-flex items-center gap-2 bg-brandBlue text-primary-foreground font-body font-bold text-sm px-8 py-3.5 rounded-full border-2 border-brandBlue shadow-sticker hover:bg-brandRose transition-all" href="#ready-sets">
<span >{"EXPLORE ALL 40+ HANDMADE DESIGNS"}</span>
<span >{"→"}</span>
</a>
</div>
</div>
</section>


<section className="py-20 bg-brandSoftWhite relative overflow-hidden" data-purpose="custom-order-flow" id="custom-studio">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

<div className="lg:col-span-5 relative order-2 lg:order-1">
<div className="bg-card p-6 rounded-3xl border-3 border-brandBlue shadow-sticker-lg rotate-[-1deg]">
<div className="washi-tape-pink w-28 h-6 absolute -top-3 left-10"></div>
<div className="flex items-center justify-between border-b pb-3 mb-4">
<span className="font-display text-sm text-brandBlue">{"CUSTOM MOODBOARD KIT"}</span>
<span className="font-handwritten text-xs font-bold text-brandRose">{"Step-by-step guide"}</span>
</div>

<div className="space-y-4">
<div className="flex items-start gap-4 p-3 bg-pink-50/60 rounded-xl border border-brandGingham/40">
<div className="w-8 h-8 rounded-full bg-brandBlue text-primary-foreground font-bold flex items-center justify-center text-sm flex-shrink-0">{"\n                    1\n                  "}</div>
<div >
<h5 className="font-bold text-sm text-brandBlue">{"Snap or Save Your Inspo"}</h5>
<p className="text-xs text-gray-600">{"Send us screenshots from Pinterest, TikTok, or our Instagram feed."}</p>
</div>
</div>
<div className="flex items-start gap-4 p-3 bg-pink-50/60 rounded-xl border border-brandGingham/40">
<div className="w-8 h-8 rounded-full bg-brandBlue text-primary-foreground font-bold flex items-center justify-center text-sm flex-shrink-0">{"\n                    2\n                  "}</div>
<div >
<h5 className="font-bold text-sm text-brandBlue">{"Measure With Sizing Coin"}</h5>
<p className="text-xs text-gray-600">{"Place a 5-rupee coin next to your bare hand or order our ₹149 sizing kit."}</p>
</div>
</div>
<div className="flex items-start gap-4 p-3 bg-pink-50/60 rounded-xl border border-brandGingham/40">
<div className="w-8 h-8 rounded-full bg-brandBlue text-primary-foreground font-bold flex items-center justify-center text-sm flex-shrink-0">{"\n                    3\n                  "}</div>
<div >
<h5 className="font-bold text-sm text-brandBlue">{"Pick Shape & Length"}</h5>
<div className="flex gap-2 mt-2">
<span className="text-[10px] bg-card border border-brandBlue px-2 py-0.5 rounded font-medium">{"Almond"}</span>
<span className="text-[10px] bg-card border border-brandBlue px-2 py-0.5 rounded font-medium">{"Coffin"}</span>
<span className="text-[10px] bg-card border border-brandBlue px-2 py-0.5 rounded font-medium">{"Square"}</span>
<span className="text-[10px] bg-card border border-brandBlue px-2 py-0.5 rounded font-medium">{"Stiletto"}</span>
</div>
</div>
</div>
<div className="flex items-start gap-4 p-3 bg-pink-50/60 rounded-xl border border-brandGingham/40">
<div className="w-8 h-8 rounded-full bg-brandBlue text-primary-foreground font-bold flex items-center justify-center text-sm flex-shrink-0">{"\n                    4\n                  "}</div>
<div >
<h5 className="font-bold text-sm text-brandBlue">{"Handmade & Shipped Pan-India"}</h5>
<p className="text-xs text-gray-600">{"Crafted with certified UV gel formulas and dispatched in 3–5 working days."}</p>
</div>
</div>
</div>

<div className="mt-4 pt-3 border-t text-center">
<span className="font-handwritten text-sm text-brandBlue font-bold">{"\n                  ✨ \"No generic factory molds. Ever.\" ✨\n                "}</span>
</div>
</div>
</div>

<div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
<span className="inline-block bg-brandBlush text-brandBlue font-body font-bold text-xs px-3.5 py-1 rounded-full border border-brandGingham uppercase tracking-normalst">{"\n              BESPOKE NAIL ARCHITECTURE\n            "}</span>
<h2 className="font-display text-3xl sm:text-5xl text-brandBlue leading-tight tracking-normal">{"\n              YOUR VISION. YOUR KLAWS.\n            "}</h2>
<p className="font-body text-lg text-copy leading-relaxed">{"\n              Saved an intricate look that no standard store sells? Whether it's metallic cyber charms, delicate cottagecore cherries, or gothic blood tears, we bring your wildest hand concepts into wearable art.\n            "}</p>
<div className="grid grid-cols-2 gap-4 pt-2">
<div className="bg-card p-4 rounded-2xl border-2 border-brandBlue shadow-sticker">
<span className="text-2xl">{"📏"}</span>
<h4 className="font-display text-sm text-brandBlue mt-2">{"PERFECT 1:1 FIT"}</h4>
<p className="font-body text-xs text-muted-foreground mt-1">{"Guaranteed fit from thumb to pinky with millimeter precision."}</p>
</div>
<div className="bg-card p-4 rounded-2xl border-2 border-brandBlue shadow-sticker">
<span className="text-2xl">{"✨"}</span>
<h4 className="font-display text-sm text-brandBlue mt-2">{"DURABLE BUILD"}</h4>
<p className="font-body text-xs text-muted-foreground mt-1">{"Layered salon builder gel that resists chipping and snaps."}</p>
</div>
</div>
<div className="pt-4 flex flex-wrap items-center gap-4">
<a className="inline-flex items-center gap-2 bg-brandBlue text-primary-foreground font-body font-bold text-sm px-8 py-3.5 rounded-full border-2 border-brandBlue shadow-sticker hover:bg-brandRose transition-all" href="https://www.instagram.com/klawseye/" rel="noopener noreferrer" target="_blank">
<span >{"DM TO CUSTOMISE ON INSTAGRAM"}</span>
<span >{"💬"}</span>
</a>
<span className="text-xs text-muted-foreground font-medium">{"Or email your inspo images to orders@klawseye.com"}</span>
</div>
</div>
</div>
</div>
</section>


<section className="relative py-24 bg-brandBlush border-y-2 border-brandBlue overflow-hidden text-center" data-purpose="manifesto">

<div className="absolute inset-0 bg-gingham-dense opacity-40"></div>

<div className="absolute top-8 left-12 hidden md:block animate-float-slow text-4xl">{"💅"}</div>
<div className="absolute bottom-8 right-12 hidden md:block animate-float-slow text-4xl float-delayed">{"🎀"}</div>
<div className="absolute top-1/2 left-1/4 hidden lg:block animate-wiggle text-2xl">{"✨"}</div>
<div className="absolute top-1/3 right-1/4 hidden lg:block animate-wiggle text-3xl">{"🌸"}</div>
<div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
<span className="inline-block bg-card text-brandBlue border-2 border-brandBlue font-handwritten text-base font-bold px-4 py-1.5 rounded-full shadow-sticker rotate-[-2deg]">{"\n          Our Manifesto 💖\n        "}</span>
<h2 className="font-display text-3xl sm:text-5xl lg:text-6xl text-brandBlue leading-tight tracking-normal uppercase">{"\n          MADE FOR EVERY VERSION OF YOU.\n        "}</h2>
<p className="font-body text-lg sm:text-2xl text-brandBlue font-medium max-w-2xl mx-auto leading-relaxed">{"\n          Cute, bold, minimal, extra, soft, or unapologetic. Your style has no single definition, and neither should your nails.\n        "}</p>
<div className="pt-4">
<div className="inline-flex items-center gap-3 bg-card/90 backdrop-blur-sm border-2 border-brandBlue px-6 py-2.5 rounded-full shadow-sticker">
<span className="text-brandRose font-bold font-display text-sm">{"#KLAWSEYE"}</span>
<span className="text-gray-400">{"·"}</span>
<span className="font-body text-xs font-semibold text-brandBlue tracking-normal">{"WEARABLE ATTITUDE FOR YOUR FINGERTIPS"}</span>
</div>
</div>
</div>
</section>


<section className="py-20 bg-brandSoftWhite" data-purpose="current-obsession-products" id="ready-sets">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="text-center max-w-xl mx-auto mb-14">
<span className="inline-block bg-brandBlush text-brandBlue font-body font-bold text-xs px-3.5 py-1 rounded-full border border-brandGingham uppercase tracking-normalst mb-3">{"\n            FRESH DROP\n          "}</span>
<h2 className="font-display text-3xl sm:text-4xl text-brandBlue tracking-normal">{"\n            THE CURRENT OBSESSION\n          "}</h2>
<p className="font-body text-copy mt-2 text-sm">{"\n            Hand-poured weekly limited editions. When they sell out, they're archived.\n          "}</p>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

<div className="bg-card rounded-3xl p-4 border-3 border-brandBlue shadow-sticker hover:-translate-y-1 transition-transform group" data-product-card="5">
<div className="relative aspect-square rounded-2xl overflow-hidden bg-pink-50 mb-4">
<img alt="Cherub Tears Press On Set" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUOmBKX6vGPEOuKgA6VA92oFYfQ8yGu-qxLXFde2RuBj50guMY9oms2qAK0Dey-eZkZkpMAnEt4HWexLc8WQWN7-Y-U4jLqWpnFb-DkKAMkEvIM2KtwlNtogLiOpNuIQn-rTZgkCCj1MeEP0l_ep9z0nz5YWyr2VaB2IjBUtbbB0h2rwfbdZ1w3fDl0QlJusMqoXuS5YgjEoEwgImoSuBaWgkzwCB_7WAZOJTWfDqQlEk8A_wNUFg_Vg" />
<span className="absolute top-3 left-3 bg-card text-brandBlue text-[11px] font-bold px-2.5 py-1 rounded-full border border-brandBlue shadow-sm">{"\n                🎀 Pearl Drop\n              "}</span>
</div>
<div className="flex justify-between items-start mb-2">
<h4 className="font-display text-base text-brandBlue">{"CHERUB TEARS"}</h4>
<span className="font-body font-bold text-sm text-brandBlue">{"₹1,699"}</span>
</div>
<p className="text-xs text-muted-foreground mb-4">{"Soft blush pink aura gradient with iridescent raindrop pearls."}</p>
<div className="flex items-center gap-2">
<select aria-label="Select Nail Size for Cherub Tears" className="text-xs py-1.5 px-3 rounded-full border-2 border-brandBlue bg-card font-medium focus:ring-0 text-brandBlue" onChange={(event) => onSize(5, event.target.value)}>
<option >{"Size: S (15, 11, 12, 11, 8mm)"}</option>
<option >{"Size: M (16, 12, 13, 12, 9mm)"}</option>
<option >{"Size: L (17, 13, 14, 13, 10mm)"}</option>
<option >{"Custom Sizing"}</option>
</select>
<Button className="flex-1 bg-brandBlue text-primary-foreground font-bold text-xs py-2 rounded-full hover:bg-brandRose transition-colors" data-product="5" onClick={() => onAdd(5)} variant="reference" size="reference">{"\n                SNAG SET\n              "}</Button>
</div>
<Button variant="reference" size="reference" className="product-heart" aria-label={`Save CHERUB TEARS`} onClick={() => onSave(5)}>{saved.includes(5) ? "♥" : "♡"}</Button></div>

<div className="bg-card rounded-3xl p-4 border-3 border-brandBlue shadow-sticker hover:-translate-y-1 transition-transform group" data-product-card="6">
<div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 mb-4">
<img alt="Cyber Chrome Cyberia Set" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0CxVWVLapoTrOZEYgkGDQIojk9TgMYxbX14ffZ72NvspnzxCJzG9T3c1NAlKkXCGw-War5YlcDwHrrbhTkR9xYDdFinw9PUOQHjdrOBJ4S2oIUSgAqZrz7jG6sxtFc_pSM7RoPakjkopXnUdk3SjesxBY0J90hlu6WUL7C-aoPYIg37Vbqz55bmBa4uAVMMF5OkYZ3w6OGSDkSM17PkMA1BnjIVRAu3pnl2PPAJJp6cHvKkI6FKxuJQ" />
<span className="absolute top-3 left-3 bg-brandBlue text-primary-foreground text-[11px] font-bold px-2.5 py-1 rounded-full">{"\n                ⚡ Chrome Spike\n              "}</span>
</div>
<div className="flex justify-between items-start mb-2">
<h4 className="font-display text-base text-brandBlue">{"CYBERIA CHROME"}</h4>
<span className="font-body font-bold text-sm text-brandBlue">{"₹2,299"}</span>
</div>
<p className="text-xs text-muted-foreground mb-4">{"Mirror finish liquid silver chrome with tribal sculpted 3D barbs."}</p>
<div className="flex items-center gap-2">
<select aria-label="Select Nail Size for Cyberia Chrome" className="text-xs py-1.5 px-3 rounded-full border-2 border-brandBlue bg-card font-medium focus:ring-0 text-brandBlue" onChange={(event) => onSize(6, event.target.value)}>
<option >{"Size: M (Standard)"}</option>
<option >{"Size: S"}</option>
<option >{"Size: L"}</option>
<option >{"Custom Sizing"}</option>
</select>
<Button className="flex-1 bg-brandBlue text-primary-foreground font-bold text-xs py-2 rounded-full hover:bg-brandRose transition-colors" data-product="6" onClick={() => onAdd(6)} variant="reference" size="reference">{"\n                SNAG SET\n              "}</Button>
</div>
<Button variant="reference" size="reference" className="product-heart" aria-label={`Save CYBERIA CHROME`} onClick={() => onSave(6)}>{saved.includes(6) ? "♥" : "♡"}</Button></div>

<div className="bg-card rounded-3xl p-4 border-3 border-brandBlue shadow-sticker hover:-translate-y-1 transition-transform group" data-product-card="7">
<div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary mb-4">
<img alt="Barbie Gingham Dream" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADqBWZTqNG_4vTwgfUz8PNUFU-Y9DBXeGG9rbwfExV-_JpdhnHKL6shwW7zVzCh6IAchCo-MGwRKPBXulAEbeSLWDsf6JDoiqkAE89-ePanIOzbvRPYrrJi4JeKIIVa9WNQSECq7UjOMIG-B90dj85AsbeWG6PwCUsUOdTOv94MBYgHPrkl6q8sZqS2N-pQ9dFbMeh7jjPjYFywqJS9FU1kGX0wdD6aWYeHLJcVrNZ8UT06Gn6zfxCTw" />
<span className="absolute top-3 left-3 bg-brandRose text-primary-foreground text-[11px] font-bold px-2.5 py-1 rounded-full">{"\n                🎀 Signature Check\n              "}</span>
</div>
<div className="flex justify-between items-start mb-2">
<h4 className="font-display text-base text-brandBlue">{"GINGHAM DREAM"}</h4>
<span className="font-body font-bold text-sm text-brandBlue">{"₹1,899"}</span>
</div>
<p className="text-xs text-muted-foreground mb-4">{"Official KLAWSEYE pink check tartan with miniature hand-painted ribbons."}</p>
<div className="flex items-center gap-2">
<select aria-label="Select Nail Size for Gingham Dream" className="text-xs py-1.5 px-3 rounded-full border-2 border-brandBlue bg-card font-medium focus:ring-0 text-brandBlue" onChange={(event) => onSize(7, event.target.value)}>
<option >{"Size: S"}</option>
<option >{"Size: M"}</option>
<option >{"Size: L"}</option>
<option >{"Custom Sizing"}</option>
</select>
<Button className="flex-1 bg-brandBlue text-primary-foreground font-bold text-xs py-2 rounded-full hover:bg-brandRose transition-colors" data-product="7" onClick={() => onAdd(7)} variant="reference" size="reference">{"\n                SNAG SET\n              "}</Button>
</div>
<Button variant="reference" size="reference" className="product-heart" aria-label={`Save GINGHAM DREAM`} onClick={() => onSave(7)}>{saved.includes(7) ? "♥" : "♡"}</Button></div>

<div className="bg-card rounded-3xl p-4 border-3 border-brandBlue shadow-sticker hover:-translate-y-1 transition-transform group" data-product-card="8">
<div className="relative aspect-square rounded-2xl overflow-hidden bg-indigo-50 mb-4">
<img alt="Eye of Klawseye" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2TnTdwCF0n_h11kQGS6eyKIB6_ct-5Kj5wWHJcuv_0V0CXaxd8WYTG4LL1bEyzubOQh1eiS5WUpqwpeZHo7Phjn3cutxqzA7hkK9am98_h0LGdSCpO-qNfBkd9iWEecbezEGcSabPGjUqEvCiEX3AkBi3XFDJzwftaCB71-I1gpclgPBZ2uRW_PK2ufyQtXy3hUvVVgJpp1Pgq4EArgDJR23HWcKC93uAVqP_wwcNqkPRFcm18fxBLg" />
<span className="absolute top-3 left-3 bg-brandBlue text-primary-foreground text-[11px] font-bold px-2.5 py-1 rounded-full">{"\n                👁️ Amulet Core\n              "}</span>
</div>
<div className="flex justify-between items-start mb-2">
<h4 className="font-display text-base text-brandBlue">{"EYE OF KLAWSEYE"}</h4>
<span className="font-body font-bold text-sm text-brandBlue">{"₹2,499"}</span>
</div>
<p className="text-xs text-muted-foreground mb-4">{"Hyper-detailed evil eye glass cabochon with sculpted molten gold wires."}</p>
<div className="flex items-center gap-2">
<select aria-label="Select Nail Size for Eye of Klawseye" className="text-xs py-1.5 px-3 rounded-full border-2 border-brandBlue bg-card font-medium focus:ring-0 text-brandBlue" onChange={(event) => onSize(8, event.target.value)}>
<option >{"Size: M"}</option>
<option >{"Size: S"}</option>
<option >{"Size: L"}</option>
<option >{"Custom Sizing"}</option>
</select>
<Button className="flex-1 bg-brandBlue text-primary-foreground font-bold text-xs py-2 rounded-full hover:bg-brandRose transition-colors" data-product="8" onClick={() => onAdd(8)} variant="reference" size="reference">{"\n                SNAG SET\n              "}</Button>
</div>
<Button variant="reference" size="reference" className="product-heart" aria-label={`Save EYE OF KLAWSEYE`} onClick={() => onSave(8)}>{saved.includes(8) ? "♥" : "♡"}</Button></div>

<div className="bg-card rounded-3xl p-4 border-3 border-brandBlue shadow-sticker hover:-translate-y-1 transition-transform group" data-product-card="9">
<div className="relative aspect-square rounded-2xl overflow-hidden bg-emerald-50 mb-4">
<img alt="Matcha Jelly Drops" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvLg8DMRJ9ln8WUmfrY6UAhTqvwCD8vHa0zC8Y_AOcL7by416jsv-kfqPcSfdLhyzTOVlC5xFFiXEnsmUzykP2MeAtI_DP_fi10SAUO7F37Bq--SvKc06pAJ6whH9OJ_44LJAkkh6gI_kgQn3P-KpBAEwjcr1m9sOMMns_v4Skah75OFzPGJ2F8GuIVi0MHRYcuWsFA57S91O42PaM4iy6VrerUUJzDnADxZu3nz3X254va7j62pSy7g" />
<span className="absolute top-3 left-3 bg-emerald-600 text-primary-foreground text-[11px] font-bold px-2.5 py-1 rounded-full">{"\n                🍵 Translucent 3D\n              "}</span>
</div>
<div className="flex justify-between items-start mb-2">
<h4 className="font-display text-base text-brandBlue">{"MATCHA JELLY DROPS"}</h4>
<span className="font-body font-bold text-sm text-brandBlue">{"₹1,599"}</span>
</div>
<p className="text-xs text-muted-foreground mb-4">{"Glassy syrup jelly finish with sculpted clear water droplet accents."}</p>
<div className="flex items-center gap-2">
<select aria-label="Select Nail Size for Matcha Jelly Drops" className="text-xs py-1.5 px-3 rounded-full border-2 border-brandBlue bg-card font-medium focus:ring-0 text-brandBlue" onChange={(event) => onSize(9, event.target.value)}>
<option >{"Size: S"}</option>
<option >{"Size: M"}</option>
<option >{"Size: L"}</option>
<option >{"Custom Sizing"}</option>
</select>
<Button className="flex-1 bg-brandBlue text-primary-foreground font-bold text-xs py-2 rounded-full hover:bg-brandRose transition-colors" data-product="9" onClick={() => onAdd(9)} variant="reference" size="reference">{"\n                SNAG SET\n              "}</Button>
</div>
<Button variant="reference" size="reference" className="product-heart" aria-label={`Save MATCHA JELLY DROPS`} onClick={() => onSave(9)}>{saved.includes(9) ? "♥" : "♡"}</Button></div>

<div className="bg-card rounded-3xl p-4 border-3 border-brandBlue shadow-sticker hover:-translate-y-1 transition-transform group" data-product-card="10">
<div className="relative aspect-square rounded-2xl overflow-hidden bg-purple-50 mb-4">
<img alt="Midnight Velvet Aura" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhuTioG-MVBzZk2msCzOIeD8t80m4n82nSq6dA9hmYfyXTHp_JdDqmuQ9cU207pZMj4FlsEDIcQS-K4gLHtBHpbPWEfbS4xTcdhqvZiiQcPnyCItpt7NHbQnUb9gyQTaZaSRb0kJnNB-pIIoQs6UCj5LSbbsSKvUhd2xw4kThKEAOgBwdcSkkirP5upPqa01buiteGPeLchrEXInWyirHOUdINozYiWSOL_pdFcwS0UPQIflyr_cOt2Q" />
<span className="absolute top-3 left-3 bg-purple-700 text-primary-foreground text-[11px] font-bold px-2.5 py-1 rounded-full">{"\n                🔮 Velvet Cat-Eye\n              "}</span>
</div>
<div className="flex justify-between items-start mb-2">
<h4 className="font-display text-base text-brandBlue">{"MIDNIGHT VELVET"}</h4>
<span className="font-body font-bold text-sm text-brandBlue">{"₹1,999"}</span>
</div>
<p className="text-xs text-muted-foreground mb-4">{"Magnetic shifting cat-eye aura with embedded Swarovski micro-crystals."}</p>
<div className="flex items-center gap-2">
<select aria-label="Select Nail Size for Midnight Velvet" className="text-xs py-1.5 px-3 rounded-full border-2 border-brandBlue bg-card font-medium focus:ring-0 text-brandBlue" onChange={(event) => onSize(10, event.target.value)}>
<option >{"Size: M"}</option>
<option >{"Size: S"}</option>
<option >{"Size: L"}</option>
<option >{"Custom Sizing"}</option>
</select>
<Button className="flex-1 bg-brandBlue text-primary-foreground font-bold text-xs py-2 rounded-full hover:bg-brandRose transition-colors" data-product="10" onClick={() => onAdd(10)} variant="reference" size="reference">{"\n                SNAG SET\n              "}</Button>
</div>
<Button variant="reference" size="reference" className="product-heart" aria-label={`Save MIDNIGHT VELVET`} onClick={() => onSave(10)}>{saved.includes(10) ? "♥" : "♡"}</Button></div>
</div>
</div>
</section>


<section className="py-20 bg-gingham border-y-2 border-brandBlue" data-purpose="in-studio-services" id="services">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
<div className="lg:col-span-5 space-y-6">
<div className="inline-flex items-center gap-2 bg-card text-brandBlue font-body font-bold text-xs px-3.5 py-1 rounded-full border border-brandBlue shadow-sm">
<span >{"📍 DELHI-NCR STUDIO"}</span>
</div>
<h2 className="font-display text-3xl sm:text-5xl text-brandBlue leading-tight tracking-normal">{"\n              YOUR NAIL DATE STARTS HERE.\n            "}</h2>
<p className="font-body text-copy text-base leading-relaxed">{"\n              Step into our cozy Delhi-NCR private studio. Relax with fresh matcha, customized music, and 1-on-1 artistic nail and lash care tailored specifically to your natural anatomy.\n            "}</p>

<div className="p-4 bg-card rounded-2xl border-2 border-brandBlue shadow-sticker flex items-center justify-between">
<div >
<p className="text-xs text-muted-foreground font-bold uppercase">{"NEXT OPENINGS"}</p>
<p className="font-display text-sm text-brandBlue mt-0.5">{"THIS FRIDAY & SATURDAY"}</p>
</div>
<span className="inline-block bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full border border-green-300">{"\n                4 Slots Left\n              "}</span>
</div>
<div >
<a className="inline-flex items-center gap-2 bg-brandBlue text-primary-foreground font-body font-bold text-sm px-8 py-3.5 rounded-full border-2 border-brandBlue shadow-sticker hover:bg-brandRose transition-all" href="https://www.instagram.com/klawseye/" rel="noopener noreferrer" target="_blank">
<span >{"BOOK AN APPOINTMENT"}</span>
<span >{"📅"}</span>
</a>
</div>
</div>

<div className="lg:col-span-7 bg-card p-6 sm:p-8 rounded-3xl border-3 border-brandBlue shadow-sticker-lg">
<div className="flex justify-between items-center border-b-2 border-brandBlush pb-4 mb-6">
<h3 className="font-display text-xl text-brandBlue">{"DELHI STUDIO MENU"}</h3>
<span className="font-handwritten text-brandRose font-bold text-sm">{"Certified Techs Only ✨"}</span>
</div>
<div className="space-y-4">

<div className="p-4 rounded-2xl bg-brandSoftWhite border border-brandGingham hover:border-brandBlue transition-colors flex justify-between items-center">
<div >
<h4 className="font-bold text-base text-brandBlue">{"Dry Russian Manicure & Builder Gel"}</h4>
<p className="text-xs text-muted-foreground mt-0.5">{"Deep e-file cuticle clean, nail plate architecture & strengthening."}</p>
</div>
<div className="text-right">
<span className="font-bold text-sm text-brandBlue">{"₹1,800"}</span>
<span className="block text-[10px] text-gray-400">{"90 mins"}</span>
</div>
</div>

<div className="p-4 rounded-2xl bg-brandSoftWhite border border-brandGingham hover:border-brandBlue transition-colors flex justify-between items-center">
<div >
<h4 className="font-bold text-base text-brandBlue">{"Full Fantasy Sculpted Extensions"}</h4>
<p className="text-xs text-muted-foreground mt-0.5">{"Hard gel extensions with freestyle 3D chrome, charms, and gems."}</p>
</div>
<div className="text-right">
<span className="font-bold text-sm text-brandBlue">{"₹3,200"}</span>
<span className="block text-[10px] text-gray-400">{"140 mins"}</span>
</div>
</div>

<div className="p-4 rounded-2xl bg-brandSoftWhite border border-brandGingham hover:border-brandBlue transition-colors flex justify-between items-center">
<div >
<h4 className="font-bold text-base text-brandBlue">{"Anime Wispy & Wet Lash Extensions"}</h4>
<p className="text-xs text-muted-foreground mt-0.5">{"Featherlight spikes customized to complement your eye shape."}</p>
</div>
<div className="text-right">
<span className="font-bold text-sm text-brandBlue">{"₹2,400"}</span>
<span className="block text-[10px] text-gray-400">{"120 mins"}</span>
</div>
</div>

<div className="p-4 rounded-2xl bg-brandSoftWhite border border-brandGingham hover:border-brandBlue transition-colors flex justify-between items-center">
<div >
<h4 className="font-bold text-base text-brandBlue">{"Press-On Fitting & Consultation"}</h4>
<p className="text-xs text-muted-foreground mt-0.5">{"Live measurement, cuticle preparation, and take-home adhesive kit."}</p>
</div>
<div className="text-right">
<span className="font-bold text-sm text-brandBlue">{"₹499"}</span>
<span className="block text-[10px] text-gray-400">{"30 mins"}</span>
</div>
</div>
</div>
<p className="text-xs text-gray-400 text-center mt-6">{"\n              Prepaid advance required to hold slot. Exact studio address sent via WhatsApp upon confirmation.\n            "}</p>
</div>
</div>
</div>
</section>


<section className="py-20 bg-brandSoftWhite" data-purpose="community-reviews" id="klawedgang">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="text-center max-w-xl mx-auto mb-14">
<span className="inline-block bg-brandBlush text-brandBlue font-body font-bold text-xs px-3.5 py-1 rounded-full border border-brandGingham uppercase tracking-normalst mb-3">{"\n            REAL CLIENTS · ZERO FILTER\n          "}</span>
<h2 className="font-display text-3xl sm:text-5xl text-brandBlue tracking-normal">{"\n            THE KLAWED GANG\n          "}</h2>
<p className="font-body text-copy mt-2 text-base">{"\n            See how the gang styles their claws in real life. Tag @klawseye to get featured.\n          "}</p>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

<div className="bg-card p-3.5 rounded-2xl border-3 border-brandBlue shadow-sticker rotate-[-1.5deg] hover:rotate-0 transition-all duration-300">
<div className="washi-tape-pink w-20 h-5 absolute -top-2.5 left-1/2 -translate-x-1/2"></div>
<div className="aspect-square rounded-xl overflow-hidden bg-neutral-100 mb-3">
<img alt="Client selfie wearing klawseye nails" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQxZSU57e5j71InVcVde9JnYZTACyQ2fvB3NT5FoAlZBu7tv07BfT_w9o1cphTl-efL1bWs01I2RLHPT37E0m9FO3FZHHzhgoXz7ffBwLCUCMXqz2F3winqdWIMs3XGUGP6_6sEDjcqLcsFopeXjETa5u3XfhFb-YXNJl7xPKXGeoLGEGzxU-kRL63hM5LZXxxP81HfXWmzMQDYKEy3KpVdvxQs9ga72lA0mD9z72gIDInpEgHsydmcg" />
</div>
<div className="space-y-1">
<div className="flex items-center justify-between">
<span className="font-bold text-xs text-brandBlue">{"@ananya_v"}</span>
<span className="text-brandRose text-xs">{"★★★★★"}</span>
</div>
<p className="font-handwritten text-xs text-gray-700 font-semibold leading-relaxed">{"\n                \"Lasted 3 straight weeks without lifting! Survived a music festival with zero loss 🥹\"\n              "}</p>
</div>
</div>

<div className="bg-card p-3.5 rounded-2xl border-3 border-brandBlue shadow-sticker rotate-[1.5deg] hover:rotate-0 transition-all duration-300">
<div className="aspect-square rounded-xl overflow-hidden bg-neutral-100 mb-3">
<img alt="Client showing custom nail set" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAx3oYM7EziVUY_XmvkX_PFz8SlEDEBhSP9On2EyeLxgZiS4jx5qWgB4ZSuAJqRGhWBg5_RfBW41J2e7KcRxjjt8L9t5ohbRI1zwIQiODH0rDdllVog9TE3RFJe0bllLlLX6Be4YGBU6wqkPHMdudAz1o27ehs1vXCB9sy39oUySZSp_qKJM46MStsT5oEqeaGfuIkueHSmMX1fTXZJpA-_wqPByGYYsuJeNpTV5LQmDK-gaPbCaWhhdQ" />
</div>
<div className="space-y-1">
<div className="flex items-center justify-between">
<span className="font-bold text-xs text-brandBlue">{"@tanya.sharma"}</span>
<span className="text-brandRose text-xs">{"★★★★★"}</span>
</div>
<p className="font-handwritten text-xs text-gray-700 font-semibold leading-relaxed">{"\n                \"Got literally 50 compliments on my flight to Goa. Everyone thought they were salon sculpts.\"\n              "}</p>
</div>
</div>

<div className="bg-card p-3.5 rounded-2xl border-3 border-brandBlue shadow-sticker rotate-[-1deg] hover:rotate-0 transition-all duration-300">
<div className="aspect-square rounded-xl overflow-hidden bg-neutral-100 mb-3">
<img alt="Customer wearing eye amulet press ons" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCI6JDCfCPDWqFmIBRRlu7m-TB4N0-9rh7OhSGSOMsMTcC7qkCDXlG6AJQAK1VaM8WgjYMe_zzTCLBsqRAwSXbffZoMQcsn_GnquBIP2_BXNvXl4lKxsCE53Wyrg81wc339xEObBjVv-oaXU_tRXAv8AjGPAMeB-eaptansVcOzB5dkNPv4-ol6brbvSWInbe8sSzEqE_3PBZ6AuUKg92HxWsZG9bsM6EXrO1gFBkq4Dc84n2LWMPOoQ" />
</div>
<div className="space-y-1">
<div className="flex items-center justify-between">
<span className="font-bold text-xs text-brandBlue">{"@zoyaaa.k"}</span>
<span className="text-brandRose text-xs">{"★★★★★"}</span>
</div>
<p className="font-handwritten text-xs text-gray-700 font-semibold leading-relaxed">{"\n                \"The 3D detailing is insane IRL. I can't stop staring at the eyeball charm 👁️💖\"\n              "}</p>
</div>
</div>

<div className="bg-card p-3.5 rounded-2xl border-3 border-brandBlue shadow-sticker rotate-[2deg] hover:rotate-0 transition-all duration-300">
<div className="aspect-square rounded-xl overflow-hidden bg-neutral-100 mb-3">
<img alt="Customer with coquette nails" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5hpvseofIkRafGXQbf40VSqPg40WQtXDg4SiIpDCJeOGGT3j_-iPpk85_HhQu1vAw3ChRrlc8OVVcIMTjgwzJrQPiuk_ZU0WUZWQJz1UPkSAwgKNQQ92cXUzqwx7oCf6Cak1q4AGcihiRvwLMgtPn5CGFl05V6eE44F-hN3FMgw7TTszbcZakFmWHyyVxPHCft2xQHkVVr1c4L1UNKsQlUmKhDn6-y5ARMiqkcT4yFXcVwN7THs0E6w" />
</div>
<div className="space-y-1">
<div className="flex items-center justify-between">
<span className="font-bold text-xs text-brandBlue">{"@ria_mehra"}</span>
<span className="text-brandRose text-xs">{"★★★★★"}</span>
</div>
<p className="font-handwritten text-xs text-gray-700 font-semibold leading-relaxed">{"\n                \"The glue tabs included were so strong. Pop on and ready in 8 minutes!\"\n              "}</p>
</div>
</div>
</div>
<div className="text-center mt-12">
<a className="inline-flex items-center gap-2 bg-brandBlue text-primary-foreground font-body font-bold text-sm px-7 py-3 rounded-full border-2 border-brandBlue shadow-sticker hover:bg-brandRose transition-colors" href="https://www.instagram.com/klawseye/" rel="noopener noreferrer" target="_blank">
<span >{"FOLLOW OUR JOURNEY @KLAWSEYE"}</span>
<span >{"📸"}</span>
</a>
</div>
</div>
</section>


<section className="py-16 bg-gingham border-y-2 border-brandBlue relative" data-purpose="artist-recruitment" id="careers">
<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="bg-card rounded-3xl p-8 sm:p-12 border-4 border-brandBlue shadow-sticker-lg flex flex-col md:flex-row items-center justify-between gap-8">
<div className="space-y-4 max-w-lg text-center md:text-left">
<span className="inline-block bg-brandBlush text-brandBlue text-xs font-bold px-3 py-1 rounded-full border border-brandBlue">{"\n              WE ARE HIRING 👩‍🎨\n            "}</span>
<h3 className="font-display text-3xl sm:text-4xl text-brandBlue leading-tight">{"\n              CREATIVE HANDS WANTED.\n            "}</h3>
<p className="font-body text-copy text-base">{"\n              Love nail art, micro-painting, and turning Pinterest ideas into tiny works of art? Join our Delhi studio team as a freelance press-on designer or in-studio tech.\n            "}</p>
</div>
<div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
<a className="inline-flex justify-center items-center gap-2 bg-brandBlue text-primary-foreground font-body font-bold text-sm px-8 py-4 rounded-full border-2 border-brandBlue shadow-sticker hover:bg-brandRose transition-all" href="mailto:careers@klawseye.com">
<span >{"JOIN OUR TEAM"}</span>
<span >{"→"}</span>
</a>
</div>
</div>
</div>
</section>

</main>

<footer className="bg-brandSoftWhite text-brandDark border-t-2 border-brandBlue pt-16 pb-12" data-purpose="page-footer">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-14 border-b border-brandGingham">

<div className="md:col-span-4 space-y-4">
<a className="inline-block" href="#">
<img alt="KLAWSEYE Logo" className="h-16 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZxUaxzmoVW5n506Wm_hIKZCCzvKnh2Qf4si_-zcTfVziYG6YlZTTcTVeJ76EG376HZtQv_EzEzccGKZ-eNBbKlL3VTSadwojyU_kDpiVlqFNHyt--OLCbKS_4iuzt5qhK6U19lUbBJBhDpuPkz-DQ7255EI1PDg-cTMS9u6yE7MYh9heyxEvw71ScLPC6puAwxYg1xLFH4ntR8p1SYNeA4xM5ryz_0ta91XJsc2EerwqUA-SKWRUAGt19BXLxdlr9hr8" />
</a>
<p className="font-body text-sm text-muted-foreground max-w-sm leading-relaxed">{"\n            Klaws that are uniquely yours. Certified Nail Tech crafting handmade luxury press-on sets, 3D fantasy nails, and wispy lashes in Delhi-NCR with pan-India delivery.\n          "}</p>
<div className="flex items-center gap-3 pt-2">
<a aria-label="Instagram" className="w-9 h-9 rounded-full bg-card border-2 border-brandBlue flex items-center justify-center text-brandBlue hover:bg-brandBlush shadow-sm transition-colors" href="https://www.instagram.com/klawseye/" rel="noopener noreferrer" target="_blank">
<svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
</a>
<a aria-label="Pinterest" className="w-9 h-9 rounded-full bg-card border-2 border-brandBlue flex items-center justify-center text-brandBlue hover:bg-brandBlush shadow-sm transition-colors" href="https://pinterest.com" rel="noopener noreferrer" target="_blank">
<svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.365-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"></path></svg>
</a>
</div>
</div>

<div className="md:col-span-2 space-y-3">
<p className="font-display text-sm text-brandBlue tracking-normal">{"SHOP"}</p>
<ul className="space-y-2 text-sm text-muted-foreground font-medium">
<li ><a className="hover:text-brandRose transition-colors" href="#editorial">{"Press-On Nails"}</a></li>
<li ><a className="hover:text-brandRose transition-colors" href="#custom-studio">{"Sizing Kits (₹149)"}</a></li>
<li ><a className="hover:text-brandRose transition-colors" href="#shop">{"Glue Tabs & Prep Kit"}</a></li>
<li ><a className="hover:text-brandRose transition-colors" href="#editorial">{"Chrome & Y2K Edits"}</a></li>
<li ><a className="hover:text-brandRose transition-colors" href="#editorial">{"Limited Vault Drops"}</a></li>
</ul>
</div>

<div className="md:col-span-3 space-y-3">
<p className="font-display text-sm text-brandBlue tracking-normal">{"STUDIO & POLICIES"}</p>
<ul className="space-y-2 text-sm text-muted-foreground font-medium">
<li ><a className="hover:text-brandRose transition-colors" href="#services">{"Delhi-NCR Studio Booking"}</a></li>
<li ><span className="text-brandRose font-semibold">{"Prepaid Orders Only Policy"}</span></li>
<li ><Button className="hover:text-brandRose transition-colors" onClick={() => onPanel("policies")} variant="reference" size="reference">{"Pan-India Shipping Timelines"}</Button></li>
<li ><a className="hover:text-brandRose transition-colors" href="#custom-studio">{"Measurement & Size Guide"}</a></li>
<li ><Button className="hover:text-brandRose transition-colors" onClick={() => onPanel("policies")} variant="reference" size="reference">{"Hygiene & Non-Refundable Rules"}</Button></li>
</ul>
</div>

<div className="md:col-span-3 space-y-4">
<p className="font-display text-sm text-brandBlue tracking-normal">{"SECRET DROPS 🎀"}</p>
<p className="text-xs text-muted-foreground">{"Be first to access 48-hour vault releases and get 10% off your first handmade order."}</p>
<form className="space-y-2" onSubmit={onNewsletter}>
<input aria-label="Email for Secret Drops" className="w-full text-xs px-3.5 py-2.5 rounded-full border-2 border-brandBlue bg-card focus:outline-none focus:ring-0" placeholder="Enter your email" type="email" required />
<Button className="w-full bg-brandBlue text-primary-foreground font-bold text-xs py-2.5 rounded-full border-2 border-brandBlue shadow-sticker hover:bg-brandRose transition-all" type="submit" variant="reference" size="reference">{"\n              JOIN GANG LIST ✨\n            "}</Button>
</form>
</div>
</div>

<div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
<p >{"© 2026 KLAWSEYE by Tea. All Rights Reserved. Delhi-NCR, India."}</p>
<p className="font-handwritten text-sm text-brandBlue font-bold">{"\n          Designed with attitude for the #KLAWEDGANG 💅✨\n        "}</p>
</div>
</div>
</footer>

</div>; }
