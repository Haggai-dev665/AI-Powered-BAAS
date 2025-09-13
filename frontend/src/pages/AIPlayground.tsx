import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BeakerIcon, 
  SparklesIcon, 
  DocumentTextIcon,
  LanguageIcon,
  PlayIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { generateText, analyzeSentiment, summarizeText, translateText } from '../utils/api';
import { useWebSocket } from '../hooks/useWebSocket';

const AIPlayground: React.FC = () => {
  const [activeTab, setActiveTab] = useState('generate');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { sendAIRequest, messages, connected } = useWebSocket();

  // Form states
  const [generateForm, setGenerateForm] = useState({
    prompt: 'Write a creative story about an AI-powered future.',
    maxTokens: 500,
    temperature: 0.7
  });

  const [sentimentForm, setSentimentForm] = useState({
    text: 'I absolutely love this new AI platform! It\'s incredibly powerful and easy to use.'
  });

  const [summarizeForm, setSummarizeForm] = useState({
    text: 'Artificial Intelligence (AI) has revolutionized the way we approach technology and problem-solving. From machine learning algorithms that can predict market trends to natural language processing systems that can understand and respond to human speech, AI has become an integral part of our daily lives. The development of AI has been driven by advances in computing power, the availability of large datasets, and breakthroughs in algorithmic design. Today, AI applications can be found in virtually every industry, from healthcare and finance to transportation and entertainment.',
    maxLength: 100
  });

  const [translateForm, setTranslateForm] = useState({
    text: 'Hello, how are you today?',
    targetLanguage: 'es',
    sourceLanguage: 'en'
  });

  const tabs = [
    { id: 'generate', name: 'Text Generation', icon: SparklesIcon, color: 'from-purple-500 to-pink-500' },
    { id: 'sentiment', name: 'Sentiment Analysis', icon: BeakerIcon, color: 'from-blue-500 to-indigo-500' },
    { id: 'summarize', name: 'Text Summary', icon: DocumentTextIcon, color: 'from-green-500 to-emerald-500' },
    { id: 'translate', name: 'Translation', icon: LanguageIcon, color: 'from-orange-500 to-red-500' }
  ];

  const handleSubmit = async (type: string) => {
    setLoading(true);
    setResult(null);

    try {
      let response;
      let requestId = `${type}_${Date.now()}`;

      switch (type) {
        case 'generate':
          if (connected) {
            sendAIRequest({
              type: 'generate',
              payload: { 
                prompt: generateForm.prompt,
                max_tokens: generateForm.maxTokens,
                temperature: generateForm.temperature
              },
              requestId
            });
          } else {
            response = await generateText(generateForm.prompt, {
              maxTokens: generateForm.maxTokens,
              temperature: generateForm.temperature
            });
            setResult(response);
          }
          break;

        case 'sentiment':
          if (connected) {
            sendAIRequest({
              type: 'sentiment',
              payload: { text: sentimentForm.text },
              requestId
            });
          } else {
            response = await analyzeSentiment(sentimentForm.text);
            setResult(response);
          }
          break;

        case 'summarize':
          if (connected) {
            sendAIRequest({
              type: 'summarize',
              payload: { 
                text: summarizeForm.text,
                max_length: summarizeForm.maxLength
              },
              requestId
            });
          } else {
            response = await summarizeText(summarizeForm.text, summarizeForm.maxLength);
            setResult(response);
          }
          break;

        case 'translate':
          response = await translateText(
            translateForm.text,
            translateForm.targetLanguage,
            translateForm.sourceLanguage
          );
          setResult(response);
          break;
      }
    } catch (error) {
      console.error(`Error in ${type}:`, error);
      setResult({
        success: false,
        error: `Failed to process ${type} request`
      });
    } finally {
      if (!connected) {
        setLoading(false);
      }
    }
  };

  // Listen for WebSocket responses
  React.useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    if (latestMessage && latestMessage.type === 'ai_result') {
      setResult(latestMessage.data.result);
      setLoading(false);
    } else if (latestMessage && latestMessage.type === 'ai_error') {
      setResult({
        success: false,
        error: latestMessage.data.error
      });
      setLoading(false);
    }
  }, [messages]);

  const renderForm = () => {
    switch (activeTab) {
      case 'generate':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-900 mb-2">
                Prompt
              </label>
              <textarea
                value={generateForm.prompt}
                onChange={(e) => setGenerateForm(prev => ({ ...prev, prompt: e.target.value }))}
                className="input-field h-32"
                placeholder="Enter your text generation prompt..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary-900 mb-2">
                  Max Tokens
                </label>
                <input
                  type="number"
                  value={generateForm.maxTokens}
                  onChange={(e) => setGenerateForm(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                  className="input-field"
                  min="1"
                  max="2000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary-900 mb-2">
                  Temperature
                </label>
                <input
                  type="number"
                  value={generateForm.temperature}
                  onChange={(e) => setGenerateForm(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                  className="input-field"
                  min="0"
                  max="1"
                  step="0.1"
                />
              </div>
            </div>
          </div>
        );

      case 'sentiment':
        return (
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">
              Text to Analyze
            </label>
            <textarea
              value={sentimentForm.text}
              onChange={(e) => setSentimentForm(prev => ({ ...prev, text: e.target.value }))}
              className="input-field h-32"
              placeholder="Enter text for sentiment analysis..."
            />
          </div>
        );

      case 'summarize':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-900 mb-2">
                Text to Summarize
              </label>
              <textarea
                value={summarizeForm.text}
                onChange={(e) => setSummarizeForm(prev => ({ ...prev, text: e.target.value }))}
                className="input-field h-40"
                placeholder="Enter text to summarize..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-900 mb-2">
                Max Summary Length
              </label>
              <input
                type="number"
                value={summarizeForm.maxLength}
                onChange={(e) => setSummarizeForm(prev => ({ ...prev, maxLength: parseInt(e.target.value) }))}
                className="input-field"
                min="50"
                max="500"
              />
            </div>
          </div>
        );

      case 'translate':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-900 mb-2">
                Text to Translate
              </label>
              <textarea
                value={translateForm.text}
                onChange={(e) => setTranslateForm(prev => ({ ...prev, text: e.target.value }))}
                className="input-field h-32"
                placeholder="Enter text to translate..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary-900 mb-2">
                  From Language
                </label>
                <select
                  value={translateForm.sourceLanguage}
                  onChange={(e) => setTranslateForm(prev => ({ ...prev, sourceLanguage: e.target.value }))}
                  className="input-field"
                >
                  <option value="auto">Auto-detect</option>
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                  <option value="ja">Japanese</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary-900 mb-2">
                  To Language
                </label>
                <select
                  value={translateForm.targetLanguage}
                  onChange={(e) => setTranslateForm(prev => ({ ...prev, targetLanguage: e.target.value }))}
                  className="input-field"
                >
                  <option value="es">Spanish</option>
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                  <option value="ja">Japanese</option>
                </select>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderResult = () => {
    if (!result) return null;

    if (!result.success) {
      return (
        <div className="card bg-red-50 border-red-200">
          <div className="flex items-center space-x-2 text-red-800">
            <span className="font-medium">Error:</span>
            <span>{result.error}</span>
          </div>
        </div>
      );
    }

    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-primary-900 mb-4">Result</h3>
        <div className="space-y-4">
          {activeTab === 'generate' && (
            <div>
              <h4 className="font-medium text-primary-800 mb-2">Generated Text:</h4>
              <p className="text-primary-700 bg-primary-50 p-4 rounded-lg">
                {result.data?.generated_text}
              </p>
            </div>
          )}

          {activeTab === 'sentiment' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <h4 className="font-medium text-primary-800 mb-2">Sentiment</h4>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  result.data?.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                  result.data?.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {result.data?.sentiment}
                </span>
              </div>
              <div className="text-center">
                <h4 className="font-medium text-primary-800 mb-2">Confidence</h4>
                <span className="text-2xl font-bold text-primary-900">
                  {(result.data?.confidence * 100).toFixed(1)}%
                </span>
              </div>
              <div className="text-center">
                <h4 className="font-medium text-primary-800 mb-2">Emotions</h4>
                <div className="flex flex-wrap gap-1 justify-center">
                  {result.data?.emotions?.map((emotion: string) => (
                    <span key={emotion} className="px-2 py-1 bg-primary-100 text-primary-800 rounded text-xs">
                      {emotion}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'summarize' && (
            <div>
              <h4 className="font-medium text-primary-800 mb-2">Summary:</h4>
              <p className="text-primary-700 bg-primary-50 p-4 rounded-lg">
                {result.data?.summary}
              </p>
              <div className="text-sm text-primary-600 mt-2">
                Original length: {result.data?.original_length} characters
              </div>
            </div>
          )}

          {activeTab === 'translate' && (
            <div>
              <h4 className="font-medium text-primary-800 mb-2">Translation:</h4>
              <p className="text-primary-700 bg-primary-50 p-4 rounded-lg">
                {result.data?.translated_text}
              </p>
              <div className="text-sm text-primary-600 mt-2">
                {result.data?.source_language} → {result.data?.target_language}
              </div>
            </div>
          )}

          {result.processing_time_ms && (
            <div className="text-sm text-primary-600">
              Processing time: {result.processing_time_ms.toFixed(1)}ms
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-gradient mb-4">AI Playground</h1>
        <p className="text-xl text-primary-600 mb-6">
          Test and experiment with our AI models powered by Gemini API
        </p>
        <div className="flex items-center justify-center space-x-2">
          <div className={`h-2 w-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-primary-600">
            {connected ? 'Real-time mode enabled' : 'Using standard API calls'}
          </span>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 m-1 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-primary-900 text-white shadow-lg'
                  : 'bg-white text-primary-700 hover:bg-primary-100 border border-primary-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="h-5 w-5" />
              <span>{tab.name}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-primary-900 mb-6">
            {tabs.find(tab => tab.id === activeTab)?.name}
          </h2>
          
          {renderForm()}

          <motion.button
            onClick={() => handleSubmit(activeTab)}
            disabled={loading}
            className="btn-primary w-full mt-6 flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <>
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <PlayIcon className="h-5 w-5" />
                <span>Run AI Model</span>
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Results */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-primary-900">Results</h2>
          
          {loading && (
            <div className="card">
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900"></div>
              </div>
            </div>
          )}

          {renderResult()}

          {!result && !loading && (
            <div className="card text-center py-12">
              <BeakerIcon className="h-16 w-16 text-primary-300 mx-auto mb-4" />
              <p className="text-primary-600">
                Run an AI model to see results here
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AIPlayground;