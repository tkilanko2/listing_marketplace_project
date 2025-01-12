export function generateUserId(): string {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  
  // Start with CM
  let id = 'CM';
  
  // Generate the remaining 10 characters
  for (let i = 0; i < 10; i++) {
    // Alternate between numbers and letters
    const characterSet = i % 2 === 0 ? numbers : letters;
    const randomIndex = Math.floor(Math.random() * characterSet.length);
    id += characterSet[randomIndex];
  }
  
  return id;
}

// Example usage:
// const userId = generateUserId(); // Returns something like "CM7b9k3m5p2z" 