const { FiscalEngine } = require('./shared/fiscal-engine');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    status: 'ERP Maroc 2026 Online', 
    engine: 'Fiscal V1.0.0',
    compliance: 'DGI 2026'
  });
});

// Test rapide du moteur fiscal pour vérifier que tout fonctionne sur le serveur
app.get('/test-fiscal', (req, res) => {
  const result = FiscalEngine.calculatePayroll({
    baseSalary: 10000,
    overtime: 0,
    bonuses: 0,
    allowances: 0,
    maritalStatus: 'single',
    childrenCount: 0
  });
  res.json(result);
});

app.listen(port, () => {
  console.log(`ERP Backend running on port ${port}`);
});
