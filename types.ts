
export interface StyleOptions {
  background: string;
  textColor: string;
  fontFamily: string;
  fontSize: number;
  padding: number;
  aspectRatio: string;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  textShadow: TextShadowOptions;
  textOutline: TextOutlineOptions;
  glow: GlowOptions;
  neon: NeonOptions;
  animation: TextAnimationOptions;
  advancedEffect: AdvancedTextEffectOptions;
}

export interface FilterOptions {
  grayscale: number;
  sepia: number;
  invert: number;
  brightness: number;
  contrast: number;
}

export interface GradientOptions {
  start: string;
  end: string;
  angle: number;
}

export interface TextShadowOptions {
  enabled: boolean;
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
}

export interface TextOutlineOptions {
  enabled: boolean;
  color: string;
  width: number;
}

export interface GlowOptions {
    enabled: boolean;
    color: string;
    blur: number;
}

export interface NeonOptions {
    enabled: boolean;
    color: string;
    blur: number;
}

export interface TextAnimationOptions {
  enabled: boolean;
  type: 'fadeIn' | 'slideInUp' | 'bounceIn' | 'slideInLeft' | 'slideInRight' | 'zoomIn';
  duration: number; // in seconds
  delay: number; // in seconds
}

export interface AdvancedTextEffectOptions {
  enabled: boolean;
  type: 'emboss' | 'deboss' | 'subtleBorder';
  lightColor: string;
  darkColor: string;
  intensity: number;
  borderColor: string;
}

export interface ContentImageOptions {
  position: 'above' | 'below';
  objectFit: 'contain' | 'cover';
  rounded: 'none' | 'lg' | '2xl' | 'full';
}

export interface Template {
    name: string;
    styles: StyleOptions;
}

export interface CustomPreset {
  name: string;
  state: Omit<EditorState, 'postText' | 'username'>; // Presets save styles, not content
}

// A single state object for all editable properties to simplify history management.
export interface EditorState {
  postText: string;
  username: string;
  profilePic: string | null;
  backgroundImage: string | null;
  contentImage: string | null;
  textFillImage: string | null;
  styleOptions: StyleOptions;
  filters: FilterOptions;
  gradientOptions: GradientOptions;
  contentImageOptions: ContentImageOptions;
}


export const FONT_OPTIONS = [
  { value: 'font-inter', label: 'Inter' },
  { value: 'font-poppins', label: 'Poppins' },
  { value: 'font-montserrat', label: 'Montserrat' },
  { value: 'font-playfair-display', label: 'Playfair Display' },
  { value: 'font-lobster', label: 'Lobster' },
  { value: 'font-dancing-script', label: 'Dancing Script' },
  { value: 'font-pacifico', label: 'Pacifico' },
  { value: 'font-roboto-slab', label: 'Roboto Slab' },
  { value: 'font-bebas-neue', label: 'Bebas Neue' },
  { value: 'font-orbitron', label: 'Orbitron' },
  { value: 'font-roboto-mono', label: 'Roboto Mono' },
];

export const ASPECT_RATIO_OPTIONS = [
    // Square
    { value: 'aspect-square', label: 'Square (1:1)' },
    // Portrait
    { value: 'aspect-[4/5]', label: 'Portrait (4:5)' },
    { value: 'aspect-[2/3]', label: 'Tall Portrait (2:3)' },
    { value: 'aspect-[9/16]', label: 'Story (9:16)' },
    // Landscape
    { value: 'aspect-[4/3]', label: 'Landscape (4:3)' },
    { value: 'aspect-[16/9]', label: 'Wide (16:9)' },
    { value: 'aspect-[191/100]', label: 'Social Landscape (1.91:1)' },
];

