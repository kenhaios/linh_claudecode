// Vietnamese validation utilities for Ha Linh Astrology Platform

/**
 * Validate Vietnamese phone number format
 */
export const validateVietnamesePhone = (phone: string): boolean => {
  if (!phone) return false;
  
  // Remove all spaces and special characters
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Vietnamese phone number pattern: +84 or 0 followed by 9 digits
  // Mobile networks: Viettel (96,97,98,86,32-39), Vinaphone (91,94,83-85,81,82), 
  // Mobifone (90,93,70,79,77,76,78), Vietnamobile (92,56,58), Gmobile (59,99)
  const vietnamesePhoneRegex = /^(\+84|0)[3-9]\d{8}$/;
  
  return vietnamesePhoneRegex.test(cleanPhone);
};

/**
 * Normalize Vietnamese phone number to standard format
 */
export const normalizeVietnamesePhone = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  let normalized = phone.replace(/\D/g, '');
  
  // Handle different Vietnamese phone formats
  if (normalized.startsWith('84')) {
    // Already in international format without +
    return '+' + normalized;
  } else if (normalized.startsWith('0')) {
    // Domestic format, convert to international
    return '+84' + normalized.substring(1);
  } else if (normalized.length === 9) {
    // 9-digit format, add country code
    return '+84' + normalized;
  }
  
  return phone; // Return original if can't normalize
};

/**
 * Get Vietnamese mobile network name
 */
export const getVietnameseMobileNetwork = (phone: string): string => {
  const normalized = phone.replace(/\D/g, '');
  
  if (/^(84|0)?(96|97|98|86|32|33|34|35|36|37|38|39)/.test(normalized)) {
    return 'Viettel';
  } else if (/^(84|0)?(91|94|83|84|85|81|82)/.test(normalized)) {
    return 'Vinaphone';
  } else if (/^(84|0)?(90|93|70|79|77|76|78)/.test(normalized)) {
    return 'Mobifone';
  } else if (/^(84|0)?(92|56|58)/.test(normalized)) {
    return 'Vietnamobile';
  } else if (/^(84|0)?(59|99)/.test(normalized)) {
    return 'Gmobile';
  }
  
  return 'Unknown';
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  if (!email) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.toLowerCase());
};

/**
 * Validate Vietnamese name (supports Vietnamese characters)
 */
export const validateVietnameseName = (name: string): boolean => {
  if (!name) return false;
  
  // Vietnamese name regex: supports Vietnamese characters, spaces, and common punctuation
  const vietnameseNameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơưĂẮẰẴẶẨẪẦẤẨẮẰẴẶẺẼỀẾỂỄỆỈỊỌỎỒỐỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴÝỶỸửữựỳỷỹ\s\.]+$/;
  
  return vietnameseNameRegex.test(name.trim()) && 
         name.trim().length >= 2 && 
         name.trim().length <= 50;
};

/**
 * Validate password strength
 */
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  score: number;
  suggestions: string[];
} => {
  const suggestions: string[] = [];
  let score = 0;
  
  if (!password) {
    return { isValid: false, score: 0, suggestions: ['Mật khẩu là bắt buộc'] };
  }
  
  // Length check
  if (password.length >= 8) {
    score += 25;
  } else {
    suggestions.push('Mật khẩu phải có ít nhất 8 ký tự');
  }
  
  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 20;
  } else {
    suggestions.push('Thêm ít nhất một chữ thường');
  }
  
  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 20;
  } else {
    suggestions.push('Thêm ít nhất một chữ hoa');
  }
  
  // Number check
  if (/\d/.test(password)) {
    score += 20;
  } else {
    suggestions.push('Thêm ít nhất một chữ số');
  }
  
  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 15;
  } else {
    suggestions.push('Thêm ít nhất một ký tự đặc biệt');
  }
  
  const isValid = score >= 85; // Require strong password
  
  return { isValid, score, suggestions };
};

/**
 * Validate Vietnamese address
 */
export const validateVietnameseAddress = (address: string): boolean => {
  if (!address) return false;
  
  // Vietnamese address can contain Vietnamese characters, numbers, and common punctuation
  const addressRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơưĂẮẰẴẶẨẪẦẤẨẮẰẴẶẺẼỀẾỂỄỆỈỊỌỎỒỐỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴÝỶỸửữựỳỷỹ0-9\s,\.\/\-]+$/;
  
  return addressRegex.test(address.trim()) && 
         address.trim().length >= 5 && 
         address.trim().length <= 200;
};

