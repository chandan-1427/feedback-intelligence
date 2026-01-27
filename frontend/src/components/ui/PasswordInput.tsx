import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

type PasswordInputProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
};

const PasswordInput: React.FC<PasswordInputProps> = ({
  label = "Password",
  value,
  onChange,
  placeholder = "••••••••",
  disabled,
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="group space-y-1.5 w-full">
      {/* Label: Minimal and architectural */}
      <label className="block text-[11px] font-medium text-gray-500 ml-1 uppercase tracking-wider font-noto transition-colors group-focus-within:text-gray-300">
        {label}
      </label>

      <div className="relative">
        {/* Left Icon: Subdued color shift on focus */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-500 transition-colors duration-300 group-focus-within:text-purple-400/80">
          <Lock className="w-4.5 h-4.5" />
        </div>

        {/* Input: The core subtle glass element */}
        <input
          type={showPassword ? "text" : "password"}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            font-work w-full pl-11 pr-12 py-3
            bg-white/[0.02] backdrop-blur-md
            border border-white/[0.06] rounded-xl
            text-white text-sm placeholder-white/10
            outline-none transition-all duration-300
            
            /* Subdued Focus State */
            focus:bg-white/[0.04]
            focus:border-purple-500/30
            focus:shadow-[0_0_15px_rgba(0,0,0,0.2)]
            
            /* Disabled & Selection */
            selection:bg-purple-500/30
            disabled:opacity-30 disabled:cursor-not-allowed
          `}
        />

        {/* Toggle Visibility Button */}
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all active:scale-90 focus:outline-none disabled:opacity-0"
          aria-label={showPassword ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="w-4.5 h-4.5 animate-in fade-in duration-300" />
          ) : (
            <Eye className="w-4.5 h-4.5 animate-in fade-in duration-300" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;