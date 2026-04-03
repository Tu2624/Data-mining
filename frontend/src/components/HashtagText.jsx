import React from 'react';
import { Link } from 'react-router-dom';

const HashtagText = ({ text }) => {
  if (!text) return null;

  // Tách text dựa trên dấu cách nhưng giữ lại các hashtags
  const parts = text.split(/(\s+)/);

  return (
    <span className="whitespace-pre-wrap break-words leading-relaxed text-[15px] text-gray-800">
      {parts.map((part, index) => {
        if (part.startsWith('#') && part.length > 1) {
          const tagName = part.substring(1).toLowerCase();
          return (
            <Link
              key={index}
              to={`/search?q=%23${tagName}`}
              className="text-primary-500 hover:underline font-medium"
            >
              {part}
            </Link>
          );
        }
        return part;
      })}
    </span>
  );
};

export default HashtagText;
