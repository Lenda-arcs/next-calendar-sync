-- Create studio teacher requests table
-- This enables teachers to request to join studios

CREATE TABLE studio_teacher_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationship fields
  studio_id UUID REFERENCES studios(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
  -- Request details
  message TEXT, -- Optional message from teacher
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  
  -- Admin response
  admin_response TEXT, -- Optional response from admin
  processed_by UUID REFERENCES users(id) ON DELETE SET NULL, -- Admin who processed the request
  processed_at TIMESTAMPTZ, -- When the request was processed
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(studio_id, teacher_id) -- One request per teacher per studio
);

-- Add indexes for efficient queries
CREATE INDEX idx_studio_teacher_requests_studio_id ON studio_teacher_requests(studio_id);
CREATE INDEX idx_studio_teacher_requests_teacher_id ON studio_teacher_requests(teacher_id);
CREATE INDEX idx_studio_teacher_requests_status ON studio_teacher_requests(status);
CREATE INDEX idx_studio_teacher_requests_processed_by ON studio_teacher_requests(processed_by);

-- RLS policies for studio_teacher_requests
ALTER TABLE studio_teacher_requests ENABLE ROW LEVEL SECURITY;

-- Teachers can view their own requests
CREATE POLICY "Teachers can view their own requests" ON studio_teacher_requests
  FOR SELECT USING (auth.uid() = teacher_id);

-- Teachers can create requests for themselves
CREATE POLICY "Teachers can create requests" ON studio_teacher_requests
  FOR INSERT WITH CHECK (auth.uid() = teacher_id);

-- Teachers can update their own pending requests (message only)
CREATE POLICY "Teachers can update their pending requests" ON studio_teacher_requests
  FOR UPDATE USING (
    auth.uid() = teacher_id AND 
    status = 'pending'
  ) WITH CHECK (
    auth.uid() = teacher_id AND 
    status = 'pending'
  );

-- Studio owners can view requests for their studios
CREATE POLICY "Studio owners can view requests for their studios" ON studio_teacher_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM studios 
      WHERE studios.id = studio_teacher_requests.studio_id 
      AND studios.created_by_user_id = auth.uid()
    )
  );

-- Studio owners can update requests for their studios (approval/rejection)
CREATE POLICY "Studio owners can process requests for their studios" ON studio_teacher_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM studios 
      WHERE studios.id = studio_teacher_requests.studio_id 
      AND studios.created_by_user_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM studios 
      WHERE studios.id = studio_teacher_requests.studio_id 
      AND studios.created_by_user_id = auth.uid()
    )
  );

-- Admins can view all requests
CREATE POLICY "Admins can view all requests" ON studio_teacher_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'moderator')
    )
  );

-- Admins can process any request
CREATE POLICY "Admins can process any request" ON studio_teacher_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'moderator')
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'moderator')
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_studio_teacher_requests_updated_at 
  BEFORE UPDATE ON studio_teacher_requests 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create billing entity when request is approved
CREATE OR REPLACE FUNCTION handle_studio_teacher_request_approval()
RETURNS TRIGGER AS $$
DECLARE
  studio_record studios%ROWTYPE;
BEGIN
  -- Only process if status changed to 'approved'
  IF OLD.status != 'approved' AND NEW.status = 'approved' THEN
    -- Get studio information
    SELECT * INTO studio_record FROM studios WHERE id = NEW.studio_id;
    
    -- Create billing entity for the teacher-studio relationship
    INSERT INTO billing_entities (
      user_id,
      entity_name,
      entity_type,
      studio_id,
      rate_config,
      location_match,
      currency,
      created_at
    ) VALUES (
      NEW.teacher_id,
      studio_record.name || ' - Teacher Contract',
      'studio',
      NEW.studio_id,
      studio_record.default_rate_config,
      studio_record.location_patterns,
      'EUR',
      NOW()
    );
    
    -- Update the request with processing info
    NEW.processed_by = auth.uid();
    NEW.processed_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to handle request approval
CREATE TRIGGER handle_studio_teacher_request_approval_trigger
  BEFORE UPDATE ON studio_teacher_requests
  FOR EACH ROW
  EXECUTE FUNCTION handle_studio_teacher_request_approval();