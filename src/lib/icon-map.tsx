import type { IconKey } from "@jaostudio/engine/types";
import type { LucideIcon } from "lucide-react";
import {
  Building, Home, Wrench, Route, ClipboardCheck, TrendingUp,
  SmilePlus, Syringe, Sparkles, Smile, Pill, Ambulance,
  Search, DollarSign, Truck, Zap, Droplets, Fan,
  Hammer, Paintbrush, Users, Shield, FileText, BookOpen,
} from "lucide-react";

export const ICON_MAP: Record<IconKey, LucideIcon> = {
  building: Building,
  home: Home,
  wrench: Wrench,
  route: Route,
  "clipboard-check": ClipboardCheck,
  "trending-up": TrendingUp,
  "smile-plus": SmilePlus,
  syringe: Syringe,
  sparkles: Sparkles,
  smile: Smile,
  pill: Pill,
  ambulance: Ambulance,
  search: Search,
  "dollar-sign": DollarSign,
  truck: Truck,
  zap: Zap,
  droplets: Droplets,
  fan: Fan,
  hammer: Hammer,
  paintbrush: Paintbrush,
  users: Users,
  shield: Shield,
  "file-text": FileText,
  "book-open": BookOpen,
};
