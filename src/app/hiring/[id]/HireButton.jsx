// app/hiring/[id]/HireButton.jsx
"use client";

export default function HireButton({ name }) {
  return (
    <button
      className="hire-button"
      onClick={() => alert(`We'll connect you with ${name} soon!`)}
    >
      Hire Now
    </button> 

  );
}
