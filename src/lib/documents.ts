import "server-only";
import path from "node:path";
import fs from "node:fs";
import PDFDocument from "pdfkit";
import { AlignmentType, Document, Footer, Header, Packer, PageNumber, Paragraph, TextRun } from "docx";

export interface DocMeta {
  title: string;
  subtitle: string;
  language: string;
  format: string;
  durationLabel: string;
  wordCount: number;
  licenseLine: string;
  watermark?: string;
}

type Block = { kind: "heading" | "cue" | "text" | "gap"; text: string };

/** Parses the lightweight script markup: "## [00:00] HOOK", "(VISUAL: …)", plain narration. */
export function parseScript(body: string): Block[] {
  return body.split(/\r?\n/).map((raw) => {
    const line = raw.trim();
    if (!line) return { kind: "gap", text: "" };
    if (line.startsWith("## ")) return { kind: "heading", text: line.slice(3) };
    if (/^\(.*\)$/.test(line) || /^\[.*\]$/.test(line)) return { kind: "cue", text: line };
    return { kind: "text", text: line };
  });
}

const fileName = (title: string, ext: string) =>
  `${title.replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/\s+/g, "-").slice(0, 60) || "script"}.${ext}`;
export const pdfFileName = (t: string) => fileName(t, "pdf");
export const docxFileName = (t: string) => fileName(t, "docx");

// ───────────────────────── PDF ─────────────────────────
const FONT_DIR = path.join(process.cwd(), "assets", "fonts");
const fontBuf = (name: string) => fs.readFileSync(path.join(FONT_DIR, name));

const isDeva = (ch: string) => {
  const c = ch.codePointAt(0)!;
  return (c >= 0x0900 && c <= 0x097f) || (c >= 0xa8e0 && c <= 0xa8ff) || (c >= 0x1cd0 && c <= 0x1cff) || c === 0x20b9 || c === 0x200c || c === 0x200d;
};

/** Splits text into runs so Devanagari and Latin each use a font that has their glyphs. */
function runs(text: string) {
  const out: { text: string; deva: boolean }[] = [];
  for (const ch of text) {
    const neutral = ch === " ";
    const deva = neutral && out.length ? out[out.length - 1].deva : isDeva(ch);
    const last = out[out.length - 1];
    if (last && last.deva === deva) last.text += ch;
    else out.push({ text: ch, deva });
  }
  return out;
}

export async function buildPdf(meta: DocMeta, body: string): Promise<Buffer> {
  const doc = new PDFDocument({ size: "A4", margins: { top: 64, bottom: 64, left: 64, right: 64 }, bufferPages: true, info: { Title: meta.title, Author: "ScriptVault" } });
  doc.registerFont("L", fontBuf("latin-400.woff"));
  doc.registerFont("LB", fontBuf("latin-700.woff"));
  doc.registerFont("D", fontBuf("deva-400.woff"));
  doc.registerFont("DB", fontBuf("deva-700.woff"));

  const chunks: Buffer[] = [];
  doc.on("data", (c: Buffer) => chunks.push(c));
  const done = new Promise<Buffer>((resolve) => doc.on("end", () => resolve(Buffer.concat(chunks))));

  const width = doc.page.width - 128;
  const write = (text: string, opts: { bold?: boolean; size: number; color: string; gap?: number; align?: "left" | "center" }) => {
    doc.fontSize(opts.size).fillColor(opts.color);
    const parts = runs(text);
    parts.forEach((p, i) => {
      doc.font(p.deva ? (opts.bold ? "DB" : "D") : opts.bold ? "LB" : "L");
      doc.text(p.text, i === 0 ? { width, align: opts.align ?? "left", continued: i < parts.length - 1, lineGap: 3 } : { continued: i < parts.length - 1 });
    });
    if (opts.gap) doc.moveDown(opts.gap);
  };

  // Title block
  write("SCRIPTVAULT", { bold: true, size: 9, color: "#7c3aed", gap: 0.6 });
  write(meta.title, { bold: true, size: 22, color: "#111111", gap: 0.2 });
  if (meta.subtitle) write(meta.subtitle, { size: 11, color: "#555555", gap: 0.6 });
  write(`${meta.language}  ·  ${meta.format}  ·  ${meta.durationLabel}  ·  ~${meta.wordCount.toLocaleString("en-IN")} words`, { size: 9, color: "#666666", gap: 0.3 });
  write(meta.licenseLine, { size: 9, color: "#7c3aed", gap: 0.4 });
  if (meta.watermark) write(meta.watermark, { bold: true, size: 10, color: "#b91c1c", gap: 0.4 });
  doc.moveTo(64, doc.y + 4).lineTo(64 + width, doc.y + 4).strokeColor("#dddddd").stroke();
  doc.moveDown(1.2);

  for (const b of parseScript(body)) {
    if (b.kind === "gap") doc.moveDown(0.35);
    else if (b.kind === "heading") { doc.moveDown(0.4); write(b.text, { bold: true, size: 12, color: "#4c1d95", gap: 0.25 }); }
    else if (b.kind === "cue") write(b.text, { size: 9.5, color: "#777777", gap: 0.15 });
    else write(b.text, { size: 11.5, color: "#1a1a1a", gap: 0.2 });
  }

  // Footer on every page
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    const bottom = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;
    doc.font("L").fontSize(8).fillColor("#999999");
    doc.text(`${meta.licenseLine}   ·   Page ${i + 1} of ${range.count}`, 64, doc.page.height - 40, { width, align: "center", lineBreak: false });
    doc.page.margins.bottom = bottom;
  }
  doc.end();
  return done;
}

