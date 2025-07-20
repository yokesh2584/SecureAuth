import { useEffect, useRef } from "react";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
}

export const OtpInput = ({
  length = 6,
  value,
  onChange,
  autoFocus,
}: OtpInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const val = e.target.value;

    if (!/^\d*$/.test(val)) return; // Only digits

    const newOtp = value.split("");
    newOtp[index] = val.slice(-1); // Take only last digit
    onChange(newOtp.join(""));

    if (val && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (
      e.key === "Backspace" &&
      !value[index] &&
      inputRefs.current[index - 1]
    ) {
      const newOtp = value.split("");
      newOtp[index - 1] = "";
      onChange(newOtp.join(""));
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .slice(0, length)
      .replace(/\D/g, "");
    if (pasted.length === length) {
      onChange(pasted);
    }
  };

  return (
    <div className="mx-auto my-4 flex max-w-xs justify-between gap-2">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          ref={(el) => {
            inputRefs.current[i] = el;
          }}
          className="h-12 w-12 rounded-md border border-gray-300 text-center text-xl font-semibold transition-transform duration-150 ease-in-out focus:scale-110 focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
      ))}
    </div>
  );
};
