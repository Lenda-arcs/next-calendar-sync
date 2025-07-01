-- Convert online penalty to online bonus system
-- This changes the logic from penalty (subtract) to bonus (add)

-- Add new online bonus field
ALTER TABLE billing_entities 
ADD COLUMN online_bonus_per_student DECIMAL(10,2) DEFAULT NULL;

-- Migrate existing online penalty data to bonus (if any exists)
-- Note: This assumes existing penalties should become bonuses of the same amount
UPDATE billing_entities 
SET online_bonus_per_student = online_penalty_per_student 
WHERE online_penalty_per_student IS NOT NULL AND online_penalty_per_student > 0;

-- Add comments for documentation
COMMENT ON COLUMN billing_entities.online_penalty_per_student IS 'DEPRECATED: Legacy penalty field, use online_bonus_per_student instead';
COMMENT ON COLUMN billing_entities.online_bonus_per_student IS 'Bonus amount paid per online student (encourages online teaching)';

-- Add index for performance
CREATE INDEX idx_billing_entities_online_bonus ON billing_entities(online_bonus_per_student);

-- Update table comment to reflect new bonus system
COMMENT ON TABLE billing_entities IS 'Unified table for all invoice recipients with advanced rate calculations: 
- base_rate: Fixed base payment regardless of student count
- minimum_student_threshold: Below this count, penalties may apply or no payment
- studio_penalty_per_student: Penalty per missing student below minimum threshold  
- bonus_student_threshold: Above this count, teacher gets bonus per additional student
- bonus_per_student: Amount paid per student above bonus threshold
- online_bonus_per_student: Bonus paid per online student (encourages online teaching)
- max_discount: Maximum total discount allowed to prevent negative payouts'; 