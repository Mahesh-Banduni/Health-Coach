// "use client";
// import React, { useState, useRef, useEffect } from 'react';
// import { Send, Bot, User, Heart, Brain, Activity, Zap, Leaf, FileText, Clock, MessageCircle, Paperclip, Camera } from 'lucide-react';

// const WellnessChatbot = () => {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       type: 'bot',
//       content: "👋 Hello! I'm your Health & Wellness Knowledge Coach. I can help you understand symptoms, explore possible causes, and suggest lifestyle improvements. What would you like to discuss today?",
//       timestamp: new Date()
//     }
//   ]);
//   const [inputValue, setInputValue] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef(null);
//   const inputRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   if (!inputValue.trim() || isLoading) return;

//   const userMessage = {
//     id: messages.length + 1,
//     type: 'user',
//     content: inputValue,
//     timestamp: new Date()
//   };

//   setMessages(prev => [...prev, userMessage]);
//   setInputValue('');
//   setIsLoading(true);

//   try {
//     const response = await fetch('/api/wellness', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ input: inputValue })
//     });

//     const data = await response.json();

//     const botMessage = {
//       id: messages.length + 2,
//       type: 'bot',
//       content: data.response || "Here’s what I found:",
//       timestamp: new Date(),
//       structured: data   // 👈 pass full structured response
//     };

//     setMessages(prev => [...prev, botMessage]);
//   } catch (error) {
//     const errorMessage = {
//       id: messages.length + 2,
//       type: 'bot',
//       content: "⚠️ I apologize, but I'm experiencing some technical difficulties. Please try again later.",
//       timestamp: new Date()
//     };
//     setMessages(prev => [...prev, errorMessage]);
//   } finally {
//     setIsLoading(false);
//   }
// };

// const formatBotResponse = (data) => {
//   if (!data) return "⚠️ I couldn't process your request.";
//   return data.response || "Here’s what I found:";
// };

//   const renderStructuredResponse = (data) => {
//     if (!data) return null;

//     return (
//       <div className="space-y-4 sm:space-y-6 mt-3 sm:mt-4">
//         {data.disease && (
//           <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
//             <div className="flex items-center gap-2 mb-2">
//               <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
//               <h3 className="font-semibold text-blue-800 text-sm sm:text-base">Condition: {data.disease}</h3>
//             </div>
//           </div>
//         )}

//         {data.summary && (
//           <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
//             <div className="flex items-center gap-2 mb-3">
//               <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
//               <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Summary</h3>
//             </div>
//             <div className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
//               {data.summary}
//             </div>
//           </div>
//         )}

//         {data.causes && data.causes.length > 0 && (
//           <div className="bg-orange-50 rounded-lg p-3 sm:p-4 border border-orange-200">
//             <div className="flex items-center gap-2 mb-3">
//               <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 flex-shrink-0" />
//               <h3 className="font-semibold text-orange-800 text-sm sm:text-base">Possible Causes</h3>
//             </div>
//             <ul className="space-y-2">
//               {data.causes.map((cause, index) => {
//                 const cleanCause = cause.replace(/\*/g, ""); // remove all '*'
//                 return (
//                   <li key={index} className="flex items-start gap-2 text-orange-700">
//                     <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
//                     <span className="text-xs sm:text-sm leading-relaxed">{cleanCause.trim()}</span>
//                   </li>
//                 );
//               })}
//             </ul>
//           </div>
//         )}

