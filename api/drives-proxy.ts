import express from "express";
import path from "path";

const app = express();

//app.use(express.json());

// API proxy endpoint for Google Sheets CSV fetching to bypass CORS
app.post("/api/drives-proxy", async (req, res) => {

  console.log('POST /api/drives-proxy called');
  console.log('req:', req);

  try {
    const url =  process.env.VITE_GOOGLE_DRIVE_URL || import.meta.env.VITE_GOOGLE_DRIVE_URL || '';
    if (!url) {
      return res.status(400).json({ error: "Missing 'url' parameter" });
    }

    
    // ยิง API ไปที่ Google Apps Script
    const response = await fetch(url, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain', // ใช้ text/plain เพื่อป้องกันปัญหา CORS
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      mode: 'cors',   // เปิดโหมดข้ามโดเมน
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Failed to fetch google drive: ${response.statusText}` });
    }

    const result = await response.json();

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    //res.setHeader("Access-Control-Allow-Origin", "*");
    return res.send(result);
  } catch (err: any) {
    console.error("Sheets proxy error:", err);
    return res
      .status(500)
      .json({ error: err.message || "Failed to fetch Google Drive data" });
  }
});

export default app;
