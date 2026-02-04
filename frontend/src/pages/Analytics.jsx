import React, { useEffect, useState } from 'react';
import { getFormAnalytics } from '../services/formService';
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip, 
    ResponsiveContainer, CartesianGrid, Cell 
} from 'recharts';

const Analytics = () => {
    const formId = "694d6d39a5af4adf8b6a4417"; 
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    // 1. Add this state to force a re-render once the DOM is ready
    const [isMounted, setIsMounted] = useState(false);

    const CHART_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

    useEffect(() => {
        setIsMounted(true); // 2. Trigger chart rendering only after mount
        const fetchAnalytics = async () => {
            try {
                const response = await getFormAnalytics(formId);
                setReport(response.data);
            } catch (err) {
                console.error("AXIOS FAILED:", err);
            } finally {
                setLoading(false);
            }
        };
        if (formId) fetchAnalytics();
    }, [formId]);

    const formatChartData = (stats) => {
        return Object.entries(stats).map(([label, value]) => ({
            name: label,
            count: value
        }));
    };

    if (loading) return <div className="text-gray-400">Loading insights...</div>;
    if (!report) return <div className="text-red-400">No data found for this form.</div>;

    return (
        <div className="space-y-6 pb-10"> {/* Added padding-bottom for better scrolling */}
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                <h2 className="text-xl font-bold text-white">{report.message}</h2>
            </div>

            <div className="grid gap-6">
                {report.analytics.map((item, idx) => (
                    <div key={item.questionId} className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                        <h3 className="text-md font-medium text-gray-300 mb-6">
                            <span className="text-indigo-500 mr-2">{idx + 1}.</span>
                            {item.question}
                        </h3>

                        {/* MCQ Rendering */}
                        {item.questionType === 'multiple-choice' && (
                          <div style={{ width: '100%', height: '350px', marginTop: '1.5rem' }}>
                            {isMounted && (
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                  data={formatChartData(item.stats)}
                                  margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                                  <XAxis
                                    dataKey="name"
                                    tick={{ fill: '#9ca3af', fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                  />
                                  <YAxis
                                    tick={{ fill: '#9ca3af', fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                    allowDecimals={false}
                                  />
                                  <Tooltip
                                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                                    contentStyle={{
                                      backgroundColor: '#111827',
                                      border: '1px solid #374151',
                                      borderRadius: '8px'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                  />
                                  <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                                    {formatChartData(item.stats).map((_, i) => (
                                      <Cell
                                        key={`cell-${i}`}
                                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                                      />
                                    ))}
                                  </Bar>
                                </BarChart>
                              </ResponsiveContainer>
                            )}
                          </div>
                        )}

                        {/* Rating Rendering */}
                        {item.questionType === 'rating' && (
                            <div className="flex items-center gap-8">
                                <div className="bg-gray-800 p-4 rounded-lg min-w-[120px]">
                                    <p className="text-xs text-gray-500 uppercase font-bold">Average</p>
                                    <p className="text-3xl font-black text-indigo-400">{item.stats.average.toFixed(1)}</p>
                                </div>
                                <div className="bg-gray-800 p-4 rounded-lg min-w-[120px]">
                                    <p className="text-xs text-gray-500 uppercase font-bold">Responses</p>
                                    <p className="text-3xl font-black text-gray-300">{item.stats.count}</p>
                                </div>
                            </div>
                        )}

                        {/* Text Rendering */}
                        {item.questionType === 'text' && (
                            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                                {item.stats.length > 0 ? (
                                    item.stats.map((ans, i) => (
                                        <div key={i} className="p-3 bg-gray-800 rounded text-sm text-gray-400 border-l-2 border-indigo-500">
                                            "{ans}"
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic text-sm">No responses yet.</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Analytics;