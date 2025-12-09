"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

/**
 * ✅ USE CDN WORKER (FIXES MODULE ERROR)
 */
pdfjs.GlobalWorkerOptions.workerSrc = 
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

type Props = {
  url: string;
};

export default function ResumePdfViewer({ url }: Props) {
  const [numPages, setNumPages] = useState<number | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className="w-full flex flex-col items-center">
     <Document
  file={{
    url: url,
    httpHeaders: {
     
    },
    withCredentials: false,
  }}
  onLoadSuccess={onDocumentLoadSuccess}
  onLoadError={(err) => console.error(err)}
  loading={<p>Loading PDF…</p>}
  error={<p>Failed to load PDF</p>}
>
        {Array.from(new Array(numPages || 0), (_, i) => (
          <Page
            key={i}
            pageNumber={i + 1}
            width={800}
          />
        ))}
      </Document>
    </div>
  );
}
