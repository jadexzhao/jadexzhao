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
  matchScore?: number
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
    matchScore: 94,
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
    matchScore: 88,
    obsession: 'Zero-merge-conflict code reviews by the lake',
    sharedInterests: ['TypeScript', 'CI pipelines'],
    bucketList: 'Pair-program a duck dating feature',
  },
  {
    id: 'quinn',
    handle: 'quinn_quacktail',
    displayName: 'Quinn Quacktail',
    bio: 'Mixologist of pond water. Looking for someone who gets my garnish game.',
    pond: 'Reeds Bar',
    mood: 'single',
    emoji: '🍋',
    matchScore: 91,
    obsession: 'Cucumber-mint pond cocktails (zero commitment issues)',
    sharedInterests: ['Mixology', 'Reed-bar aesthetics'],
    bucketList: 'Host a quacktail pop-up at sunset',
  },
  {
    id: 'pearl',
    handle: 'pearl_paddler',
    displayName: 'Pearl Paddler',
    bio: 'WCAG advocate. If your nest isn’t accessible, we’re not nesting.',
    pond: 'Inclusive Bay',
    mood: 'wading',
    emoji: '♿',
    verified: true,
    matchScore: 96,
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
    matchScore: 85,
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
    matchScore: 79,
    obsession: 'Konami-code easter eggs in production',
    sharedInterests: ['Chaos gremlin energy', 'Retro games'],
    bucketList: 'Trigger 50 ducks on a first date',
  },
]

export const INITIAL_QUACKS: Quack[] = [
  {
    id: 'q1',
    authorId: 'mallory',
    content:
      'Just watched the sunrise from the east reeds. If you’re not a morning duck, at least be a morning-text duck.',
    timestamp: '2h',
    replies: 12,
    requacks: 34,
    hearts: 128,
  },
  {
    id: 'q2',
    authorId: 'drake',
    content:
      'Hot take: the best first date is a code review by the pond. No merge conflicts, only chemistry.',
    timestamp: '4h',
    replies: 28,
    requacks: 89,
    hearts: 412,
  },
  {
    id: 'q3',
    authorId: 'quinn',
    content:
      'New quacktail drop: cucumber splash, hint of mint, zero commitment issues. DM for the recipe.',
    timestamp: '5h',
    replies: 19,
    requacks: 56,
    hearts: 203,
  },
  {
    id: 'q4',
    authorId: 'pearl',
    content:
      'Reminder: contrast ratio matters in love letters too. If I can’t read your intentions at 4.5:1, swipe left.',
    timestamp: '8h',
    replies: 41,
    requacks: 112,
    hearts: 567,
  },
  {
    id: 'q5',
    authorId: 'gander',
    content:
      'Found a pebble that looks exactly like 福州. Keeping it. Also keeping an eye out for someone who appreciates geography.',
    timestamp: '11h',
    replies: 8,
    requacks: 22,
    hearts: 94,
  },
  {
    id: 'q6',
    authorId: 'waddles',
    content:
      '50 ducks just appeared on my screen and honestly? Same energy I want in a relationship.',
    timestamp: '1d',
    replies: 67,
    requacks: 201,
    hearts: 891,
  },
]

export const TRENDING_TOPICS = [
  { tag: '#PondParty', posts: '2.4K quacks' },
  { tag: '#BreadOrBust', posts: '1.8K quacks' },
  { tag: '#鸭年Dating', posts: '956 quacks' },
  { tag: '#NestGoals', posts: '743 quacks' },
]

export function getProfile(id: string): DuckProfile | undefined {
  return DUCK_PROFILES.find((p) => p.id === id) ?? (id === CURRENT_USER.id ? CURRENT_USER : undefined)
}
