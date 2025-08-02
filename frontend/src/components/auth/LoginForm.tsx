// Vietnamese Login Form Component for Ha Linh Astrology Platform
import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Alert, Typography, Space, Divider } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { loginUser } from '../../store/slices/authSlice';
import { validateVietnamesePhone, validateEmail } from '../../utils/validation';

const { Title, Text } = Typography;

interface LoginFormValues {
  identifier: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, redirectTo = '/dashboard' }) => {
  const [form] = Form.useForm();
  const [identifierType, setIdentifierType] = useState<'email' | 'phone' | 'unknown'>('unknown');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { loading, error } = useAppSelector((state) => state.auth);

  // Determine identifier type and validate
  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    
    if (!value) {
      setIdentifierType('unknown');
      return;
    }

    if (value.includes('@')) {
      setIdentifierType('email');
    } else if (validateVietnamesePhone(value)) {
      setIdentifierType('phone');
    } else {
      setIdentifierType('unknown');
    }
  };

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      // Validate identifier format
      const { identifier } = values;
      const isEmail = identifier.includes('@');
      const isPhone = validateVietnamesePhone(identifier);

      if (!isEmail && !isPhone) {
        form.setFields([
          {
            name: 'identifier',
            errors: ['Email hoặc số điện thoại không hợp lệ']
          }
        ]);
        return;
      }

      // Dispatch login action
      const result = await dispatch(loginUser(values)).unwrap();

      if (result.success) {
        // Show success message
        form.resetFields();
        
        // Handle success callback
        if (onSuccess) {
          onSuccess();
        } else {
          navigate(redirectTo);
        }
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      // Error will be handled by the auth slice and displayed in the component
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={2} style={{ color: '#d32f2f', marginBottom: 8 }}>
          🌟 Đăng Nhập
        </Title>
        <Text type="secondary">
          Chào mừng trở lại với Ha Linh - Tử Vi Việt Nam
        </Text>
      </div>

      {error && (
        <Alert
          message="Đăng nhập thất bại"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
          closable
        />
      )}

      <Form
        form={form}
        name="login"
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
        size="large"
      >
        <Form.Item
          name="identifier"
          label="Email hoặc Số điện thoại"
          rules={[
            { required: true, message: 'Vui lòng nhập email hoặc số điện thoại!' },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                
                const isEmail = value.includes('@');
                const isPhone = validateVietnamesePhone(value);
                
                if (!isEmail && !isPhone) {
                  return Promise.reject(new Error('Email hoặc số điện thoại không hợp lệ'));
                }
                
                if (isEmail && !validateEmail(value)) {
                  return Promise.reject(new Error('Email không hợp lệ'));
                }
                
                return Promise.resolve();
              }
            }
          ]}
        >
          <Input
            prefix={
              identifierType === 'email' ? <MailOutlined /> :
              identifierType === 'phone' ? <PhoneOutlined /> :
              <UserOutlined />
            }
            placeholder="Email hoặc số điện thoại (VD: 0901234567)"
            onChange={handleIdentifierChange}
            autoComplete="username"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu!' },
            { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Nhập mật khẩu"
            autoComplete="current-password"
          />
        </Form.Item>

        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Form.Item name="rememberMe" valuePropName="checked" noStyle>
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>
            <Link to="/forgot-password" style={{ color: '#d32f2f' }}>
              Quên mật khẩu?
            </Link>
          </div>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            style={{
              height: 48,
              fontSize: 16,
              fontWeight: 600,
              background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
              border: 'none',
              borderRadius: 8
            }}
          >
            {loading ? 'Đang đăng nhập...' : '🚀 Đăng Nhập'}
          </Button>
        </Form.Item>

        <Divider style={{ margin: '24px 0' }}>
          <Text type="secondary">Hoặc</Text>
        </Divider>

        <div style={{ textAlign: 'center' }}>
          <Space direction="vertical" size={16}>
            <Text type="secondary">
              Chưa có tài khoản?{' '}
              <Link to="/register" style={{ color: '#d32f2f', fontWeight: 600 }}>
                Đăng ký ngay
              </Link>
            </Text>
            
            <div style={{ fontSize: 12, color: '#666' }}>
              <Text type="secondary">
                Việc đăng nhập đồng nghĩa với việc bạn đồng ý với{' '}
                <Link to="/terms" style={{ color: '#d32f2f' }}>
                  Điều khoản sử dụng
                </Link>{' '}
                và{' '}
                <Link to="/privacy" style={{ color: '#d32f2f' }}>
                  Chính sách bảo mật
                </Link>{' '}
                của Ha Linh.
              </Text>
            </div>
          </Space>
        </div>
      </Form>

      {/* Vietnamese cultural elements */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: 32, 
        padding: 16,
        background: 'linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)',
        borderRadius: 8,
        border: '1px solid #ffd54f'
      }}>
        <Text style={{ color: '#e65100', fontSize: 12 }}>
          🏮 Chúc bạn một ngày tốt lành và thịnh vượng! 🏮
        </Text>
      </div>
    </div>
  );
};

export default LoginForm;