import { Link } from "@inertiajs/react";
import { useState } from "react";

const NavRoutes = () => {
  const [activeTab, setActiveTab] = useState("discover products");

  const navItems = [
    { id: "discover products", name: "Discover", icon: "🔍", url: "/products" },
    { id: "stores", name: "Stores", icon: "🏪", url: "/stores" },
    { id: "track order", name: "Track", icon: "📦", url: "/track-order" },
    { id: "help", name: "Help", icon: "❓", url: "/help" },
    { id: "contact us", name: "Contact", icon: "📞", url: "/contact" },
  ];

  return (
    <div className="w-full mt-6 md:mt-10">
      {/* Desktop - Tab Style */}
      <div className="hidden md:block">
        <div className="flex items-center justify-center">
          <div className="flex items-center bg-white rounded-full p-1 shadow-lg border border-gray-100">
            {navItems.map((item) => (
              <Link
                href={item.url}
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium uppercase tracking-wide text-sm">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile - Scrollable Tabs */}
      <div className="md:hidden overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1 min-w-max px-2">
          {navItems.map((item) => (
            <Link
              href={item.url}
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center px-4 py-3 rounded-2xl transition-all duration-300 min-w-[80px] ${
                activeTab === item.id
                  ? "bg-gradient-to-b from-blue-50 to-white text-blue-600 border border-blue-100"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-xs font-medium uppercase tracking-wide">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default NavRoutes;
