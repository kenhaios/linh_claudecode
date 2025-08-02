// Test utilities for Vietnamese astrology components
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { store } from '../../store/store';
import { vietnameseTheme } from '../../theme/vietnameseTheme';

// Vietnamese-specific test wrapper
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ConfigProvider 
          locale={viVN} 
          theme={vietnameseTheme}
        >
          {children}
        </ConfigProvider>
      </BrowserRouter>
    </Provider>
  );
};

// Custom render function with Vietnamese providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Vietnamese text content helpers
export const vietnameseTexts = {
  auth: {
    login: 'Đăng nhập',
    register: 'Đăng ký',
    logout: 'Đăng xuất',
    email: 'Email',
    phone: 'Số điện thoại',
    password: 'Mật khẩu',
    confirmPassword: 'Xác nhận mật khẩu',
    forgotPassword: 'Quên mật khẩu?',
    loginSuccess: 'Đăng nhập thành công',
    loginFailed: 'Đăng nhập thất bại'
  },
  chart: {
    generateChart: 'Lập lá số tử vi',
    chartTitle: 'Lá số tử vi',
    birthInfo: 'Thông tin sinh',
    name: 'Họ và tên',
    gender: 'Giới tính',
    male: 'Nam',
    female: 'Nữ',
    birthDate: 'Ngày sinh',
    birthTime: 'Giờ sinh',
    birthPlace: 'Nơi sinh',
    province: 'Tỉnh/Thành phố',
    district: 'Quận/Huyện',
    generateSuccess: 'Lập lá số thành công',
    generateFailed: 'Lập lá số thất bại'
  },
  consultation: {
    askQuestion: 'Đặt câu hỏi',
    aiConsultation: 'Tư vấn AI',
    questionPlaceholder: 'Nhập câu hỏi của bạn về tử vi...',
    categories: {
      general: 'Tổng quát',
      love: 'Tình duyên',
      career: 'Sự nghiệp',
      health: 'Sức khỏe',
      finance: 'Tài chính'
    },
    sendQuestion: 'Gửi câu hỏi',
    thinking: 'Đang suy nghĩ...',
    consultationHistory: 'Lịch sử tư vấn'
  },
  tokens: {
    balance: 'Số dư token',
    purchase: 'Mua token',
    purchaseSuccess: 'Mua token thành công',
    insufficientTokens: 'Không đủ token',
    tokenHistory: 'Lịch sử giao dịch'
  },
  common: {
    loading: 'Đang tải...',
    error: 'Lỗi',
    success: 'Thành công',
    save: 'Lưu',
    cancel: 'Hủy',
    delete: 'Xóa',
    edit: 'Sửa',
    view: 'Xem',
    back: 'Quay lại',
    next: 'Tiếp theo',
    previous: 'Trước đó',
    confirm: 'Xác nhận',
    close: 'Đóng'
  }
};

// Vietnamese form validation helpers
export const vietnameseValidation = {
  phoneNumber: (phone: string) => {
    const vietnamesePhoneRegex = /^(\+84|0)[3-9]\d{8}$/;
    return vietnamesePhoneRegex.test(phone);
  },
  
  name: (name: string) => {
    // Vietnamese names can contain Vietnamese characters
    const vietnameseNameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơưĂẮẰẴẶẨẪẦẤẨẮẰẴẶẺẼỀẾỂỄỆỈỊỌỎỒỐỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴÝỶỸửữựỳỷỹ\s]+$/;
    return vietnameseNameRegex.test(name) && name.length >= 2 && name.length <= 50;
  }
};

// Vietnamese date formatting
export const formatVietnameseDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh'
  });
};

export const formatVietnameseDateTime = (date: Date | string) => {
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

// Mock Vietnamese provinces data
export const mockVietnameseProvinces = [
  { code: 1, name: 'Hà Nội' },
  { code: 79, name: 'Thành phố Hồ Chí Minh' },
  { code: 48, name: 'Đà Nẵng' },
  { code: 92, name: 'Cần Thơ' },
  { code: 4, name: 'Cao Bằng' },
  { code: 6, name: 'Bắc Kạn' }
];

export const mockVietnameseDistricts = [
  { code: 1, name: 'Ba Đình', provinceCode: 1 },
  { code: 2, name: 'Hoàn Kiếm', provinceCode: 1 },
  { code: 3, name: 'Hai Bà Trưng', provinceCode: 1 },
  { code: 760, name: 'Quận 1', provinceCode: 79 },
  { code: 761, name: 'Quận 3', provinceCode: 79 }
];

// Traditional Vietnamese hours mapping
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

export * from '@testing-library/react';
export { customRender as render };