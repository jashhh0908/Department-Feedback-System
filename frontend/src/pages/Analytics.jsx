import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFormAnalytics, getForms } from '../services/formService';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, CartesianGrid, Cell
} from 'recharts';

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const formatChartData = (stats) => {
    return Object.entries(stats).map(([label, value]) => ({
        name: label,
        count: value
    }));
};

const Analytics = () => {
    const navigate = useNavigate();
    const { formId } = useParams();
    const isDetailView = useMemo(() => Boolean(formId), [formId]);

    const [formsState, setFormsState] = useState({
        forms: [],
        loading: true,
        error: ''
    });
    const [detailState, setDetailState] = useState({
        report: null,
        loading: true,
        error: ''
    });

    useEffect(() => {
        if (isDetailView) return;

        const fetchAllForms = async () => {
            try {
                const response = await getForms();
                setFormsState({
                    forms: response.data.forms || [],
                    loading: false,
                    error: ''
                });
            } catch (err) {
                console.error('Failed to load forms:', err);
                setFormsState({
                    forms: [],
                    loading: false,
                    error: 'Failed to load forms.'
                });
            }
        };

        fetchAllForms();
    }, [isDetailView]);

    useEffect(() => {
        if (!isDetailView) return;

        const fetchAnalytics = async () => {
            setDetailState(prev => ({ ...prev, loading: true, error: '' }));
            try {
                const response = await getFormAnalytics(formId);
                setDetailState({
                    report: response.data,
                    loading: false,
                    error: ''
                });
            } catch (err) {
                console.error('Failed to fetch analytics:', err);
                setDetailState({
                    report: null,
                    loading: false,
                    error: 'No analytics available for this form yet.'
                });
            }
        };

        fetchAnalytics();
    }, [formId, isDetailView]);

    if (!isDetailView) {
        if (formsState.loading) return <div className="text-gray-400">Loading forms...</div>;

        return (
            <div className="space-y-6 pb-10">
                <header>
                    <h1 className="text-2xl font-bold">Viewing Analytics</h1>
                    <p className="text-gray-400 mt-2">Select a form to view its analytics.</p>
                </header>

                {formsState.error && (
                    <div className="bg-red-900/20 border border-red-800 text-red-300 p-4 rounded-lg text-sm">
                        {formsState.error}
                    </div>
                )}

                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse table-auto">
                        <thead>
                            <tr className="bg-gray-800/50 text-gray-400 text-sm uppercase tracking-widest border-b border-gray-800">
                                <th className="p-4 font-medium">Form Title</th>
                                <th className="p-4 font-medium">Target</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {formsState.forms.map((form) => (
                                <tr key={form._id} className="hover:bg-gray-800/30 transition">
                                    <td className="p-4 font-medium">{form.title}</td>
                                    <td className="p-4 text-gray-300 capitalize">{form.targetAudience}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                            form.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700 text-gray-400'
                                        }`}>
                                            {form.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => navigate(`/dashboard/analytics/${form._id}`)}
                                            className="px-3 py-1.5 text-sm rounded bg-indigo-600 hover:bg-indigo-500 text-white transition"
                                        >
                                            View Analytics
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {formsState.forms.length === 0 && (
                        <div className="p-10 text-center text-gray-500">No forms found.</div>
                    )}
                </div>
            </div>
        );
    }

    if (detailState.loading) return <div className="text-gray-400">Loading insights...</div>;

    if (!detailState.report) {
        return (
            <div className="space-y-4">
                <button
                    onClick={() => navigate('/dashboard/analytics')}
                    className="px-3 py-1.5 text-sm rounded bg-gray-800 hover:bg-gray-700 text-white transition"
                >
                    Back to Forms
                </button>
                <div className="text-red-400">{detailState.error || 'No data found for this form.'}</div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10">
            <button
                onClick={() => navigate('/dashboard/analytics')}
                className="px-3 py-1.5 text-sm rounded bg-gray-800 hover:bg-gray-700 text-white transition"
            >
                Back to Forms
            </button>

            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                <h2 className="text-xl font-bold text-white">Form Analytics</h2>
                <p className="text-gray-400 text-sm mt-1">{detailState.report.message}</p>
            </div>

            <div className="grid gap-6">
                {detailState.report.analytics.map((item, idx) => (
                    <div key={item.questionId} className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                        <h3 className="text-md font-medium text-gray-300 mb-6">
                            <span className="text-indigo-500 mr-2">{idx + 1}.</span>
                            {item.question}
                        </h3>

                        {item.questionType === 'multiple-choice' && (
                            <div style={{ width: '100%', height: '350px', marginTop: '1.5rem' }}>
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
                            </div>
                        )}

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