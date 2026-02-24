import React, { useState, useEffect, useRef } from 'react';

const EmailSelector = () => {
  const [emails, setEmails] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1); // Para navegar con flechas
  const inputRef = useRef(null);

  const directory = [
    { name: 'Alain Pérez', email: 'balartalain@gmail.com' },
    { name: 'Soporte UAPA', email: 'soporte@uapa.edu.do' },
    { name: 'Finanzas', email: 'finanzas@uapa.edu.do' },
    { name: 'Rectoría', email: 'rectoria@uapa.edu.do' }
  ];

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = directory.filter(c => 
        c.email.toLowerCase().includes(inputValue.toLowerCase()) && !emails.includes(c.email)
      );
      setSuggestions(filtered);
      setSelectedIndex(0); // Resetear al primer elemento al buscar
    } else {
      setSuggestions([]);
      setSelectedIndex(-1);
    }
  }, [inputValue, emails]);

  const addEmail = (email) => {
    if (email && !emails.includes(email)) {
      setEmails([...emails, email]);
      setInputValue('');
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e) => {
    // 1. Borrar con Backspace si el input está vacío
    if (e.key === 'Backspace' && inputValue === '' && emails.length > 0) {
      const newEmails = [...emails];
      newEmails.pop();
      setEmails(newEmails);
    }

    // 2. Navegación por sugerencias con flechas
    if (suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        if (selectedIndex >= 0) {
          addEmail(suggestions[selectedIndex].email);
        } else if (inputValue.includes('@')) {
          addEmail(inputValue.trim());
        }
      }
    } else if (e.key === 'Enter' && inputValue.includes('@')) {
      addEmail(inputValue.trim());
    }
  };

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-sm">
      <label className="block text-sm font-bold text-gray-700 mb-2">Destinatarios</label>
      <div 
        className="flex flex-wrap items-center gap-2 p-1.5 border-b-2 border-gray-100 focus-within:border-[#003B71] transition-all relative"
        onClick={() => inputRef.current.focus()}
      >
        {/* Chips */}
        {emails.map((email) => (
          <div key={email} className="flex items-center gap-1 bg-gray-100 text-gray-700 pl-3 pr-1.5 py-1 rounded-full text-sm border border-gray-200 animate-in fade-in zoom-in duration-200">
            <span>{email}</span>
            <button 
              onClick={(e) => { e.stopPropagation(); setEmails(emails.filter(em => em !== email)); }}
              className="w-5 h-5 flex items-center justify-center rounded-full hover:text-red-500 font-bold ml-1"
            >x
            </button>
          </div>
        ))}

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          className="flex-grow outline-none py-2 text-sm min-w-[120px]"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={emails.length === 0 ? "Para:" : ""}
        />

        {/* Dropdown de Sugerencias */}
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 w-full bg-white shadow-2xl rounded-md border border-gray-100 z-50 mt-2 py-1 overflow-hidden">
            {suggestions.map((contact, index) => (
              <div
                key={contact.email}
                onMouseEnter={() => setSelectedIndex(index)}
                onClick={() => addEmail(contact.email)}
                className={`px-4 py-2 cursor-pointer flex items-center justify-between ${
                  index === selectedIndex ? 'bg-emerald-50' : ''
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-800">{contact.name}</span>
                  <span className="text-xs text-gray-500">{contact.email}</span>
                </div>
                {index === selectedIndex && <i className="fas fa-level-down-alt text-[10px] text-emerald-400 rotate-90"></i>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default EmailSelector;