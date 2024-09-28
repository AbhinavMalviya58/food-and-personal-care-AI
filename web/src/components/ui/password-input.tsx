import React, { useState, forwardRef } from 'react';
import { Input } from './input';
import { Eye, EyeOff } from 'lucide-react';

const PasswordInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
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