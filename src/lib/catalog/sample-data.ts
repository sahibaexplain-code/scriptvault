/**
 * Sample catalogue used in demo mode and by `npm run seed:sql`.
 * PUBLIC DATA ONLY: titles, metadata and free previews. The paid script
 * bodies live in sample-bodies.ts, which is server-only.
 */
import type { Bundle, Category, Script } from "@/lib/types";

export const CATEGORIES: Category[] = [
  { slug: "what-if", name: "What If", tagline: "Hypotheticals that hook in 5 seconds", palette: ["#8b5cf6", "#1e1065"], motif: "orbit" },
  { slug: "science-psychology", name: "Science & Psychology", tagline: "Why minds and matter behave the way they do", palette: ["#a855f7", "#2e1065"], motif: "brain" },
  { slug: "history", name: "History", tagline: "Empires, turning points, forgotten people", palette: ["#c084fc", "#3b0764"], motif: "column" },
  { slug: "mystery", name: "Mystery", tagline: "Unsolved cases told with restraint", palette: ["#7c3aed", "#0f0a1f"], motif: "eye" },
  { slug: "business-finance", name: "Business & Finance", tagline: "Brand stories and money, explained", palette: ["#6d28d9", "#1a1033"], motif: "chart" },
  { slug: "interesting-facts", name: "Interesting Facts", tagline: "Fast, verified, endlessly shareable", palette: ["#9333ea", "#1f0a3a"], motif: "spark" },
  { slug: "funny-educational", name: "Funny Educational", tagline: "Learn something while laughing", palette: ["#d946ef", "#2a0a33"], motif: "smile" },
  { slug: "documentary", name: "Documentary Storytelling", tagline: "Long-form narrative, cinematic pacing", palette: ["#7e22ce", "#120822"], motif: "film" },
];

const id = (n: number) => `5c1a0000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const bid = (n: number) => `b0d1e000-0000-4000-8000-${String(n).padStart(12, "0")}`;

type SeedScript = Omit<Script, "thumbnailUrl" | "isPublished" | "createdAt"> & { daysAgo: number };

const RAW: SeedScript[] = [
  {
    id: id(1), slug: "what-if-earth-stopped-spinning", category: "what-if",
    title: "What If the Earth Stopped Spinning for One Second?",
    subtitle: "A physics thriller in ten minutes",
    language: "English", format: "YouTube Long-form", durationMinutes: 10, wordCount: 1480,
    priceInr: 499, exclusivePriceInr: 4999, exclusiveAvailable: true,
    description: "The equator moves at roughly 1,670 km/h. Freeze it for one second and everything not bolted to bedrock keeps going. A tightly paced explainer that escalates from coffee cups to oceans, with on-screen cues and B-roll notes for every beat.",
    preview: `## [00:00] HOOK
(VISUAL: slow push-in on a coffee cup on a desk, steam rising)
Right now, while you sit perfectly still, you are moving at about sixteen hundred kilometres an hour. You can't feel it, because everything around you is moving with you. The desk. The air. The coffee.
Now imagine the planet stops. Not slows down. Stops. For one single second.
The ground halts. You don't.

## [00:35] SETUP
(VISUAL: globe with a glowing line along the equator, speed counter ticking)
Earth spins once every twenty-four hours. At the equator that means covering roughly forty thousand kilometres a day. Faster than a passenger jet. Faster than the speed of sound.`,
    tags: ["physics", "earth", "space", "hypothetical"], isFeatured: true, salesCount: 214, rating: 4.9, daysAgo: 12,
  },
  {
    id: id(2), slug: "agar-insaan-kabhi-na-soye", category: "what-if",
    title: "अगर इंसान कभी ना सोए तो?",
    subtitle: "What if humans never slept? (Hindi)",
    language: "Hindi", format: "YouTube Long-form", durationMinutes: 8, wordCount: 1160,
    priceInr: 399, exclusivePriceInr: 3999, exclusiveAvailable: true,
    description: "शुद्ध हिंदी में लिखी एक रोचक स्क्रिप्ट जो नींद के विज्ञान को एक काल्पनिक दुनिया के ज़रिए समझाती है। Pure Hindi narration with visual cues, ideal for faceless science channels.",
    preview: `## [00:00] HOOK
