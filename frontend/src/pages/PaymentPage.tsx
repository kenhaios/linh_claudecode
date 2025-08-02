import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const PaymentPage: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Thanh toán</Title>
      <p>Trang thanh toán sẽ được triển khai trong Phase 8</p>
    </div>
  );
};

export default PaymentPage;