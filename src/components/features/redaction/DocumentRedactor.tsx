"use client";

import { useState, useRef, useEffect } from "react";
import Tesseract from "tesseract.js";
import { StorageService } from "@/services/storage";

interface RedactionBox {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
}

export default function DocumentRedactor() {
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [boxes, setBoxes] = useState<RedactionBox[]>([]);
  const [rawText, setRawText] = useState<string>("");
  const [processedPreview, setProcessedPreview] = useState<string | null>(null);
  const [showProcessed, setShowProcessed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setImage(url);
      setBoxes([]);
      setStatus("");
      setRawText("");
      setProcessedPreview(null);
    }
  };

  // Helper to pre-process image for better OCR
  const preprocessImage = (imageSrc: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(imageSrc);
          return;
        }

        // Upscale 2x for better small-text recognition
        canvas.width = img.width * 2;
        canvas.height = img.height * 2;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.scale(2, 2);
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // 1. Grayscale + Contrast Stretching
        let min = 255;
        let max = 0;
        const grays = new Uint8Array(data.length / 4);

        for (let i = 0; i < data.length; i += 4) {
          const g = Math.round(
            data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114,
          );
          grays[i / 4] = g;
          if (g < min) min = g;
          if (g > max) max = g;
        }

        const range = max - min || 1;
        for (let i = 0; i < data.length; i += 4) {
          const g = grays[i / 4];
          // Stretch to 0-255
          const stretched = ((g - min) / range) * 255;

          // 2. Simple Binarization with bias
          const val = stretched > 120 ? 255 : 0;
          data[i] = data[i + 1] = data[i + 2] = val;
          data[i + 3] = 255; // Fully opaque
        }

        ctx.putImageData(imageData, 0, 0);
        const out = canvas.toDataURL("image/png");
        setProcessedPreview(out);
        resolve(out);
      };
      img.src = imageSrc;
    });
  };

  const analyzeImage = async () => {
    if (!image) return;
    setBoxes([]);
    setRawText("");
    setStatus("Pre-processing image...");

    try {
      const processedImage = await preprocessImage(image);

      setStatus("Initializing OCR Engine...");
      const worker = await Tesseract.createWorker("eng", 1, {
        workerPath: "/tesseract/worker.min.js",
        corePath: "/tesseract/tesseract-core.wasm.js",
        langPath: "/tesseract",
        logger: (m) =>
          setStatus(`OCR: ${m.status} (${Math.round(m.progress * 100)}%)`),
      });

      // Set parameters for better receipt segmentation
      await worker.setParameters({
        tessedit_pageseg_mode: "1" as any, // Automatic page segmentation with OSD
        tessjs_create_hocr: "1",
        tessjs_create_tsv: "1",
      });

      const result = await worker.recognize(processedImage);
      await worker.terminate();

      console.log("OCR Full Result:", result);
      setRawText(result.data.text);
      const data = result.data as any;

      if (!data || !data.text || data.text.trim().length === 0) {
        setStatus("OCR finished but no readable text detected.");
        return;
      }

      const newBoxes: RedactionBox[] = [];
      const patterns = {
        EMAIL: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
        PHONE: /\b(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})\b/,
        GENERIC_PHONE: /\b\d{10,12}\b/,
        CC: /\b(?:\d[ -]*?){13,19}\b/,
        DATE: /\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/,
        PASSPORT: /\b[A-Z0-9]{7,15}\b/i,
      };

      const highRiskKeywords = [
        "total",
        "amount",
        "balance",
        "price",
        "sub",
        "tax",
        "bill",
        "invoice",
        "cashier",
        "restaurant",
        "contact",
        "email",
        "name",
        "surname",
        "birth",
        "geburt",
        "place",
        "nationality",
        "expiry",
        "authority",
        "signature",
        "inhaber",
        "titulaire",
        "pass-nr",
        "bundesrepublik",
        "kolkata",
        "pulao",
        "qty",
        "service",
        "charge",
        "mobile",
        "ph",
      ];

      // Process Words - More robust coordinate mapping
      if (data.words) {
        data.words.forEach((word: any) => {
          const text = word.text || "";
          if (word.confidence < 30) return; // Skip low confidence noise

          for (const [label, regex] of Object.entries(patterns)) {
            if (regex.test(text)) {
              newBoxes.push({
                x: word.bbox.x0 / 2,
                y: word.bbox.y0 / 2,
                w: (word.bbox.x1 - word.bbox.x0) / 2,
                h: (word.bbox.y1 - word.bbox.y0) / 2,
                label,
              });
              return;
            }
          }
        });
      }

      // Process Lines for context
      if (data.lines) {
        data.lines.forEach((line: any) => {
          const text = line.text?.toLowerCase() || "";
          if (line.confidence < 25) return;

          const hasKeyword = highRiskKeywords.some((kw) => text.includes(kw));
          const hasCurrency =
            text.includes("$") ||
            text.includes("€") ||
            text.includes("£") ||
            text.includes("¥") ||
            text.includes("rs");
          const hasBigNumber = /\d{5,}/.test(text);
          const hasIDPattern = /[A-Z]{1,2}[0-9<]{7,}/i.test(text);

          if (
            hasKeyword ||
            (hasCurrency && /\d/.test(text)) ||
            hasBigNumber ||
            hasIDPattern
          ) {
            newBoxes.push({
              x: line.bbox.x0 / 2,
              y: line.bbox.y0 / 2,
              w: (line.bbox.x1 - line.bbox.x0) / 2,
              h: (line.bbox.y1 - line.bbox.y0) / 2,
              label: "CONFIDENTIAL",
            });
          }
        });
      }

      setBoxes(newBoxes);
      setStatus(`Analysis Complete. Found ${newBoxes.length} sensitive items.`);
    } catch (err: any) {
      console.error(err);
      setStatus("OCR Failed: " + (err.message || "Unknown error"));
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (canvas && img && image) {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        ctx.fillStyle = "black";
        boxes.forEach((box) => {
          ctx.fillRect(box.x, box.y, box.w, box.h);
        });
      }
    }
  }, [image, boxes]);

  return (
    <div className="p-6 border border-secondary bg-black/80 shadow-[0_0_20px_rgba(0,255,157,0.15)] max-w-4xl mx-auto relative rounded-lg">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-secondary to-transparent"></div>

      <h2 className="text-2xl font-bold mb-8 text-secondary uppercase font-mono flex items-center gap-4 before:block before:w-2 before:h-2 before:bg-secondary before:shadow-[0_0_10px_var(--secondary)]">
        PII Redaction Tool
      </h2>

      <div className="mb-8 p-8 border border-dashed border-secondary rounded bg-secondary/5 text-center transition-all hover:bg-secondary/10 hover:shadow-[0_0_15px_rgba(0,255,157,0.2)]">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-text-muted font-mono file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-secondary/10 file:text-secondary hover:file:bg-secondary/20 cursor-pointer"
        />
      </div>

      {status && (
        <p className="mb-4 text-sm text-secondary font-mono p-2 border-l-2 border-secondary bg-secondary/5">
          {status}
        </p>
      )}

      {image && (
        <div className="flex flex-col gap-4">
          <div className="relative border border-white/10 overflow-hidden max-h-[600px] mb-6 bg-black group">
            {/* Scanline Effect */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/50 shadow-[0_0_10px_var(--primary)] animate-scanline pointer-events-none z-10" />

            <img
              ref={imageRef}
              src={showProcessed && processedPreview ? processedPreview : image}
              alt="Original"
              onLoad={() => setStatus("Image Loaded. Ready to Analyze.")}
              style={{
                display: boxes.length > 0 && !showProcessed ? "none" : "block",
              }}
              className={`max-w-full block ${!showProcessed ? "contrast-[1.1] brightness-[0.9] grayscale-[0.2]" : ""}`}
            />
            <canvas
              ref={canvasRef}
              style={{
                display: boxes.length > 0 && !showProcessed ? "block" : "none",
              }}
              className="max-w-full block"
            />
          </div>

          <div className="flex gap-4 flex-wrap justify-center">
            {processedPreview && (
              <label className="flex items-center gap-2 px-4 py-2 border border-secondary/30 rounded cursor-pointer hover:bg-secondary/5 font-mono text-xs text-secondary transition-colors">
                <input
                  type="checkbox"
                  checked={showProcessed}
                  onChange={(e) => setShowProcessed(e.target.checked)}
                  className="accent-secondary"
                />
                Show OCR Preview
              </label>
            )}
            <button
              onClick={analyzeImage}
              className="px-6 py-3 border border-secondary bg-secondary/20 text-secondary font-bold uppercase font-mono tracking-wider transition-all hover:bg-secondary hover:text-black hover:shadow-[0_0_15px_var(--secondary)]"
            >
              Auto-Redact PII
            </button>
            <button
              onClick={() => setBoxes([])}
              className="px-6 py-3 border border-text-muted bg-transparent text-text-muted font-bold uppercase font-mono tracking-wider transition-all hover:border-white hover:text-white"
            >
              Reset Redactions
            </button>
            <button
              onClick={async () => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                try {
                  const dataUrl = canvas.toDataURL("image/png");
                  await StorageService.addAsset({
                    id: Math.random().toString(36).substring(2, 15),
                    type: "document",
                    content: dataUrl,
                    createdAt: Date.now(),
                  });
                  setStatus("Document Saved to Vault!");
                  setTimeout(() => setStatus(""), 3000);
                } catch (err) {
                  console.error("Save failed:", err);
                  setStatus("Save Failed");
                }
              }}
              className="px-6 py-3 border border-primary bg-primary/10 text-primary font-bold uppercase font-mono tracking-wider transition-all hover:bg-primary hover:text-black hover:shadow-[0_0_15px_var(--primary)]"
            >
              Save to Vault
            </button>
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.download = "redacted_document.png";
                link.href = canvasRef.current?.toDataURL() || "";
                link.click();
              }}
              disabled={boxes.length === 0}
              className="px-6 py-3 border border-success bg-success/10 text-success font-bold uppercase font-mono tracking-wider transition-all hover:bg-success hover:text-black hover:shadow-[0_0_15px_var(--success)] disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none disabled:bg-transparent"
            >
              Download Redacted
            </button>
          </div>

          {rawText && (
            <div className="mt-8 p-4 border border-white/5 bg-white/5 rounded backdrop-blur-sm animate-fade-in">
              <h3 className="text-xs font-mono text-secondary mb-2 uppercase tracking-widest opacity-70 flex items-center gap-2">
                <span className="w-2 h-2 bg-secondary animate-pulse rounded-full"></span>
                OCR Result (Raw)
              </h3>
              <div className="p-3 bg-black/50 rounded border border-white/5 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-secondary/20 scrollbar-track-transparent">
                <pre className="text-[10px] font-mono whitespace-pre-wrap text-text-muted leading-relaxed">
                  {rawText}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
