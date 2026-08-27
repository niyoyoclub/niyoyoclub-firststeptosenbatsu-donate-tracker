import express from "express";
import path from "path";

const app = express();

// เพิ่ม limit เป็นขนาดที่ต้องการ เช่น 2mb หรือ 10mb
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// API proxy endpoint for Google Sheets CSV fetching to bypass CORS
app.get("/api/tanabata-proxy", async (req, res) => {
  try {
    const url =  process.env.GOOGLE_GETSHEET_TANABATA_URL || import.meta.env.GOOGLE_GETSHEET_TANABATA_URL || '';

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

    //console.log('fetchUrl:', fetchUrl);
    // ป้องกันการติด Cache ของเบราว์เซอร์ด้วยการใส่ Timestamp
    const cacheBusterUrl = `${fetchUrl}${fetchUrl.includes('?') ? '&' : '?'}_t=${Date.now()}`;
    //console.log('cacheBusterUrl:', cacheBusterUrl);

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

    const rawData = await response.text();
    const csvData = removeSlipUrlColumn(rawData);

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

export default app;