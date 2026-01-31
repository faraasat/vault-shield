"use client";

import { useState, useRef, useEffect } from "react";
import Tesseract from "tesseract.js";

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setImage(url);
      setBoxes([]);
      setStatus("");
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    setStatus("Analyzing with OCR...");

    try {
      const result = await Tesseract.recognize(image, "eng", {
        logger: (m) =>
          setStatus(`OCR: ${m.status} (${Math.round(m.progress * 100)}%)`),
      });

      console.log("OCR Result:", result);

      const newBoxes: RedactionBox[] = [];
      const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;

      // @ts-ignore
      (result.data as any).words.forEach((word: any) => {
        if (emailRegex.test(word.text) || word.text.includes("@")) {
          newBoxes.push({
            x: word.bbox.x0,
            y: word.bbox.y0,
            w: word.bbox.x1 - word.bbox.x0,
            h: word.bbox.y1 - word.bbox.y0,
            label: "EMAIL",
          });
        }
      });

      // @ts-ignore
      (result.data as any).lines.forEach((line: any) => {
        if (
          line.text.includes("$") ||
          line.text.toLowerCase().includes("balance")
        ) {
          newBoxes.push({
            x: line.bbox.x0,
            y: line.bbox.y0,
            w: line.bbox.x1 - line.bbox.x0,
            h: line.bbox.y1 - line.bbox.y0,
            label: "SENSITIVE",
          });
        }
      });

      setBoxes(newBoxes);
      setStatus(`Analysis Complete. Found ${newBoxes.length} sensitive items.`);
    } catch (err) {
      console.error(err);
      setStatus("Detailed Text Analysis Failed");
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
              src={image}
              alt="Original"
              onLoad={() => setStatus("Image Loaded. Ready to Analyze.")}
              style={{ display: boxes.length > 0 ? "none" : "block" }}
              className="max-w-full block contrast-[1.1] brightness-[0.9] grayscale-[0.2]"
            />
            <canvas
              ref={canvasRef}
              style={{ display: boxes.length > 0 ? "block" : "none" }}
              className="max-w-full block"
            />
          </div>

          <div className="flex gap-4 flex-wrap justify-center">
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
        </div>
      )}
    </div>
  );
}