(VISUAL: रात का शहर, सब लाइटें जल रही हैं)
सोचिए, एक ऐसी दुनिया जहाँ रात कभी नहीं होती। कोई बिस्तर नहीं, कोई अलार्म नहीं, कोई सपना नहीं।
चौबीस घंटे काम, चौबीस घंटे जागना।
सुनने में यह किसी सुपरपावर जैसा लगता है। लेकिन क्या सच में ऐसा है?

## [00:30] पहला दिन
(VISUAL: घड़ी की सुइयाँ तेज़ी से घूमती हुई)
पहले चौबीस घंटे में ज़्यादातर लोग ठीक महसूस करेंगे। थोड़ी थकान, थोड़ी चिड़चिड़ाहट। बस इतना ही।`,
    tags: ["sleep", "science", "hindi", "hypothetical"], isFeatured: false, salesCount: 97, rating: 4.7, daysAgo: 30,
  },
  {
    id: id(3), slug: "psychology-of-endless-scrolling", category: "science-psychology",
    title: "The Psychology of Why You Can't Stop Scrolling",
    subtitle: "Variable rewards, explained without the lecture",
    language: "English", format: "YouTube Long-form", durationMinutes: 12, wordCount: 1720,
    priceInr: 599, exclusivePriceInr: 5999, exclusiveAvailable: false,
    description: "From Skinner's pigeons to the pull-to-refresh gesture, this script unpacks variable reward schedules and why feeds feel impossible to put down. Built with a mid-video retention hook and a practical, non-preachy ending.",
    preview: `## [00:00] HOOK
(VISUAL: thumb flicking up a phone screen, sped up)
You opened this app to check one thing. That was twenty minutes ago.
You're not weak. You're not lazy. You're responding exactly the way a very old experiment predicted you would.

## [00:25] THE PIGEON BOX
(VISUAL: archival-style illustration of a pigeon pecking a lever)
In the 1950s, psychologist B. F. Skinner noticed something strange. If a pigeon got food every time it pecked a lever, it pecked steadily. But if food arrived unpredictably, it pecked like it was obsessed.`,
    tags: ["psychology", "social media", "habits", "dopamine"], isFeatured: true, salesCount: 341, rating: 4.9, daysAgo: 45,
  },
  {
    id: id(4), slug: "dimaag-ka-dhokha-cognitive-biases", category: "science-psychology",
    title: "Dimaag Ka Dhokha: 7 Cognitive Biases",
    subtitle: "Seven tricks your brain plays on you daily",
    language: "Hinglish", format: "YouTube Long-form", durationMinutes: 9, wordCount: 1290,
    priceInr: 449, exclusivePriceInr: 4499, exclusiveAvailable: true,
    description: "Anchoring, confirmation bias, sunk cost and four more, explained with everyday Indian examples: sale tags, cricket superstitions, and that gym membership. Conversational Hinglish that sounds natural on camera.",
    preview: `## [00:00] HOOK
(VISUAL: shopping tag "₹4,999 ~~₹1,999~~" zoom)
Aapne kabhi ₹1,999 ki cheez sirf isliye khareedi kyunki uske upar ₹4,999 kata hua tha? Congratulations. Aapka dimaag aapko dhokha de chuka hai.
Aaj hum baat karenge saat aise biases ki jo roz aapke decisions chupke se control karte hain.