export const BACKGROUND_PRESETS = [
    { value: 'linear-gradient(145deg, #1e3a8a, #4f46e5, #9333ea)', label: 'Default' },
    { value: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)', label: 'Twilight' },
    { value: 'linear-gradient(to right, #ff9966, #ff5e62)', label: 'Sunrise' },
    { value: 'linear-gradient(to right, #43cea2, #185a9d)', label: 'Ocean' },
    { value: 'linear-gradient(to right, #c31432, #240b36)', label: 'Grape' },
    { value: 'linear-gradient(to right, #1d976c, #93f9b9)', label: 'Mojito' },
    { value: 'linear-gradient(to right, #f857a6, #ff5858)', label: 'Passion' },
    { value: 'linear-gradient(to right, #000428, #004e92)', label: 'Deep Sea' },
    { value: 'linear-gradient(to right, #e0eafc, #cfdef3)', label: 'Lavender' },
    { value: 'linear-gradient(to right, #ba5370, #f4e2d8)', label: 'Rose Gold' },
    { value: 'linear-gradient(45deg, #232526, #414345)', label: 'Graphite' },
    { value: 'linear-gradient(to right, #ffafbd, #ffc3a0)', label: 'Blush' },
    { value: 'linear-gradient(to right, #2193b0, #6dd5ed)', label: 'Blue Lagoon' },
    { value: 'linear-gradient(to right, #cc2b5e, #753a88)', label: 'Royal' },
    { value: '#111827', label: 'Dark' },
    { value: '#1a1a1a', label: 'Charcoal' },
    { value: '#ffffff', label: 'White' },
    { value: '#f3f4f6', label: 'Light Gray' },
    { value: '#fef9c3', label: 'Lemon' },
    { value: '#008080', label: 'Teal' },
    { value: '#ff7f50', label: 'Coral' },
    { value: '#708090', label: 'Slate' },
];

const defaultTextShadow: TextShadowOptions = {
    enabled: false,
    color: '#000000',
    blur: 0,
    offsetX: 2,
    offsetY: 2,
};

const defaultTextOutline: TextOutlineOptions = {
    enabled: false,
    color: '#000000',
    width: 1,
};

const defaultGlow: GlowOptions = {
    enabled: false,
    color: '#00ffff',
    blur: 10,
};

const defaultNeon: NeonOptions = {
    enabled: false,
    color: '#ff00ff',
    blur: 15,
};

const defaultTextAnimation: TextAnimationOptions = {
    enabled: false,
    type: 'fadeIn',
    duration: 1,
    delay: 0,
};

const defaultAdvancedEffect: AdvancedTextEffectOptions = {
    enabled: false,
    type: 'emboss',
    lightColor: '#ffffff',
    darkColor: '#000000',
    intensity: 1,
    borderColor: '#ffffff',
};


