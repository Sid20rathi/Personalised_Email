interface PdfViewerProps {
  url: string;
}

export default function PdfViewer({ url }: PdfViewerProps) {
  return (
    <div className="w-full h-[75vh] min-h-[500px] border-2 border-gray-200 rounded-xl  shadow-sm bg-gray-50">
      <iframe 
        src={url} 
        className="w-full h-full" 
        title="Resume Viewer"
       
        allow="fullscreen"
      />
    </div>
  );
}