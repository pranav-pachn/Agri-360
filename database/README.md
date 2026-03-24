# AgriMitra 360 Database Setup

## Overview

Enhanced database schema with multi-level analytics, AI chat functionality, and finance-ready credit scoring. Designed to support AI, finance, and decision-making capabilities for the AgriMitra 360 platform.

## Tables

### Core Tables

1. **farmers** - User registration and profile data
2. **crop_reports** - Enhanced crop disease analysis with health metrics
3. **credit_scores** - Financial trust scores with loan eligibility
4. **analytics** - Multi-level aggregation (district/state/national)
5. **chat_logs** - AI assistant conversation logs with threading

## Key Enhancements

### Enhanced crop_reports
- `severity` - Disease severity classification
- `health_score` - Overall crop health (0-100)
- `yield_prediction` - AI predicted yield (tons/hectare)
- `sustainability_index` - Environmental sustainability score

### Multi-Level Analytics
- `level` ENUM('district', 'state', 'national')
- Flexible aggregation with NULL fields for higher levels
- Performance-optimized indexes

### Enhanced Credit Scoring
- `interest_rate` - Loan interest rates
- `repayment_term` - Loan duration (months)
- `risk_category` - Risk classification
- `loan_eligibility` - Automatic eligibility

### Full Chat Functionality
- `conversation_id` - Thread grouping
- `message_type` - User/AI message distinction
- `metadata` JSONB - Model info, latency, tokens
- Bilingual support with language field

## Setup Instructions

### Quick Setup
```bash
# Run all migrations
psql -d your_database -f migrations/run_migrations.sql

# Or run complete schema
psql -d your_database -f schema.sql
```

### Individual Migrations
```bash
# Run specific migrations
psql -d your_database -f migrations/001_enhance_crop_reports.sql
psql -d your_database -f migrations/002_create_analytics.sql
psql -d your_database -f migrations/003_enhance_credit_scores.sql
psql -d your_database -f migrations/004_create_chat_logs.sql
psql -d your_database -f migrations/005_sample_data.sql
```

## Sample Data

The schema includes comprehensive sample data:
- 2 demo farmers with different languages
- Enhanced crop reports with all new fields
- Credit scores with finance features
- Multi-level analytics (district, state, national)
- Chat conversations with threading

## Performance Features

### Strategic Indexes
- Composite indexes for common query patterns
- GIN indexes for JSONB metadata
- Partial indexes for filtered queries

### Materialized Views
- District-level analytics aggregation
- Optimized for dashboard queries

## Data Relationships

```
farmers (1) ----< (many) crop_reports
  |                         |
  |                         +----> analytics (aggregation)
  |
  +----< (1) credit_scores
  
farmers (1) ----< (many) chat_logs
```

## Migration Strategy

- **Incremental**: Separate migration files for safety
- **Rollback-safe**: IF NOT EXISTS clauses
- **Zero-downtime**: Compatible with live deployments

## Validation

All tables include:
- Foreign key constraints with CASCADE DELETE
- CHECK constraints for data integrity
- Comprehensive comments for documentation
- Sample data for testing

## Notes

- SQL linter may show false positives for PostgreSQL syntax
- All syntax is PostgreSQL-compatible
- Schema supports both hackathon MVP and production scaling
- Designed for AI/finance/decision-making focus
