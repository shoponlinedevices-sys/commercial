export function getCategoryDisplayName(name: string): string {
  const trimmedName = name.trim();

  if (/^D.{1,2}ng c.{1,2} c.{1,2}m tay$/iu.test(trimmedName)) {
    return 'Dụng cụ cầm tay';
  }

  if (/^.{1,2} gia d.{1,2}ng$/iu.test(trimmedName)) {
    return 'Đồ gia dụng';
  }

  return name;
}