//         {data.lifestyleTips && data.lifestyleTips.length > 0 && (
//           <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-200">
//             <div className="flex items-center gap-2 mb-3">
//               <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
//               <h3 className="font-semibold text-green-800 text-sm sm:text-base">Lifestyle Recommendations</h3>
//             </div>
//             <div className="space-y-3 sm:space-y-4">
//               {data.lifestyleTips.map((tip, index) => (
//                 <div key={index} className="border-l-3 sm:border-l-4 border-green-300 pl-3 sm:pl-4">
//                   <h4 className="font-medium text-green-800 mb-1 text-xs sm:text-sm">{tip.title.replace(/\*\*/g, "")}</h4>
//                   <p className="text-xs sm:text-sm text-green-700 leading-relaxed">{tip.tip}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
//           <p className="text-xs sm:text-sm text-yellow-800">
//             <strong>Disclaimer:</strong> This information is for educational purposes only and should not replace professional medical advice. Please consult with a healthcare provider for proper diagnosis and treatment.
//           </p>
//         </div>
//       </div>
//     );
//   };

//   const renderMessage = (message) => {
//     if (message.type === 'user') {
//       return (
//         <div className="flex justify-end mb-4 sm:mb-6">
//           <div className="flex items-end gap-2 sm:gap-3 max-w-[85%] sm:max-w-2xl">
//             <div className="bg-blue-600 text-white rounded-2xl rounded-br-md px-3 sm:px-4 py-2 sm:py-3 shadow-lg">
//               <p className="text-sm leading-relaxed">{message.content}</p>
//             </div>
//             <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
//               <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
//             </div>
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div className="flex justify-start mb-4 sm:mb-6">
//         <div className="flex items-end gap-2 sm:gap-3 max-w-[95%] sm:max-w-4xl w-full">
//           <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
//             <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
//           </div>
//           <div className="bg-white rounded-2xl rounded-bl-md px-3 sm:px-4 py-2 sm:py-3 shadow-lg border border-gray-100 flex-1 min-w-0">
//             {typeof message.content === 'string' ? (
//               <p className="text-sm text-gray-700 leading-relaxed mb-2">{message.structured?.causes ? null : message.content}</p>
//             ) : null}
//             {message.structured && renderStructuredResponse(message.structured)}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const quickSuggestions = [
//     "I've been having frequent headaches",
//     "I feel tired all the time",
//     "How can I improve my sleep quality?",
//     "I have back pain from sitting too long"
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
//       {/* Header */}
//       <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
//         <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-14 sm:h-16">
//             <div className="flex items-center gap-2 sm:gap-3 min-w-0">
//               <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
//                 <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
//               </div>
//               <div className="min-w-0">
//                 <h1 className="text-sm sm:text-xl font-bold text-gray-900 truncate">Health & Wellness Coach</h1>
//                 <p className="text-xs text-gray-600 hidden sm:block">AI-Powered Wellness Guidance</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-2 sm:gap-4">
//               <div className="hidden lg:flex items-center gap-4 xl:gap-6 text-xs xl:text-sm text-gray-600">
//                 <div className="flex items-center gap-1">
//                   <Activity className="w-3 h-3 xl:w-4 xl:h-4" />
//                   <span className="hidden xl:inline">Symptom Analysis</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <Brain className="w-3 h-3 xl:w-4 xl:h-4" />
//                   <span className="hidden xl:inline">Cause Exploration</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <Leaf className="w-3 h-3 xl:w-4 xl:h-4" />
//                   <span className="hidden xl:inline">Lifestyle Tips</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-6">
//         <div className="bg-white rounded-lg sm:rounded-2xl shadow-xl border border-gray-200 overflow-hidden min-h-[calc(100vh-5rem)] sm:min-h-0">
//           {/* Chat Messages */}
//           <div className="h-[calc(100vh-12rem)] sm:h-[60vh] overflow-y-auto p-3 sm:p-6 bg-gradient-to-b from-gray-50/50 to-transparent">
//             {messages.map((message) => renderMessage(message))}
            
