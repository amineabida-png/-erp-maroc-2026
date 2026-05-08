-- ERP SaaS Maroc 2026 - Database Schema
-- Multi-tenant using Row Level Security (RLS)

-- Enable RLS
-- ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tenants (Entreprises)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    ice VARCHAR(15) UNIQUE NOT NULL, -- Identifiant Commun de l'Entreprise
    tax_id VARCHAR(15) UNIQUE,       -- Identifiant Fiscal
    cnss_id VARCHAR(15) UNIQUE,      -- N° Affiliation CNSS
    rc VARCHAR(50),                  -- Registre du Commerce
    address TEXT,
    city VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    settings JSONB DEFAULT '{}'
);

-- 2. Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, email)
);

-- 3. Products/Services
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    sku VARCHAR(50),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_ht DECIMAL(15, 2) NOT NULL DEFAULT 0,
    tva_rate DECIMAL(5, 2) NOT NULL DEFAULT 20.00, -- 0, 7, 10, 14, 20
    category VARCHAR(100),
    stock_quantity DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Customers
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    ice VARCHAR(15),
    address TEXT,
    email VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Invoices
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id),
    number VARCHAR(50) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE,
    status VARCHAR(20) DEFAULT 'draft', -- draft, sent, paid, cancelled
    total_ht DECIMAL(15, 2) NOT NULL DEFAULT 0,
    total_tva DECIMAL(15, 2) NOT NULL DEFAULT 0,
    total_ttc DECIMAL(15, 2) NOT NULL DEFAULT 0,
    stamp_duty DECIMAL(10, 2) DEFAULT 0, -- Timbre fiscal 0.25%
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, number)
);

-- 6. Invoice Items
CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    description TEXT,
    quantity DECIMAL(15, 2) NOT NULL DEFAULT 1,
    unit_price DECIMAL(15, 2) NOT NULL,
    tva_rate DECIMAL(5, 2) NOT NULL,
    discount DECIMAL(15, 2) DEFAULT 0
);

-- 7. Employees
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    cin VARCHAR(20) UNIQUE,
    cnss_number VARCHAR(20),
    marital_status VARCHAR(20) DEFAULT 'single', -- single, married, divorced, widowed
    children_count INTEGER DEFAULT 0,
    base_salary DECIMAL(15, 2) NOT NULL,
    hire_date DATE,
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT true
);

-- 8. Pay Slips
CREATE TABLE pay_slips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    gross_salary DECIMAL(15, 2) NOT NULL,
    cnss_employee DECIMAL(15, 2) NOT NULL,
    amo_employee DECIMAL(15, 2) NOT NULL,
    ir_amount DECIMAL(15, 2) NOT NULL,
    net_salary DECIMAL(15, 2) NOT NULL,
    data JSONB, -- Store full calculation breakdown
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id, month, year)
);

-- RLS Policies Example
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY tenant_isolation_policy ON products
-- USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
