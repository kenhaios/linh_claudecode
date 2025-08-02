import React from 'react';
import { Button, Typography, Card, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <Title level={1} style={{ color: '#d4380d', marginBottom: '16px' }}>
          Hà Linh Tử Vi
        </Title>
        <Title level={3} style={{ fontWeight: 'normal', marginBottom: '24px' }}>
          Tư vấn tử vi trực tuyến với trí tuệ nhân tạo
        </Title>
        <Paragraph style={{ fontSize: '16px', maxWidth: '600px', margin: '0 auto 32px' }}>
          Khám phá vận mệnh của bạn thông qua nghệ thuật tử vi truyền thống Việt Nam 
          kết hợp với công nghệ AI hiện đại. Nhận tư vấn chính xác về tình duyên, 
          sự nghiệp, tài lộc và sức khỏe.
        </Paragraph>
        <Button 
          type="primary" 
          size="large" 
          onClick={() => navigate('/auth')}
          style={{ marginRight: '16px' }}
        >
          Bắt đầu ngay
        </Button>
        <Button 
          size="large" 
          onClick={() => navigate('/dashboard')}
        >
          Tìm hiểu thêm
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card 
            title="🌙 Âm lịch chính xác" 
            style={{ height: '100%' }}
          >
            <Paragraph>
              Tính toán lá số tử vi dựa trên âm lịch Việt Nam truyền thống 
              với độ chính xác cao, phù hợp với văn hóa và tín ngưỡng Việt.
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card 
            title="🤖 AI tư vấn thông minh" 
            style={{ height: '100%' }}
          >
            <Paragraph>
              Trí tuệ nhân tạo được huấn luyện với kiến thức tử vi sâu rộng, 
              đưa ra lời tư vấn chi tiết và phù hợp với từng cá nhân.
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card 
            title="💬 Tư vấn trực tiếp" 
            style={{ height: '100%' }}
          >
            <Paragraph>
              Chat trực tiếp với AI để được giải đáp mọi thắc mắc về vận mệnh, 
              tình duyên, sự nghiệp một cách nhanh chóng và tiện lợi.
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;