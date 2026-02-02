import React from 'react';
import * as LucideIcons from 'lucide-react';

interface ServiceItem {
    icon: string;
    title: string;
    description: string;
}

interface Props {
    items: ServiceItem[];
}

export default function ServicesList({ items }: Props) {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {items.map((item, idx) => {
                // Dynamic Icon Resolution
                const IconComponent = (LucideIcons as any)[item.icon] || LucideIcons.HelpCircle;

                return (
                    <div key={idx} className="flex flex-col items-center text-center group">
                        <div className="w-16 h-16 rounded-full bg-patagonia-snow flex items-center justify-center mb-6 text-patagonia-lake group-hover:bg-patagonia-lake group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md">
                            <IconComponent size={32} strokeWidth={1.5} />
                        </div>
                        <h4 className="text-xl font-serif text-patagonia-deep mb-3">{item.title}</h4>
                        <p className="text-sm text-stone-600 leading-relaxed max-w-xs mx-auto">
                            {item.description}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}
