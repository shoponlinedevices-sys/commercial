# Email Service (email-svc)

Email microservice for sending emails using Gmail (shoponlinedevices@gmail.com).

## Features

- Send emails via REST API or gRPC
- Email tracking with database persistence
- Support for email templates
- Email history and status tracking

## Configuration

Environment variables in `.env`:

```env
GRPC_PORT=50053
PORT=3003

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=06081990
DB_NAME=commercial

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=shoponlinedevices@gmail.com
EMAIL_PASSWORD=your_app_password_here
EMAIL_FROM=shoponlinedevices@gmail.com
```

**Important:** For Gmail, you need to use an App Password instead of your regular password:
1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password for mail
4. Use that app password in EMAIL_PASSWORD

## Database Setup

Run the SQL script to create the emails table:

```bash
mysql -u root -p commercial < setup-database.sql
```

## Installation

```bash
npm install
```

## Running

Development:
```bash
npm run start:dev
```

Production:
```bash
npm run build
npm run start:prod
```

## API Endpoints

### REST API

- `POST /emails` - Send an email
- `GET /emails/history` - Get email history
- `GET /emails/recipient/:to` - Get emails by recipient
- `GET /emails/:id` - Get email by ID

### gRPC

Service: `EmailService`
Method: `SendEmail`

Request:
```protobuf
message SendEmailRequest {
  string to = 1;
  string subject = 2;
  string body = 3;
  string template = 4;
  map<string, string> templateData = 5;
}
```

Response:
```protobuf
message SendEmailResponse {
  bool success = 1;
  string messageId = 2;
  int32 emailId = 3;
  string error = 4;
}
```

## Example Usage

### REST API

```bash
curl -X POST http://localhost:3003/emails \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "subject": "Test Email",
    "body": "<h1>Hello</h1><p>This is a test email.</p>"
  }'
```

### gRPC

The service is available at `localhost:50053` with package name `email`.
