import { type LucideProps } from 'lucide-react';
import dynamic from 'next/dynamic';

// Icons are dynamically imported for better performance
const Icons = {
  alertCircle: dynamic(() => import('lucide-react').then(mod => mod.AlertCircle)),
  arrowRight: dynamic(() => import('lucide-react').then(mod => mod.ArrowRight)),
  check: dynamic(() => import('lucide-react').then(mod => mod.Check)),
  chevronDown: dynamic(() => import('lucide-react').then(mod => mod.ChevronDown)),
  chevronRight: dynamic(() => import('lucide-react').then(mod => mod.ChevronRight)),
  clock: dynamic(() => import('lucide-react').then(mod => mod.Clock)),
  creditCard: dynamic(() => import('lucide-react').then(mod => mod.CreditCard)),
  dollarSign: dynamic(() => import('lucide-react').then(mod => mod.DollarSign)),
  filter: dynamic(() => import('lucide-react').then(mod => mod.Filter)),
  home: dynamic(() => import('lucide-react').then(mod => mod.Home)),
  loader: dynamic(() => import('lucide-react').then(mod => mod.Loader2)),
  logIn: dynamic(() => import('lucide-react').then(mod => mod.LogIn)),
  logOut: dynamic(() => import('lucide-react').then(mod => mod.LogOut)),
  menu: dynamic(() => import('lucide-react').then(mod => mod.Menu)),
  minus: dynamic(() => import('lucide-react').then(mod => mod.Minus)),
  package: dynamic(() => import('lucide-react').then(mod => mod.Package)),
  plus: dynamic(() => import('lucide-react').then(mod => mod.Plus)),
  refreshCw: dynamic(() => import('lucide-react').then(mod => mod.RefreshCw)),
  search: dynamic(() => import('lucide-react').then(mod => mod.Search)),
  settings: dynamic(() => import('lucide-react').then(mod => mod.Settings)),
  shoppingCart: dynamic(() => import('lucide-react').then(mod => mod.ShoppingCart)),
  star: dynamic(() => import('lucide-react').then(mod => mod.Star)),
  truck: dynamic(() => import('lucide-react').then(mod => mod.Truck)),
  user: dynamic(() => import('lucide-react').then(mod => mod.User)),
  x: dynamic(() => import('lucide-react').then(mod => mod.X)),
  xCircle: dynamic(() => import('lucide-react').then(mod => mod.XCircle)),
};

export { Icons };

export type IconName = keyof typeof Icons;

export interface IconProps extends LucideProps {
  name: keyof typeof Icons;
}

export function Icon({ name, ...props }: IconProps) {
  const IconComponent = Icons[name];
  return <IconComponent {...props} />;
}
