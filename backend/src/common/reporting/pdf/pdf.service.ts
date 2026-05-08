import { Injectable } from '@nestjs/common';
import { PaySlipRecord } from '../../../hr/payroll/payroll.service';
import { Employee } from '../../../hr/employees/employees.service';
import { Tenant } from '../../../tenants/tenants.service';

@Injectable()
export class PdfExportService {
  /**
   * Génère le HTML pour le Bulletin de Paie (à convertir en PDF via Puppeteer/Playwright)
   */
  async generatePaySlipHtml(slip: PaySlipRecord, employee: Employee, tenant: Tenant): Promise<string> {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #333; font-size: 12px; }
        .header { border-bottom: 2px solid #1E3A8A; padding-bottom: 10px; margin-bottom: 20px; }
        .company-name { font-size: 18px; font-weight: bold; color: #1E3A8A; }
        .title { text-align: center; font-size: 16px; font-weight: bold; background: #F3F4F6; padding: 5px; margin-bottom: 20px; }
        .info-grid { display: flex; justify-content: space-between; margin-bottom: 20px; }
        .info-box { width: 45%; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #E5E7EB; padding: 8px; text-align: left; }
        th { background: #F9FAFB; }
        .totals { float: right; width: 300px; }
        .net-to-pay { font-size: 14px; font-weight: bold; background: #1E3A8A; color: white; padding: 10px; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">${tenant.name}</div>
        <div>ICE: ${tenant.ice} | IF: ${tenant.taxId || 'N/A'}</div>
        <div>Adresse: ${tenant.address || 'Maroc'}</div>
    </div>

    <div class="title">BULLETIN DE PAIE - ${slip.month}/${slip.year}</div>

    <div class="info-grid">
        <div class="info-box">
            <strong>Salarié:</strong> ${employee.firstName} ${employee.lastName}<br>
            <strong>CIN:</strong> ${employee.cin}<br>
            <strong>N° CNSS:</strong> ${employee.cnssNumber}<br>
            <strong>Situation:</strong> ${employee.maritalStatus} (${employee.childrenCount} enfants)
        </div>
        <div class="info-box">
            <strong>Département:</strong> ${employee.department}<br>
            <strong>Date de paiement:</strong> ${new Date().toLocaleDateString('fr-MA')}<br>
            <strong>Mode:</strong> Virement Bancaire
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Désignation</th>
                <th>Nombre/Base</th>
                <th>Taux</th>
                <th>Retenue</th>
                <th>Gain</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Salaire de base</td>
                <td>26 jours</td>
                <td>-</td>
                <td>-</td>
                <td>${employee.baseSalary.toFixed(2)}</td>
            </tr>
            <tr>
                <td>CNSS (Part Salariée)</td>
                <td>${Math.min(slip.grossSalary, 6000).toFixed(2)}</td>
                <td>4.48%</td>
                <td>${slip.cnss.toFixed(2)}</td>
                <td>-</td>
            </tr>
            <tr>
                <td>AMO (Part Salariée)</td>
                <td>${slip.grossSalary.toFixed(2)}</td>
                <td>2.26%</td>
                <td>${slip.amo.toFixed(2)}</td>
                <td>-</td>
            </tr>
            <tr>
                <td>IR (Retenue à la source)</td>
                <td>${slip.netTaxableSalary.toFixed(2)}</td>
                <td>Barème 2026</td>
                <td>${slip.irNet.toFixed(2)}</td>
                <td>-</td>
            </tr>
        </tbody>
    </table>

    <div class="totals">
        <table>
            <tr><td>Salaire Brut</td><td>${slip.grossSalary.toFixed(2)} DH</td></tr>
            <tr><td>Total Retenues</td><td>${(slip.cnss + slip.amo + slip.irNet).toFixed(2)} DH</td></tr>
            <tr class="net-to-pay"><td>Net à Payer</td><td>${slip.netSalary.toFixed(2)} DH</td></tr>
        </table>
    </div>

    <div style="clear:both; margin-top:50px; font-size:10px; color:#999;">
        Document généré par ERP MAROC 2026 - Conforme DGI/CNSS
    </div>
</body>
</html>
    `;
  }
}
