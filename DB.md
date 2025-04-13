# Supabase Database Schema for Calendar App

This file documents the database schema used in the project, including table definitions, constraints, indexing strategies, and security policies for Supabase integration.

## Tables

### events

Stores core event information including scheduling, location, and metadata.

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

### attachments

Stores media files (images/videos) associated with specific events.

CREATE TABLE attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  type VARCHAR(10) NOT NULL CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

### notifications

Manages scheduled notifications related to events, including snooze and dismissal tracking.

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  status VARCHAR(10) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'snoozed', 'dismissed')),
  snooze_count INT DEFAULT 0,
  last_snoozed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_event_id ON notifications(event_id);

-- Set up RLS (Row Level Security)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for events"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Public read access for attachments"
  ON attachments FOR SELECT
  USING (true);

CREATE POLICY "Public read access for notifications"
  ON notifications FOR SELECT
  USING (true);

## Supabase Configuration

Add the following environment variables in your `.env` file for Supabase integration:

```
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
```

These credentials will be used by the backend to connect and store data securely in the Supabase database.

## Indexing

- `idx_events_start_date`: Optimizes querying events by their start date.
- `idx_notifications_status`: Useful for querying notification delivery status.
- `idx_notifications_event_id`: Supports efficient joins and lookups related to events.

## Row Level Security (RLS)

RLS is enabled for all tables to enforce access control. The following policies have been created:

- `Public read access for events`
- `Public read access for attachments`
- `Public read access for notifications`

Each allows read-only access using `USING (true)` condition. Update these policies based on your authentication rules for secure production deployment.