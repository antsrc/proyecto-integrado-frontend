import React from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export default function NotificationBox({ title, items, emptyText, getCode, getSecondary, getNavigateTo, getNavigateState, getButtonTitle, notificationCount }) {
  const navigate = useNavigate();
  const count = typeof notificationCount === 'number' ? notificationCount : (items && items.length ? items.length : 0);
  return (
    <div className="bg-white rounded-lg px-6 py-6 shadow-sm">
      <div className="flex items-center mb-4 gap-2">
        <span className={`inline-flex items-center justify-center rounded-full font-semibold text-sm w-7 h-7
          ${count > 0
            ? 'bg-yellow-300 text-yellow-700'
            : 'bg-green-100 text-green-700'}
        `}>
          {count}
        </span>
        <h2 className="text-lg font-semibold ml-1">{title}</h2>
      </div>
      {items && items.length > 0 ? (
        <ul className="divide-y divide-gray-100">
          {items.map((item, i) => (
            <li key={item.id || i} className="py-2.5 flex items-center gap-2 font-sans min-w-0 flex-wrap">
              <span className="text-sm text-gray-700 min-w-[90px] max-w-full md:max-w-[180px] truncate">{getCode(item)}</span>
              <span className="text-xs text-gray-500 font-sans min-w-[70px] max-w-full md:max-w-[140px] truncate">{getSecondary(item)}</span>
              <span className="flex-1" />
              <button
                className="text-gray-500 hover:text-purple-600 cursor-pointer focus:outline-none transition-colors"
                title={getButtonTitle ? getButtonTitle(item) : "Ver detalle"}
                onClick={() => navigate(getNavigateTo(item), getNavigateState ? getNavigateState(item) : undefined)}
              >
                <Search className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">{emptyText}</p>
      )}
    </div>
  );
}