//             {isLoading && (
//               <div className="flex justify-start mb-4 sm:mb-6">
//                 <div className="flex items-end gap-2 sm:gap-3">
//                   <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
//                     <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
//                   </div>
//                   <div className="bg-white rounded-2xl rounded-bl-md px-3 sm:px-4 py-2 sm:py-3 shadow-lg border border-gray-100">
//                     <div className="flex items-center gap-2">
//                       <div className="flex gap-1">
//                         <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                         <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
//                         <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//                       </div>
//                       <span className="text-xs sm:text-sm text-gray-500 ml-2">Analyzing...</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Quick Suggestions */}
//           {messages.length === 1 && (
//             <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-100 bg-gray-50/50">
//               <p className="text-sm text-gray-600 mb-3 font-medium">Try asking about:</p>
//               <div className="grid grid-cols-1 gap-2">
//                 {quickSuggestions.map((suggestion, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setInputValue(suggestion)}
//                     className="text-left text-xs sm:text-sm text-gray-700 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg px-3 py-2 transition-all duration-200 hover:shadow-sm"
//                   >
//                     {suggestion}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Input Form */}
//           <div className="p-3 sm:p-6 border-t border-gray-200 bg-white">
//             <div className="flex gap-2 sm:gap-3">
//               <div className="flex-1 relative">
//                 <input
//                   ref={inputRef}
//                   type="text"
//                   value={inputValue}
//                   onChange={(e) => setInputValue(e.target.value)}
//                   onKeyPress={(e) => {
//                     if (e.key === 'Enter' && !e.shiftKey) {
//                       e.preventDefault();
//                       handleSubmit(e);
//                     }
//                   }}
//                   placeholder="Describe your symptoms or ask for wellness tips..."
//                   className="w-full px-3 sm:px-4 py-3 pr-16 sm:pr-18 text-sm border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
//                   disabled={isLoading}
//                 />
//                 <Camera className="absolute right-10 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
//                 <Paperclip className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
//               </div>
//               <button
//                 onClick={handleSubmit}
//                 disabled={!inputValue.trim() || isLoading}
//                 className="px-3 sm:px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-1 sm:gap-2 font-medium"
//               >
//                 <Send className="w-4 h-4" />
//                 <span className="hidden sm:inline text-sm">Send</span>
//               </button>
//             </div>
//             <p className="text-xs text-gray-500 mt-2 sm:mt-3 text-center px-2">
//               This AI provides educational info only. Consult healthcare professionals for medical advice.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WellnessChatbot;


"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Heart, Brain, Activity, Zap, Leaf, FileText, Clock, MessageCircle, Paperclip, Camera } from 'lucide-react';

const WellnessChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "👋 Hello! I'm your Health & Wellness Knowledge Coach. I can help you understand symptoms, explore possible causes, and suggest lifestyle improvements. What would you like to discuss today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   if (!inputValue.trim() || isLoading) return;

//   const userMessage = {
//     id: messages.length + 1,
//     type: 'user',
//     content: inputValue,
//     timestamp: new Date()
//   };

//   setMessages(prev => [...prev, userMessage]);
//   setInputValue('');
//   setIsLoading(true);

//   try {
//     const response = await fetch('/api/wellness', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ input: inputValue })
//     });

//     const data = await response.json();

//     const botMessage = {
//       id: messages.length + 2,
//       type: 'bot',
//       content: data.response || "Here’s what I found:",
//       timestamp: new Date(),
//       structured: data   // 👈 pass full structured response
//     };

