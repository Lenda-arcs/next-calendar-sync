-- Create billing entity trigger for studio_teachers table
-- This standardizes billing entity creation when relationships are created

CREATE OR REPLACE FUNCTION handle_studio_teacher_creation()
RETURNS TRIGGER AS $$
DECLARE
  studio_record studios%ROWTYPE;
  teacher_record users%ROWTYPE;
BEGIN
  -- Only process when a new active relationship is created
  IF TG_OP = 'INSERT' AND NEW.is_active = true THEN
    -- Get studio and teacher information
    SELECT * INTO studio_record FROM studios WHERE id = NEW.studio_id;
    SELECT * INTO teacher_record FROM users WHERE id = NEW.teacher_id;
    
    -- Create billing entity for the teacher-studio relationship
    INSERT INTO billing_entities (
      user_id,
      entity_name,
      entity_type,
      studio_id,
      rate_config,
      location_match,
      currency,
      notes,
      created_at
    ) VALUES (
      NEW.teacher_id,
      studio_record.name || ' - ' || teacher_record.name,
      'studio',
      NEW.studio_id,
      studio_record.default_rate_config,
      studio_record.location_patterns,
      'EUR',
      'Auto-created from studio-teacher relationship',
      NOW()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS studio_teacher_billing_trigger ON studio_teachers;
CREATE TRIGGER studio_teacher_billing_trigger
  AFTER INSERT ON studio_teachers
  FOR EACH ROW
  EXECUTE FUNCTION handle_studio_teacher_creation();

-- Optional: Add trigger for deactivation (see teacher leaving scenario below)
CREATE OR REPLACE FUNCTION handle_studio_teacher_deactivation()
RETURNS TRIGGER AS $$
BEGIN
  -- When a relationship is deactivated, mark billing entity as inactive
  IF TG_OP = 'UPDATE' AND OLD.is_active = true AND NEW.is_active = false THEN
    UPDATE billing_entities 
    SET notes = COALESCE(notes, '') || ' [Deactivated: ' || NOW()::date || ']'
    WHERE studio_id = NEW.studio_id 
      AND user_id = NEW.teacher_id 
      AND entity_type = 'studio';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create deactivation trigger
DROP TRIGGER IF EXISTS studio_teacher_deactivation_trigger ON studio_teachers;
CREATE TRIGGER studio_teacher_deactivation_trigger
  AFTER UPDATE ON studio_teachers
  FOR EACH ROW
  EXECUTE FUNCTION handle_studio_teacher_deactivation();