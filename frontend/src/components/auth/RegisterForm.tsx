// Vietnamese Registration Form Component for Ha Linh Astrology Platform
import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Select, 
  DatePicker, 
  Alert, 
  Typography, 
  Space, 
  Divider,
  Row,
  Col,
  Checkbox,
  Progress
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  PhoneOutlined, 
  MailOutlined,
  CalendarOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { registerUser } from '../../store/slices/authSlice';
import { validateVietnamesePhone, validateEmail, validateVietnameseName } from '../../utils/validation';
import { getVietnameseProvinces, getVietnameseDistricts } from '../../services/locationService';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

interface RegisterFormValues {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  dateOfBirth?: string;
  preferences: {
    language: 'vi' | 'en';
    timezone: string;
    theme: 'vietnamese-traditional' | 'light' | 'dark';
  };
  location?: {
    province?: string;
    district?: string;
  };
  agreeToTerms: boolean;
}

interface RegisterFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, redirectTo = '/verify' }) => {
  const [form] = Form.useForm();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [provinces, setProvinces] = useState<Array<{ code: number; name: string }>>([]);
  const [districts, setDistricts] = useState<Array<{ code: number; name: string }>>([]);
  const [hasEmail, setHasEmail] = useState(false);
  const [hasPhone, setHasPhone] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { loading, error } = useAppSelector((state) => state.auth);