//     setMessages(prev => [...prev, botMessage]);
//   } catch (error) {
//     const errorMessage = {
//       id: messages.length + 2,
//       type: 'bot',
//       content: "⚠️ I apologize, but I'm experiencing some technical difficulties. Please try again later.",
//       timestamp: new Date()
//     };
//     setMessages(prev => [...prev, errorMessage]);
//   } finally {
//     setIsLoading(false);
//   }
// };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setFilePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() && !selectedFile) return;

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: inputValue || (selectedFile ? selectedFile.name : ""),
      timestamp: new Date(),
      filePreview,
      fileName: selectedFile?.name,
      fileType: selectedFile?.type,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setSelectedFile(null);
    setFilePreview(null);
    setIsLoading(true);

    try {
      let data;
      if (selectedFile) {
        const formData = new FormData();
        formData.append("input", userMessage.content);
        formData.append("file", selectedFile);

        const res = await fetch("/api/file-analyze", {
          method: "POST",
          body: formData,
        });
        data = await res.json();
      } else {
        const res = await fetch("/api/wellness", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: inputValue }),
        });
        data = await res.json();
      }

      const botMessage = {
        id: messages.length + 2,
        type: "bot",
        content: data.response || "Here’s what I found:",
        timestamp: new Date(),
        structured: data,
        filePreview: filePreview,
        fileName: userMessage.fileName,
        fileType: userMessage.fileType,
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: messages.length + 2,
        type: "bot",
        content: "⚠️ I’m experiencing technical difficulties. Please try again later.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

const formatBotResponse = (data) => {
  if (!data) return "⚠️ I couldn't process your request.";
  return data.response || "Here’s what I found:";
};

  const renderFilePreview = (fileData) => {
    const { file, previewURL } = fileData;
    if (!file.name && !file.previewURL) return null;

    if (file.type.startsWith("image/") && previewURL) {
      return <img src={previewURL} alt={file.name} className="max-w-xs rounded shadow mt-2" />;
    } else {
      return (
        <div className="bg-gray-100 p-2 rounded mt-2 border border-gray-300 text-gray-800 text-xs flex items-center gap-2">
          <FileText className="w-4 h-4" /> {file.name}
        </div>
      );
    }
  };

  const renderStructuredResponse = (data) => {
    if (!data) return null;

    return (
      <div className="space-y-4 sm:space-y-6 mt-3 sm:mt-4">
                {data.fileSummary && (
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-gray-600" />
              <h3 className="font-semibold text-gray-800 text-sm">Document Summary</h3>
            </div>
            <div className="text-xs text-gray-700 whitespace-pre-line">{data.fileSummary}</div>
          </div>
        )}
        {data.imageAnalysis && (
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Camera className="w-4 h-4 text-gray-600" />
              <h3 className="font-semibold text-gray-800 text-sm">Image Analysis</h3>
            </div>
            <div className="text-xs text-gray-700 whitespace-pre-line">{data.imageAnalysis}</div>
          </div>
        )}
        {data.disease && (
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
              <h3 className="font-semibold text-blue-800 text-sm sm:text-base">Condition: {data.disease}</h3>
            </div>
          </div>
        )}
        {data.summary && (
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Summary</h3>
            </div>
            <div className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {data.summary}
            </div>
          </div>
        )}

        {data.causes && data.causes.length > 0 && (
          <div className="bg-orange-50 rounded-lg p-3 sm:p-4 border border-orange-200">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 flex-shrink-0" />
              <h3 className="font-semibold text-orange-800 text-sm sm:text-base">Possible Causes</h3>
            </div>
            <ul className="space-y-2">
              {data.causes.map((cause, index) => {
                const cleanCause = cause.replace(/\*/g, ""); // remove all '*'
                return (
                  <li key={index} className="flex items-start gap-2 text-orange-700">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                    <span className="text-xs sm:text-sm leading-relaxed">{cleanCause.trim()}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {data.lifestyleTips && data.lifestyleTips.length > 0 && (
          <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
              <h3 className="font-semibold text-green-800 text-sm sm:text-base">Lifestyle Recommendations</h3>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {data.lifestyleTips.map((tip, index) => (
                <div key={index} className="border-l-3 sm:border-l-4 border-green-300 pl-3 sm:pl-4">
                  <h4 className="font-medium text-green-800 mb-1 text-xs sm:text-sm">{tip.title.replace(/\*\*/g, "")}</h4>
                  <p className="text-xs sm:text-sm text-green-700 leading-relaxed">{tip.tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-yellow-800">
            <strong>Disclaimer:</strong> This information is for educational purposes only and should not replace professional medical advice. Please consult with a healthcare provider for proper diagnosis and treatment.
          </p>
        </div>
      </div>
    );
  };

  const renderMessage = (message) => {
    if (message.type === 'user') {
      return (
        <div className="flex justify-end mb-4 sm:mb-6">
          <div className="flex items-end gap-2 sm:gap-3 max-w-[85%] sm:max-w-2xl">
            <div className="bg-blue-600 text-white rounded-2xl rounded-br-md px-3 sm:px-4 py-2 sm:py-3 shadow-lg flex flex-col">
              <p className="text-sm leading-relaxed">{message.content}</p>
              {renderFilePreview({ file: { name: message.fileName, type: message.fileType }, previewURL: message.filePreview })}
            </div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
              <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex justify-start mb-4 sm:mb-6">
        <div className="flex items-end gap-2 sm:gap-3 max-w-[95%] sm:max-w-4xl w-full">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
            <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </div>
          <div className="bg-white rounded-2xl rounded-bl-md px-3 sm:px-4 py-2 sm:py-3 shadow-lg border border-gray-100 flex-1 min-w-0">
            {typeof message.content === 'string' ? (
              <p className="text-sm text-gray-700 leading-relaxed mb-2">{message.structured?.causes ? null : message.content}</p>
            ) : null}
            {message.structured && renderStructuredResponse(message.structured)}
          </div>
        </div>
      </div>
    );
  };

  const quickSuggestions = [
    "I've been having frequent headaches",
    "I feel tired all the time",
    "How can I improve my sleep quality?",
    "I have back pain from sitting too long"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-xl font-bold text-gray-900 truncate">Health & Wellness Coach</h1>
                <p className="text-xs text-gray-600 hidden sm:block">AI-Powered Wellness Guidance</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden lg:flex items-center gap-4 xl:gap-6 text-xs xl:text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Activity className="w-3 h-3 xl:w-4 xl:h-4" />
                  <span className="hidden xl:inline">Symptom Analysis</span>
                </div>
                <div className="flex items-center gap-1">
                  <Brain className="w-3 h-3 xl:w-4 xl:h-4" />
                  <span className="hidden xl:inline">Cause Exploration</span>
                </div>
                <div className="flex items-center gap-1">
                  <Leaf className="w-3 h-3 xl:w-4 xl:h-4" />
                  <span className="hidden xl:inline">Lifestyle Tips</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-6">
        <div className="bg-white rounded-lg sm:rounded-2xl shadow-xl border border-gray-200 overflow-hidden min-h-[calc(100vh-5rem)] sm:min-h-0">
          {/* Chat Messages */}
          <div className="h-[calc(100vh-12rem)] sm:h-[60vh] overflow-y-auto p-3 sm:p-6 bg-gradient-to-b from-gray-50/50 to-transparent">
            {messages.map((message) => renderMessage(message))}
            
            {isLoading && (
              <div className="flex justify-start mb-4 sm:mb-6">
                <div className="flex items-end gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                    <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-bl-md px-3 sm:px-4 py-2 sm:py-3 shadow-lg border border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs sm:text-sm text-gray-500 ml-2">Analyzing...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length === 1 && (
            <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-100 bg-gray-50/50">
              <p className="text-sm text-gray-600 mb-3 font-medium">Try asking about:</p>
              <div className="grid grid-cols-1 gap-2">
                {quickSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInputValue(suggestion)}
                    className="text-left text-xs sm:text-sm text-gray-700 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg px-3 py-2 transition-all duration-200 hover:shadow-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
        <div className="p-4 border-t border-gray-200 bg-white">
           <form className="flex gap-2" onSubmit={handleSubmit}>
             <div className="flex-1 relative">
               <input
                 type="text"
                 value={inputValue}
                 onChange={(e) => setInputValue(e.target.value)}
                 placeholder="Describe your symptoms or upload a file..."
                 className="w-full px-3 py-2 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                 disabled={isLoading}
               />
               <input
                 type="file"
                 accept="image/*,application/pdf,text/plain"
                 onChange={handleFileChange}
                 className="absolute right-10 top-1/2 transform -translate-y-1/2 w-6 h-6 opacity-0 cursor-pointer"
               />
               <Camera className="absolute right-10 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
               <Paperclip className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
             </div>
             <button
               type="submit"
               disabled={isLoading || (!inputValue.trim() && !selectedFile)}
               className="px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 shadow-lg"
             >
               <Send className="w-4 h-4 inline" />
             </button>
           </form>
            <p className="text-xs text-gray-500 mt-2 sm:mt-3 text-center px-2">
              This AI provides educational info only. Consult healthcare professionals for medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessChatbot;







// "use client";
// import React, { useState, useRef, useEffect } from "react";
// import { Send, Bot, User, Heart, Brain, Leaf, Activity, FileText, Camera, Paperclip, Zap } from "lucide-react";

// const WellnessChatbot = () => {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       type: "bot",
//       content: "👋 Hello! I'm your Health & Wellness Knowledge Coach. I can help you understand symptoms, explore possible causes, and suggest lifestyle improvements. What would you like to discuss today?",
//       timestamp: new Date(),
//     },
//   ]);
//   const [inputValue, setInputValue] = useState("");
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [filePreview, setFilePreview] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   const quickSuggestions = [
//     "I've been having frequent headaches",
//     "I feel tired all the time",
//     "How can I improve my sleep quality?",
//     "I have back pain from sitting too long"
//   ];

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setSelectedFile(file);

//     if (file.type.startsWith("image/")) {
//       const reader = new FileReader();
//       reader.onload = () => setFilePreview(reader.result);
//       reader.readAsDataURL(file);
//     } else {
//       setFilePreview(null);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!inputValue.trim() && !selectedFile) return;

//     const userMessage = {
//       id: messages.length + 1,
//       type: "user",
//       content: inputValue || (selectedFile ? selectedFile.name : ""),
//       timestamp: new Date(),
//       filePreview,
//       fileName: selectedFile?.name,
//       fileType: selectedFile?.type,
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInputValue("");
//     setSelectedFile(null);
//     setFilePreview(null);
//     setIsLoading(true);

//     try {
//       let data;
//       if (selectedFile) {
//         const formData = new FormData();
//         formData.append("input", userMessage.content);
//         formData.append("file", selectedFile);

//         const res = await fetch("/api/wellness/file-analyze", {
//           method: "POST",
//           body: formData,
//         });
//         data = await res.json();
//       } else {
//         const res = await fetch("/api/wellness", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ input: inputValue }),
//         });
//         data = await res.json();
//       }

//       const botMessage = {
//         id: messages.length + 2,
//         type: "bot",
//         content: data.response || "Here’s what I found:",
//         timestamp: new Date(),
//         structured: data,
//         filePreview: filePreview,
//         fileName: userMessage.fileName,
//         fileType: userMessage.fileType,
//       };
//       setMessages(prev => [...prev, botMessage]);
//     } catch (err) {
//       console.error(err);
//       setMessages(prev => [...prev, {
//         id: messages.length + 2,
//         type: "bot",
//         content: "⚠️ I’m experiencing technical difficulties. Please try again later.",
//         timestamp: new Date(),
//       }]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const renderFilePreview = (fileData) => {
//     const { file, previewURL } = fileData;
//     if (!file.name && !file.previewURL) return null;

//     if (file.type.startsWith("image/") && previewURL) {
//       return <img src={previewURL} alt={file.name} className="max-w-xs rounded shadow mt-2" />;
//     } else {
//       return (
//         <div className="bg-gray-100 p-2 rounded mt-2 border border-gray-300 text-gray-800 text-xs flex items-center gap-2">
//           <FileText className="w-4 h-4" /> {file.name}
//         </div>
//       );
//     }
//   };

//   const renderStructuredResponse = (data) => {
//     if (!data) return null;

//     return (
//       <div className="space-y-4 mt-3">
//         {data.fileSummary && (
//           <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
//             <div className="flex items-center gap-2 mb-2">
//               <FileText className="w-4 h-4 text-gray-600" />
//               <h3 className="font-semibold text-gray-800 text-sm">Document Summary</h3>
//             </div>
//             <div className="text-xs text-gray-700 whitespace-pre-line">{data.fileSummary}</div>
//           </div>
//         )}
//         {data.imageAnalysis && (
//           <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
//             <div className="flex items-center gap-2 mb-2">
//               <Camera className="w-4 h-4 text-gray-600" />
//               <h3 className="font-semibold text-gray-800 text-sm">Image Analysis</h3>
//             </div>
//             <div className="text-xs text-gray-700 whitespace-pre-line">{data.imageAnalysis}</div>
//           </div>
//         )}
//         {data.summary && (
//           <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
//             <div className="flex items-center gap-2 mb-2">
//               <Brain className="w-4 h-4 text-blue-600" />
//               <h3 className="font-semibold text-blue-800 text-sm">Summary</h3>
//             </div>
//             <div className="text-xs text-blue-700 whitespace-pre-line">{data.summary}</div>
//           </div>
//         )}
//         {data.disease && (
//           <div className="bg-red-50 rounded-lg p-3 border border-red-200">
//             <div className="flex items-center gap-2 mb-2">
//               <Brain className="w-4 h-4 text-red-600" />
//               <h3 className="font-semibold text-red-800 text-sm">Condition: {data.disease}</h3>
//             </div>
//           </div>
//         )}
//         {data.causes?.length > 0 && (
//           <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
//             <div className="flex items-center gap-2 mb-2">
//               <Zap className="w-4 h-4 text-orange-600" />
//               <h3 className="font-semibold text-orange-800 text-sm">Possible Causes</h3>
//             </div>
//             <ul className="space-y-1 text-xs text-orange-700">
//               {data.causes.map((cause, idx) => <li key={idx}>{cause}</li>)}
//             </ul>
//           </div>
//         )}
//         {data.lifestyleTips?.length > 0 && (
//           <div className="bg-green-50 rounded-lg p-3 border border-green-200">
//             <div className="flex items-center gap-2 mb-2">
//               <Leaf className="w-4 h-4 text-green-600" />
//               <h3 className="font-semibold text-green-800 text-sm">Lifestyle Recommendations</h3>
//             </div>
//             <ul className="space-y-1 text-xs text-green-700">
//               {data.lifestyleTips.map((tip, idx) => <li key={idx}>{tip.title}: {tip.tip}</li>)}
//             </ul>
//           </div>
//         )}
//         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
//           <strong>Disclaimer:</strong> This info is for educational purposes only and should not replace professional medical advice.
//         </div>
//       </div>
//     );
//   };

//   const renderMessage = (message) => {
//     if (message.type === "user") {
//       return (
//         <div key={message.id} className="flex justify-end mb-4">
//           <div className="flex items-end gap-2 max-w-[85%]">
//             <div className="bg-blue-600 text-white rounded-2xl rounded-br-md px-3 py-2 shadow-lg flex flex-col">
//               <p className="text-sm">{message.content}</p>
//               {renderFilePreview({ file: { name: message.fileName, type: message.fileType }, previewURL: message.filePreview })}
//             </div>
//             <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
//               <User className="w-3 h-3 text-white" />
//             </div>
//           </div>
//         </div>
//       );
//     }
//     return (
//       isLoading && (
//       <div key={message.id} className="flex justify-start mb-4">
//         <div className="flex items-end gap-2 max-w-[95%]">
//           <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
//             <Bot className="w-3 h-3 text-white" />
//           </div>
//           <div className="bg-white rounded-2xl rounded-bl-md px-3 py-2 shadow-lg border border-gray-100 flex items-center gap-2">
//             <div className="flex gap-1">
//               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
//               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
//             </div>
//             <span className="text-xs text-gray-500 ml-2">Analyzing...</span>
//           </div>
//         </div>
//       </div>
//     )
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
//       {/* Header */}
//      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
//        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
//          <div className="flex items-center justify-between h-14 sm:h-16">
//            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
//              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
//                <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
//              </div>
//              <div className="min-w-0">
//                <h1 className="text-sm sm:text-xl font-bold text-gray-900 truncate">Health & Wellness Coach</h1>
//                <p className="text-xs text-gray-600 hidden sm:block">AI-Powered Wellness Guidance</p>
//              </div>
//            </div>
//            <div className="flex items-center gap-2 sm:gap-4">
//              <div className="hidden lg:flex items-center gap-4 xl:gap-6 text-xs xl:text-sm text-gray-600">
//                <div className="flex items-center gap-1">
//                  <Activity className="w-3 h-3 xl:w-4 xl:h-4" />
//                  <span className="hidden xl:inline">Symptom Analysis</span>
//                </div>
//                <div className="flex items-center gap-1">
//                  <Brain className="w-3 h-3 xl:w-4 xl:h-4" />
//                  <span className="hidden xl:inline">Cause Exploration</span>
//                </div>
//                <div className="flex items-center gap-1">
//                  <Leaf className="w-3 h-3 xl:w-4 xl:h-4" />
//                  <span className="hidden xl:inline">Lifestyle Tips</span>
//                </div>
//              </div>
//            </div>
//          </div>
//        </div>
//      </header>

//       <div className="max-w-6xl mx-auto px-4 py-4">
//         <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden min-h-[60vh]">
//           <div className="h-[60vh] overflow-y-auto p-3 bg-gradient-to-b from-gray-50/50 to-transparent">
//             {messages.map(renderMessage)}
//             {isLoading && (
//               <div className="flex justify-start mb-4">
//                 <div className="flex items-end gap-2">
//                   <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
//                     <Bot className="w-3 h-3 text-white" />
//                   </div>
//                   <div className="bg-white rounded-2xl px-3 py-2 shadow-lg border border-gray-100 flex items-center gap-2">
//                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
//                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
//                     <span className="text-xs text-gray-500 ml-2">Analyzing...</span>
//                   </div>
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {messages.length === 1 && (
//             <div className="px-3 py-3 border-t border-gray-100 bg-gray-50/50">
//               <p className="text-sm text-gray-600 mb-3 font-medium">Try asking about:</p>
//               <div className="grid grid-cols-1 gap-2">
//                 {quickSuggestions.map((suggestion, index) => (
//                   <button key={index} onClick={() => setInputValue(suggestion)}
//                     className="text-left text-xs sm:text-sm text-gray-700 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg px-3 py-2 transition-all duration-200 hover:shadow-sm">
//                     {suggestion}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           <div className="p-4 border-t border-gray-200 bg-white">
//             <form className="flex gap-2" onSubmit={handleSubmit}>
//               <div className="flex-1 relative">
//                 <input
//                   type="text"
//                   value={inputValue}
//                   onChange={(e) => setInputValue(e.target.value)}
//                   placeholder="Describe your symptoms or upload a file..."
//                   className="w-full px-3 py-2 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
//                   disabled={isLoading}
//                 />
//                 <input
//                   type="file"
//                   accept="image/*,application/pdf,text/plain"
//                   onChange={handleFileChange}
//                   className="absolute right-10 top-1/2 transform -translate-y-1/2 w-6 h-6 opacity-0 cursor-pointer"
//                 />
//                 <Camera className="absolute right-10 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//                 <Paperclip className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//               </div>
//               <button
//                 type="submit"
//                 disabled={isLoading || (!inputValue.trim() && !selectedFile)}
//                 className="px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 shadow-lg"
//               >
//                 <Send className="w-4 h-4 inline" />
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WellnessChatbot;
