import { useState, useEffect } from 'react';

//Debouncing is like a cool-down timer for your code. 
//It tells the computer: "Hey, don't run this heavy action (like an API call) every single millisecond.
//Wait until the user has completely stopped doing what they're doing for a brief moment before you fire." credit: Gemini
export function useDebounce(value, delay = 400) {
  // State to store our debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 1. Setup a timer to update our debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 2. CLEANUP: If the user types another letter before the 400ms is up,
    // this cleanup function runs automatically, clearing the timer instantly.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Re-run this effect only if the text input or delay changes

  return debouncedValue;
}