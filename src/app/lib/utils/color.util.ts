/**
 * Rastgele HEX renk kodu oluşturur
 * @returns HEX renk kodu (örn: #FF0000)
 */
export function generateRandomHexColor(): string {
  // Rastgele bir sayı oluştur ve HEX'e çevir
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);

  // 6 haneli olmasını garantile (başına 0 ekle)
  const paddedColor = randomColor.padStart(6, "0");

  return `#${paddedColor}`;
}
