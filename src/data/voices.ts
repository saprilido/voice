export interface Voice {
  id: string;
  name: string;
  tone: string;
  trait: string;
  pitch: string;
  description: string;
  genderHint: string;
  samplePhrase: string;
}

export interface VoiceStyleDirective {
  id: string;
  name: string;
  description: string;
  directive: string;
}

export interface VoicePaceDirective {
  id: string;
  name: string;
  description: string;
  directive: string;
  playbackSpeedDefault: number;
}

export interface VoiceAccentDirective {
  id: string;
  name: string;
  shortName: string;
  description: string;
  directive: string;
}

export interface MomentItem {
  id: string;
  title: string;
  subtitle: string;
  lines: string[];
  note: string;
}

export const GEMINI_VOICES: Voice[] = [
  {
    id: 'Achernar',
    name: 'Achernar',
    tone: 'Soft • Higher pitch',
    trait: 'Soft',
    pitch: 'Higher pitch',
    description: 'Soft, gentle female voice with a delicate and light touch',
    genderHint: 'Soft Female',
    samplePhrase: 'Hello, I am Achernar. Soft and gentle with a light, melodic touch.'
  },
  {
    id: 'Achird',
    name: 'Achird',
    tone: 'Friendly • Lower middle pitch',
    trait: 'Friendly',
    pitch: 'Lower middle pitch',
    description: 'Warm, approachable tone with natural conversational flow',
    genderHint: 'Friendly Male',
    samplePhrase: 'Hi there, I am Achird. A friendly voice with warm, grounded conversation.'
  },
  {
    id: 'Algenib',
    name: 'Algenib',
    tone: 'Gravelly • Lower pitch',
    trait: 'Gravelly',
    pitch: 'Lower pitch',
    description: 'Deep, textured timber with a distinctive rugged timbre',
    genderHint: 'Gravelly Male',
    samplePhrase: 'Greetings, I am Algenib. Deep, textured, and carrying distinctive gravelly character.'
  },
  {
    id: 'Algieba',
    name: 'Algieba',
    tone: 'Smooth • Lower pitch',
    trait: 'Smooth',
    pitch: 'Lower pitch',
    description: 'Velvety, suave presentation with sophisticated poise',
    genderHint: 'Smooth Male',
    samplePhrase: 'Good day. I am Algieba, offering a smooth, polished narrative tone.'
  },
  {
    id: 'Alnilam',
    name: 'Alnilam',
    tone: 'Firm • Lower middle pitch',
    trait: 'Firm',
    pitch: 'Lower middle pitch',
    description: 'Resolute, steady delivery with grounded confidence',
    genderHint: 'Firm Male',
    samplePhrase: 'I am Alnilam. Resolute, grounded, and clear in every sentence.'
  },
  {
    id: 'Aoede',
    name: 'Aoede',
    tone: 'Breezy • Middle pitch',
    trait: 'Breezy',
    pitch: 'Middle pitch',
    description: 'Conversational, elegant narrative style with musical nuance',
    genderHint: 'Breezy Female',
    samplePhrase: 'Welcome. I am Aoede, weaving words with breezy poetry and warmth.'
  },
  {
    id: 'Autonoe',
    name: 'Autonoe',
    tone: 'Bright • Middle pitch',
    trait: 'Bright',
    pitch: 'Middle pitch',
    description: 'Vibrant and engaging delivery with vivid melodic inflections',
    genderHint: 'Bright Female',
    samplePhrase: 'Hello! I am Autonoe, full of color, enthusiasm, and crisp clarity.'
  },
  {
    id: 'Callirrhoe',
    name: 'Callirrhoe',
    tone: 'Easy-going • Middle pitch',
    trait: 'Easy-going',
    pitch: 'Middle pitch',
    description: 'Approachable, relaxed cadence with effortless conversational warmth',
    genderHint: 'Easy-going Female',
    samplePhrase: 'Hey! I am Callirrhoe, here to keep things easy, pleasant, and natural.'
  },
  {
    id: 'Charon',
    name: 'Charon',
    tone: 'Informative • Lower pitch',
    trait: 'Informative',
    pitch: 'Lower pitch',
    description: 'Rich, grounded timber carrying calm authority and clarity',
    genderHint: 'Deep Male',
    samplePhrase: 'Greetings. I am Charon. Delivering thoughtful calm and grounded resonance.'
  },
  {
    id: 'Despina',
    name: 'Despina',
    tone: 'Smooth • Middle pitch',
    trait: 'Smooth',
    pitch: 'Middle pitch',
    description: 'Silky, delicate vocal presence with heartfelt empathy',
    genderHint: 'Smooth Female',
    samplePhrase: 'Hello. I am Despina, gently sharing thoughts with heartfelt care.'
  },
  {
    id: 'Enceladus',
    name: 'Enceladus',
    tone: 'Breathy • Lower pitch',
    trait: 'Breathy',
    pitch: 'Lower pitch',
    description: 'Soft, close-mic quality with tender reflective whisper warmth',
    genderHint: 'Breathy Male',
    samplePhrase: 'Quietly now. I am Enceladus, speaking with soft, close intimacy.'
  },
  {
    id: 'Erinome',
    name: 'Erinome',
    tone: 'Clear • Middle pitch',
    trait: 'Clear',
    pitch: 'Middle pitch',
    description: 'Balanced, lucid, and articulated with crisp elegance',
    genderHint: 'Clear Female',
    samplePhrase: 'Hello, I am Erinome. Balanced, lucid, and articulated with crisp elegance.'
  },
  {
    id: 'Fenrir',
    name: 'Fenrir',
    tone: 'Excitable • Lower middle pitch',
    trait: 'Excitable',
    pitch: 'Lower middle pitch',
    description: 'Grounded, authentic storytelling voice with steady dynamic clarity',
    genderHint: 'Dynamic Male',
    samplePhrase: 'Hello! I am Fenrir, passionate and ready to spark your imagination.'
  },
  {
    id: 'Gacrux',
    name: 'Gacrux',
    tone: 'Mature • Middle pitch',
    trait: 'Mature',
    pitch: 'Middle pitch',
    description: 'Experienced, composed delivery with calm reassurance',
    genderHint: 'Mature Male',
    samplePhrase: 'Greetings, I am Gacrux. Experienced, steady, and comfortably composed.'
  },
  {
    id: 'Iapetus',
    name: 'Iapetus',
    tone: 'Clear • Lower middle pitch',
    trait: 'Clear',
    pitch: 'Lower middle pitch',
    description: 'Crisp, balanced cadence with analytical, poised diction',
    genderHint: 'Poised Male',
    samplePhrase: 'Greetings. I am Iapetus, articulating ideas with balanced precision.'
  },
  {
    id: 'Kore',
    name: 'Kore',
    tone: 'Firm • Middle pitch',
    trait: 'Firm',
    pitch: 'Middle pitch',
    description: 'Gentle, soothing female voice with warm natural pauses',
    genderHint: 'Warm Female',
    samplePhrase: 'Hello, I am Kore. A warm, contemplative voice with steady grace.'
  },
  {
    id: 'Laomedeia',
    name: 'Laomedeia',
    tone: 'Upbeat • Higher pitch',
    trait: 'Upbeat',
    pitch: 'Higher pitch',
    description: 'Radiant, cheerful delivery full of energetic optimism',
    genderHint: 'Upbeat Female',
    samplePhrase: 'Hi! I am Laomedeia, lively and sparkling with radiant enthusiasm.'
  },
  {
    id: 'Leda',
    name: 'Leda',
    tone: 'Youthful • Higher pitch',
    trait: 'Youthful',
    pitch: 'Higher pitch',
    description: 'Warm, sweet female tone with welcoming youthful brightness',
    genderHint: 'Youthful Female',
    samplePhrase: 'Hi! I am Leda, bringing a gentle, bright, and sincere touch.'
  },
  {
    id: 'Orus',
    name: 'Orus',
    tone: 'Firm • Lower middle pitch',
    trait: 'Firm',
    pitch: 'Lower middle pitch',
    description: 'Strong, resolute delivery with reliable, confident timber',
    genderHint: 'Strong Male',
    samplePhrase: 'I am Orus. Strong, steady, and clear in every sentence.'
  },
  {
    id: 'Puck',
    name: 'Puck',
    tone: 'Upbeat • Middle pitch',
    trait: 'Upbeat',
    pitch: 'Middle pitch',
    description: 'Tender smile in the voice, lighthearted and reminiscing',
    genderHint: 'Lively Male',
    samplePhrase: 'Hey there, I am Puck! Ready to bring energy, charm, and lively stories.'
  },
  {
    id: 'Pulcherrima',
    name: 'Pulcherrima',
    tone: 'Forward • Middle pitch',
    trait: 'Forward',
    pitch: 'Middle pitch',
    description: 'Direct, clear, and engaging with bold modern articulation',
    genderHint: 'Forward Female',
    samplePhrase: 'Welcome, I am Pulcherrima. Direct, engaging, and confidently forward.'
  },
  {
    id: 'Rasalgethi',
    name: 'Rasalgethi',
    tone: 'Informative • Middle pitch',
    trait: 'Informative',
    pitch: 'Middle pitch',
    description: 'Structured, analytical delivery built for clarity and tutorials',
    genderHint: 'Informative Male',
    samplePhrase: 'Greetings, I am Rasalgethi. Analytical, clear, and structured for understanding.'
  },
  {
    id: 'Sadachbia',
    name: 'Sadachbia',
    tone: 'Lively • Lower pitch',
    trait: 'Lively',
    pitch: 'Lower pitch',
    description: 'Deep, resonant voice with an engaging, bouncy rhythm',
    genderHint: 'Lively Male',
    samplePhrase: 'Hey! I am Sadachbia. Deep yet full of lively pulse and groove.'
  },
  {
    id: 'Sadaltager',
    name: 'Sadaltager',
    tone: 'Knowledgeable • Middle pitch',
    trait: 'Knowledgeable',
    pitch: 'Middle pitch',
    description: 'Erudite, reassuring timber with authoritative warmth',
    genderHint: 'Knowledgeable Male',
    samplePhrase: 'Good day, I am Sadaltager. Thoughtful, erudite, and naturally reassuring.'
  },
  {
    id: 'Schedar',
    name: 'Schedar',
    tone: 'Even • Lower middle pitch',
    trait: 'Even',
    pitch: 'Lower middle pitch',
    description: 'Steadfast, consistent pacing with neutral, calming balance',
    genderHint: 'Even Male',
    samplePhrase: 'Hello, I am Schedar. Delivering an even, steadfast, and measured tone.'
  },
  {
    id: 'Sulafat',
    name: 'Sulafat',
    tone: 'Warm • Middle pitch',
    trait: 'Warm',
    pitch: 'Middle pitch',
    description: 'Deeply comforting, warm female voice ideal for narration',
    genderHint: 'Warm Female',
    samplePhrase: 'Welcome, I am Sulafat. Radiating cozy warmth and soothing comfort.'
  },
  {
    id: 'Umbriel',
    name: 'Umbriel',
    tone: 'Easy-going • Lower middle pitch',
    trait: 'Easy-going',
    pitch: 'Lower middle pitch',
    description: 'Relaxed, soothing timbre with laid-back natural pacing',
    genderHint: 'Mellow Male',
    samplePhrase: 'Hello there. I am Umbriel, calm and mellow like a quiet evening.'
  },
  {
    id: 'Vindemiatrix',
    name: 'Vindemiatrix',
    tone: 'Gentle • Middle pitch',
    trait: 'Gentle',
    pitch: 'Middle pitch',
    description: 'Gentle, tender presence bringing calm and soothing empathy',
    genderHint: 'Gentle Female',
    samplePhrase: 'Hello, I am Vindemiatrix. Tender, calm, and soothing like a gentle breeze.'
  },
  {
    id: 'Zephyr',
    name: 'Zephyr',
    tone: 'Bright • Higher pitch',
    trait: 'Bright',
    pitch: 'Higher pitch',
    description: 'Soft, airy cadence that feels close, thoughtful, and intimate',
    genderHint: 'Serene Neutral',
    samplePhrase: 'Hello, I am Zephyr. A bright, airy voice with reflective stillness.'
  },
  {
    id: 'Zubenelgenubi',
    name: 'Zubenelgenubi',
    tone: 'Casual • Lower middle pitch',
    trait: 'Casual',
    pitch: 'Lower middle pitch',
    description: 'Laid-back, conversational tone with natural easygoing charm',
    genderHint: 'Casual Male',
    samplePhrase: 'Hey there, I am Zubenelgenubi. Casual, laid-back, and totally relaxed.'
  }
];

