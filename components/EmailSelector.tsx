import React, { useState, useEffect } from 'react';

const EmailSelector = () => {
  const [emails, setEmails] = useState([]); // Correos ya seleccionados
  const [inputValue, setInputValue] = useState(''); // Lo que se escribe
  const [suggestions, setSuggestions] = useState([]); // Lista filtrada
  
  // Datos de ejemplo (Esto vendría de tu base de datos Django)
  const directory = [
    { name: 'Alain Pérez', email: 'balartalain@gmail.com' },
    { name: 'Soporte UAPA', email: 'soporte@uapa.edu.do' },
    { name: 'Finanzas', email: 'finanzas@uapa.edu.do' },
    { name: 'Rectoría', email: 'rectoria@uapa.edu.do' }
  ];

  // Filtrar sugerencias mientras el usuario escribe
  useEffect(() => {
    if (inputValue.trim() === "") {
      setSuggestions([]);
    } else {
      const filtered = directory.filter(contact =>
        contact.email.toLowerCase().includes(inputValue.toLowerCase()) &&
        !emails.includes(contact.email)
      );
      setSuggestions(filtered);
    }
  }, [inputValue, emails]);

  const addEmail = (email) => {
    if (!emails.includes(email)) {
      setEmails([...emails, email]);
    }
    setInputValue('');
  };

  const removeEmail = (emailToRemove) => {
    setEmails(emails.filter(email => email !== emailToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.includes('@')) {
      addEmail(inputValue.trim());
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-bold text-gray-700 mb-2">Destinatarios</label>
      
      <div className="relative flex flex-wrap items-center gap-2 p-2 border-b-2 border-gray-200 focus-within:border-[#003B71] transition-all bg-white">
        {/* Chips de correos seleccionados */}
        {emails.map(email => (
          <div key={email} className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm border border-gray-200">
            <span>{email}</span>
            <button onClick={() => removeEmail(email)} className="hover:text-red-500 font-bold ml-1">×</button>
          </div>
        ))}

        {/* Input transparente */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={emails.length === 0 ? "Escribe un correo..." : ""}
          className="flex-1 outline-none min-w-[150px] text-sm py-1"
        />

        {/* Menú de Sugerencias (Dropdown) */}
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-b-lg border border-gray-100 z-50 mt-1 overflow-hidden">
            {suggestions.map(contact => (
              <div 
                key={contact.email}
                onClick={() => addEmail(contact.email)}
                className="px-4 py-3 hover:bg-emerald-50 cursor-pointer flex justify-between items-center transition-colors border-b border-gray-50 last:border-none"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-800">{contact.name}</span>
                  <span className="text-xs text-gray-500">{contact.email}</span>
                </div>
                <i className="fas fa-plus text-gray-300 text-xs"></i>
              </div>
            ))}
          </div>
        )}
      </div>
      <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest font-bold">Presiona Enter para agregar correos externos</p>
    </div>
  );
};

export default EmailSelector;