// ───────────────────────── DOCX ─────────────────────────
const FONT = { ascii: "Calibri", hAnsi: "Calibri", cs: "Nirmala UI", eastAsia: "Calibri" };

export async function buildDocx(meta: DocMeta, body: string): Promise<Buffer> {
  const children: Paragraph[] = [
    new Paragraph({ children: [new TextRun({ text: "SCRIPTVAULT", bold: true, size: 18, color: "7C3AED", font: FONT })] }),
    new Paragraph({ spacing: { before: 120 }, children: [new TextRun({ text: meta.title, bold: true, size: 44, font: FONT, boldComplexScript: true, sizeComplexScript: 44 })] }),
  ];
  if (meta.subtitle) children.push(new Paragraph({ children: [new TextRun({ text: meta.subtitle, size: 22, color: "555555", font: FONT })] }));
  children.push(
    new Paragraph({ spacing: { before: 120 }, children: [new TextRun({ text: `${meta.language}  ·  ${meta.format}  ·  ${meta.durationLabel}  ·  ~${meta.wordCount.toLocaleString("en-IN")} words`, size: 18, color: "666666", font: FONT })] }),
    new Paragraph({ children: [new TextRun({ text: meta.licenseLine, size: 18, color: "7C3AED", font: FONT })] })
  );
  if (meta.watermark) children.push(new Paragraph({ children: [new TextRun({ text: meta.watermark, bold: true, size: 20, color: "B91C1C", font: FONT })] }));
  children.push(new Paragraph({ border: { bottom: { style: "single", size: 6, color: "DDDDDD", space: 8 } }, children: [] }));

  for (const b of parseScript(body)) {
    if (b.kind === "gap") continue;
    if (b.kind === "heading")
      children.push(new Paragraph({ spacing: { before: 280, after: 80 }, children: [new TextRun({ text: b.text, bold: true, size: 24, color: "4C1D95", font: FONT, boldComplexScript: true, sizeComplexScript: 24 })] }));
    else if (b.kind === "cue")
      children.push(new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: b.text, italics: true, size: 19, color: "777777", font: FONT, sizeComplexScript: 19 })] }));
    else children.push(new Paragraph({ spacing: { after: 100, line: 300 }, children: [new TextRun({ text: b.text, size: 23, font: FONT, sizeComplexScript: 23 })] }));
  }

  const doc = new Document({
    creator: "ScriptVault",
    title: meta.title,
    sections: [
      {
        headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "ScriptVault", size: 16, color: "999999", font: FONT })] })] }) },
        footers: {
          default: new Footer({
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [`${meta.licenseLine}   ·   Page `, PageNumber.CURRENT], size: 16, color: "999999", font: FONT })] })],
          }),
        },
        children,
      },
    ],
  });
  return Packer.toBuffer(doc);
}