/**
 * Validate Vietnamese date format (DD/MM/YYYY)
 */
export const validateVietnameseDate = (dateString: string): boolean => {
  if (!dateString) return false;
  
  const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  const match = dateString.match(dateRegex);
  
  if (!match) return false;
  
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  
  // Basic date validation
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > new Date().getFullYear()) return false;
  
  // Create date and check if it's valid
  const date = new Date(year, month - 1, day);
  return date.getDate() === day && 
         date.getMonth() === month - 1 && 
         date.getFullYear() === year;
};

/**
 * Vietnamese traditional time periods (12 hours system)
 */
export const vietnameseTraditionalHours = [
  { value: 'tý', label: 'Tý (23:00 - 01:00)', hours: [23, 0] },
  { value: 'sửu', label: 'Sửu (01:00 - 03:00)', hours: [1, 2] },
  { value: 'dần', label: 'Dần (03:00 - 05:00)', hours: [3, 4] },
  { value: 'mão', label: 'Mão (05:00 - 07:00)', hours: [5, 6] },
  { value: 'thìn', label: 'Thìn (07:00 - 09:00)', hours: [7, 8] },
  { value: 'tỵ', label: 'Tỵ (09:00 - 11:00)', hours: [9, 10] },
  { value: 'ngọ', label: 'Ngọ (11:00 - 13:00)', hours: [11, 12] },
  { value: 'mùi', label: 'Mùi (13:00 - 15:00)', hours: [13, 14] },
  { value: 'thân', label: 'Thân (15:00 - 17:00)', hours: [15, 16] },
  { value: 'dậu', label: 'Dậu (17:00 - 19:00)', hours: [17, 18] },
  { value: 'tuất', label: 'Tuất (19:00 - 21:00)', hours: [19, 20] },
  { value: 'hợi', label: 'Hợi (21:00 - 23:00)', hours: [21, 22] }
];

/**
 * Get Vietnamese traditional hour from regular hour
 */
export const getVietnameseTraditionalHour = (hour: number): string => {
  const traditionalHour = vietnameseTraditionalHours.find(
    th => th.hours.includes(hour)
  );
  return traditionalHour?.value || 'unknown';
};

/**
 * Vietnamese gender options
 */
export const vietnameseGenderOptions = [
  { value: 'nam', label: 'Nam' },
  { value: 'nữ', label: 'Nữ' }
];

/**
 * Validate Vietnamese gender
 */
export const validateVietnameseGender = (gender: string): boolean => {
  return ['nam', 'nữ'].includes(gender);
};

/**
 * Vietnamese lunar calendar months
 */
export const vietnameseLunarMonths = [
  { value: 1, label: 'Tháng Giêng' },
  { value: 2, label: 'Tháng Hai' },
  { value: 3, label: 'Tháng Ba' },
  { value: 4, label: 'Tháng Tư' },
  { value: 5, label: 'Tháng Năm' },
  { value: 6, label: 'Tháng Sáu' },
  { value: 7, label: 'Tháng Bảy' },
  { value: 8, label: 'Tháng Tám' },
  { value: 9, label: 'Tháng Chín' },
  { value: 10, label: 'Tháng Mười' },
  { value: 11, label: 'Tháng Mười Một' },
  { value: 12, label: 'Tháng Chạp' }
];

/**
 * Vietnamese astrology elements
 */
export const vietnameseElements = [
  { value: 'kim', label: 'Kim (金)', color: '#FFD700' },
  { value: 'mộc', label: 'Mộc (木)', color: '#228B22' },
  { value: 'thủy', label: 'Thủy (水)', color: '#4169E1' },
  { value: 'hỏa', label: 'Hỏa (火)', color: '#DC143C' },
  { value: 'thổ', label: 'Thổ (土)', color: '#8B4513' }
];

/**
 * Validate Vietnamese astrology element
 */
export const validateVietnameseElement = (element: string): boolean => {
  return ['kim', 'mộc', 'thủy', 'hỏa', 'thổ'].includes(element);
};

/**
 * Format Vietnamese currency (VND)
 */
export const formatVietnameseCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

/**
 * Format Vietnamese date
 */
export const formatVietnameseDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh'
  });
};

/**
 * Format Vietnamese date and time
 */
export const formatVietnameseDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh'
  });
};