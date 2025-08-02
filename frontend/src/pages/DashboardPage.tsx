import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const DashboardPage: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Dashboard</Title>
      <p>Dashboard sẽ được triển khai trong các phase tiếp theo</p>
    </div>
  );
};

export default DashboardPage;