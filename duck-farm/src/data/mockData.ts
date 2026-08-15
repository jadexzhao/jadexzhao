export type DuckMood = 'single' | 'wading' | 'matched'

export interface DuckProfile {
  id: string
  handle: string
  displayName: string
  bio: string
  pond: string
  mood: DuckMood
  emoji: string
  verified?: boolean
  /** Sandbox ordering only ... not a real match algorithm */
  demoOrder?: number
  obsession?: string
  sharedInterests?: string[]
  bucketList?: string
}

export interface Quack {
  id: string
  authorId: string
  content: string
  timestamp: string
  replies: number
  requacks: number
  hearts: number
  flirted?: boolean
  pending?: boolean
}

export const CURRENT_USER: DuckProfile = {
  id: 'jade',
  handle: 'jadexzhao',
  displayName: 'Jade Zhao',
  bio: 'Portfolio duck · 福州 roots · building playful interfaces',
  pond: 'Indiana · 鸭年 2026',
  mood: 'wading',
  emoji: '🦆',
  verified: true,
  obsession: 'Ship playful interfaces before the pond freezes',
}

export const DUCK_PROFILES: DuckProfile[] = [
  {
    id: 'mallory',
    handle: 'mallory_mallard',
    displayName: 'Mallory Mallard',
    bio: 'Sunrise paddler. Will share bread but only the good kind.',
    pond: 'North Pond',
    mood: 'single',
    emoji: '🌅',
    demoOrder: 1,
    obsession: 'Sunrise paddles & artisan bread crumbs',
    sharedInterests: ['Morning rituals', 'Pond photography'],
    bucketList: 'Fly south with someone who packs snacks',
  },
  {
    id: 'drake',
    handle: 'drake_dev',
    displayName: 'Drake the Dev Duck',
    bio: 'Ships features at pond velocity. TypeScript enjoyer.',
    pond: 'Dev Lake',
    mood: 'matched',
    emoji: '💻',
    demoOrder: 3,
    obsession: 'Zero-merge-conflict code reviews by the lake',
    sharedInterests: ['TypeScript', 'CI pipelines'],
    bucketList: 'Pair-program a duck social feature',
  },
  {
    id: 'quinn',
    handle: 'quinn_quacktail',
    displayName: 'Quinn Quacktail',
    bio: 'Mixologist of pond water. Looking for someone who gets my garnish game.',
    pond: 'Reeds Bar',
    mood: 'single',
    emoji: '🍋',
    demoOrder: 2,
    obsession: 'Cucumber-mint pond cocktails (zero commitment issues)',
    sharedInterests: ['Mixology', 'Reed-bar aesthetics'],
    bucketList: 'Host a quacktail pop-up at sunset',
  },
  {
    id: 'pearl',
    handle: 'pearl_paddler',
    displayName: 'Pearl Paddler',
    bio: 'WCAG advocate. If your nest is not accessible, we are not nesting.',
    pond: 'Inclusive Bay',
    mood: 'wading',
    emoji: '♿',
    verified: true,
    demoOrder: 0,
    obsession: '4.5:1 contrast in love letters AND landing pages',
    sharedInterests: ['WCAG', 'Inclusive design'],
    bucketList: 'Audit every nest on the pond',
  },
  {
    id: 'gander',
    handle: 'gander_gold',
    displayName: 'Gander Gold',
    bio: 'Collects shiny pebbles. Fluent in Mandarin puns.',
    pond: 'Gold Coast',
    mood: 'single',
    emoji: '✨',
    demoOrder: 4,
    obsession: 'Collecting pebbles that look like 福州',
    sharedInterests: ['Geography puns', 'Mandarin wordplay'],
    bucketList: 'Find a nest-mate who gets the joke',
  },
  {
    id: 'waddles',
    handle: 'waddles_wild',
    displayName: 'Waddles Wild',
    bio: 'Chaos gremlin duck. Konami code enthusiast.',
    pond: 'Stampede Creek',
    mood: 'matched',
    emoji: '🎮',
    demoOrder: 5,
    obsession: 'Konami-code easter eggs in production',
    sharedInterests: ['Chaos gremlin energy', 'Retro games'],
    bucketList: 'Trigger fifty ducks in one feed refresh',
  },
]

/** Sample feed only ... small counts so it reads as a sandbox deck, not viral metrics. */
export const INITIAL_QUACKS: Quack[] = [
  {
    id: 'q1',
    authorId: 'mallory',
    content:
      'Just watched the sunrise from the east reeds. If you are not a morning duck, at least be a morning-text duck.',
    timestamp: '2h',
    replies: 2,
    requacks: 4,
    hearts: 11,
  },
  {
    id: 'q2',
    authorId: 'drake',
    content:
      'Hot take: the best hang is a code review by the pond. No merge conflicts, only chemistry.',
    timestamp: '4h',
    replies: 3,
    requacks: 6,
    hearts: 14,
  },
  {
    id: 'q3',
    authorId: 'quinn',
    content:
      'New quacktail drop: cucumber splash, hint of mint, zero commitment issues. DM for the recipe.',
    timestamp: '5h',
    replies: 1,
    requacks: 3,
    hearts: 9,
  },
  {
    id: 'q4',
    authorId: 'pearl',
    content:
      'Reminder: contrast ratio matters in love letters too. If I cannot read your intentions at 4.5:1, swipe left.',
    timestamp: '8h',
    replies: 5,
    requacks: 8,
    hearts: 17,
  },
  {
    id: 'q5',
    authorId: 'gander',
    content:
      'Found a pebble that looks exactly like 福州. Keeping it. Also keeping an eye out for someone who appreciates geography.',
    timestamp: '11h',
    replies: 1,
    requacks: 2,
    hearts: 7,
  },
  {
    id: 'q6',
    authorId: 'waddles',
    content:
      'Fifty ducks just appeared on my screen and honestly? Same energy I want in a relationship.',
    timestamp: '1d',
    replies: 4,
    requacks: 9,
    hearts: 19,
  },
]

export const TRENDING_TOPICS = [
  { tag: '#PondParty', posts: 'sandbox tag' },
  { tag: '#BreadOrBust', posts: 'sandbox tag' },
  { tag: '#鸭年Social', posts: 'sandbox tag' },
  { tag: '#NestGoals', posts: 'sandbox tag' },
]

export function getProfile(id: string): DuckProfile | undefined {
  return DUCK_PROFILES.find((p) => p.id === id) ?? (id === CURRENT_USER.id ? CURRENT_USER : undefined)
}
