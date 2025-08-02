import React from 'react';
import { Layout } from 'antd';
import { useAppSelector } from '@/hooks/redux';

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isDarkMode } = useAppSelector((state) => state.ui);

  return (
    <Layout 
      style={{ minHeight: '100vh' }}
      data-theme={isDarkMode ? 'dark' : 'light'}
    >
      <Content>
        {children}
      </Content>
    </Layout>
  );
};

export default MainLayout;