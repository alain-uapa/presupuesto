import React from 'react';

export interface FileAttachment {
  id?: number | string;
  nombre?: string;
  name?: string;
  url_view?: string;
  es_certificado?: boolean;
}

interface AttachmentListProps {
  files: FileAttachment[];
  onDeleteAttachment?: (id: number | string) => void;
  emptyMessage?: string;
}

const AttachmentList: React.FC<AttachmentListProps> = ({
  files,
  onDeleteAttachment,
  emptyMessage = 'No se adjuntaron archivos al presupuesto.'
}) => {
  const regularFiles = files?.filter(f => !f.es_certificado) || [];

  if (regularFiles.length === 0) {
    return (
      <p className="text-sm text-slate-400 italic">{emptyMessage}</p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {regularFiles.map((archivo, idx) => {
        const fileId = archivo.id ?? idx;
        const fileName = archivo.nombre ?? archivo.name ?? 'Archivo';
        
        return (
          <div 
            key={fileId} 
            className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-white hover:shadow-md hover:border-blue-400 transition-all duration-200"
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-gray-700 truncate" title={fileName}>
                  {fileName}
                </p>
                <p className="text-xs text-gray-400 uppercase tracking-tighter">Google Drive</p>
              </div>
            </div>

            <div className="flex items-center space-x-1 ml-2">
              {archivo.url_view && (
                <a 
                  href={archivo.url_view} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-4 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
              {onDeleteAttachment && (
                <button
                  type="button"
                  onClick={() => onDeleteAttachment(fileId as number | string)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar adjunto"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AttachmentList;
