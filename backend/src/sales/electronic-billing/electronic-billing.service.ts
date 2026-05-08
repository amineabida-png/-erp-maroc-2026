import { Injectable } from '@nestjs/common';
import { Invoice } from '../invoices/invoices.service';
import { Tenant } from '../../tenants/tenants.service';

@Injectable()
export class ElectronicBillingService {
  /**
   * Génère le fichier XML UBL pour la DGI
   * Format conforme aux exigences 2026
   */
  async generateDGIXml(invoice: Invoice, tenant: Tenant, customer: any): Promise<string> {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
    <cbc:CustomizationID>urn:cen.eu:en16931:2017#compliant#urn:fdc:dgi.gov.ma:erp:v1</cbc:CustomizationID>
    <cbc:ID>${invoice.number}</cbc:ID>
    <cbc:IssueDate>${invoice.date.toISOString().split('T')[0]}</cbc:IssueDate>
    <cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>
    <cbc:DocumentCurrencyCode>MAD</cbc:DocumentCurrencyCode>

    <!-- Émetteur (Vendeur - Tenant) -->
    <cac:AccountingSupplierParty>
        <cac:Party>
            <cac:PartyIdentification>
                <cbc:ID schemeID="ICE">${tenant.ice}</cbc:ID>
            </cac:PartyIdentification>
            <cac:PartyName>
                <cbc:Name>${tenant.name}</cbc:Name>
            </cac:PartyName>
            <cac:PartyTaxScheme>
                <cbc:CompanyID>${tenant.taxId}</cbc:CompanyID>
                <cac:TaxScheme>
                    <cbc:ID>VAT</cbc:ID>
                </cac:TaxScheme>
            </cac:PartyTaxScheme>
        </cac:Party>
    </cac:AccountingSupplierParty>

    <!-- Client -->
    <cac:AccountingCustomerParty>
        <cac:Party>
            <cac:PartyIdentification>
                <cbc:ID schemeID="ICE">${customer.ice || 'N/A'}</cbc:ID>
            </cac:PartyIdentification>
            <cac:PartyName>
                <cbc:Name>${customer.name}</cbc:Name>
            </cac:PartyName>
        </cac:Party>
    </cac:AccountingCustomerParty>

    <!-- Totaux -->
    <cac:LegalMonetaryTotal>
        <cbc:LineExtensionAmount currencyID="MAD">${invoice.subTotalHT.toFixed(2)}</cbc:LineExtensionAmount>
        <cbc:TaxExclusiveAmount currencyID="MAD">${invoice.subTotalHT.toFixed(2)}</cbc:TaxExclusiveAmount>
        <cbc:TaxInclusiveAmount currencyID="MAD">${invoice.totalTTC.toFixed(2)}</cbc:TaxInclusiveAmount>
        <cbc:PayableAmount currencyID="MAD">${invoice.grandTotal.toFixed(2)}</cbc:PayableAmount>
    </cac:LegalMonetaryTotal>

    <!-- Détail des lignes -->
    ${invoice.items.map((item, index) => `
    <cac:InvoiceLine>
        <cbc:ID>${index + 1}</cbc:ID>
        <cbc:InvoicedQuantity unitCode="UNIT">${item.quantity}</cbc:InvoicedQuantity>
        <cbc:LineExtensionAmount currencyID="MAD">${item.totalHT.toFixed(2)}</cbc:LineExtensionAmount>
        <cac:Item>
            <cbc:Name>Produit ${item.productId}</cbc:Name>
            <cac:ClassifiedTaxCategory>
                <cbc:ID>S</cbc:ID>
                <cbc:Percent>${item.tvaRate}</cbc:Percent>
                <cac:TaxScheme>
                    <cbc:ID>VAT</cbc:ID>
                </cac:TaxScheme>
            </cac:ClassifiedTaxCategory>
        </cac:Item>
        <cac:Price>
            <cbc:PriceAmount currencyID="MAD">${item.unitPriceHT.toFixed(2)}</cbc:PriceAmount>
        </cac:Price>
    </cac:InvoiceLine>`).join('')}
</Invoice>`;

    return xml;
  }

  /**
   * Simule la signature électronique du document
   */
  async signInvoice(xml: string): Promise<string> {
    // Signature numérique XAdES-BES
    return `${xml}\n<!-- DigitalSignature: ${Math.random().toString(36).substring(7)} -->`;
  }
}
