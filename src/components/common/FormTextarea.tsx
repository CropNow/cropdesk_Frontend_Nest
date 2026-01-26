import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface FormTextareaProps extends React.ComponentProps<'textarea'> {
    error?: string;
}

export const FormTextarea = ({ error, className, ...props }: FormTextareaProps) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            <Textarea
                className={`w-full ${className || ''} ${error ? 'border-red-500 focus-visible:ring-red-500' : ''
                    }`}
                {...props}
            />
            {error && <p className="text-red-500 text-xs ml-1">{error}</p>}
        </div>
    );
};
