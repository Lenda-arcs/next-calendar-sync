-- Enhance billing_entities table for advanced rate calculations
-- Add support for minimum thresholds, bonus thresholds, and bonus rates

-- Add new columns for enhanced rate calculations
ALTER TABLE billing_entities 
ADD COLUMN minimum_student_threshold INTEGER DEFAULT NULL,
ADD COLUMN bonus_student_threshold INTEGER DEFAULT NULL, 
ADD COLUMN bonus_per_student DECIMAL(10,2) DEFAULT NULL;

-- Add comments for documentation
COMMENT ON COLUMN billing_entities.student_threshold IS 'DEPRECATED: Legacy threshold field, use minimum_student_threshold instead';
COMMENT ON COLUMN billing_entities.minimum_student_threshold IS 'Minimum students required to avoid penalties or get base payment';
COMMENT ON COLUMN billing_entities.bonus_student_threshold IS 'Student count above which teacher gets bonus per additional student';
COMMENT ON COLUMN billing_entities.bonus_per_student IS 'Amount paid per student above bonus threshold';

-- Add constraints to ensure logical thresholds
ALTER TABLE billing_entities 
ADD CONSTRAINT billing_entities_threshold_check 
CHECK (
  minimum_student_threshold IS NULL OR 
  bonus_student_threshold IS NULL OR 
  bonus_student_threshold >= minimum_student_threshold
);

-- Add indexes for performance
CREATE INDEX idx_billing_entities_thresholds ON billing_entities(minimum_student_threshold, bonus_student_threshold);

-- Update existing records to use new minimum_student_threshold field
-- Migrate data from student_threshold to minimum_student_threshold
UPDATE billing_entities 
SET minimum_student_threshold = student_threshold 
WHERE student_threshold IS NOT NULL;

-- Add more detailed comments about the rate calculation system
COMMENT ON TABLE billing_entities IS 'Unified table for all invoice recipients with advanced rate calculations: 
- base_rate: Fixed base payment regardless of student count
- minimum_student_threshold: Below this count, penalties may apply or no payment
- studio_penalty_per_student: Penalty per missing student below minimum threshold  
- bonus_student_threshold: Above this count, teacher gets bonus per additional student
- bonus_per_student: Amount paid per student above bonus threshold
- max_discount: Maximum total discount allowed to prevent negative payouts'; 