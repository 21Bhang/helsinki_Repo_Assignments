import { useState } from "react";

export const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const reset = () => {
    setValue("");
  };

  // Return only the props needed for the input element
  // Exclude 'reset' from being spread onto the input
  return {
    type,
    value,
    onChange,
    reset,
  };
};
