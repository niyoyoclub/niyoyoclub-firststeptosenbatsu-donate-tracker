export interface FilterOptions {
  maskChar?: string;            // อักขระที่ใช้เซ็นเซอร์ (ค่าเริ่มต้น: '*')
  replaceMode?: 'full' | 'preserve-length'; // แทนที่คำด้วยความยาวเดิม หรือใช้ตัวเดียว
  keepFirstAndLast?: boolean;  // เก็บตัวอักษรหน้า-หลังไว้ไหม เช่น "ค**ย"
}

// 1. ตารางแปลงอักขระเลียนแบบ (Leetspeak & Normalization)
const CHAR_MAP: Record<string, string> = {
  '0': 'o',
  '1': 'i',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '@': 'a',
  '$': 's',
  '!': 'i',
};

// 2. รายการคำหยาบเริ่มต้น (สามารถเพิ่ม/ลดตามบริบทงาน)
export const DEFAULT_BAD_WORDS: string[] = [
  // ภาษาไทย
  'ควย', 'เหี้ย', 'สัส', 'เย็ด', 'มึง', 'กู', 'ดอกทอง', 'ระยำ', 
  'จัญไร', 'ชาติหมา', 'หน้าตัวเมีย', 'สันดาน', 'เงี่ยน', 'หี', 'แตด',
  // ภาษาอังกฤษ
  'fuck', 'shit', 'bitch', 'asshole', 'dick', 'pussy', 'bastard', 'cunt'
];

export class ProfanityFilter {
  private badWords: Set<string>;

  constructor(customWordList?: string[]) {
    this.badWords = new Set(
      (customWordList || DEFAULT_BAD_WORDS).map((w) => w.trim().toLowerCase())
    );
  }

  /**
   * เพิ่มคำหยาบเข้าระบบ
   */
  public addWords(...words: string[]): void {
    words.forEach((w) => this.badWords.add(w.trim().toLowerCase()));
  }

  /**
   * ลบคำออกจากรายการ
   */
  public removeWords(...words: string[]): void {
    words.forEach((w) => this.badWords.delete(w.trim().toLowerCase()));
  }

  /**
   * ตรวจสอบว่ามีคำหยาบหรือไม่ (Boolean)
   */
  public hasProfanity(text: string): boolean {
    if (!text) return false;
    const regex = this.buildRegex();
    return regex.test(this.normalizeText(text));
  }

  /**
   * ดึงรายการคำหยาบทั้งหมดที่พบในข้อความ
   */
  public detectProfanities(text: string): string[] {
    if (!text) return [];
    const regex = this.buildRegex();
    const normalized = this.normalizeText(text);
    const matches = normalized.match(regex) || [];
    return Array.from(new Set(matches.map((m) => m.toLowerCase())));
  }

  /**
   * กรองและเซ็นเซอร์ข้อความ
   */
  public clean(text: string, options: FilterOptions = {}): string {
    if (!text) return '';

    const {
      maskChar = '*',
      replaceMode = 'preserve-length',
      keepFirstAndLast = false,
    } = options;

    const regex = this.buildRegex();

    return text.replace(regex, (match) => {
      if (replaceMode === 'full') {
        return maskChar.repeat(3);
      }

      if (keepFirstAndLast && match.length > 2) {
        const first = match[0];
        const last = match[match.length - 1];
        const middle = maskChar.repeat(match.length - 2);
        return `${first}${middle}${last}`;
      }

      return maskChar.repeat(match.length);
    });
  }

  /**
   * สร้าง Regular Expression แบบไดนามิก รองรับการแทรกเว้นวรรค/อักขระพิเศษระหว่างตัวอักษร
   */
  private buildRegex(): RegExp {
    const escapedWords = Array.from(this.badWords).map((word) => {
      // แทรก pattern อนุญาตให้มีช่องว่างหรือสัญลักษณ์คั่นระหว่างตัวอักษรได้ เช่น ค_ว_ย, f.u.c.k
      return word
        .split('')
        .map((char) => this.escapeRegex(char))
        .join('[\\s\\W_]*');
    });

    return new RegExp(`(${escapedWords.join('|')})`, 'gi');
  }

  /**
   * ปรับมาตรฐานข้อความ (ลดตัวอักษรซ้ำ, แปลง Leetspeak) เพื่อการตรวจจับที่แม่นยำ
   */
  private normalizeText(text: string): string {
    let result = text.toLowerCase();

    // แปลง Leetspeak
    for (const [char, replacement] of Object.entries(CHAR_MAP)) {
      result = result.replaceAll(char, replacement);
    }

    // ยุบตัวอักษรที่พิมพ์ซ้ำเกิน 2 ตัว เช่น "ฟัคคคคคค" -> "ฟัค"
    result = result.replace(/(.)\1{2,}/g, '$1$1');

    return result;
  }

  private escapeRegex(str: string): string {
    return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }
}