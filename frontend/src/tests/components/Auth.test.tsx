// Tests for Vietnamese authentication components
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { render, vietnameseTexts, vietnameseValidation } from '../utils/test-utils';
import { LoginForm } from '../../components/auth/LoginForm';
import { RegisterForm } from '../../components/auth/RegisterForm';

// Mock the auth service
vi.mock('../../services/authService', () => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn()
}));

describe('Vietnamese Authentication Components', () => {
  describe('LoginForm', () => {
    it('should render Vietnamese login form elements', () => {
      render(<LoginForm />);
      
      expect(screen.getByText(vietnameseTexts.auth.login)).toBeInTheDocument();
      expect(screen.getByLabelText(vietnameseTexts.auth.email)).toBeInTheDocument();
      expect(screen.getByLabelText(vietnameseTexts.auth.password)).toBeInTheDocument();
      expect(screen.getByText(vietnameseTexts.auth.forgotPassword)).toBeInTheDocument();
    });

    it('should accept Vietnamese phone number format', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);
      
      const phoneInput = screen.getByLabelText(vietnameseTexts.auth.email);
      await user.type(phoneInput, '+84901234567');
      
      expect(phoneInput).toHaveValue('+84901234567');
    });

    it('should handle login form submission', async () => {
      const user = userEvent.setup();
      const mockLogin = vi.fn();
      
      render(<LoginForm onLogin={mockLogin} />);
      
      await user.type(screen.getByLabelText(vietnameseTexts.auth.email), 'test@example.com');
      await user.type(screen.getByLabelText(vietnameseTexts.auth.password), 'password123');
      
      const loginButton = screen.getByRole('button', { name: vietnameseTexts.auth.login });
      await user.click(loginButton);
      
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          identifier: 'test@example.com',
          password: 'password123'
        });
      });
    });

    it('should display Vietnamese error messages', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);
      
      // Submit empty form
      const loginButton = screen.getByRole('button', { name: vietnameseTexts.auth.login });
      await user.click(loginButton);
      
      await waitFor(() => {
        expect(screen.getByText(/email là bắt buộc/i)).toBeInTheDocument();
        expect(screen.getByText(/mật khẩu là bắt buộc/i)).toBeInTheDocument();
      });
    });
  });

  describe('RegisterForm', () => {
    it('should render Vietnamese registration form', () => {
      render(<RegisterForm />);
      
      expect(screen.getByText(vietnameseTexts.auth.register)).toBeInTheDocument();
      expect(screen.getByLabelText(vietnameseTexts.chart.name)).toBeInTheDocument();
      expect(screen.getByLabelText(vietnameseTexts.auth.email)).toBeInTheDocument();
      expect(screen.getByLabelText(vietnameseTexts.auth.phone)).toBeInTheDocument();
      expect(screen.getByLabelText(vietnameseTexts.auth.password)).toBeInTheDocument();
      expect(screen.getByLabelText(vietnameseTexts.auth.confirmPassword)).toBeInTheDocument();
    });

    it('should handle Vietnamese name input', async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);
      
      const nameInput = screen.getByLabelText(vietnameseTexts.chart.name);
      await user.type(nameInput, 'Nguyễn Văn Tùng');
      
      expect(nameInput).toHaveValue('Nguyễn Văn Tùng');
    });

    it('should validate Vietnamese phone number format', async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);
      
      const phoneInput = screen.getByLabelText(vietnameseTexts.auth.phone);
      
      // Test invalid phone number
      await user.type(phoneInput, '123456789');
      await user.tab(); // Trigger validation
      
      await waitFor(() => {
        expect(screen.getByText(/số điện thoại không hợp lệ/i)).toBeInTheDocument();
      });
      
      // Test valid Vietnamese phone number
      await user.clear(phoneInput);
      await user.type(phoneInput, '+84901234567');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.queryByText(/số điện thoại không hợp lệ/i)).not.toBeInTheDocument();
      });
    });

    it('should handle registration form submission with Vietnamese data', async () => {
      const user = userEvent.setup();
      const mockRegister = vi.fn();
      
      render(<RegisterForm onRegister={mockRegister} />);
      
      // Fill form with Vietnamese data
      await user.type(screen.getByLabelText(vietnameseTexts.chart.name), 'Trần Thị Hương');
      await user.type(screen.getByLabelText(vietnameseTexts.auth.email), 'huong@example.com');
      await user.type(screen.getByLabelText(vietnameseTexts.auth.phone), '+84987654321');
      await user.type(screen.getByLabelText(vietnameseTexts.auth.password), 'StrongPass123!');
      await user.type(screen.getByLabelText(vietnameseTexts.auth.confirmPassword), 'StrongPass123!');
      
      const registerButton = screen.getByRole('button', { name: vietnameseTexts.auth.register });
      await user.click(registerButton);
      
      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          name: 'Trần Thị Hương',
          email: 'huong@example.com',
          phone: '+84987654321',
          password: 'StrongPass123!',
          preferences: {
            language: 'vi',
            timezone: 'Asia/Ho_Chi_Minh'
          }
        });
      });
    });

    it('should validate password confirmation', async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);
      
      await user.type(screen.getByLabelText(vietnameseTexts.auth.password), 'password123');
      await user.type(screen.getByLabelText(vietnameseTexts.auth.confirmPassword), 'different123');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText(/mật khẩu xác nhận không khớp/i)).toBeInTheDocument();
      });
    });
  });

  describe('Vietnamese Validation Helpers', () => {
    it('should validate Vietnamese phone numbers correctly', () => {
      const validPhones = ['+84901234567', '0901234567', '+84987654321'];
      const invalidPhones = ['123456789', '+1234567890', '84901234567', '12345678901'];
      
      validPhones.forEach(phone => {
        expect(vietnameseValidation.phoneNumber(phone)).toBe(true);
      });
      
      invalidPhones.forEach(phone => {
        expect(vietnameseValidation.phoneNumber(phone)).toBe(false);
      });
    });

    it('should validate Vietnamese names correctly', () => {
      const validNames = ['Nguyễn Văn A', 'Trần Thị Hương Giang', 'Lê Đức Anh'];
      const invalidNames = ['A', '', 'John123', 'Tên quá dài'.repeat(10)];
      
      validNames.forEach(name => {
        expect(vietnameseValidation.name(name)).toBe(true);
      });
      
      invalidNames.forEach(name => {
        expect(vietnameseValidation.name(name)).toBe(false);
      });
    });
  });
});