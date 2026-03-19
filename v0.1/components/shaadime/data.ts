export type HeroSlide = {
  id: string;
  label: string;
  meta: string;
  video: string;
};

export type HeroStat = {
  value: string;
  label: string;
};

export type ThemeCard = {
  name: string;
  description: string;
  image: string;
  featured?: boolean;
  imageStyle?: React.CSSProperties;
};

export type VenueCard = {
  name: string;
  description: string;
  tag: string;
  image: string;
  imageStyle?: React.CSSProperties;
};

export type DecorCard = {
  name: string;
  image: string;
  large?: boolean;
  imageStyle?: React.CSSProperties;
};

export type WhyCard = {
  icon: string;
  number: string;
  title: string;
  description: string;
  featured?: boolean;
};

export type CityCard = {
  name: string;
  tagline: string;
  image: string;
  imageStyle?: React.CSSProperties;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export const navItems = [
  { label: "Themes", href: "#themes" },
  { label: "Venues", href: "#venues" },
  { label: "Why ShaadiMe", href: "#why" },
  { label: "Cities", href: "#cities" },
  { label: "FAQ", href: "#faq" },
];

export const heroSlides: HeroSlide[] = [
  {
    id: "01",
    label: "Royal Grandeur",
    meta: "Hyderabad • ShaadiMe Edit",
    video: "/landing-videos/landing-1.mp4",
  },
  {
    id: "02",
    label: "Garden Wedding",
    meta: "Bengaluru • Open Air",
    video: "/landing-videos/landing-2.mp4",
  },
  {
    id: "03",
    label: "Traditional South Indian",
    meta: "Chennai • Ceremony Flow",
    video: "/landing-videos/landing-3.mp4",
  },
  {
    id: "04",
    label: "Modern Destination",
    meta: "ShaadiMe • Signature Planning",
    video: "/landing-videos/landing-4.mp4",
  },
];

export const heroStats: HeroStat[] = [
  { value: "3", label: "launch cities" },
  { value: "1", label: "dedicated planner" },
  { value: "Full", label: "planning support" },
];

export const themes: ThemeCard[] = [
  {
    name: "Royal Grandeur",
    description: "Grand entrances, regal details, and a sense of occasion in every frame.",
    image:
      "https://images.pexels.com/photos/33361433/pexels-photo-33361433.jpeg?auto=compress&cs=tinysrgb&w=1200",
    featured: true,
    imageStyle: { objectPosition: "center 35%" },
  },
  {
    name: "Intimate Garden",
    description: "Soft florals, easy light, and a celebration that feels close to home.",
    image:
      "https://images.pexels.com/photos/26202234/pexels-photo-26202234.jpeg?auto=compress&cs=tinysrgb&w=1200",
    imageStyle: { objectPosition: "center 52%" },
  },
  {
    name: "Traditional South Indian",
    description: "Sacred rituals, marigold warmth, and timeless South Indian elegance.",
    image:
      "https://images.pexels.com/photos/34303528/pexels-photo-34303528.jpeg?auto=compress&cs=tinysrgb&w=1200",
    imageStyle: { objectPosition: "center 56%" },
  },
  {
    name: "Destination",
    description: "A wedding that feels like a getaway, without the planning chaos.",
    image:
      "https://images.pexels.com/photos/7663304/pexels-photo-7663304.jpeg?auto=compress&cs=tinysrgb&w=1200",
    imageStyle: { objectPosition: "center 54%" },
  },
  {
    name: "Minimalist Modern",
    description: "Refined palettes, considered details, and understated luxury.",
    image:
      "https://images.pexels.com/photos/10733520/pexels-photo-10733520.jpeg?auto=compress&cs=tinysrgb&w=1200",
    imageStyle: { objectPosition: "center 50%" },
  },
];

export const venues: VenueCard[] = [
  {
    name: "Palace & Heritage",
    description: "Historic character, dramatic architecture, and unmistakable grandeur.",
    tag: "Heritage Venue",
    image:
      "https://images.pexels.com/photos/33361433/pexels-photo-33361433.jpeg?auto=compress&cs=tinysrgb&w=1200",
    imageStyle: { objectPosition: "center 58%" },
  },
  {
    name: "Five Star Hotel",
    description: "Polished hospitality and the comfort of a venue built for scale.",
    tag: "Luxury Hotel",
    image:
      "https://images.pexels.com/photos/30866709/pexels-photo-30866709.jpeg?auto=compress&cs=tinysrgb&w=1200",
    imageStyle: { objectPosition: "center 40%" },
  },
  {
    name: "Farmhouse & Open Air",
    description: "Fresh air, open lawns, and space for a relaxed celebration.",
    tag: "Open Air Venue",
    image:
      "https://images.pexels.com/photos/29781787/pexels-photo-29781787.jpeg?auto=compress&cs=tinysrgb&w=1200",
    imageStyle: { objectPosition: "center 56%" },
  },
  {
    name: "Banquet Hall",
    description: "A reliable setting for large gatherings done with elegance.",
    tag: "Indoor Celebration",
    image:
      "https://images.pexels.com/photos/24023407/pexels-photo-24023407.jpeg?auto=compress&cs=tinysrgb&w=1200",
    imageStyle: { objectPosition: "center 56%" },
  },
  {
    name: "Beach",
    description: "Sea breeze, sunset light, and a wedding with a destination feel.",
    tag: "Destination Setting",
    image:
      "https://images.pexels.com/photos/12031245/pexels-photo-12031245.jpeg?auto=compress&cs=tinysrgb&w=1200",
    imageStyle: { objectPosition: "center 58%" },
  },
];

export const decorStyles: DecorCard[] = [
  {
    name: "Floral Extravaganza",
    image:
      "https://images.pexels.com/photos/34389342/pexels-photo-34389342.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    name: "Drape & Lights",
    image:
      "https://images.pexels.com/photos/24023407/pexels-photo-24023407.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    name: "Marigold Traditional",
    image:
      "https://images.pexels.com/photos/34303528/pexels-photo-34303528.jpeg?auto=compress&cs=tinysrgb&w=1200",
    large: true,
  },
  {
    name: "Minimal Luxe",
    image:
      "https://images.pexels.com/photos/35760208/pexels-photo-35760208.jpeg?auto=compress&cs=tinysrgb&w=1200",
    imageStyle: { objectPosition: "center 58%" },
  },
  {
    name: "Royal Baroque",
    image:
      "https://images.pexels.com/photos/33361433/pexels-photo-33361433.jpeg?auto=compress&cs=tinysrgb&w=1200",
    imageStyle: { objectPosition: "center 46%" },
  },
];

export const whyCards: WhyCard[] = [
  {
    icon: "🎯",
    number: "01 — Complete Convenience",
    title: "You plan once. We handle the rest.",
    description:
      "Share the wedding you want once. We coordinate the moving pieces, follow through with vendors, and keep the day from turning into a checklist.",
  },
  {
    icon: "💎",
    number: "02 — Personalised to You",
    title: "Intimate ceremony or grand celebration.",
    description:
      "Whether you are planning for 80 guests or 800, the experience is shaped around your family, rituals, pace, and taste.",
  },
  {
    icon: "📱",
    number: "03 — One Point of Contact",
    title: "One planner. One number.",
    description:
      "You should not have to manage fifteen parallel conversations. One ShaadiMe planner keeps the context, the decisions, and the follow-through in one place.",
  },
  {
    icon: "🪔",
    number: "04 — Made for Indian Weddings",
    title: "We speak Indian wedding fluently.",
    description:
      "From family expectations to ceremony flow, we understand the scale and emotion of Indian weddings and plan with that reality in mind.",
  },
  {
    icon: "🥂",
    number: "05 — The ShaadiMe Promise",
    title: "You are the guest at your own wedding.",
    description:
      "The goal is simple: you should be present for your own wedding. Not managing calls, not checking on setup, not solving last-minute issues.",
    featured: true,
  },
];

export const collageImages = [
  "https://images.pexels.com/photos/26871674/pexels-photo-26871674.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/35547224/pexels-photo-35547224.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/34389342/pexels-photo-34389342.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/34018647/pexels-photo-34018647.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/35234471/pexels-photo-35234471.jpeg?auto=compress&cs=tinysrgb&w=1200",
];

export const cities: CityCard[] = [
  {
    name: "Bengaluru",
    tagline: "We are here ✦",
    image:
      "https://images.pexels.com/photos/30866399/pexels-photo-30866399.jpeg?auto=compress&cs=tinysrgb&w=1200",
    imageStyle: { objectPosition: "center 72%" },
  },
  {
    name: "Chennai",
    tagline: "We are here ✦",
    image:
      "https://images.pexels.com/photos/29636129/pexels-photo-29636129.jpeg?auto=compress&cs=tinysrgb&w=1200",
    imageStyle: { objectPosition: "center 52%" },
  },
  {
    name: "Hyderabad",
    tagline: "We are here ✦",
    image: "/hyderabad.jpeg",
    imageStyle: { objectPosition: "center 46%" },
  },
];

export const faqs: FaqItem[] = [
  {
    question:
      "What does ShaadiMe actually do? Is it a vendor marketplace or a planning service?",
    answer:
      "ShaadiMe is a planning partner, not a vendor marketplace. We do not hand you a directory and ask you to manage it yourself. We understand your wedding, assign a planner, coordinate the work, and guide the process end to end.",
  },
  {
    question: "How much does it cost to plan with ShaadiMe?",
    answer:
      "The final cost depends on the scale, city, and complexity of your wedding. Once we understand what you are planning, we walk you through a transparent recommendation instead of pushing a generic package.",
  },
  {
    question: "Which cities is ShaadiMe available in right now?",
    answer:
      "ShaadiMe is currently serving Bengaluru, Chennai, and Hyderabad. These are our launch cities, and we will expand from here.",
  },
  {
    question: "How early should I get in touch before my wedding?",
    answer:
      "Earlier is always better, especially for larger celebrations. Six months gives enough room to plan calmly, but if your timeline is shorter we can still tell you what is realistic.",
  },
  {
    question:
      "What if I only need help with part of the wedding and not everything?",
    answer:
      "That is fine. Some couples need full planning, others need help with a specific part of the wedding. We can shape the engagement around what is actually useful.",
  },
  {
    question:
      "Will I have a dedicated planner or will multiple people be involved?",
    answer:
      "You will have one primary planner who knows the details of your wedding and remains your main point of contact throughout the process.",
  },
  {
    question:
      "Can I upload inspiration photos or references for my wedding vision?",
    answer:
      "Yes. You can share inspiration images or reference files in the intake flow so your planner starts with a clear sense of your taste, not a blank slate.",
  },
];

export const plannerSteps = [
  {
    id: "names",
    emoji: "💍",
    title: "Tell us who is getting married",
  },
  {
    id: "phone",
    emoji: "📱",
    title: "How do we reach you?",
  },
  {
    id: "date",
    emoji: "📅",
    title: "When is the big day?",
  },
  {
    id: "budget",
    emoji: "💰",
    title: "What's your wedding budget?",
  },
  {
    id: "type",
    emoji: "💑",
    title: "How did you two find each other?",
  },
  {
    id: "guests",
    emoji: "🎊",
    title: "How many guests are you expecting?",
  },
  {
    id: "preference",
    emoji: "🎯",
    title: "How would you like to work with us?",
  },
  {
    id: "inspiration",
    emoji: "🌸",
    title: "Share your inspiration",
  },
  {
    id: "city",
    emoji: "🏙️",
    title: "Which city is your wedding in?",
  },
];
