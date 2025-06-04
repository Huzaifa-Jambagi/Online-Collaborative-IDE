import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { GoogleGenAI } from "@google/genai";
import { dracula } from '@uiw/codemirror-theme-dracula';
import CodeMirror from '@uiw/react-codemirror';
import axios from 'axios';
import 'codemirror/lib/codemirror.css';


import { useState } from 'react';
import toast from 'react-hot-toast';

const languages = [
  { name: "C++", id: "cpp", version: "10.2.0", extension: cpp() },
  { name: "Java", id: "java", version: "15.0.2", extension: java() },
  { name: "Python", id: "python", version: "3.10.0", extension: python() },
  { name: "JavaScript", id: "javascript", version: "18.15.0", extension: javascript() },
  { name: "C", id: "c", version: "10.2.0", extension: cpp() }
];

const key = import.meta.env.VITE_API_KEY
const ai = new GoogleGenAI({ apiKey: key });

const Editor = () => {
  const [selectedLang, setSelectedLang] = useState(languages[3]);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

  const reviewCode = async () => {
    try{
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `You are an expert software engineer and code reviewer.

 Analyze the following code for:
1. Syntax errors
2. Logical bugs
3. Bad practices
4. Optimization opportunities
Suggest improvements and fixes **with corrected code**. If the code is correct, explain why it works and dont make it very long.

Code:${code}`,
    });
    setOutput(response.text);
  }catch(error){
    toast.error("Something went wrong with the AI")
  }
  }

  const runCode = async () => {
    try {
      const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
        language: selectedLang.id,
        version: selectedLang.version,
        files: [{ content: code }]
      });
      setOutput(response.data.run.output);
    } catch (err) {
      setOutput("Error running code.");
    }
  };

  return (
    <div className="d-flex h-100" style={{ height: "100vh" }}>
      {/* Editor Panel */}
      <div className="d-flex flex-column flex-grow-1 border-end">
        <div className="d-flex align-items-center p-2 border-bottom">
          <select
            className="form-select w-auto me-3"
            value={selectedLang.id}
            onChange={(e) => {
              const lang = languages.find(l => l.id === e.target.value);
              setSelectedLang(lang);
            }}
          >
            {languages.map(lang => (
              <option key={lang.id} value={lang.id}>{lang.name}</option>
            ))}
          </select>
          <button onClick={runCode} className="btn btn-success">Run</button>
          <button onClick={reviewCode} className="btn btn-secondary ms-2">Review</button>
        </div>

        <div className="flex-grow-1 position-relative">
          <CodeMirror
            value={code}
            height="100%"
            theme={dracula}
            extensions={selectedLang.extension ? [selectedLang.extension] : []}
            onChange={(value) => setCode(value)}
          />

        </div>
      </div>

      {/* Output Panel */}
      <div className="d-flex flex-column" style={{ width: '40%', minWidth: '300px' }}>
        <div className="bg-secondary text-white p-2 border-bottom">
          <h4>Output</h4>
        </div>
        <div
          className="bg-dark text-white p-3 flex-grow-1 overflow-auto"
          style={{
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
            fontSize: "14px"
          }}
        >
          {output || "Run your code to see output"}
        </div>
      </div>
    </div>
  );
};

export default Editor;
