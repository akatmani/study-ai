import React from 'react';
import { cn } from '@/lib/utils';

interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, label, description, size = 'md', ...props }, ref) => {
    const sizes = {
      sm: 'w-7 h-4 after:h-3 after:w-3',
      md: 'w-9 h-5 after:h-4 after:w-4',
      lg: 'w-11 h-6 after:h-5 after:w-5'
    };

    return (
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          ref={ref}
          {...props}
        />
        <div className={cn(
          "bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-neutral-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:transition-all peer-checked:bg-neutral-900",
          sizes[size]
        )}></div>
        {(label || description) && (
          <div className="ml-3">
            {label && <span className="text-sm font-medium text-neutral-900">{label}</span>}
            {description && <p className="text-xs text-neutral-500">{description}</p>}
          </div>
        )}
      </label>
    );
  }
);

Toggle.displayName = 'Toggle';

export { Toggle };
