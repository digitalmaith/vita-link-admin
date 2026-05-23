// components/dashboard/badges/badge-presets.ts

export interface PresetBadge {
  name: string;
  description: string;
  emoji: string;
  iconUrl: string;
  criteria: string;
  isSeasonal?: boolean;
  season?: string;
  color: string;
}

export const PRESET_BADGES: PresetBadge[] = [
  {
    name: "Guerrier",
    description: "A effectué 5 dons de sang",
    emoji: "⚔️",
    iconUrl: "https://img.icons8.com/fluency/96/sword.png",
    criteria: '{"minDonations": 5}',
    color: "from-amber-500 to-orange-600",
  },
  {
    name: "Héros",
    description: "A effectué 10 dons de sang",
    emoji: "🦸",
    iconUrl: "https://img.icons8.com/fluency/96/superhero.png",
    criteria: '{"minDonations": 10}',
    color: "from-blue-500 to-indigo-600",
  },
  {
    name: "Légende",
    description: "A effectué 25 dons de sang",
    emoji: "🌟",
    iconUrl: "https://img.icons8.com/fluency/96/prize.png",
    criteria: '{"minDonations": 25}',
    color: "from-purple-500 to-pink-600",
  },
  {
    name: "Champion",
    description: "A effectué 50 dons de sang",
    emoji: "🏆",
    iconUrl: "https://img.icons8.com/fluency/96/trophy.png",
    criteria: '{"minDonations": 50}',
    color: "from-yellow-500 to-amber-600",
  },
  {
    name: "Sauveur",
    description: "A sauvé 3 vies estimées",
    emoji: "❤️",
    iconUrl: "https://img.icons8.com/fluency/96/like.png",
    criteria: '{"livesSaved": 3}',
    color: "from-red-500 to-rose-600",
  },
  {
    name: "Ambassadeur",
    description: "A parrainé 5 donneurs",
    emoji: "🤝",
    iconUrl: "https://img.icons8.com/fluency/96/handshake.png",
    criteria: '{"referrals": 5}',
    color: "from-green-500 to-emerald-600",
  },
  {
    name: "Fidèle",
    description: "3 dons consécutifs",
    emoji: "💎",
    iconUrl: "https://img.icons8.com/fluency/96/diamond.png",
    criteria: '{"consecutiveDonations": 3}',
    color: "from-cyan-500 to-blue-600",
  },
  {
    name: "Défi Ramadan",
    description: "Don effectué pendant le Ramadan",
    emoji: "🌙",
    iconUrl: "https://img.icons8.com/fluency/96/crescent-moon.png",
    criteria: '{"season": "Ramadan"}',
    isSeasonal: true,
    season: "Ramadan 2026",
    color: "from-indigo-500 to-purple-600",
  },
  {
    name: "Défi Tabaski",
    description: "Don effectué pendant la Tabaski",
    emoji: "⭐",
    iconUrl: "https://img.icons8.com/fluency/96/star.png",
    criteria: '{"season": "Tabaski"}',
    isSeasonal: true,
    season: "Tabaski 2026",
    color: "from-teal-500 to-green-600",
  },
];