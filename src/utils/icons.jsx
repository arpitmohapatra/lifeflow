import * as Icons from 'lucide-react';

export const ICON_OPTIONS = [
    { name: 'List', icon: 'List' },
    { name: 'Shopping', icon: 'ShoppingCart' },
    { name: 'Home', icon: 'Home' },
    { name: 'Work', icon: 'Briefcase' },
    { name: 'Goal', icon: 'Target' },
    { name: 'Personal', icon: 'User' },
    { name: 'Heart', icon: 'Heart' },
    { name: 'Star', icon: 'Star' },
    { name: 'Idea', icon: 'Lightbulb' },
    { name: 'Book', icon: 'Book' },
    { name: 'Code', icon: 'Code' },
    { name: 'Coffee', icon: 'Coffee' },
    { name: 'Plan', icon: 'Calendar' },
    { name: 'Music', icon: 'Music' },
    { name: 'Car', icon: 'Car' },
    { name: 'Check', icon: 'CheckSquare' }
];

export function IconRenderer({ iconName, className = "w-5 h-5", style }) {
    const IconComponent = Icons[iconName] || Icons.List;
    return <IconComponent className={className} style={style} />;
}
