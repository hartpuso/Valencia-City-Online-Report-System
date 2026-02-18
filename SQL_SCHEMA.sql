-- Create FOI Requests Table
CREATE TABLE IF NOT EXISTS foi_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  contact_number VARCHAR(20) NOT NULL,
  barangay VARCHAR(255) NOT NULL,
  street VARCHAR(255) NOT NULL,
  concern TEXT NOT NULL,
  image_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed, rejected
  reference_number VARCHAR(50) UNIQUE DEFAULT 'FOI-' || to_char(now(), 'YYYYMMDDHH24MISS') || '-' || LPAD(CAST(floor(random() * 10000) AS TEXT), 4, '0'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  notes TEXT
);

-- Create an index for faster queries
CREATE INDEX idx_foi_requests_email ON foi_requests(email);
CREATE INDEX idx_foi_requests_status ON foi_requests(status);
CREATE INDEX idx_foi_requests_created_at ON foi_requests(created_at);
CREATE INDEX idx_foi_requests_reference ON foi_requests(reference_number);

-- Create a trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_foi_requests_updated_at
  BEFORE UPDATE ON foi_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (Row Level Security) if needed
ALTER TABLE foi_requests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert
CREATE POLICY "Allow public insert" ON foi_requests
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow users to read their own requests
CREATE POLICY "Allow users to read own requests" ON foi_requests
  FOR SELECT
  USING (auth.jwt() ->> 'email' = email OR true);
