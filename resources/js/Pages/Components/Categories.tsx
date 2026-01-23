
import { useRef, useState } from "react";

const categories = [
  { name: 'Global finds', image: '/category/cate1.webp', url: '/' },
  { name: 'Ecommerce', image: '/category/cate2.webp', url: '/' },
  { name: 'SmartPhone', image: '/category/cate3.webp', url: '/' },
  { name: 'Grocery', image: '/category/cate4.webp', url: '/' },
  { name: 'Electronics & Applicances', image: '/category/cate5.webp', url: '/' },
  { name: 'Men', image: '/category/cate6.webp', url: '/' },
  { name: 'Women', image: '/category/cate7.webp', url: '/' },
  { name: 'Furniture', image: '/category/cate8.webp', url: '/' },
  { name: 'Beauty', image: '/category/cate9.webp', url: '/' },
  { name: 'Baby Care', image: '/category/cate10.webp', url: '/' },
  { name: 'HouseHold Essentials', image: '/category/cate11.webp', url: '/' },
  { name: 'Toys', image: '/category/cate12.webp', url: '/' },
];

const Categories = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({
    startX: 0,
    scrollLeft: 0
  });

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    setIsDragging(true);

    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;

    dragState.current = {
      startX: pageX - container.offsetLeft,
      scrollLeft: container.scrollLeft
    };

    container.style.cursor = 'grabbing';

    // Prevent text selection
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;

    e.preventDefault();
    const container = containerRef.current;
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    const x = pageX - container.offsetLeft;
    const walk = (x - dragState.current.startX) * 2;

    container.scrollLeft = dragState.current.scrollLeft - walk;
  };

  const handleDragEnd = () => {
    setIsDragging(false);

    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab';
    }

    // Restore text selection
    document.body.style.userSelect = 'auto';
    document.body.style.webkitUserSelect = 'auto';
  };

  return (
    <div className="w-full mt-16">
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Shop by Category
        </h2>
      </div>

      <div
        ref={containerRef}
        className={`flex overflow-x-auto scrollbar-hide py-5 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <div className="flex gap-5 px-5 min-w-max">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="group flex-shrink-0 w-fit flex flex-col items-center rounded-2xl shadow p-6 border border-gray-100 hover:-translate-y-1 transition-all duration-300 bg-white select-none"
              onClick={(e) => {
                // Prevent click if we were dragging
                if (isDragging) {
                  e.preventDefault();
                }
              }}
            >
              <div className="relative mb-5">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 p-3">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300 select-none pointer-events-none"
                    loading="lazy"
                    draggable="false"
                    onDragStart={(e) => e.preventDefault()}
                  />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-blue-200/30" />
              </div>
              <span className="text-sm font-semibold text-gray-900 text-center px-2 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors duration-200 select-none">
                {cat.name}
              </span>
              <div className="w-8 h-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-60 mt-2" />
            </div>
          ))}
        </div>
      </div>


      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Prevent text selection during drag */
        .select-none {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
        }

        /* Prevent image dragging */
        img {
          -webkit-user-drag: none;
          -khtml-user-drag: none;
          -moz-user-drag: none;
          -o-user-drag: none;
          user-drag: none;
        }
      `}</style>
    </div>
  );
};

export default Categories;
