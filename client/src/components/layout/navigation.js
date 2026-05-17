import {
  LayoutDashboard,
  Leaf,
  TrendingUp,
  Map,
  Settings,
  MessageCircle,
} from 'lucide-react';

export const protectedPrimaryNavItems = [
  { icon: LayoutDashboard, label: 'Overview', shortLabel: 'Home', path: '/dashboard' },
  { icon: Leaf, label: 'Crop Intelligence', shortLabel: 'Crops', path: '/upload' },
  { icon: TrendingUp, label: 'Credit Pulse', shortLabel: 'Finance', path: '/trust-score' },
  { icon: MessageCircle, label: 'AI Assistant', shortLabel: 'AI Chat', path: '/chat' },
  { icon: Map, label: 'Land Assets', shortLabel: 'Analytics', path: '/analytics' },
  { icon: Settings, label: 'Settings', shortLabel: 'Profile', path: '/profile' },
];

export const protectedMobileMenuItems = protectedPrimaryNavItems;

export const protectedBottomNavItems = [
  protectedPrimaryNavItems[0],
  protectedPrimaryNavItems[1],
  protectedPrimaryNavItems[2],
  protectedPrimaryNavItems[3],
  protectedPrimaryNavItems[4],
  protectedPrimaryNavItems[5],
];