## [00:30] BIAS #1: ANCHORING
(VISUAL: ship anchor drops onto a price tag)
Jo pehla number aap dekhte ho, dimaag usko anchor bana leta hai. Uske baad har price usi se compare hota hai.`,
    tags: ["psychology", "biases", "hinglish", "self-improvement"], isFeatured: false, salesCount: 188, rating: 4.8, daysAgo: 20,
  },
  {
    id: id(5), slug: "delhi-1739-nadir-shah", category: "history",
    title: "The Day Delhi Fell: Nadir Shah, 1739",
    subtitle: "How the Peacock Throne left India",
    language: "English", format: "YouTube Long-form", durationMinutes: 14, wordCount: 2010,
    priceInr: 699, exclusivePriceInr: 6999, exclusiveAvailable: true,
    description: "The Battle of Karnal, a rumour in Chandni Chowk, and a single day that emptied the Mughal treasury. A carefully sourced narrative with era-appropriate visual direction and a closing reflection on imperial decline.",
    preview: `## [00:00] COLD OPEN
(VISUAL: candlelit marble hall, a jewelled throne in silhouette)
In the spring of 1739, a Persian king sat on the most famous throne in the world. It wasn't his. Weeks earlier it had belonged to the Mughal emperor of India.
By the time he rode home, he would take it with him, along with a diamond whose name you already know.