  // Load Vietnamese provinces on component mount
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const provincesData = await getVietnameseProvinces();
        setProvinces(provincesData);
      } catch (error) {
        console.error('Failed to load provinces:', error);
      }
    };
    
    loadProvinces();
  }, []);

  // Load districts when province changes
  const handleProvinceChange = async (provinceCode: number) => {
    try {
      const districtsData = await getVietnameseDistricts(provinceCode);
      setDistricts(districtsData);
      form.setFieldValue(['location', 'district'], undefined);
    } catch (error) {
      console.error('Failed to load districts:', error);
    }
  };

  // Calculate password strength
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 25;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 25;
    
    return Math.min(strength, 100);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    const strength = calculatePasswordStrength(password);
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return '#ff4d4f';
    if (passwordStrength < 75) return '#faad14';
    return '#52c41a';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Rất yếu';
    if (passwordStrength < 50) return 'Yếu';
    if (passwordStrength < 75) return 'Trung bình';
    if (passwordStrength < 100) return 'Mạnh';
    return 'Rất mạnh';
  };

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      // Validate at least one contact method
      if (!values.email && !values.phone) {
        form.setFields([
          {
            name: 'email',
            errors: ['Phải cung cấp ít nhất một trong hai: email hoặc số điện thoại']
          }
        ]);
        return;
      }

      // Dispatch register action
      const result = await dispatch(registerUser(values)).unwrap();

      if (result.success) {
        // Show success and redirect to verification
        form.resetFields();
        
        if (onSuccess) {
          onSuccess();
        } else {
          navigate(redirectTo);
        }
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      // Error will be handled by the auth slice and displayed in the component
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={2} style={{ color: '#d32f2f', marginBottom: 8 }}>
          🌟 Đăng Ký Tài Khoản
        </Title>
        <Text type="secondary">
          Tham gia cộng đồng Ha Linh - Khám phá vận mệnh của bạn
        </Text>
      </div>

      {error && (
        <Alert
          message="Đăng ký thất bại"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
          closable
        />
      )}

      <Form
        form={form}
        name="register"
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
        size="large"
        initialValues={{
          preferences: {
            language: 'vi',
            timezone: 'Asia/Ho_Chi_Minh',
            theme: 'vietnamese-traditional'
          }
        }}
      >
        {/* Basic Information */}
        <Title level={4} style={{ color: '#d32f2f', marginBottom: 16 }}>
          📝 Thông tin cơ bản
        </Title>

        <Form.Item
          name="name"
          label="Họ và tên"
          rules={[
            { required: true, message: 'Vui lòng nhập họ và tên!' },
            { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự!' },
            { max: 50, message: 'Họ và tên không được vượt quá 50 ký tự!' },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                
                if (!validateVietnameseName(value)) {
                  return Promise.reject(new Error('Họ và tên chỉ được chứa chữ cái và khoảng trắng (hỗ trợ tiếng Việt)'));
                }
                
                return Promise.resolve();
              }
            }
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="VD: Nguyễn Văn A"
            autoComplete="name"
          />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="email"
              label="Email (tùy chọn)"
              rules={[
                {
                  validator: (_, value) => {
                    if (!value) {
                      setHasEmail(false);
                      return Promise.resolve();
                    }
                    
                    setHasEmail(true);
                    
                    if (!validateEmail(value)) {
                      return Promise.reject(new Error('Email không hợp lệ'));
                    }
                    
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="example@gmail.com"
                autoComplete="email"
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12}>
            <Form.Item
              name="phone"
              label="Số điện thoại (tùy chọn)"
              rules={[
                {
                  validator: (_, value) => {
                    if (!value) {
                      setHasPhone(false);
                      return Promise.resolve();
                    }
                    
                    setHasPhone(true);
                    
                    if (!validateVietnamesePhone(value)) {
                      return Promise.reject(new Error('Số điện thoại Việt Nam không hợp lệ'));
                    }
                    
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="0901234567"
                autoComplete="tel"
              />
            </Form.Item>
          </Col>
        </Row>

        {!hasEmail && !hasPhone && (
          <Alert
            message="Lưu ý: Phải cung cấp ít nhất một trong hai: email hoặc số điện thoại"
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường và một số!'
                }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu mạnh"
                autoComplete="new-password"
                onChange={handlePasswordChange}
              />
            </Form.Item>
            
            {passwordStrength > 0 && (
              <div style={{ marginTop: -16, marginBottom: 16 }}>
                <Progress
                  percent={passwordStrength}
                  strokeColor={getPasswordStrengthColor()}
                  showInfo={false}
                  size="small"
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Độ mạnh: {getPasswordStrengthText()}
                </Text>
              </div>
            )}
          </Col>
          
          <Col xs={24} sm={12}>
            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập lại mật khẩu"
                autoComplete="new-password"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Optional Information */}
        <Divider />
        <Title level={4} style={{ color: '#d32f2f', marginBottom: 16 }}>
          🎯 Thông tin bổ sung (tùy chọn)
        </Title>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="dateOfBirth"
              label="Ngày sinh"
            >
              <DatePicker
                prefix={<CalendarOutlined />}
                placeholder="Chọn ngày sinh"
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
                disabledDate={(current) => {
                  const now = dayjs();
                  const minAge = now.subtract(13, 'year');
                  const maxAge = now.subtract(120, 'year');
                  return current && (current.isAfter(minAge) || current.isBefore(maxAge));
                }}
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12}>
            <Form.Item
              name={['preferences', 'theme']}
              label="Giao diện"
            >
              <Select placeholder="Chọn giao diện">
                <Option value="vietnamese-traditional">🏮 Truyền thống Việt Nam</Option>
                <Option value="light">☀️ Sáng</Option>
                <Option value="dark">🌙 Tối</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name={['location', 'province']}
              label="Tỉnh/Thành phố"
            >
              <Select
                placeholder="Chọn tỉnh/thành phố"
                onChange={handleProvinceChange}
                showSearch
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    ?.toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {provinces.map(province => (
                  <Option key={province.code} value={province.code}>
                    {province.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12}>
            <Form.Item
              name={['location', 'district']}
              label="Quận/Huyện"
            >
              <Select
                placeholder="Chọn quận/huyện"
                disabled={districts.length === 0}
                showSearch
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    ?.toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {districts.map(district => (
                  <Option key={district.code} value={district.code}>
                    {district.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Terms Agreement */}
        <Form.Item
          name="agreeToTerms"
          valuePropName="checked"
          rules={[
            { required: true, message: 'Bạn phải đồng ý với điều khoản sử dụng!' }
          ]}
        >
          <Checkbox>
            Tôi đồng ý với{' '}
            <Link to="/terms" style={{ color: '#d32f2f' }}>
              Điều khoản sử dụng
            </Link>{' '}
            và{' '}
            <Link to="/privacy" style={{ color: '#d32f2f' }}>
              Chính sách bảo mật
            </Link>{' '}
            của Ha Linh
          </Checkbox>
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
            {loading ? 'Đang đăng ký...' : '🚀 Tạo Tài Khoản'}
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary">
            Đã có tài khoản?{' '}
            <Link to="/login" style={{ color: '#d32f2f', fontWeight: 600 }}>
              Đăng nhập ngay
            </Link>
          </Text>
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
          🏮 Chào mừng bạn đến với gia đình Ha Linh! 🏮
        </Text>
      </div>
    </div>
  );
};

export default RegisterForm;