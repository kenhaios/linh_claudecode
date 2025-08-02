// MongoDB initialization script for Ha Linh Vietnamese Astrology Application

// Switch to the application database
db = db.getSiblingDB('ha-linh-dev');

// Create application user with read/write permissions
db.createUser({
  user: 'halinh-app',
  pwd: 'halinh-app-pass',
  roles: [
    {
      role: 'readWrite',
      db: 'ha-linh-dev'
    }
  ]
});

// Create collections with Vietnamese-specific settings
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'createdAt'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'User name (Vietnamese characters supported)'
        },
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        },
        phone: {
          bsonType: 'string',
          pattern: '^(\\+84|0)[3-9]\\d{8}$',
          description: 'Vietnamese phone number format'
        },
        preferences: {
          bsonType: 'object',
          properties: {
            language: {
              enum: ['vi', 'en'],
              description: 'Vietnamese or English'
            },
            timezone: {
              enum: ['Asia/Ho_Chi_Minh'],
              description: 'Vietnamese timezone'
            }
          }
        }
      }
    }
  }
});

db.createCollection('astrologycharts', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'birthData', 'createdAt'],
      properties: {
        birthData: {
          bsonType: 'object',
          required: ['name', 'gender', 'solarDate', 'timeOfBirth'],
          properties: {
            gender: {
              enum: ['nam', 'nữ'],
              description: 'Vietnamese gender specification'
            },
            timeOfBirth: {
              bsonType: 'object',
              properties: {
                traditionalHour: {
                  enum: ['tý', 'sửu', 'dần', 'mão', 'thìn', 'tỵ', 'ngọ', 'mùi', 'thân', 'dậu', 'tuất', 'hợi'],
                  description: 'Vietnamese traditional time periods'
                }
              }
            }
          }
        }
      }
    }
  }
});

db.createCollection('consultations');
db.createCollection('tokentransactions');
db.createCollection('payments');

// Create indexes for better performance
// User indexes
db.users.createIndex({ email: 1 }, { unique: true, sparse: true });
db.users.createIndex({ phone: 1 }, { unique: true, sparse: true });
db.users.createIndex({ createdAt: 1 });
db.users.createIndex({ 'preferences.language': 1 });

// Chart indexes for Vietnamese astrology
db.astrologycharts.createIndex({ userId: 1, createdAt: -1 });
db.astrologycharts.createIndex({ 'birthData.solarDate': 1 });
db.astrologycharts.createIndex({ 'birthData.lunarDate.year': 1, 'birthData.lunarDate.month': 1 });
db.astrologycharts.createIndex({ 'birthData.gender': 1 });
db.astrologycharts.createIndex({ 'birthData.placeOfBirth.province': 1 });

// Consultation indexes
db.consultations.createIndex({ userId: 1, createdAt: -1 });
db.consultations.createIndex({ sessionId: 1 });
db.consultations.createIndex({ status: 1, expiresAt: 1 });
db.consultations.createIndex({ category: 1 });

// Token transaction indexes
db.tokentransactions.createIndex({ userId: 1, timestamp: -1 });
db.tokentransactions.createIndex({ 'reference.type': 1, 'reference.id': 1 });
db.tokentransactions.createIndex({ type: 1, timestamp: -1 });

// Payment indexes
db.payments.createIndex({ userId: 1, createdAt: -1 });
db.payments.createIndex({ providerTransactionId: 1 });
db.payments.createIndex({ status: 1, createdAt: -1 });
db.payments.createIndex({ provider: 1 });

// TTL indexes for cleanup
db.consultations.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

print('✅ Ha Linh MongoDB initialization completed successfully');
print('📊 Collections created with Vietnamese-specific validation');
print('🔍 Performance indexes created');
print('🇻🇳 Vietnamese cultural adaptations applied');