## [00:40] KARNAL
(VISUAL: animated map, Persian army moving east through the Khyber)
Nadir Shah had risen from a shepherd's family to the throne of Persia. In February 1739, at Karnal, about a hundred kilometres north of Delhi, his army met the forces of Emperor Muhammad Shah.`,
    tags: ["mughal", "india", "history", "koh-i-noor"], isFeatured: true, salesCount: 156, rating: 4.8, daysAgo: 60,
  },
  {
    id: id(6), slug: "chandragupta-maurya-story", category: "history",
    title: "Chandragupta Maurya: Ek Ladke Se Samrat Tak",
    subtitle: "The making of India's first great empire",
    language: "Hinglish", format: "YouTube Long-form", durationMinutes: 11, wordCount: 1560,
    priceInr: 549, exclusivePriceInr: 5499, exclusiveAvailable: true,
    description: "Chanakya, the Nanda dynasty and the rise of the Mauryas, told as a mentor-and-student story. Clearly separates recorded history from legend, so your channel stays credible.",
    preview: `## [00:00] HOOK
(VISUAL: young boy playing "king" with friends, sepia tone)
Kehte hain ek din Taxila ka ek teacher raste se guzar raha tha. Usne dekha kuch bachche khel rahe the, aur ek ladka raja ban kar faisle suna raha tha.
Woh teacher tha Chanakya. Aur woh ladka, aage chal kar, Bharat ka pehla vishaal samrajya banane wala tha.
Ab yeh kahani kitni sach hai? Chaliye pata karte hain.`,
    tags: ["maurya", "chanakya", "ancient india", "hinglish"], isFeatured: false, salesCount: 132, rating: 4.7, daysAgo: 75,
  },
  {
    id: id(7), slug: "dyatlov-pass-incident", category: "mystery",
    title: "Dyatlov Pass: Nine Hikers, One Tent, No Easy Answers",
    subtitle: "The 1959 case, told responsibly",
    language: "English", format: "Documentary", durationMinutes: 15, wordCount: 2140,
    priceInr: 749, exclusivePriceInr: 7499, exclusiveAvailable: false,
    description: "A slow-burn mystery script that walks through the timeline, the evidence and the leading explanations, including the 2021 slab-avalanche research, without sensationalism. Includes music-cue suggestions.",
    preview: `## [00:00] COLD OPEN
(VISUAL: snow blowing across a dark slope, wind audio only)
February 1959. The northern Ural Mountains. A tent sits half-buried in snow on the slope of a mountain the local Mansi people call Kholat Syakhl.
The tent has been cut open. From the inside.
Nearby, footprints lead downhill. Some are in socks. Some are barefoot. In temperatures far below freezing.

## [00:45] THE GROUP
(VISUAL: black-and-white group photo, slow pan across faces)
There were nine of them, led by a twenty-three-year-old engineering student named Igor Dyatlov. They were experienced hikers.`,
    tags: ["mystery", "unsolved", "russia", "documentary"], isFeatured: true, salesCount: 403, rating: 5.0, daysAgo: 90,
  },
  {
    id: id(8), slug: "roopkund-skeleton-lake", category: "mystery",
    title: "रूपकुंड: कंकालों वाली झील का रहस्य",
    subtitle: "The skeleton lake of Uttarakhand (Hindi)",
    language: "Hindi", format: "YouTube Long-form", durationMinutes: 10, wordCount: 1420,
    priceInr: 499, exclusivePriceInr: 4999, exclusiveAvailable: true,
    description: "हिमालय की ऊँचाई पर बसी रूपकुंड झील और उसके सैकड़ों कंकालों की कहानी, 2019 के DNA अध्ययन तक। A Hindi mystery script that balances folklore with modern science.",
    preview: `## [00:00] HOOK
(VISUAL: बर्फ़ से ढकी एक छोटी झील, धुंध)
उत्तराखंड के हिमालय में, लगभग पाँच हज़ार मीटर की ऊँचाई पर, एक छोटी सी झील है।
गर्मियों में जब बर्फ़ पिघलती है, तो इसके किनारे कुछ ऐसा दिखता है जो किसी को भी डरा दे।
इंसानी कंकाल। एक नहीं, सैकड़ों।

## [00:35] खोज
(VISUAL: पुरानी तस्वीर, 1940 का दशक)
1942 में एक फ़ॉरेस्ट रेंजर ने इन कंकालों को देखा।`,
    tags: ["mystery", "himalaya", "uttarakhand", "hindi"], isFeatured: true, salesCount: 176, rating: 4.9, daysAgo: 15,
  },
  {
    id: id(9), slug: "how-amul-beat-global-giants", category: "business-finance",
    title: "How Amul Beat the Global Giants",
    subtitle: "A cooperative, a cartoon girl and Operation Flood",
    language: "English", format: "YouTube Long-form", durationMinutes: 12, wordCount: 1690,
    priceInr: 649, exclusivePriceInr: 6499, exclusiveAvailable: true,
    description: "From the 1946 farmers' strike in Anand to the Amul girl's topical ads, a brand-strategy story with clear business lessons. Great for business-breakdown channels.",
    preview: `## [00:00] HOOK
(VISUAL: Amul-style hoarding with a topical pun, then cut to a dairy farm)
The biggest food brand in India isn't owned by a billionaire. It isn't owned by a multinational.
It's owned by millions of farmers, many of whom own just a few cows.
This is how a cooperative from a small town in Gujarat out-competed the world.

## [00:30] ANAND, 1946
(VISUAL: archival-style footage of milk cans, village roads)
In the 1940s, dairy farmers in Kaira district sold their milk through middlemen who set the price.`,
    tags: ["business", "brand story", "india", "amul"], isFeatured: false, salesCount: 129, rating: 4.8, daysAgo: 40,
  },
  {
    id: id(10), slug: "sip-vs-lump-sum-hinglish", category: "business-finance",
    title: "SIP vs Lump Sum: Paisa Kaise Badhta Hai",
    subtitle: "Compounding for first-time investors",
    language: "Hinglish", format: "YouTube Long-form", durationMinutes: 8, wordCount: 1180,
    priceInr: 399, exclusivePriceInr: 3999, exclusiveAvailable: true,
    description: "A beginner-friendly explainer on compounding, rupee-cost averaging and when each approach makes sense, with illustrative numbers and a built-in disclaimer. Educational content, not investment advice.",
    preview: `## [00:00] HOOK
(VISUAL: ₹500 note splitting into two, then four, then eight)
Agar aapko aaj ₹1 lakh mile, toh aap kya karoge? Ek saath invest karoge, ya har mahine thoda thoda?
Yeh sawaal simple lagta hai, lekin iska jawab aapki poori financial life badal sakta hai.
Disclaimer pehle: yeh video sirf education ke liye hai, investment advice nahi.`,
    tags: ["finance", "investing", "sip", "hinglish"], isFeatured: false, salesCount: 244, rating: 4.6, daysAgo: 8,
  },
  {
    id: id(11), slug: "facts-that-sound-fake", category: "interesting-facts",
    title: "25 Facts That Sound Fake but Are True",
    subtitle: "Every claim checked, every source noted",
    language: "English", format: "YouTube Long-form", durationMinutes: 10, wordCount: 1350,
    priceInr: 449, exclusivePriceInr: 4499, exclusiveAvailable: false,
    description: "Oxford is older than the Aztec capital. Sharks are older than trees. A rapid-fire listicle with escalating 'wait, what?' moments and a source note under every fact for your description box.",
    preview: `## [00:00] HOOK
(VISUAL: fast montage: shark, tree, university gate, pyramid)
Sharks are older than trees. Oxford University is older than the Aztec capital city. And Cleopatra lived closer in time to the Moon landing than to the building of the Great Pyramid.
Every one of those is true. And we're just getting started.

## [00:25] FACT #25
(VISUAL: jar of honey, ancient clay pot)
Honey basically doesn't spoil. Archaeologists have found pots of honey in ancient Egyptian tombs that were thousands of years old.`,
    tags: ["facts", "listicle", "trivia"], isFeatured: true, salesCount: 512, rating: 4.8, daysAgo: 100,
  },
  {
    id: id(12), slug: "reels-pack-space-facts", category: "interesting-facts",
    title: "Reels Pack: 10 Space Facts in 30 Seconds",
    subtitle: "Ten ready-to-shoot vertical scripts",
    language: "English", format: "Reels / Shorts", durationMinutes: 0.5, wordCount: 900,
    priceInr: 299, exclusivePriceInr: 2499, exclusiveAvailable: true,
    description: "Ten 30-second scripts, each with a 2-second scroll-stopping hook, one fact and a loopable last line. Includes on-screen text suggestions for every reel.",
    preview: `## REEL 1: THE DAY THAT'S LONGER THAN A YEAR
(ON-SCREEN TEXT: "This planet breaks the rules")
HOOK: There's a planet where a day is longer than a year.
Venus spins so slowly that one rotation takes about 243 Earth days. But it orbits the Sun in about 225.
So on Venus, your birthday comes before tomorrow does.
LOOP LINE: And it spins backwards too. Watch again.`,
    tags: ["reels", "shorts", "space", "facts"], isFeatured: false, salesCount: 287, rating: 4.7, daysAgo: 5,
  },
  {
    id: id(13), slug: "ek-machchhar-ki-autobiography", category: "funny-educational",
    title: "Ek Machchhar Ki Autobiography",
    subtitle: "Biology, narrated by the villain",
    language: "Hinglish", format: "YouTube Long-form", durationMinutes: 6, wordCount: 880,
    priceInr: 349, exclusivePriceInr: 2999, exclusiveAvailable: true,
    description: "A mosquito narrates her life story: why only females bite, how she finds you with CO2, and why your ears are her favourite runway. Comedy-first, facts-solid, made for character voice-overs.",
    preview: `## [00:00] INTRO
(VISUAL: cartoon mosquito wearing sunglasses, dramatic spotlight)
Namaste. Main hoon ek machchhar. Aur haan, main wahi hoon jo raat ko 2 baje aapke kaan mein concert karti hoon.
Pehli baat clear kar doon: main "karti" hoon, "karta" nahi. Kyunki aapko sirf female machchhar kaatte hain. Male machchhar? Woh toh phoolon ka ras peete hain. Bechare vegetarian log.`,
    tags: ["comedy", "biology", "kids", "hinglish"], isFeatured: true, salesCount: 268, rating: 4.9, daysAgo: 25,
  },
  {
    id: id(14), slug: "body-is-a-badly-managed-company", category: "funny-educational",
    title: "Your Body Is a Badly Managed Company",
    subtitle: "Anatomy as office comedy",
    language: "English", format: "YouTube Long-form", durationMinutes: 9, wordCount: 1260,
    priceInr: 449, exclusivePriceInr: 4499, exclusiveAvailable: true,
    description: "The brain is a CEO who panics, the appendix is the employee nobody can fire, and the immune system is overzealous security. A comedic explainer that's genuinely educational.",
    preview: `## [00:00] COLD OPEN
(VISUAL: office lobby sign: "HUMAN BODY PVT. LTD. Est. at birth")
Welcome to Human Body Private Limited. Thirty-seven trillion employees. No weekends. No holidays. Terrible management.
Let's meet the team.

## [00:20] THE CEO
(VISUAL: brain in a tie, sweating at a desk)
This is the brain. The CEO. Uses about twenty percent of the company's energy budget while making up around two percent of its body weight.`,
    tags: ["comedy", "anatomy", "explainer"], isFeatured: false, salesCount: 195, rating: 4.8, daysAgo: 55,
  },
  {
    id: id(15), slug: "chernobyl-the-first-36-hours", category: "documentary",
    title: "Chernobyl: The First 36 Hours",
    subtitle: "A minute-by-minute documentary script",
    language: "English", format: "Documentary", durationMinutes: 18, wordCount: 2560,
    priceInr: 899, exclusivePriceInr: 8999, exclusiveAvailable: true,
    description: "From the 1:23 a.m. explosion on 26 April 1986 to the evacuation of Pripyat the next afternoon. Structured in acts, with narration, archival-footage cues and interview-placement notes.",
    preview: `## ACT I: [00:00] 1:23 A.M.
(VISUAL: slow drift across a dark control room, dials glowing)
At 1:23 in the morning on the 26th of April, 1986, the night shift at Reactor Number Four of the Chernobyl Nuclear Power Plant began a safety test.
Within about a minute, the reactor was destroyed.

(VISUAL: wide shot of a burning building, distant)
Thirty-six hours later, a city of nearly fifty thousand people would be told to pack for three days. Most of them never went back.`,
    tags: ["documentary", "disaster", "history", "long-form"], isFeatured: true, salesCount: 221, rating: 5.0, daysAgo: 120,
  },
  {
    id: id(16), slug: "sundarbans-jahan-sher-tairte-hain", category: "documentary",
    title: "सुंदरबन: जहाँ बाघ तैरते हैं",
    subtitle: "Sundarbans: where tigers swim (Hindi)",
    language: "Hindi", format: "Documentary", durationMinutes: 15, wordCount: 2080,
    priceInr: 799, exclusivePriceInr: 7999, exclusiveAvailable: true,
    description: "दुनिया के सबसे बड़े मैंग्रोव जंगल की एक सिनेमैटिक हिंदी डॉक्यूमेंट्री स्क्रिप्ट। Wildlife narration with drone-shot cues and a human story at its centre.",
    preview: `## [00:00] शुरुआत
(VISUAL: ड्रोन शॉट, नदियों का जाल, हरा जंगल)
भारत और बांग्लादेश की सीमा पर एक ऐसा जंगल है जो दिन में दो बार डूबता है।
यहाँ पेड़ खारे पानी में उगते हैं, मछलियाँ पेड़ों पर चढ़ती हैं,
और बाघ, नदियाँ तैरकर पार करते हैं।
यह है सुंदरबन।`,
    tags: ["wildlife", "documentary", "tiger", "hindi"], isFeatured: false, salesCount: 84, rating: 4.9, daysAgo: 18,
  },
  {
    id: id(17), slug: "reels-pack-psychology-hooks", category: "science-psychology",
    title: "Reels Pack: 10 Psychology Hooks",
    subtitle: "Hinglish shorts that stop the scroll",
    language: "Hinglish", format: "Reels / Shorts", durationMinutes: 0.75, wordCount: 1050,
    priceInr: 299, exclusivePriceInr: 2499, exclusiveAvailable: true,
    description: "Ten 45-second Hinglish reels on everyday psychology: the spotlight effect, the Zeigarnik effect and more. Every reel ships with a hook, a body, a CTA and caption text.",
    preview: `## REEL 1: SPOTLIGHT EFFECT
(ON-SCREEN TEXT: "Sab aapko nahi dekh rahe")
HOOK: Aapko lagta hai sab log aapko notice kar rahe hain? Sach bataun? Bilkul nahi.
Psychology mein isse kehte hain Spotlight Effect. Ek study mein students ko ek awkward t-shirt pehna kar class mein bheja gaya. Unhe laga aadhi class ne notice kiya. Asal mein? Bahut kam logon ne.
CTA: Follow karo, kal ek aur dimaag ka secret.`,
    tags: ["reels", "psychology", "hinglish", "shorts"], isFeatured: false, salesCount: 331, rating: 4.8, daysAgo: 3,
  },
  {
    id: id(18), slug: "reels-pack-history-in-60-seconds", category: "history",
    title: "Reels Pack: History in 60 Seconds",
    subtitle: "Ten one-minute history shorts",
    language: "English", format: "Reels / Shorts", durationMinutes: 1, wordCount: 1400,
    priceInr: 349, exclusivePriceInr: 2999, exclusiveAvailable: true,
    description: "The shortest war in history, the emperor who lost to rabbits, and eight more. Ten fast, accurate one-minute scripts with punchy endings built for re-watches.",
    preview: `## REEL 1: THE SHORTEST WAR EVER
(ON-SCREEN TEXT: "This war lasted less than an hour")
HOOK: The shortest war in recorded history lasted under forty-five minutes.
In August 1896, Britain and the Sultanate of Zanzibar went to war after a disputed succession. British ships opened fire in the morning. By the time many people had finished breakfast, it was over.
LOOP LINE: Shorter than this playlist. Keep watching.`,
    tags: ["reels", "history", "shorts"], isFeatured: false, salesCount: 159, rating: 4.7, daysAgo: 10,
  },
];

