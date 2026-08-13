
/*
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// API proxy endpoint for Google Sheets CSV fetching to bypass CORS
app.get("/api/sheets-proxy", async (req, res) => {
  try {
    const url = req.query.url as string;
    if (!url) {
      return res.status(400).json({ error: "Missing 'url' parameter" });
    }

    let fetchUrl = url;
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

    const response = await fetch(fetchUrl, {
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

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Vite middleware setup
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
  app.listen(PORT, "localhost", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

export default app;
*/