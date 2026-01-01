import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { createForm } from '../services/formService';
const FormBuilder = ({ onBack, fetchForms }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [targetAudience, setTargetAudience] = useState('student');
    const [questions, setQuestions] = useState([{
        questionText: '',
        questionType: 'text',
        options: []
    }]);

    const addNewQuestion = () => {
        setQuestions([
            ...questions, 
            { questionText: '', questionType: 'text', options: [] }
        ]);
    };

    const deleteQuestion = (index) => {
        if (questions.length > 1) {
            const updatedQuestions = questions.filter((_, i) => i !== index);
            setQuestions(updatedQuestions);
        } else {
            toast.error("Form must have at least one question");
        }
    };

    const handleQuestionTextChange = (index, value) => {
        const updatedQuestions = [...questions]; 
        updatedQuestions[index].questionText = value; 
        setQuestions(updatedQuestions); 
    };

    const handleTypeChange = (index, newType) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].questionType = newType;
        
        if (newType === 'multiple-choice' && updatedQuestions[index].options.length === 0) {
            updatedQuestions[index].options = [''];
        }
        
        setQuestions(updatedQuestions);
    };

    const handleOptionChange = (qIndex, optIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options[optIndex] = value;
        setQuestions(updatedQuestions);
    };

    const addOption = (qIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options.push('');
        setQuestions(updatedQuestions);
    };

    const removeOption = (qIndex, optIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options.splice(optIndex, 1);
        setQuestions(updatedQuestions);
    };

    const submitForm = async () => {
        if (!title.trim()) 
            return toast.error("Title is required");

        if (!description.trim()) 
            return toast.error("Description is required");
        
        if (questions.some(q => !q.questionText.trim())) 
            return toast.error("Question text is required");
        
        const formData = {
            title,
            description,
            targetAudience,
            questions
        }
        try {
            console.log("Submitting Form Data:", formData);
            await createForm(formData);

            toast.success("Form Published Successfully!");

            fetchForms(); 
            onBack();     
        } catch (error) {
            console.error("Submission Error:", error.response?.data);
            const errorMsg = error.response?.data?.message || "Failed to create form";
            toast.error(errorMsg);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            <div className="flex justify-between items-center bg-gray-900 p-4 rounded-xl border border-gray-800 shadow-lg sticky top-0 z-10">
                <button 
                    onClick={onBack} 
                    className="text-gray-400 hover:text-white transition"
                >
                    ← Back
                </button>
                <h2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-white uppercase tracking-wider">
                    New Form
                </h2>

                <button 
                    onClick={submitForm}
                    className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-teal-900/20 transition-all"
                >
                    Create
                </button>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-gray-200 uppercase tracking-widest">Form Title</label>
                        <input 
                            name="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Course Satisfaction Survey"
                            className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500 transition"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-gray-200 uppercase tracking-widest">Target Audience</label>
                        <div className='relative'>
                            <select 
                                name="targetAudience"
                                value={targetAudience}
                                onChange={(e) => setTargetAudience(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500 appearance-none"
                            >
                                <option value="student">Student</option>
                                <option value="alumni">Alumni</option>
                                <option value="employer">Employer</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                                ▼
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-gray-200 uppercase tracking-widest">Description</label>
                    <textarea 
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description for the form"
                        className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500 h-24 resize-none transition"
                    />
                </div>
            </div>
        
            <div className="space-y-4 mt-6">
                {questions.map((q, index) => (
                    <div key={index} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-teal-500 uppercase tracking-widest">
                                Question {index + 1}
                            </label>
                                        
                            <div className="flex items-center gap-3">
                                <select 
                                    value={q.questionType}
                                    onChange={(e) => handleTypeChange(index, e.target.value)}
                                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-[14px] text-gray-300 focus:outline-none focus:border-teal-500" // your existing classes
                                >
                                    <option value="text">Short Answer</option>
                                    <option value="multiple-choice">Multiple Choice</option>
                                    <option value="rating">Rating (1-5)</option>
                                </select>
                                        
                                <button 
                                    onClick={() => deleteQuestion(index)}
                                    className="text-gray-500 hover:text-red-500 transition"
                                    title="Delete Question"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                
                        <div className="flex flex-col gap-2">
                            <input 
                                type="text"
                                value={q.questionText}
                                onChange={(e) => handleQuestionTextChange(index, e.target.value)}
                                placeholder="Enter your question here..."
                                className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500 transition"
                            />
                            {q.questionType === 'multiple-choice' && (
                                <div className="pl-6 space-y-3 border-l-2 border-teal-900/30 mt-4 ml-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">
                                        Answer Options
                                    </label>
                                    {q.options.map((option, optIndex) => (
                                        <div key={optIndex} className="flex gap-2">
                                            <input 
                                                type="text"
                                                value={option}
                                                onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                                                placeholder={`Option ${optIndex + 1}`}
                                                className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-teal-500 transition"
                                            />
                                            <button 
                                                onClick={() => removeOption(index, optIndex)}
                                                className="text-gray-600 hover:text-red-500 transition px-2"
                                                title="Remove Option"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                    <button 
                                        onClick={() => addOption(index)}
                                        className="text-xs font-bold text-teal-500 hover:text-teal-400 transition flex items-center gap-1"
                                    >
                                        + Add Option
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <button 
                    onClick={addNewQuestion}
                    className="w-full py-4 border-2 border-dashed border-gray-800 rounded-xl text-gray-300 hover:border-teal-500/50 hover:text-teal-500 hover:bg-teal-500/5 transition-all font-bold flex items-center justify-center gap-2"
                >
                    <span className="text-xl">+</span> Add New Question
                </button>
            </div>
        </div>
    )
}

export default FormBuilder