const NOW = Date.parse("2026-11-20T10:00:00Z");

export const SCRIPTS: Script[] = RAW.map(({ daysAgo, ...s }) => ({
  ...s,
  thumbnailUrl: null,
  isPublished: true,
  createdAt: new Date(NOW - daysAgo * 86400000).toISOString(),
}));

export const BUNDLES: Bundle[] = [
  {
    id: bid(1), slug: "creator-starter-pack", title: "Creator Starter Pack", badge: "Best seller",
    description: "Five proven long-form scripts across our top categories. Enough content for your first month of uploads.",
    priceInr: 1799, scriptIds: [id(1), id(3), id(11), id(9), id(14)], isPublished: true,
  },
  {
    id: bid(2), slug: "mystery-and-history-vault", title: "Mystery & History Vault", badge: "Save 33%",
    description: "Four slow-burn narratives for storytelling channels: unsolved cases and turning points, with full visual direction.",
    priceInr: 1899, scriptIds: [id(7), id(8), id(5), id(15)], isPublished: true,
  },
  {
    id: bid(3), slug: "reels-power-pack", title: "Reels Power Pack", badge: "30 reels",
    description: "All three reels packs: thirty short-form scripts to post daily for a month across Reels, Shorts and Moj.",
    priceInr: 699, scriptIds: [id(12), id(17), id(18)], isPublished: true,
  },
  {
    id: bid(4), slug: "hindi-storyteller-bundle", title: "Hindi Storyteller Bundle", badge: "शुद्ध हिंदी",
    description: "Three pure-Hindi scripts with cinematic pacing, for Hindi-first documentary and mystery channels.",
    priceInr: 1299, scriptIds: [id(2), id(8), id(16)], isPublished: true,
  },
];
