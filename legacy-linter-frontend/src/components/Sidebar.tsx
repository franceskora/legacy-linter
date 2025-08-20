// src/components/Sidebar.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface HistoryItem {
  id: number;
  user_input: string;
}

export default function Sidebar() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // NOTE: This uses a placeholder URL. Update it to your live backend URL's /history endpoint.
        const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/chat/', '/history/') || 'http://127.0.0.1:8000/history/';
        const response = await axios.get(apiUrl);
        setHistory(response.data);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <aside className="w-64 border-r border-gray-200 bg-gray-50 p-4 flex flex-col">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 shrink-0">
        History
      </h2>
      <div className="flex-1 overflow-y-auto">
        {isLoading && <p className="text-gray-400">Loading...</p>}
        {!isLoading && history.length === 0 && (
          <p className="text-center text-gray-400 mt-8">No projects yet.</p>
        )}
        <ul className="space-y-2">
          {history.map((item) => (
            <li key={item.id}>
              <a href="#" className="block p-2 text-sm text-slate-700 rounded-md hover:bg-slate-200 truncate">
                {item.user_input}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}