export const STYLE_DIRECTIVES: VoiceStyleDirective[] = [
  {
    id: 'vocal-smile',
    name: 'Vocal Smile',
    description: 'The "Vocal Smile": The soft palate is raised to keep the tone bright, sunny, and explicitly inviting.',
    directive: 'The "Vocal Smile": The soft palate is raised to keep the tone bright, sunny, and explicitly inviting.'
  },
  {
    id: 'newscaster',
    name: 'Newscaster',
    description: 'Professional, authoritative, clear articulation with standard broadcast cadence.',
    directive: 'Professional, authoritative, clear articulation with standard broadcast cadence.'
  },
  {
    id: 'whisper',
    name: 'Whisper',
    description: 'Intimate, breathy, close-to-mic proximity effect.',
    directive: 'Intimate, breathy, close-to-mic proximity effect.'
  },
  {
    id: 'empathetic',
    name: 'Empathetic',
    description: 'Warm, understanding, soft tone with gentle inflections.',
    directive: 'Warm, understanding, soft tone with gentle inflections.'
  },
  {
    id: 'promo-hype',
    name: 'Promo/Hype',
    description: 'High energy, punchy consonants, elongated vowels on excitement words.',
    directive: 'High energy, punchy consonants, elongated vowels on excitement words.'
  },
  {
    id: 'deadpan',
    name: 'Deadpan',
    description: 'Flat affect, minimal pitch variation, dry delivery.',
    directive: 'Flat affect, minimal pitch variation, dry delivery.'
  }
];

