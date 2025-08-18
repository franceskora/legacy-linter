// src/components/Sidebar.tsx
'use client';

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-gray-200 bg-gray-50 p-4">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
        History
      </h2>
      {/* We will add a list of previous projects here */}
      <div className="text-center text-gray-400 mt-8">
        No projects yet.
      </div>
    </aside>
  );
}