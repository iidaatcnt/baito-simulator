'use client';

import React, { useState } from 'react';
import { Plus, Trash2, TrendingUp } from 'lucide-react';

interface Job {
  id: number;
  name: string;
  hourlyWage: number;
  weeklyHours: number;
  workDaysPerWeek: number;
  transportCostPerDay: number;
}

interface IncomeData {
  gross: number;
  transport: number;
  net: number;
}

const BaitoSimulator: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([
    { id: 1, name: '居酒屋', hourlyWage: 1500, weeklyHours: 30, workDaysPerWeek: 5, transportCostPerDay: 0 },
    { id: 2, name: '家庭教師', hourlyWage: 2800, weeklyHours: 2, workDaysPerWeek: 1, transportCostPerDay: 800 }
  ]);

  const addJob = (): void => {
    const newId = Math.max(...jobs.map(j => j.id), 0) + 1;
    setJobs([...jobs, { 
      id: newId, 
      name: `バイト${newId}`, 
      hourlyWage: 1000, 
      weeklyHours: 10, 
      workDaysPerWeek: 3, 
      transportCostPerDay: 0 
    }]);
  };

  const removeJob = (id: number): void => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  const updateJob = (id: number, field: keyof Job, value: string | number): void => {
    setJobs(jobs.map(job => 
      job.id === id ? { ...job, [field]: value } : job
    ));
  };

  const calculateMonthlyIncome = (
    hourlyWage: number, 
    weeklyHours: number, 
    workDaysPerWeek: number, 
    transportCostPerDay: number
  ): IncomeData => {
    const grossIncome = hourlyWage * weeklyHours * 4; // 4週間として計算
    const transportCost = transportCostPerDay * workDaysPerWeek * 4; // 月の交通費
    return {
      gross: grossIncome,
      transport: transportCost,
      net: grossIncome - transportCost
    };
  };

  // ソート済みジョブリスト（実質月収順）
  const sortedJobs = [...jobs].sort((a, b) => {
    const aIncome = calculateMonthlyIncome(a.hourlyWage, a.weeklyHours, a.workDaysPerWeek, a.transportCostPerDay);
    const bIncome = calculateMonthlyIncome(b.hourlyWage, b.weeklyHours, b.workDaysPerWeek, b.transportCostPerDay);
    return bIncome.net - aIncome.net;
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            💰 バイト収入シミュレーター
          </h1>
          <p className="text-gray-600">時給の罠を見破ろう！交通費も考慮した本当に稼げるバイトはどれ？</p>
        </div>

        <div className="space-y-4 mb-8">
          {jobs.map((job) => {
            const incomeData = calculateMonthlyIncome(job.hourlyWage, job.weeklyHours, job.workDaysPerWeek, job.transportCostPerDay);
            
            return (
              <div key={job.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      バイト名
                    </label>
                    <input
                      type="text"
                      value={job.name}
                      onChange={(e) => updateJob(job.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      時給 (円)
                    </label>
                    <input
                      type="number"
                      value={job.hourlyWage}
                      onChange={(e) => updateJob(job.id, 'hourlyWage', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      週の労働時間
                    </label>
                    <input
                      type="number"
                      value={job.weeklyHours}
                      onChange={(e) => updateJob(job.id, 'weeklyHours', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      週の勤務日数
                    </label>
                    <input
                      type="number"
                      value={job.workDaysPerWeek}
                      onChange={(e) => updateJob(job.id, 'workDaysPerWeek', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      1日の交通費 (円)
                    </label>
                    <input
                      type="number"
                      value={job.transportCostPerDay}
                      onChange={(e) => updateJob(job.id, 'transportCostPerDay', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="支給なら0"
                    />
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-gray-600">実質月収</div>
                    <div className="text-2xl font-bold text-green-600">
                      ￥{incomeData.net.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      交通費 -￥{incomeData.transport.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <button
                      onClick={() => removeJob(job.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={addJob}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus size={20} />
            <span>バイトを追加</span>
          </button>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <TrendingUp className="text-green-600" />
            <span>実質月収ランキング</span>
          </h2>
          
          <div className="space-y-3">
            {sortedJobs.map((job, index) => {
              const incomeData = calculateMonthlyIncome(job.hourlyWage, job.weeklyHours, job.workDaysPerWeek, job.transportCostPerDay);
              const isHighestWage = job.hourlyWage === Math.max(...jobs.map(j => j.hourlyWage));
              
              return (
                <div 
                  key={job.id}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                    index === 0 
                      ? 'bg-yellow-100 border-yellow-300' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' : 'bg-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 flex items-center space-x-2">
                        <span>{job.name}</span>
                        {isHighestWage && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            最高時給
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        時給￥{job.hourlyWage} × 週{job.weeklyHours}時間 (週{job.workDaysPerWeek}日)
                      </div>
                      {incomeData.transport > 0 && (
                        <div className="text-xs text-red-500">
                          交通費 -￥{incomeData.transport.toLocaleString()}/月
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      ￥{incomeData.net.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">実質月収</div>
                    {incomeData.transport > 0 && (
                      <div className="text-xs text-gray-400">
                        (総額￥{incomeData.gross.toLocaleString()})
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="font-bold text-blue-800 mb-2">💡 ポイント</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 時給が高くても、労働時間が少なければ月収は低くなります</li>
            <li>• 交通費が自己負担の場合、時給が高くても実質収入が減ります</li>
            <li>• 「時給＝稼げる額」ではありません。総労働時間と交通費が重要です</li>
            <li>• バイト選びでは時給、シフト数、交通費支給の有無を総合的に判断しましょう</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BaitoSimulator;