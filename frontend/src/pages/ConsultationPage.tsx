import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const ConsultationPage: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Tư vấn AI</Title>
      <p>Trang tư vấn AI sẽ được triển khai trong Phase 5</p>
    </div>
  );
};

export default ConsultationPage;