import React from 'react';

export default function TextEditorToolbar() {
  const formatOptions = [
    { icon: 'B', label: 'Bold', command: 'bold', tooltip: 'Ctrl+B' },
    { icon: 'I', label: 'Italic', command: 'italic', tooltip: 'Ctrl+I' },
    { icon: 'U', label: 'Underline', command: 'underline', tooltip: 'Ctrl+U' },
  ];

  const handleFormat = (command) => {
    document.execCommand(command, false, null);
  };

  return (
    <div className="border-b border-gray-200 bg-gray-50 px-6 py-2">
      <div className="flex items-center gap-4">
        {/* Formatting Buttons */}
        <div className="flex gap-2 border-r border-gray-300 pr-4">
          {formatOptions.map((option) => (
            <button
              key={option.command}
              onClick={() => handleFormat(option.command)}
              title={option.tooltip}
              className="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 font-bold text-sm"
            >
              {option.icon}
            </button>
          ))}
        </div>

        {/* Text Align */}
        <div className="flex gap-2">
          <button
            onClick={() => document.execCommand('justifyLeft', false, null)}
            title="Align Left"
            className="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100"
          >
            ☰
          </button>
          <button
            onClick={() => document.execCommand('justifyCenter', false, null)}
            title="Align Center"
            className="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100"
          >
            ☲
          </button>
          <button
            onClick={() => document.execCommand('justifyRight', false, null)}
            title="Align Right"
            className="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100"
          >
            ☳
          </button>
        </div>

        {/* Lists */}
        <div className="flex gap-2 border-l border-gray-300 pl-4">
          <button
            onClick={() => document.execCommand('insertUnorderedList', false, null)}
            title="Bullet List"
            className="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100"
          >
            • List
          </button>
          <button
            onClick={() => document.execCommand('insertOrderedList', false, null)}
            title="Numbered List"
            className="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100"
          >
            1. List
          </button>
        </div>
      </div>
    </div>
  );
}
