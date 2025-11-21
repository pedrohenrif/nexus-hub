import React from 'react';
import { Server, Box, Terminal, Layout, Code } from 'lucide-react';

interface BadgeProps {
  children: React.ReactNode;
  color?: 'gray' | 'green' | 'blue' | 'yellow' | 'purple' | 'red';
}

export const Badge: React.FC<BadgeProps> = ({ children, color = 'gray' }) => {
  const colors = {
    gray: 'bg-gray-100 text-gray-800 border-gray-200',
    green: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    red: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[color]}`}>
      {children}
    </span>
  );
};

export const TypeBadge: React.FC<{ type: string }> = ({ type }) => {
  const styles: Record<string, { color: string; icon: any }> = {
    API: { color: 'text-blue-700 bg-blue-50 border-blue-200', icon: Server },
    Automação: { color: 'text-purple-700 bg-purple-50 border-purple-200', icon: Box },
    Bot: { color: 'text-orange-700 bg-orange-50 border-orange-200', icon: Terminal },
    Site: { color: 'text-green-700 bg-green-50 border-green-200', icon: Layout },
    Script: { color: 'text-gray-700 bg-gray-50 border-gray-200', icon: Code },
  };

  const style = styles[type] || styles.API;
  const Icon = style.icon;

  return (
    <span className={`flex items-center gap-1 font-mono text-[10px] px-2 py-1 rounded border ${style.color}`}>
      <Icon size={10} />
      {type}
    </span>
  );
};