export const PACE_DIRECTIVES: VoicePaceDirective[] = [
  {
    id: 'natural',
    name: 'Natural',
    description: 'Natural conversational pace.',
    directive: 'Natural conversational pace.',
    playbackSpeedDefault: 1.0
  },
  {
    id: 'rapid-fire',
    name: 'Rapid Fire',
    description: 'Fast, energetic, no dead air. Sentences overlap slightly.',
    directive: 'Fast, energetic, no dead air. Sentences overlap slightly.',
    playbackSpeedDefault: 1.25
  },
  {
    id: 'the-drift',
    name: 'The Drift',
    description: 'Slow, liquid, zero urgency. Long pauses for breath.',
    directive: 'Slow, liquid, zero urgency. Long pauses for breath.',
    playbackSpeedDefault: 0.85
  },
  {
    id: 'staccato',
    name: 'Staccato',
    description: 'Short, clipped sentences with distinct pauses between words.',
    directive: 'Short, clipped sentences with distinct pauses between words.',
    playbackSpeedDefault: 1.0
  }
];

export const ACCENT_DIRECTIVES: VoiceAccentDirective[] = [
  {
    id: 'neutral',
    name: 'Neutral',
    shortName: 'Neutral',
    description: 'Standard neutral accent without regional coloring.',
    directive: 'Neutral clear pronunciation.'
  },
  {
    id: 'american-gen',
    name: 'American (Gen)',
    shortName: 'American (Gen)',
    description: 'Standard General American pronunciation.',
    directive: 'General American accent.'
  },
  {
    id: 'american-valley',
    name: 'American (Valley)',
    shortName: 'American (Valley)',
    description: 'American California Valley cadence with subtle uptalk.',
    directive: 'American Valley accent.'
  },
  {
    id: 'american-south',
    name: 'American (South)',
    shortName: 'American (South)',
    description: 'Southern American accent with warm relaxed cadence.',
    directive: 'American Southern accent.'
  },
  {
    id: 'british-rp',
    name: 'British (RP)',
    shortName: 'British (RP)',
    description: 'Received Pronunciation British accent, crisp and articulate.',
    directive: 'British Received Pronunciation (RP) accent.'
  },
  {
    id: 'british-brixton',
    name: 'British (Brixton)',
    shortName: 'British (Brixton)',
    description: 'British Brixton London multicultural urban accent.',
    directive: 'British Brixton accent.'
  },
  {
    id: 'transatlantic',
    name: 'Transatlantic',
    shortName: 'Transatlantic',
    description: 'Classic mid-Atlantic aristocratic broadcast cadence.',
    directive: 'Transatlantic accent.'
  },
  {
    id: 'australian',
    name: 'Australian',
    shortName: 'Australian',
    description: 'General Australian accent with rising inflection.',
    directive: 'Australian accent.'
  }
];

