"use client";

import { useState, useRef, useEffect } from "react";
import Tesseract from "tesseract.js";
import styles from "./DocumentRedactor.module.css";

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
    <div className={styles.container}>
      <h2 className={styles.title}>PII Redaction Tool</h2>

      <div className={styles.fileInputContainer}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={styles.fileInput}
        />
      </div>

      {status && <p className={styles.status}>{status}</p>}

      {image && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className={styles.previewContainer}>
            <img
              ref={imageRef}
              src={image}
              alt="Original"
              onLoad={() => setStatus("Image Loaded. Ready to Analyze.")}
              style={{ display: boxes.length > 0 ? "none" : "block" }}
              className={styles.previewImage}
            />
            <canvas
              ref={canvasRef}
              style={{ display: boxes.length > 0 ? "block" : "none" }}
              className={styles.canvas}
            />
          </div>

          <div className={styles.controls}>
            <button
              onClick={analyzeImage}
              className={`${styles.button} ${styles.primaryButton}`}
            >
              Auto-Redact PII
            </button>
            <button
              onClick={() => setBoxes([])}
              className={`${styles.button} ${styles.secondaryButton}`}
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
              className={`${styles.button} ${styles.successButton}`}
            >
              Download Redacted
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
