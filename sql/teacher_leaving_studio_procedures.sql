-- Procedures for handling teacher leaving studio scenario
-- Focuses on data integrity and historical preservation

-- 1. Deactivate teacher-studio relationship
CREATE OR REPLACE FUNCTION deactivate_teacher_studio_relationship(
  p_studio_id UUID,
  p_teacher_id UUID,
  p_deactivated_by UUID,
  p_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_relationship_exists BOOLEAN;
  v_active_events_count INTEGER;
BEGIN
  -- Check if active relationship exists
  SELECT EXISTS(
    SELECT 1 FROM studio_teachers 
    WHERE studio_id = p_studio_id 
      AND teacher_id = p_teacher_id 
      AND is_active = true
  ) INTO v_relationship_exists;
  
  IF NOT v_relationship_exists THEN
    RAISE EXCEPTION 'No active relationship found between teacher and studio';
  END IF;
  
  -- Check for future events (optional warning)
  SELECT COUNT(*) INTO v_active_events_count
  FROM events 
  WHERE studio_id = p_studio_id 
    AND date >= CURRENT_DATE
    AND (invoice_id IS NULL OR invoice_id IN (
      SELECT id FROM invoices WHERE user_id = p_teacher_id AND status != 'paid'
    ));
  
  -- Deactivate the relationship
  UPDATE studio_teachers 
  SET 
    is_active = false,
    available_for_substitution = false,
    deactivated_at = NOW(),
    deactivated_by = p_deactivated_by,
    notes = COALESCE(notes, '') || 
            CASE 
              WHEN p_reason IS NOT NULL THEN ' [Deactivated: ' || p_reason || ']'
              ELSE ' [Deactivated: ' || NOW()::date || ']'
            END
  WHERE studio_id = p_studio_id 
    AND teacher_id = p_teacher_id 
    AND is_active = true;
  
  -- Note: Billing entities are preserved for historical invoices
  -- They are marked via trigger but not deleted
  
  -- Return warning about future events
  IF v_active_events_count > 0 THEN
    RAISE NOTICE 'Warning: % future events may need reassignment', v_active_events_count;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- 2. Reactivate teacher-studio relationship (if needed)
CREATE OR REPLACE FUNCTION reactivate_teacher_studio_relationship(
  p_studio_id UUID,
  p_teacher_id UUID,
  p_reactivated_by UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Reactivate the relationship
  UPDATE studio_teachers 
  SET 
    is_active = true,
    deactivated_at = NULL,
    deactivated_by = NULL,
    available_for_substitution = false, -- Default to false, can be changed later
    notes = COALESCE(notes, '') || ' [Reactivated: ' || NOW()::date || ']'
  WHERE studio_id = p_studio_id 
    AND teacher_id = p_teacher_id 
    AND is_active = false;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'No inactive relationship found to reactivate';
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- 3. Get teacher departure impact analysis
CREATE OR REPLACE FUNCTION analyze_teacher_departure_impact(
  p_studio_id UUID,
  p_teacher_id UUID
)
RETURNS TABLE(
  future_events_count INTEGER,
  unpaid_invoices_count INTEGER,
  total_unpaid_amount DECIMAL,
  last_event_date DATE,
  relationship_duration_days INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    -- Future events count
    (SELECT COUNT(*)::INTEGER 
     FROM events e 
     WHERE e.studio_id = p_studio_id 
       AND e.date >= CURRENT_DATE
       AND e.invoice_id IN (
         SELECT i.id FROM invoices i WHERE i.user_id = p_teacher_id
       )
    ),
    
    -- Unpaid invoices count
    (SELECT COUNT(*)::INTEGER 
     FROM invoices i 
     WHERE i.user_id = p_teacher_id 
       AND i.studio_id = p_studio_id 
       AND i.status IN ('draft', 'sent')
    ),
    
    -- Total unpaid amount
    (SELECT COALESCE(SUM(i.total_amount), 0)
     FROM invoices i 
     WHERE i.user_id = p_teacher_id 
       AND i.studio_id = p_studio_id 
       AND i.status IN ('draft', 'sent')
    ),
    
    -- Last event date
    (SELECT MAX(e.date)
     FROM events e
     JOIN invoices i ON e.invoice_id = i.id
     WHERE i.user_id = p_teacher_id 
       AND e.studio_id = p_studio_id
    ),
    
    -- Relationship duration
    (SELECT (NOW() - st.approved_at)::INTEGER
     FROM studio_teachers st
     WHERE st.studio_id = p_studio_id 
       AND st.teacher_id = p_teacher_id
     LIMIT 1
    );
END;
$$ LANGUAGE plpgsql;