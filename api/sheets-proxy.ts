import express from "express";
import path from "path";

const app = express();

// เพิ่ม limit เป็นขนาดที่ต้องการ เช่น 2mb หรือ 10mb
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// API proxy endpoint for Google Sheets CSV fetching to bypass CORS
app.get("/api/sheets-proxy", async (req, res) => {
  try {
    const url =  process.env.GOOGLE_GETSHEET_URL || import.meta.env.GOOGLE_GETSHEET_URL || '';

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

app.post("/api/sheets-proxy", async (req, res) => {
  console.log("POST /api/sheets-proxy called");
  try {
    const url = process.env.GOOGLE_SPREADSHEET_URL || import.meta.env.GOOGLE_SPREADSHEET_URL || '';

    if (!url) {
      return res.status(400).json({ error: "Missing 'url' parameter" });
    }

    //console.log('req:', req);
    const data = req.body;

    const imagePayload = JSON.stringify(data.imagePayload);
    //console.log('imagePayload:', imagePayload);
    const slipUrl = await uploadSlip(imagePayload);
    console.log('slipUrl:', slipUrl);

    data.donationPayload.slipUrl = slipUrl;
    const donationPayload = JSON.stringify(data.donationPayload);    
    console.log('donationPayload:', donationPayload);

    const response = await fetch(url, {
      method: 'POST',
      redirect: 'follow', // จำเป็นต้องใส่เพื่อให้ fetch ตามการ redirect ของ Google Apps Script ไปได้ถูกต้อง
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // แนะนำให้ใช้ text/plain เพื่อหลีกเลี่ยงปัญหา CORS ใน Apps Script
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: donationPayload,
      mode: 'cors'   // เปิดโหมดข้ามโดเมน
    });

    console.log('response:', response);

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Failed to fetch sheet: ${response.statusText}` });
    }

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.send(true);
  } catch (err: any) {
    console.error("Sheets proxy error:", err);
    return res
      .status(500)
      .json({ error: err.message || "Failed to fetch Google Sheet data" });
  }  
});

export default app;

// internal function
function removeSlipUrlColumn(csvContent: string): string {
  //console.log('removeSlipUrlColumn(string) called');
  //console.log('csvContent:', csvContent);

  const lines = csvContent.trim().replaceAll('\r', '').split('\n');
  //console.log('lines:', lines);
  if (lines.length === 0) return '';

  // 1. ระบุ index ของคอลัมน์ slipUrl จาก Header
  const headers = lines[0].split(',');
  //console.log('headers:', headers);
  const slipUrlIndex = headers.indexOf('slipUrl');

  //console.log('slipUrlIndex:', slipUrlIndex);
  if (slipUrlIndex === -1) {
    return csvContent; // ไม่พบคอลัมน์ slipUrl คืนค่าเดิม
  }

  // 2. ลบคอลัมน์ตาม index ในทุกแถว
  const processedLines = lines.map((line) => {
    //console.log('line:', line);

    const columns = line.split(',');
    //columns.splice(slipUrlIndex, 1);
    var newLine = columns.join(',');
    
    //console.log('newLine:', newLine);
    return newLine;
  });

  //console.log('removeSlipUrlColumn(string) end');
  return processedLines.join('\n');
}

// ฟังก์ชันหลักในการส่งข้อมูลไป Google Drive
const uploadSlip = async (payload:any) => {
  console.log("uploadSlip() called");  
  let slipUrl = '';
  

  try {
    const url = process.env.GOOGLE_DRIVE_URL || import.meta.env.GOOGLE_DRIVE_URL || '';

    if (!url) {
      return slipUrl;
    }
    console.log("  payload:", payload);

    // ยิง API ไปที่ Google Apps Script
    const response = await fetch(url, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain', // ใช้ text/plain เพื่อป้องกันปัญหา CORS
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      mode: 'cors',   // เปิดโหมดข้ามโดเมน
      body: JSON.stringify(payload)
    });

    console.log("  response:", response);

    const result = await response.json();

    console.log("  result:", result);

    if (result.status === 'success') {
      // 'อัปโหลดสลิปเรียบร้อยแล้ว!';
      slipUrl = result.url; // นำ URL ที่ได้กลับมาเก็บเพื่อแสดงผลตรวจสอบ
    } else {
      console.error('เกิดข้อผิดพลาดจากเซิร์ฟเวอร์: ' + result.message);
    }
  } catch (error) {    
    console.error('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ หรือไฟล์มีขนาดใหญ่เกินไป', error);
  } finally {
    
  }

  console.log("uploadSlip() end");
  return slipUrl
};