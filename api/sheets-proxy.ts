import express from "express";
import path from "path";

const app = express();
const PORT = 3000;

app.use(express.json());

// API proxy endpoint for Google Sheets CSV fetching to bypass CORS
app.get("/api/sheets-proxy", async (req, res) => {
  try {
    const url =  import.meta.env.VITE_GOOGLE_GETSHEET_URL || 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQjjo3Gd1VwUWxVHYEy01Rar9ueGqpxeiQtpRR-Q9U1IxD5ew15gf0YQ0KPtyGAbj8XAKO8JXLm_RjF/pub?gid=0&single=true&output=csv';

    if (!url) {
      return res.status(400).json({ error: "Missing 'url' parameter" });
    }

    let fetchUrl = url.trim();
    // Convert standard sheet URL to CSV export if needed
    if (
      url.includes("docs.google.com/spreadsheets/d/") &&
      !url.includes("output=csv") &&
      !url.includes("out:csv")
    ) {
      const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) {
        const sheetId = match[1];
        fetchUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
      }
    }

    // ป้องกันการติด Cache ของเบราว์เซอร์ด้วยการใส่ Timestamp
    const cacheBusterUrl = `${fetchUrl}${fetchUrl.includes('?') ? '&' : '?'}_t=${Date.now()}`;

    const response = await fetch(cacheBusterUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Failed to fetch sheet: ${response.statusText}` });
    }

    const csvData = await response.text();
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.send(csvData);
  } catch (err: any) {
    console.error("Sheets proxy error:", err);
    return res
      .status(500)
      .json({ error: err.message || "Failed to fetch Google Sheet data" });
  }
});

app.post("/api/sheets-proxy", async (req, res) => {
  console.log("POST /api/sheets-proxy called");

  console.log("POST /api/sheets-proxy end");
});

export default app;