export const TEMPLATES: Template[] = [
    {
        name: 'Deep Space',
        styles: {
            background: 'linear-gradient(145deg, #1e3a8a, #4f46e5, #9333ea)',
            textColor: '#ffffff',
            fontFamily: 'font-poppins',
            fontSize: 24,
            padding: 48,
            aspectRatio: 'aspect-square',
            textAlign: 'left',
            textShadow: { ...defaultTextShadow },
            textOutline: { ...defaultTextOutline },
            glow: { ...defaultGlow },
            neon: { ...defaultNeon },
            animation: { ...defaultTextAnimation },
            advancedEffect: { ...defaultAdvancedEffect },
        },
    },
    {
        name: 'Sunset',
        styles: {
            background: 'linear-gradient(to right, #ff9966, #ff5e62)',
            textColor: '#1f2937',
            fontFamily: 'font-lobster',
            fontSize: 36,
            padding: 64,
            aspectRatio: 'aspect-[16/9]',
            textAlign: 'center',
            textShadow: { ...defaultTextShadow },
            textOutline: { ...defaultTextOutline },
            glow: { ...defaultGlow },
            neon: { ...defaultNeon },
            animation: { ...defaultTextAnimation },
            advancedEffect: { ...defaultAdvancedEffect },
        },
    },
    {
        name: 'Minimalist',
        styles: {
            background: '#ffffff',
            textColor: '#111827',
            fontFamily: 'font-inter',
            fontSize: 20,
            padding: 80,
            aspectRatio: 'aspect-[9/16]',
            textAlign: 'left',
            textShadow: { ...defaultTextShadow },
            textOutline: { ...defaultTextOutline },
            glow: { ...defaultGlow },
            neon: { ...defaultNeon },
            animation: { ...defaultTextAnimation },
            advancedEffect: { ...defaultAdvancedEffect },
        },
    },
    {
        name: 'Terminal',
        styles: {
            background: '#111827',
            textColor: '#34d399',
            fontFamily: 'font-roboto-mono',
            fontSize: 18,
            padding: 32,
            aspectRatio: 'aspect-square',
            textAlign: 'left',
            textShadow: { ...defaultTextShadow },
            textOutline: { ...defaultTextOutline },
            glow: { ...defaultGlow, color: '#34d399' },
            neon: { ...defaultNeon, color: '#34d399' },
            animation: { ...defaultTextAnimation },
            advancedEffect: { ...defaultAdvancedEffect },
        },
    },
    {
        name: 'Modern Quote',
        styles: {
            background: 'linear-gradient(135deg, #f5f7fa, #eef2f7)',
            textColor: '#374151',
            fontFamily: 'font-lobster',
            fontSize: 38,
            padding: 80,
            aspectRatio: 'aspect-square',
            textAlign: 'center',
            textShadow: { 
                enabled: true,
                color: 'rgba(0,0,0,0.1)',
                blur: 5,
                offsetX: 2,
                offsetY: 2,
            },
            textOutline: { ...defaultTextOutline },
            glow: { ...defaultGlow },
            neon: { ...defaultNeon },
            animation: { ...defaultTextAnimation },
            advancedEffect: { ...defaultAdvancedEffect },
        },
    },
    {
        name: 'Bold Announcement',
        styles: {
            background: 'linear-gradient(45deg, #004d7a, #008793)',
            textColor: '#ffffff',
            fontFamily: 'font-poppins',
            fontSize: 28,
            padding: 56,
            aspectRatio: 'aspect-[16/9]',
            textAlign: 'left',
            textShadow: { 
                enabled: true,
                color: 'rgba(0,0,0,0.3)',
                blur: 4,
                offsetX: 1,
                offsetY: 1,
            },
            textOutline: { ...defaultTextOutline },
            glow: { ...defaultGlow },
            neon: { ...defaultNeon },
            animation: { ...defaultTextAnimation },
            advancedEffect: { ...defaultAdvancedEffect },
        },
    },
    {
        name: 'Neon Promo',
        styles: {
            background: 'linear-gradient(200deg, #111827, #000000)',
            textColor: '#f472b6',
            fontFamily: 'font-roboto-mono',
            fontSize: 32,
            padding: 64,
            aspectRatio: 'aspect-[9/16]',
            textAlign: 'center',
            textShadow: { ...defaultTextShadow },
            textOutline: { ...defaultTextOutline },
            glow: { ...defaultGlow },
            neon: { 
                enabled: true,
                color: '#f472b6',
                blur: 20,
            },
            animation: { ...defaultTextAnimation },
            advancedEffect: { ...defaultAdvancedEffect },
        },
    },
    {
        name: 'Vintage Paper',
        styles: {
            background: 'linear-gradient(135deg, #fdfbfb, #ebedee)',
            textColor: '#4a4238',
            fontFamily: 'font-lobster',
            fontSize: 32,
            padding: 72,
            aspectRatio: 'aspect-square',
            textAlign: 'center',
            textShadow: { 
                enabled: true,
                color: 'rgba(0,0,0,0.15)',
                blur: 4,
                offsetX: 1,
                offsetY: 1,
            },
            textOutline: { ...defaultTextOutline },
            glow: { ...defaultGlow },
            neon: { ...defaultNeon },
            animation: { ...defaultTextAnimation },
            advancedEffect: { ...defaultAdvancedEffect },
        },
    },
    {
        name: 'Corporate Clean',
        styles: {
            background: '#eef2f7',
            textColor: '#1e3a8a',
            fontFamily: 'font-poppins',
            fontSize: 22,
            padding: 56,
            aspectRatio: 'aspect-[16/9]',
            textAlign: 'left',
            textShadow: { ...defaultTextShadow },
            textOutline: { ...defaultTextOutline },
            glow: { ...defaultGlow },
            neon: { ...defaultNeon },
            animation: { ...defaultTextAnimation },
            advancedEffect: { ...defaultAdvancedEffect },
        },
    },
    {
        name: 'Party Vibes',
        styles: {
            background: 'linear-gradient(to right, #f857a6, #ff5858)',
            textColor: '#ffffff',
            fontFamily: 'font-poppins',
            fontSize: 36,
            padding: 64,
            aspectRatio: 'aspect-[9/16]',
            textAlign: 'center',
            textShadow: { 
                enabled: true,
                color: 'rgba(0,0,0,0.25)',
                blur: 8,
                offsetX: 0,
                offsetY: 4,
            },
            textOutline: { ...defaultTextOutline },
            glow: { ...defaultGlow },
            neon: { ...defaultNeon },
            animation: { 
                enabled: true,
                type: 'bounceIn',
                duration: 1.2,
                delay: 0,
            },
            advancedEffect: { ...defaultAdvancedEffect },
        },
    },
    {
        name: 'Cyberpunk Glitch',
        styles: {
            background: 'linear-gradient(180deg, #3a0ca3, #00f5d4)',
            textColor: '#00f5d4',
            fontFamily: 'font-orbitron',
            fontSize: 26,
            padding: 48,
            aspectRatio: 'aspect-square',
            textAlign: 'left',
            textShadow: { 
                enabled: true,
                color: '#f72585',
                blur: 2,
                offsetX: 2,
                offsetY: -2,
            },
            textOutline: { ...defaultTextOutline },
            glow: { 
                enabled: true,
                color: '#4cc9f0',
                blur: 10,
            },
            neon: { ...defaultNeon },
            animation: { ...defaultTextAnimation },
            advancedEffect: { ...defaultAdvancedEffect },
        },
    },
    {
        name: 'Elegant Script',
        styles: {
            background: '#f8f9fa',
            textColor: '#343a40',
            fontFamily: 'font-dancing-script',
            fontSize: 40,
            padding: 80,
            aspectRatio: 'aspect-[4/5]',
            textAlign: 'center',
            textShadow: { 
                enabled: true,
                color: 'rgba(0,0,0,0.1)',
                blur: 10,
                offsetX: 0,
                offsetY: 5,
            },
            textOutline: { ...defaultTextOutline },
            glow: { ...defaultGlow },
            neon: { ...defaultNeon },
            animation: { ...defaultTextAnimation },
            advancedEffect: { ...defaultAdvancedEffect },
        },
    },
    {
        name: 'Nature Walk',
        styles: {
            background: 'linear-gradient(135deg, #606c38, #283618)',
            textColor: '#fefae0',
            fontFamily: 'font-playfair-display',
            fontSize: 32,
            padding: 64,
            aspectRatio: 'aspect-square',
            textAlign: 'center',
            textShadow: { ...defaultTextShadow },
            textOutline: { ...defaultTextOutline },
            glow: { ...defaultGlow },
            neon: { ...defaultNeon },
            animation: { ...defaultTextAnimation },
            advancedEffect: { ...defaultAdvancedEffect },
        },
    },
    {
        name: 'Pop Art',
        styles: {
            background: '#ffd100',
            textColor: '#003566',
            fontFamily: 'font-bebas-neue',
            fontSize: 48,
            padding: 48,
            aspectRatio: 'aspect-square',
            textAlign: 'center',
            textShadow: { 
                enabled: true,
                color: '#000000',
                blur: 0,
                offsetX: 4,
                offsetY: 4,
            },
            textOutline: { 
                enabled: true,
                color: '#000000',
                width: 2,
            },
            glow: { ...defaultGlow },
            neon: { ...defaultNeon },
            animation: { ...defaultTextAnimation },
            advancedEffect: { ...defaultAdvancedEffect },
        },
    },
    {
        name: 'Cosmic Dust',
        styles: {
            background: 'linear-gradient(225deg, #000000, #430d4b)',
            textColor: '#e0c3fc',
            fontFamily: 'font-montserrat',
            fontSize: 22,
            padding: 56,
            aspectRatio: 'aspect-[9/16]',
            textAlign: 'left',
            textShadow: { ...defaultTextShadow },
            textOutline: { ...defaultTextOutline },
            glow: { 
                enabled: true,
                color: '#e0c3fc',
                blur: 15,
            },
            neon: { ...defaultNeon },
            animation: { ...defaultTextAnimation },
            advancedEffect: { ...defaultAdvancedEffect },
        },
    },
    {
        name: 'Oceanic Calm',
        styles: {
            background: 'linear-gradient(135deg, #2193b0, #6dd5ed)',
            textColor: '#ffffff',
            fontFamily: 'font-playfair-display',
            fontSize: 30,
            padding: 64,
            aspectRatio: 'aspect-square',
            textAlign: 'center',
            textShadow: { 
                enabled: true,
                color: 'rgba(0,0,0,0.2)',
                blur: 5,
                offsetX: 1,
                offsetY: 1,
            },
            textOutline: { ...defaultTextOutline },
            glow: { ...defaultGlow },
            neon: { ...defaultNeon },
            animation: { ...defaultTextAnimation },
            advancedEffect: { ...defaultAdvancedEffect },
        },
    },
    {
        name: 'Gamer Fuel',
        styles: {
            background: 'linear-gradient(315deg, #7f00ff, #e100ff, #00ffc4)',
            textColor: '#ffffff',
            fontFamily: 'font-orbitron',
            fontSize: 28,
            padding: 48,
            aspectRatio: 'aspect-[16/9]',
            textAlign: 'left',
            textShadow: { ...defaultTextShadow },
            textOutline: { 
                enabled: true,
                color: '#000000',
                width: 2,
            },
            glow: { 
                enabled: true,
                color: '#00ffc4',
                blur: 15,
            },
            neon: { ...defaultNeon },
            animation: { ...defaultTextAnimation },
            advancedEffect: { ...defaultAdvancedEffect },
        },
    },
    {
        name: 'Classic Noir',
        styles: {
            background: '#1a1a1a',
            textColor: '#f5f5f5',
            fontFamily: 'font-roboto-slab',
            fontSize: 24,
            padding: 72,
            aspectRatio: 'aspect-[4/3]',
            textAlign: 'left',
            textShadow: { 
                enabled: true,
                color: 'rgba(255,255,255,0.1)',
                blur: 1,
                offsetX: 0,
                offsetY: 1,
            },
            textOutline: { ...defaultTextOutline },
            glow: { ...defaultGlow },
            neon: { ...defaultNeon },
            animation: { ...defaultTextAnimation },
            advancedEffect: { ...defaultAdvancedEffect },
        },
    },
    {
        name: 'Pastel Dream',
        styles: {
            background: 'linear-gradient(145deg, #ffafbd, #ffc3a0)',
            textColor: '#5e3a4e',
            fontFamily: 'font-pacifico',
            fontSize: 34,
            padding: 64,
            aspectRatio: 'aspect-[4/5]',
            textAlign: 'center',
            textShadow: { ...defaultTextShadow },
            textOutline: { ...defaultTextOutline },
            glow: { ...defaultGlow },
            neon: { ...defaultNeon },
            animation: { ...defaultTextAnimation },
            advancedEffect: { ...defaultAdvancedEffect },
        },
    },
    {
        name: 'Autumn Warmth',
        styles: {
            background: 'linear-gradient(to right, #d3959b, #bfe6ba)',
            textColor: '#4a2c2a',
            fontFamily: 'font-roboto-slab',
            fontSize: 28,
            padding: 64,
            aspectRatio: 'aspect-square',
            textAlign: 'left',
            textShadow: { 
                enabled: true,
                color: 'rgba(255,255,255,0.5)',
                blur: 2,
                offsetX: 1,
                offsetY: 1,
            },
            textOutline: { ...defaultTextOutline },
            glow: { ...defaultGlow },
            neon: { ...defaultNeon },
            animation: { ...defaultTextAnimation },
            advancedEffect: { ...defaultAdvancedEffect },
        },
    },
];