export const DEFAULT_MOMENT: MomentItem = {
  id: 'ymd-voice-input',
  title: 'Text Input',
  subtitle: 'Masukkan teks',
  lines: ['Input teks di sini'],
  note: 'Generator voice over'
};

export const PRESET_MOMENTS: MomentItem[] = [
  DEFAULT_MOMENT,
  {
    id: 'the-porch-light',
    title: 'The Porch Light',
    subtitle: 'An evening homecoming',
    lines: [
      'The porch light was still burning yellow.',
      'We sat on the wooden steps until the stars took over,',
      'remembering who we were before the world grew busy.'
    ],
    note: 'The night air and old memories.'
  },
  {
    id: 'unbroken-thread',
    title: 'An Unbroken Thread',
    subtitle: 'Between two souls',
    lines: [
      'Years can slip by like rain on glass,',
      'yet the first shared glance',
      'erases every mile in between.'
    ],
    note: 'True friendships need no catching up.'
  },
  {
    id: 'coffee-steam',
    title: 'Over Steaming Cups',
    subtitle: 'Morning reunion',
    lines: [
      'Two mugs, steam curling in the morning sun,',
      'unhurried words filling the silence,',
      'as if yesterday was only an hour ago.'
    ],
    note: 'Simple warmth shared across the table.'
  }
];
