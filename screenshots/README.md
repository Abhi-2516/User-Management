# Postman & Test Execution Screenshots

This directory is designated for storing visual testing evidence for the User Management REST API.

## Recommended Screenshots to Capture

When submitting your assignment or presenting in an interview, provide the following screenshots:

1. **`01_health_check.png`**:
   - `GET http://localhost:5000/api/health` -> HTTP 200 OK.
2. **`02_create_user_success.png`**:
   - `POST http://localhost:5000/api/users` with valid body -> HTTP 201 Created. Show that `id` is returned and `password` is NOT exposed.
3. **`03_create_user_validation_error.png`**:
   - `POST http://localhost:5000/api/users` with empty body or invalid email -> HTTP 400 Bad Request with formatted `errors` array.
4. **`04_create_user_duplicate_email.png`**:
   - `POST http://localhost:5000/api/users` with duplicate email -> HTTP 409 Conflict.
5. **`05_get_all_users.png`**:
   - `GET http://localhost:5000/api/users` -> HTTP 200 OK with user array.
6. **`06_get_user_by_id.png`**:
   - `GET http://localhost:5000/api/users/:id` -> HTTP 200 OK for valid ID.
7. **`07_get_user_invalid_id.png`**:
   - `GET http://localhost:5000/api/users/invalid-id` -> HTTP 400 Bad Request.
8. **`08_get_user_not_found.png`**:
   - `GET http://localhost:5000/api/users/507f1f77bcf86cd799439011` -> HTTP 404 Not Found.
9. **`09_patch_user_success.png`**:
   - `PATCH http://localhost:5000/api/users/:id` -> HTTP 200 OK with updated fields.
10. **`10_patch_unsupported_fields.png`**:
    - `PATCH http://localhost:5000/api/users/:id` with unsupported field like `role` -> HTTP 400 Bad Request.
11. **`11_delete_user.png`**:
    - `DELETE http://localhost:5000/api/users/:id` -> HTTP 200 OK.
12. **`12_automated_test_suite_passing.png`**:
    - Terminal screenshot showing `npm test` passing all 23 tests with 100% green status.

## How to Capture Using Postman

1. Open Postman Desktop or Web Agent.
2. Click **Import** (top left) and select `postman/User-Management-API.postman_collection.json`.
3. Set your collection variable `baseUrl` to `http://localhost:5000`.
4. Ensure your server is running (`npm start` or `npm run dev`).
5. Run the requests in numerical order (01 through 13), or use the **Collection Runner** to run all requests in sequence.
6. Take screenshots of the responses and save them in this directory.
