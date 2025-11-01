
import React from 'react';
import { useNavigate } from 'react-router-dom';
// Fix: Added .tsx extension
import type { Brand } from '../DashboardPage.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card.tsx';
import { Button } from '../../ui/Button.tsx';

// A simple dropdown for actions
const ActionsMenu = ({ onEdit, onDelete }: { onEdit: () => void, onDelete: () => void }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  return (
    <div className="relative" ref={menuRef}>
      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen);}} className="w-8 h-8 -mr-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
      </Button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-slate-800 ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <button onClick={(e) => { e.stopPropagation(); onEdit(); setIsOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">Edit</button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(); setIsOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700">Delete</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Fix: Defined BrandCardProps interface.
interface BrandCardProps {
  brand: Brand;
  onEdit: () => void;
  onDelete: () => void;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <Card onClick={() => navigate(`/brand/${brand.id}`)} className="flex flex-col h-full group transition-all duration-300 hover:border-primary/80 hover:shadow-primary/20 cursor-pointer">
      <CardHeader className="flex-row items-start gap-4 space-y-0">
          <div className="w-16 h-16 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: brand.primary_color || '#8b5cf6' }}>
            {brand.logo_url ? (
              <img src={brand.logo_url} alt={`${brand.name} logo`} className="w-12 h-12 object-contain" />
            ) : (
              <span className="text-2xl font-bold" style={{color: brand.secondary_color || '#ffffff'}}>{brand.name?.charAt(0) || 'B'}</span>
            )}
          </div>
          <div className="flex-grow">
            <CardTitle className="text-lg leading-tight group-hover:text-primary">{brand.name}</CardTitle>
            <p className="text-sm text-slate-400 truncate">{brand.description || 'No description'}</p>
          </div>
          <ActionsMenu onEdit={onEdit} onDelete={onDelete} />
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{backgroundColor: brand.primary_color || '#8b5cf6' }}></div>
                <span className="text-slate-300">{brand.primary_color || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-slate-600" style={{backgroundColor: brand.secondary_color || '#ffffff' }}></div>
                <span className="text-slate-300">{brand.secondary_color || 'N/A'}</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandCard;
