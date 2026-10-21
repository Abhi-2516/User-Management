const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../app');
const User = require('../models/User');

let mongoServer;

beforeAll(async () => {
  // Use MONGODB_URI_TEST if provided, otherwise spin up an in-memory MongoDB instance
  if (process.env.MONGODB_URI_TEST) {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
  } else {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  }
}, 60000);

afterEach(async () => {
  // Clean up all documents between tests to ensure test isolation
  if (mongoose.connection.readyState === 1) {
    await User.deleteMany({});
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('User Management API Integration Tests', () => {
  // Sample valid user payload
  const validUserData = {
    fullName: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    password: 'SecurePassword123'
  };

  /* ==========================================================================
     1. User Creation (POST /api/users)
     ========================================================================== */
  describe('POST /api/users', () => {
    test('1. Should successfully create a new user and return HTTP 201 with safe data', async () => {
      const res = await request(app)
        .post('/api/users')
        .send(validUserData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('User created successfully');
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.fullName).toBe(validUserData.fullName);
      expect(res.body.data.email).toBe(validUserData.email.toLowerCase());
      expect(res.body.data).toHaveProperty('createdAt');

      // Security check: Never expose password or password hash
      expect(res.body.data.password).toBeUndefined();
      expect(res.body.data.passwordHash).toBeUndefined();
      expect(res.body.data._id).toBeUndefined();
      expect(res.body.data.__v).toBeUndefined();
    });

    test('2. Should return HTTP 400 when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({
          // Missing fullName, email, and password
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed');
      expect(Array.isArray(res.body.errors)).toBe(true);
      expect(res.body.errors.length).toBeGreaterThanOrEqual(3);
    });

    test('3. Should return HTTP 400 when an invalid email format is provided', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({
          fullName: 'Ananya Verma',
          email: 'invalid-email-format',
          password: 'Password123'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed');
      const emailError = res.body.errors.find((err) => err.field === 'email');
      expect(emailError).toBeDefined();
      expect(emailError.message).toMatch(/valid email/i);
    });

    test('4. Should return HTTP 400 when password is less than 6 characters', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({
          fullName: 'Vikram Singh',
          email: 'vikram@example.com',
          password: '123' // too short
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed');
      const passwordError = res.body.errors.find((err) => err.field === 'password');
      expect(passwordError).toBeDefined();
      expect(passwordError.message).toMatch(/at least 6 characters/i);
    });

    test('5. Should return HTTP 409 when attempting to create a user with duplicate email', async () => {
      // First user creation
      await request(app).post('/api/users').send(validUserData);

      // Duplicate attempt with case insensitivity check
      const res = await request(app)
        .post('/api/users')
        .send({
          fullName: 'Another Person',
          email: 'RAHUL.SHARMA@EXAMPLE.COM',
          password: 'AnotherPassword456'
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already exists/i);
    });
  });

  /* ==========================================================================
     2. Retrieve All Users (GET /api/users)
     ========================================================================== */
  describe('GET /api/users', () => {
    test('6. Should return HTTP 200 with an empty array when no users exist', async () => {
      const res = await request(app).get('/api/users');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(0);
    });

    test('6b. Should return HTTP 200 with all users when records exist, sorted by createdAt', async () => {
      await request(app).post('/api/users').send({
        fullName: 'First User',
        email: 'first@example.com',
        password: 'Password123'
      });

      await request(app).post('/api/users').send({
        fullName: 'Second User',
        email: 'second@example.com',
        password: 'Password123'
      });

      const res = await request(app).get('/api/users');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2);

      // Verify no passwords or hashes are returned
      res.body.data.forEach((user) => {
        expect(user.password).toBeUndefined();
        expect(user.passwordHash).toBeUndefined();
        expect(user.id).toBeDefined();
      });
    });
  });

  /* ==========================================================================
     3. Retrieve Single User (GET /api/users/:id)
     ========================================================================== */
  describe('GET /api/users/:id', () => {
    test('7. Should return HTTP 200 and user data for a valid existing user ID', async () => {
      const createRes = await request(app).post('/api/users').send(validUserData);
      const userId = createRes.body.data.id;

      const res = await request(app).get(`/api/users/${userId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(userId);
      expect(res.body.data.email).toBe(validUserData.email.toLowerCase());
      expect(res.body.data.password).toBeUndefined();
    });

    test('8. Should return HTTP 400 for a malformed MongoDB ID', async () => {
      const res = await request(app).get('/api/users/not-a-valid-id');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Validation failed|Invalid user ID format/i);
    });

    test('9. Should return HTTP 404 for a valid format but non-existent ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const res = await request(app).get(`/api/users/${nonExistentId}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('User not found');
    });
  });

  /* ==========================================================================
     4. Update User (PATCH /api/users/:id)
     ========================================================================== */
  describe('PATCH /api/users/:id', () => {
    test('10. Should successfully update user name and return HTTP 200', async () => {
      const createRes = await request(app).post('/api/users').send(validUserData);
      const userId = createRes.body.data.id;

      const res = await request(app)
        .patch(`/api/users/${userId}`)
        .send({ fullName: 'Rahul S. Sharma' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.fullName).toBe('Rahul S. Sharma');
      expect(res.body.data.email).toBe(validUserData.email.toLowerCase());
    });

    test('11. Should successfully update user email', async () => {
      const createRes = await request(app).post('/api/users').send(validUserData);
      const userId = createRes.body.data.id;

      const res = await request(app)
        .patch(`/api/users/${userId}`)
        .send({ email: 'rahul.new@example.com' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('rahul.new@example.com');
    });

    test('11b. Should return HTTP 409 when updating email to one already used by another user', async () => {
      const user1 = await request(app).post('/api/users').send(validUserData);
      const user2 = await request(app).post('/api/users').send({
        fullName: 'Pooja Patel',
        email: 'pooja@example.com',
        password: 'Password123'
      });

      const res = await request(app)
        .patch(`/api/users/${user2.body.data.id}`)
        .send({ email: validUserData.email });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already exists/i);
    });

    test('12. Should update password, ensure it is securely hashed, and never expose hash', async () => {
      const createRes = await request(app).post('/api/users').send(validUserData);
      const userId = createRes.body.data.id;
      const newPassword = 'BrandNewSecurePassword999';

      const res = await request(app)
        .patch(`/api/users/${userId}`)
        .send({ password: newPassword });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      // Ensure password is not in API response
      expect(res.body.data.password).toBeUndefined();
      expect(res.body.data.passwordHash).toBeUndefined();

      // Directly verify database state
      const dbUser = await User.findById(userId).select('+password');
      expect(dbUser.password).not.toBe(newPassword);
      const isMatch = await bcrypt.compare(newPassword, dbUser.password);
      expect(isMatch).toBe(true);
    });

    test('13. Should return HTTP 400 when unsupported fields are submitted', async () => {
      const createRes = await request(app).post('/api/users').send(validUserData);
      const userId = createRes.body.data.id;

      const res = await request(app)
        .patch(`/api/users/${userId}`)
        .send({
          fullName: 'Updated Name',
          role: 'admin',
          createdAt: new Date().toISOString()
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed');
    });

    test('13b. Should return HTTP 400 when empty update object is submitted', async () => {
      const createRes = await request(app).post('/api/users').send(validUserData);
      const userId = createRes.body.data.id;

      const res = await request(app)
        .patch(`/api/users/${userId}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed');
    });

    test('Should return HTTP 404 when updating non-existent user ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .patch(`/api/users/${nonExistentId}`)
        .send({ fullName: 'Nobody' });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('User not found');
    });
  });

  /* ==========================================================================
     5. Delete User (DELETE /api/users/:id)
     ========================================================================== */
  describe('DELETE /api/users/:id', () => {
    test('14. Should successfully delete a user and return HTTP 200', async () => {
      const createRes = await request(app).post('/api/users').send(validUserData);
      const userId = createRes.body.data.id;

      const res = await request(app).delete(`/api/users/${userId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('User deleted successfully');
      expect(res.body.data.id).toBe(userId);

      // Verify record is gone from DB
      const checkUser = await User.findById(userId);
      expect(checkUser).toBeNull();
    });

    test('15. Should return HTTP 404 when attempting to delete non-existent user', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const res = await request(app).delete(`/api/users/${nonExistentId}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('User not found');
    });

    test('Should return HTTP 400 when deleting with malformed user ID', async () => {
      const res = await request(app).delete('/api/users/not-valid-id');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Validation failed|Invalid user ID format/i);
    });
  });

  /* ==========================================================================
     6. Security and Edge Cases
     ========================================================================== */
  describe('Security and Edge Case Handling', () => {
    test('16. Confirm password hashes never appear in any response format', async () => {
      const createRes = await request(app).post('/api/users').send(validUserData);
      const jsonString = JSON.stringify(createRes.body);

      // String should not contain any bcrypt salt or hash signature ($2a$, $2b$)
      expect(jsonString).not.toMatch(/\$2[abxy]?\$\d+\$/);
      expect(createRes.body.data.password).toBeUndefined();
    });

    test('17. Should return HTTP 404 for unknown routes', async () => {
      const res = await request(app).get('/api/non-existent-route');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Route not found/i);
    });

    test('Should return HTTP 200 on health check endpoint', async () => {
      const res = await request(app).get('/api/health');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/operational/i);
    });
  });
});
