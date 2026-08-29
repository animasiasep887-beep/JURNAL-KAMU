import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { Dumbbell, TrendingUp, Trophy } from 'lucide-react';

export const GymProgressCharts: React.FC = () => {
  const benchPressHistory = [
    { date: '01 Agt', weight: 40.0 },
    { date: '08 Agt', weight: 42.5 },
    { date: '15 Agt', weight: 45.0 },
    { date: '25 Agt', weight: 47.5 },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Progressive Overload — Grafik Perkembangan Beban</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Perkembangan kekuatan beban Barbell Bench Press (40kg → 42.5kg → 45kg → 47.5kg).</p>
        </div>
      </div>

      <div className="h-56 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={benchPressHistory}>
            <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
            <YAxis stroke="#64748b" fontSize={11} domain={[35, 55]} tickFormatter={(v) => `${v}kg`} />
            <Tooltip formatter={(val: any) => [`${val} kg`, 'Max Weight']} />
            <Line type="monotone" dataKey="weight" stroke="#f59e0b" strokeWidth={3} dot={{ r: 6, fill: '#f59e0b' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
