import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const { _id, name, price, image, secondaryImage, category, stock } = product;
  const displayImage = isHovered && secondaryImage ? secondaryImage : image;
  const showPlaceholder = !displayImage || imageError;

  const handleClick = () => {
    navigate(`/products/${_id}`);
  };

  return (
    <div 
      className="group cursor-pointer"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {category ? (
            <span className="absolute left-4 top-4 z-10 rounded-full border border-white/70 bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-700 shadow-sm">
              {category}
            </span>
          ) : null}
          {stock === 0 ? (
            <span className="absolute right-4 top-4 z-10 rounded-full border border-red-200 bg-white/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-red-600 shadow-sm">
              Out of stock
            </span>
          ) : (
            <span className="absolute right-4 top-4 z-10 rounded-full border border-emerald-200 bg-white/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-600 shadow-sm">
              In stock
            </span>
          )}
          {showPlaceholder ? (
            <div className="flex h-full w-full items-center justify-center transition-transform duration-500 group-hover:scale-110">
              <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          ) : (
            <img
              src={displayImage}
              alt={name}
              onError={() => setImageError(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          )}
          <div className="pointer-events-none absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </div>
      <div className="mt-4 space-y-2 px-1">
        {category ? <p className="text-xs font-medium uppercase tracking-[0.22em] text-gray-500">{category}</p> : null}
        <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-gray-950">{name}</h3>
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-xl font-bold text-[#0A0A0A]">${typeof price === 'number' ? price.toFixed(2) : price}</p>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C9A84C]">View details</span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
