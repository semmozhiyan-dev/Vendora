import { useState } from 'react';

function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const { name, price, image, secondaryImage } = product;
  const displayImage = isHovered && secondaryImage ? secondaryImage : image;
  const showPlaceholder = !displayImage || imageError;

  return (
    <div 
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
        <div className="aspect-square overflow-hidden bg-gray-100">
          {showPlaceholder ? (
            <div className="w-full h-full flex items-center justify-center transition-transform group-hover:scale-110">
              <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          ) : (
            <img
              src={displayImage}
              alt={name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
            />
          )}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-medium text-gray-900 mb-1">{name}</h3>
        <p className="text-gray-900 font-semibold">${typeof price === 'number' ? price.toFixed(2) : price}</p>
      </div>
    </div>
  );
}

export default ProductCard;
