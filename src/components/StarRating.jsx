import { Star } from 'lucide-react';

export default function StarRating({ rating, count, size = 16 }) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[...Array(full)].map((_, i) => (
          <Star key={`f${i}`} size={size} className="star-filled fill-current" />
        ))}
        {half && (
          <span className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} className="star-empty absolute inset-0" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <Star size={size} className="star-filled fill-current" />
            </span>
          </span>
        )}
        {[...Array(empty)].map((_, i) => (
          <Star key={`e${i}`} size={size} className="star-empty" />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-sm text-gray-500 ml-1">({count.toLocaleString()})</span>
      )}
    </div>
  );
}
