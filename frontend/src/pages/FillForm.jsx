import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getFormByIdForUser, submitResponse } from '../services/formService';

const FillForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAnonymous, setIsAnonymous] = useState(true);
    const [responses, setResponses] = useState({}); 

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const res = await getFormByIdForUser(id);
                
                const formData = res.data?.form || res.data;

                if (formData && formData.questions) {
                    setForm(formData);
                    
                    const initial = {};
                    formData.questions.forEach(q => {
                        initial[q._id] = ""; 
                    });
                    setResponses(initial);
                }
            } catch (err) {
                const msg = err.response?.data?.message || "Form inaccessible";
                toast.error(msg);
                navigate('/'); 
            } finally {
                setLoading(false);
            }
        };
        fetchForm();
    }, [id, navigate]);

    const handleInputChange = (qId, val) => {
        setResponses(prev => ({ ...prev, [qId]: val }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submissionData = {
                isAnon: isAnonymous,
                answers: Object.entries(responses).map(([questionId, value]) => ({
                    questionId,
                    answer: value
                }))
            };            
            await submitResponse(id, submissionData);
            toast.success("Feedback submitted!");
            navigate('/success');
        } catch (err) {
            toast.error(err.response?.data?.message || "Submission failed.");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white font-sans">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-teal-500"></div>
            <span className="ml-4">Loading Form...</span>
        </div>
    );

    if (!form || !form.questions) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
            <p>Form not found.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-950 text-white p-6 md:p-12 font-sans">
            <div className="max-w-2xl mx-auto">
                <header className="mb-10 text-center border-b border-gray-800 pb-8">
                    <h1 className="text-4xl font-extrabold mb-2 text-teal-400">{form.title}</h1>
                    <p className="text-gray-400 text-lg">{form.description}</p>
                    <div className="mt-4 inline-block px-3 py-1 rounded-full bg-teal-900/30 text-teal-400 text-xs font-semibold uppercase tracking-wider">
                        Target: {form.targetAudience}
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex flex-col gap-4 shadow-inner">
                        <label className="text-sm font-medium text-gray-400 uppercase tracking-widest">Submit as:</label>
                        <div className="flex bg-gray-950 p-1 rounded-xl">
                            <button
                                type="button"
                                onClick={() => setIsAnonymous(true)}
                                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${isAnonymous ? 'bg-teal-600 text-white shadow-lg' : 'text-gray-500'}`}
                            >
                                Anonymous
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsAnonymous(false)}
                                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${!isAnonymous ? 'bg-teal-600 text-white shadow-lg' : 'text-gray-500'}`}
                            >
                                Identify Me
                            </button>
                        </div>
                    </div>

                    {form.questions.map((q, index) => (
                        <div key={q._id} className="bg-gray-900 border border-gray-800 p-8 rounded-3xl transition-all hover:border-gray-700">
                            <label className="block text-xl font-medium mb-6 text-gray-200">
                                <span className="text-teal-500 mr-2">{index + 1}.</span>
                                {q.questionText}
                            </label>

                            {q.questionType === 'text' && (
                                <textarea
                                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition min-h-32 placeholder-gray-700"
                                    placeholder="Write your response here..."
                                    value={responses[q._id] || ""}
                                    onChange={(e) => handleInputChange(q._id, e.target.value)}
                                    required
                                />
                            )}

                            {q.questionType === 'multiple-choice' && (
                                <div className="grid gap-3">
                                    {q.options.map(option => (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => handleInputChange(q._id, option)}
                                            className={`w-full text-left p-4 rounded-xl border transition-all flex justify-between items-center ${
                                                responses[q._id] === option 
                                                ? 'bg-teal-600/10 border-teal-500 text-white shadow-md shadow-teal-900/20' 
                                                : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-600'
                                            }`}
                                        >
                                            <span>{option}</span>
                                            {responses[q._id] === option && (
                                                <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {q.questionType === 'rating' && (
                                <div className="flex flex-wrap justify-between gap-2 max-w-sm mx-auto pt-2">
                                    {[1, 2, 3, 4, 5].map(num => (
                                        <button
                                            key={num}
                                            type="button"
                                            onClick={() => handleInputChange(q._id, num)}
                                            className={`w-12 h-12 rounded-2xl font-black transition-all transform active:scale-90 border ${
                                                responses[q._id] === num 
                                                ? 'bg-teal-600 text-white border-teal-500 scale-110 shadow-lg shadow-teal-900/40' 
                                                : 'bg-gray-950 text-gray-500 border-gray-800 hover:border-gray-600'
                                            }`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="w-full bg-teal-600 hover:bg-teal-500 text-gray-950 font-black py-5 rounded-2xl transition-all shadow-xl shadow-teal-600/10 uppercase tracking-widest active:scale-[0.98]"
                    >
                        Submit Feedback
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FillForm;