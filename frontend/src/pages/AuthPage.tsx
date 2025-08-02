import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const AuthPage: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ color: '#d4380d' }}>
            Đăng nhập / Đăng ký
          </Title>
        </div>
        
        {/* Authentication form will be implemented in Phase 3 */}
        <div style={{ textAlign: 'center', color: '#666' }}>
          Chức năng đăng nhập sẽ được triển khai trong Phase 3
        </div>
      </Card>
    </div>
  );
};

export default AuthPage;