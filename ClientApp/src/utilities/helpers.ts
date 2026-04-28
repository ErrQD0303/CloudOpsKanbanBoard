export const checkTitle = (title: string) => {
  if (title.trim().length === 0) {
    return "Title is required";
  }

  return null;
};

export const generateRowVersion = (): string => {
  // Generate a random 8-byte (64-bit) value and encode it as a base64 string
  const randomBytes = new Uint8Array(8); // 8 bytes for 64 bits
  crypto.getRandomValues(randomBytes);
  return btoa(String.fromCharCode(...randomBytes));
};

export const isValidRowVersion = (rowVersion: string): boolean => {
  // Check if the rowVersion is a valid base64 string and decodes to 8 bytes
  try {
    const decoded = atob(rowVersion);
    return decoded.length === 8; // Ensure it decodes to 8 bytes
  } catch (e) {
    console.error("Invalid rowVersion format:", e);
    return false; // Invalid base64 string
  }
};
