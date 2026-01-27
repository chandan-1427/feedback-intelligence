import React from "react";
import type { LucideIcon } from "lucide-react";

type TextInputProps = {
  label: string;
  icon: LucideIcon;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
};

const TextInput: React.FC<TextInputProps> = ({
  label,
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
  required = false,
}) => {
  return (
    <div className="group space-y-1.5 w-full">
      {/* Label: Toned down color and tracking for a cleaner look */}
      <label className="block text-[11px] font-medium text-gray-500 ml-1 uppercase tracking-wider font-noto transition-colors group-focus-within:text-gray-300">
        {label}
      </label>

      <div className="relative">
        {/* Icon: Removed the scale-up and vibrant purple to keep it calm */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-500 transition-colors duration-300 group-focus-within:text-purple-400/80">
          <Icon className="w-4.5 h-4.5" />
        </div>

        {/* Input: The core element */}
        <input
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            font-work w-full pl-11 pr-4 py-3
            bg-white/[0.02] backdrop-blur-md
            border border-white/[0.06] rounded-xl
            text-white text-sm placeholder-white/10
            outline-none transition-all duration-300
            
            /* Subdued Focus State: No neon glows, just a crisp border and soft shadow */
            focus:bg-white/[0.04]
            focus:border-purple-500/30
            focus:shadow-[0_0_15px_rgba(0,0,0,0.2)]
            
            /* Selection & Disabled */
            selection:bg-purple-500/30
            disabled:opacity-30 disabled:cursor-not-allowed
          `}
        />
      </div>
    </div>
  );
};

export default TextInput;