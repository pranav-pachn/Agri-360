# 🗄️ AgriMitra 360 - Database Setup Guide

## 📋 Current Status: Tables Need Manual Creation

The SQL script has been prepared but needs to be executed manually in Supabase dashboard.

## 🔧 Step-by-Step Setup Instructions

### 1. Open Supabase Dashboard
- Go to: https://app.supabase.com
- Sign in to your account

### 2. Select Your Project
- Project ID: `dfrekeokibwhlxgqwupj`
- Click on your project to open it

### 3. Open SQL Editor
- In the left sidebar, click on **"SQL Editor"**
- This will open a query editor interface

### 4. Execute the Schema
- Copy the entire content from: `database/create-tables.sql`
- Paste it into the SQL editor
- Click **"Run"** or press **Ctrl+Enter**

### 5. Verify Table Creation
After execution, you should see:
```
✅ farmers table created
✅ crop_reports table created  
✅ credit_scores table created
✅ Indexes created
✅ Sample data inserted
```

## 📊 Tables Being Created

### 1. farmers Table
```sql
CREATE TABLE farmers (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    language TEXT DEFAULT 'en',
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. crop_reports Table
```sql
CREATE TABLE crop_reports (
    id UUID PRIMARY KEY,
    farmer_id UUID REFERENCES farmers(id),
    image_url TEXT,
    disease TEXT,
    confidence DECIMAL(5,4),  -- AI precision: 0.9234
    risk_score DECIMAL(5,4),
    crop_type TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. credit_scores Table
```sql
CREATE TABLE credit_scores (
    farmer_id UUID REFERENCES farmers(id) PRIMARY KEY,
    trust_score INTEGER CHECK (trust_score >= 300 AND trust_score <= 900),
    credit_grade TEXT,
    loan_amount DECIMAL(12,2),  -- Financial precision
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 🎯 Key Features

### ✅ Precise Data Types
- **DECIMAL(5,4)** for AI confidence scores
- **DECIMAL(12,2)** for financial amounts
- **No FLOAT** - avoids precision errors with money

### ✅ Practical Indexes
- `location` - for farmer filtering
- `farmer_id` - for relationship queries
- `created_at` - for time-based queries
- `crop_type` - for crop filtering

### ✅ Foreign Key Relationships
- `crop_reports.farmer_id` → `farmers.id`
- `credit_scores.farmer_id` → `farmers.id`
- **CASCADE DELETE** - data integrity

## 🧪 Validation After Setup

Once tables are created, run:
```bash
cd scripts
node validate-tables.js
```

Expected output:
```
✅ farmers table exists
✅ crop_reports table exists
✅ credit_scores table exists
🎉 All tables exist and are accessible!
```

## 📝 Sample Data

The script includes sample data for testing:
- **Test Farmer** in Andhra Pradesh
- **2 crop reports** (Rice with Leaf Blight, Wheat - Healthy)
- **1 credit score** (750, Good grade, ₹50,000 loan)

## 🔍 Troubleshooting

### If Tables Don't Create:
1. **Check SQL syntax** - Ensure no typos
2. **Permissions** - Ensure you have admin access
3. **Extensions** - UUID extension should auto-enable
4. **Execute in parts** - Run table creation one by one

### Common Errors:
- `relation "farmers" does not exist` → Create farmers table first
- `column "farmer_id" does not exist` → Check table structure
- `permission denied` → Check your Supabase role

## 🎉 Setup Complete

When validation passes, your database is ready for:
- ✅ Farmer registration
- ✅ Crop disease analysis
- ✅ Credit scoring
- ✅ API integration

---

**Ready for AgriMitra 360! 🚀**
