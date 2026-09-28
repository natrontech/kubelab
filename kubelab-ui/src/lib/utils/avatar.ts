/**
 * Generate a deterministic gradient based on a string (like email)
 */
export function generateGradient(str: string): string {
  if (!str) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate two colors from the hash
  const hue1 = Math.abs(hash) % 360;
  const hue2 = (hue1 + 60) % 360; // 60 degrees apart for nice contrast
  
  const saturation = 65 + (Math.abs(hash >> 8) % 20); // 65-85%
  const lightness1 = 50 + (Math.abs(hash >> 16) % 15); // 50-65%
  const lightness2 = 45 + (Math.abs(hash >> 24) % 15); // 45-60%
  
  return `linear-gradient(135deg, hsl(${hue1}, ${saturation}%, ${lightness1}%) 0%, hsl(${hue2}, ${saturation}%, ${lightness2}%) 100%)`;
}

/**
 * Get initials from email or name
 */
export function getInitials(emailOrName: string): string {
  if (!emailOrName) return '?';
  
  // If it's an email, get the part before @
  const name = emailOrName.includes('@') 
    ? emailOrName.split('@')[0] 
    : emailOrName;
  
  // Split by common separators
  const parts = name.split(/[.\-_\s]+/).filter(Boolean);
  
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  
  return name.substring(0, 2).toUpperCase();
}

