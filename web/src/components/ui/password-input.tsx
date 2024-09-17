import React, { useState, forwardRef } from 'react';
import { Input } from './input';
import { Eye, EyeOff } from 'lucide-react';

// Option 1: Remove the empty interface and use the supertype directly
// Replace the empty interface with the actual type it's extending

// Option 2: Disable the ESLint rule for this specific interface
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

// Option 3: Add a dummy property
interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  _dummy?: never;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className='relative flex-1'>
        <Input
          {...props}
          ref={ref} // Forward the ref to the Input component
          type={showPassword ? 'text' : 'password'}
          className='pr-10'
        />
        {showPassword ? (
          <Eye
            width={20}
            height={20}
            className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer'
            onClick={() => setShowPassword(!showPassword)}
          />
        ) : (
          <EyeOff
            width={20}
            height={20}
            className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer'
            onClick={() => setShowPassword(!showPassword)}
          />
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;