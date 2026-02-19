import { useState, useCallback } from "react";
import { Upload, FileText, AlertCircle, CheckCircle2 } from "lucide-react";

interface FileUploadProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
}

export default function FileUpload({ onUpload, isLoading }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.name.endsWith(".csv")) {
        return;
      }
      setFileName(file.name);
      onUpload(file);
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="w-full">
      <label
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`
          relative flex flex-col items-center justify-center w-full h-44 rounded-xl border-2 border-dashed cursor-pointer
          transition-all duration-300
          ${isDragging
            ? "border-[hsl(var(--primary))] bg-[hsl(var(--accent))] scale-[1.01]"
            : fileName
              ? "border-[hsl(var(--primary)/0.5)] bg-[hsl(var(--accent)/0.4)]"
              : "border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.4)] hover:border-[hsl(var(--primary)/0.4)] hover:bg-[hsl(var(--accent)/0.3)]"
          }
        `}
      >
        <input
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleChange}
          disabled={isLoading}
        />

        {isLoading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-[hsl(var(--muted-foreground))]">Analyzing transactions...</span>
          </div>
        ) : fileName ? (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-[hsl(var(--primary))]" />
              <FileText className="w-6 h-6 text-[hsl(var(--muted-foreground))]" />
            </div>
            <span className="text-sm font-medium text-[hsl(var(--foreground))]">{fileName}</span>
            <span className="text-xs text-[hsl(var(--muted-foreground))]">Click to upload a different file</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 rounded-full bg-[hsl(var(--accent))]">
              <Upload className="w-7 h-7 text-[hsl(var(--primary))]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                Drop your CSV file here, or <span className="text-[hsl(var(--primary))]">browse</span>
              </p>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                Required columns: transaction_id, sender_id, receiver_id, amount, timestamp
              </p>
            </div>
          </div>
        )}
      </label>

      <div className="mt-3 flex items-start gap-2 px-1">
        <AlertCircle className="w-3.5 h-3.5 text-[hsl(var(--muted-foreground))] mt-0.5 shrink-0" />
        <p className="text-xs text-[hsl(var(--muted-foreground))]">
          All analysis runs locally in your browser. No data is transmitted to any server.
        </p>
      </div>
    </div>
  );
}
