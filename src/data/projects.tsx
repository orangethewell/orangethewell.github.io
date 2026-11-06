import { Sparkles } from 'lucide-react';
import type { OrbitItemProps } from '../components/SaturnOrbit';
import lebiageIcon from '../../assets/lebiage-favicon.png';
import ecaonomiaIcon from '../../assets/ecaonomia-brand.webp';

// Projects shown in the hero orbit and its detail card.
export const portfolioItems: OrbitItemProps[] = [
  {
    id: 'lebiage',
    label: 'Le Biagê',
    icon: <span className="flex h-full w-full items-center justify-center rounded-[22%] bg-[#e4e9db] p-[18%]"><img src={lebiageIcon} alt="" className="h-full w-full object-contain" /></span>,
    iconSize: 'large',
    href: 'https://lebiage.com.br/',
  },
  {
    id: 'ecaonomia',
    label: 'Ecãonomia',
    icon: <img src={ecaonomiaIcon} alt="" className="h-full w-full rounded-[28%] object-contain" />,
    iconSize: 'large',
    href: 'https://ecaonomia.vercel.app/',
  },
  {
    id: 'manunails',
    label: 'Manu C. Nails',
    icon: <span className="flex h-full w-full items-center justify-center rounded-[22%] bg-[#f2dee5] p-[18%]"><Sparkles aria-hidden="true" className="h-full w-full" strokeWidth={1.6} /></span>,
    iconSize: 'large',
    href: 'https://manunails.com.br/',
    color: '#995f70',
  },
];
