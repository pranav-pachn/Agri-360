-- Migration 003: Enhance credit_scores table for finance-ready features
-- Add fields for comprehensive credit scoring and loan eligibility

-- Add interest_rate field for loan interest rates
ALTER TABLE credit_scores 
ADD COLUMN IF NOT EXISTS interest_rate DECIMAL(5,2);

-- Add repayment_term field for loan duration in months
ALTER TABLE credit_scores 
ADD COLUMN IF NOT EXISTS repayment_term INTEGER;

-- Add risk_category field for risk classification
ALTER TABLE credit_scores 
ADD COLUMN IF NOT EXISTS risk_category TEXT 
CHECK (risk_category IN ('low', 'medium', 'high'));

-- Add loan_eligibility field for automatic eligibility determination
ALTER TABLE credit_scores 
ADD COLUMN IF NOT EXISTS loan_eligibility BOOLEAN DEFAULT TRUE;

-- Add is_archived field for soft deletion
ALTER TABLE credit_scores 
ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT FALSE;

-- Create indexes for new fields
CREATE INDEX IF NOT EXISTS idx_credit_scores_risk_category ON credit_scores(risk_category);
CREATE INDEX IF NOT EXISTS idx_credit_scores_eligibility ON credit_scores(loan_eligibility);
CREATE INDEX IF NOT EXISTS idx_credit_scores_archived ON credit_scores(is_archived);

-- Add comments for documentation
COMMENT ON COLUMN credit_scores.interest_rate IS 'Loan interest rate as percentage (e.g., 8.5 for 8.5%)';
COMMENT ON COLUMN credit_scores.repayment_term IS 'Loan repayment term in months';
COMMENT ON COLUMN credit_scores.risk_category IS 'Risk classification: low, medium, high';
COMMENT ON COLUMN credit_scores.loan_eligibility IS 'Automatic loan eligibility determination';
COMMENT ON COLUMN credit_scores.is_archived IS 'Soft delete flag for data retention';
