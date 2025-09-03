import { useState, useRef } from 'react';

interface FileUploadProps {
  fieldName: string;
  label: string;
  value?: string;
  onChange: (value: string) => void;
  multiple?: boolean;
  accept?: string;
}

interface UploadedFile {
  url: string;
  name: string;
  type: string;
}

export default function FileUpload({ 
  fieldName, 
  label, 
  value, 
  onChange, 
  multiple = true,
  accept = "image/*,video/*"
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse existing URLs from value
  const existingUrls = value ? value.split(',').filter(url => url.trim()) : [];

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('/api/v1/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      
      if (result.success && result.urls) {
        // Combine existing URLs with new ones
        const allUrls = [...existingUrls, ...result.urls];
        const urlString = allUrls.join(',');
        onChange(urlString);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = (urlToRemove: string) => {
    const updatedUrls = existingUrls.filter(url => url !== urlToRemove);
    onChange(updatedUrls.join(','));
  };

  const getFileType = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return 'image';
    }
    if (['mp4', 'webm', 'ogg', 'mov'].includes(extension || '')) {
      return 'video';
    }
    return 'unknown';
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-white">
        {label}
      </label>
      
      {/* File Input */}
      <div className="flex items-center space-x-4">
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileSelect}
          disabled={isUploading}
          className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-400 disabled:opacity-50"
        />
        
        {isUploading && (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-300">Uploading...</span>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="text-red-400 text-sm bg-red-900/20 border border-red-500/20 rounded-md p-3">
          {error}
        </div>
      )}

      {/* Existing Files Display */}
      {existingUrls.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300">Uploaded Files:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {existingUrls.map((url, index) => {
              const fileType = getFileType(url);
              const fileName = url.split('/').pop() || `File ${index + 1}`;
              
              return (
                <div key={url} className="relative group bg-gray-800 rounded-lg p-3 border border-gray-700">
                  <button
                    type="button"
                    onClick={() => removeFile(url)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  <div className="space-y-2">
                    {fileType === 'image' ? (
                      <img 
                        src={url} 
                        alt={fileName}
                        className="w-full h-32 object-cover rounded-md"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : fileType === 'video' ? (
                      <video 
                        src={url} 
                        className="w-full h-32 object-cover rounded-md"
                        controls
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-700 rounded-md flex items-center justify-center">
                        <span className="text-gray-400">File</span>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-400 truncate" title={fileName}>
                      {fileName}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name={fieldName}
        value={value || ''}
      />
    </div>
  );
}
