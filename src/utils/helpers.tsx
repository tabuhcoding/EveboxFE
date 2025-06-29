import { UserRole } from "@/types/models/admin/accountManagement.interface";

export function mapRoleNumberToString(roleNum: number): UserRole {
  switch (roleNum) {
    case 0: return UserRole.SYSTEM_ADMIN;
    case 1: return UserRole.ADMIN;
    case 2: return UserRole.ORGANIZER;
    default: return UserRole.CUSTOMER; // hoặc undefined, tùy bạn
  }
}

export function mapRoleStringToNumber(roleStr: string): number {
  switch (roleStr) {
    case 'SYSTEM_ADMIN': 
    case UserRole.SYSTEM_ADMIN:
      return 0;
    case 'ADMIN': 
    case UserRole.ADMIN:
      return 1;
    case 'ORGANIZER': 
    case UserRole.ORGANIZER:
      return 2;
    default: return 3; 
  }
}

/**
 * Formats a date string into a more readable format.
 *
 * @param dateStr - The date string to format.
 * @returns The formatted date string in the format "DD MMM YYYY".
 */
export function formatYYYYMMDDToLocaleDateString(dateStr: string, includeTime: boolean = false): string {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' }); // Get short month
  const year = date.getFullYear();
  
  let formattedDate = `${day} ${month}, ${year}`;

  if (includeTime) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    // const seconds = date.getSeconds().toString().padStart(2, '0');
    // formattedDate += ` ${hours}:${minutes}:${seconds}`;
    formattedDate += ` ${hours}:${minutes}`;
  }

  return formattedDate;
}

export const convertLocationToVietnamese = (locationString: string): string => {
  return locationString
    .replace(/(\d+) Ward\b/gi, "Phường $1")
    .replace(/(\b[A-Za-z ]+) Ward\b/gi, "Phường $1")
    .replace(/(\d+) District\b/gi, "Quận $1")
    .replace(/(\b[A-Za-z ]+) District\b/gi, "Quận $1")
    .replace(/(\b[A-Za-z ]+) City\b/gi, "Thành phố $1")
    .replace(/(\b[A-Za-z ]+) Province\b/gi, "Tỉnh $1");
};

// /**
//  * Decrypts a given hex-encoded string using AES encryption.
//  * because the backend uses CryptoJS to encrypt, so we also use CryptoJS to decrypt
//  * @param encryptedText - The hex-encoded string to decrypt.
//  * @returns The decrypted string.
//  */
// export function decrypt(encryptedText: string): string {
//   const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
//     iv: iv,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7,
//   });
//   return decrypted.toString(CryptoJS.enc.Utf8);
// }

export function formatCurrency (amount: number) {
  return new Intl.NumberFormat('vi-VN').format(amount);
}