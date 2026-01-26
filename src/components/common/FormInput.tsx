import React from 'react';
import { Input } from '@/components/ui/input';

interface FormInputProps extends React.ComponentProps<'input'> {
    error?: string;
    // We can add more specific props if needed, but passing through input props is usually best
}

export const FormInput = ({ error, className, ...props }: FormInputProps) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            <Input
                className={`w-full ${className || ''} ${error ? 'border-red-500 focus-visible:ring-red-500' : ''
                    }`}
                {...props}
            />
            {error && <p className="text-red-500 text-xs ml-1">{error}</p>}
        </div>
    );
};
