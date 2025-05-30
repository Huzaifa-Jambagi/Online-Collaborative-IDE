import axios from 'axios';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/clike/clike'; // for C, C++, Java
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/theme/dracula.css';
import { useState } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';

const languages = [
  { name: "C++", id: "cpp", version: "10.2.0", mode: "text/x-c++src" },
  { name: "Java", id: "java", version: "15.0.2", mode: "text/x-java" },
  { name: "Python", id: "python", version: "3.10.0", mode: "python" },
  { name: "JavaScript", id: "javascript", version: "18.15.0", mode: "javascript" },
  { name: "C", id: "c", version: "10.2.0", mode: "text/x-csrc" }
];

const Editor = () => {
  const [selectedLang, setSelectedLang] = useState(languages[3]); 
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

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
      {/* Left Panel Header + Editor */}
      <div className="d-flex flex-column flex-grow-1 border-end">
        {/* Header Controls */}
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
          <button className="btn btn-secondary ms-2">Review</button>
        </div>

        {/* Code Editor */}
        <div className="flex-grow-1 position-relative">
          <CodeMirror
            value={code}
            options={{
              mode: selectedLang.mode,
              theme: 'dracula',
              lineNumbers: true,
              autoCloseBrackets: true,
              autoCloseTags: true,
            }}
            onBeforeChange={(editor, data, value) => {
              setCode(value);
            }}
            editorDidMount={(editor) => {
              editor.setSize(null, '100%');
              const handleResize = () => editor.refresh();
              window.addEventListener('resize', handleResize);
              return () => window.removeEventListener('resize', handleResize);
            }}
            className="h-100 w-100"
          />
        </div>
      </div>

      {/* Output Section */}
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
