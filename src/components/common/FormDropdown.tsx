import React from 'react';
import { Dropdown } from '@/components/ui/dropdown';

interface FormDropdownProps extends React.ComponentProps<'select'> {
    error?: string;
    hideArrow?: boolean;
}

export const FormDropdown = ({
    error,
    className,
    children,
    ...props
}: FormDropdownProps) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            <Dropdown
                className={`w-full ${className || ''} ${error ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                {...props}
            >
                {children}
            </Dropdown>
            {error && <p className="text-red-500 text-xs ml-1">{error}</p>}
        </div>
    );
};
