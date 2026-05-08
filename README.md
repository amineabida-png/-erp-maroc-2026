# ERP SaaS Maroc 2026

## Overview
ERP complet pour les PME marocaines, conforme aux réglementations de 2026.

## Structure
- `/backend`: NestJS + PostgreSQL (RLS)
- `/frontend`: Next.js + Tailwind
- `/mobile`: Flutter

## Fonctionnalités Clés
- **Fiscalité 2026:** Moteur de paie (IR, CNSS, AMO) et IS intégrés.
- **Multi-tenant:** Isolation stricte des données par ICE.
- **Facturation Electronique:** Compatible avec les futures normes DGI.
- **Comptabilité:** Écritures automatiques basées sur les ventes et la paie.

## Installation
1. `cd backend && npm install`
2. Configurer PostgreSQL et exécuter `database/schema.sql`.
3. `npm run test` pour vérifier le moteur fiscal.
