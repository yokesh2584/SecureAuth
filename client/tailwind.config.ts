// tailwind.config.ts

export default {
  theme: {
    extend: {
      keyframes: {
        // fade and scale effect
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(10px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.3s ease-out",
      },
    },
  },
};
