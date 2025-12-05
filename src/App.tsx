import { useState } from 'react';
import DataWorksheet from './components/DataWorksheet';
import PivotControls from './components/PivotControls';
import PivotTableWorksheet from './components/PivotTableWorksheet';
import type { PivotConfig } from './components/PivotControls';
import type { jspreadsheet } from '@jspreadsheet/react';
import { sampleData } from './data/sampleData';
import './App.css';

function App() {
  const [currentData, setCurrentData] = useState<(string | number)[][]>(sampleData);
  const [pivotConfig, setPivotConfig] = useState<PivotConfig>({
    groupBy1: 'Category',
    groupBy2: 'Subcategory',
    aggregateColumn: 'Sales',
  });
  const [dataInstance, setDataInstance] = useState<jspreadsheet.worksheetInstance | null>(null);

  const handleConfigChange = (config: PivotConfig) => {
    setPivotConfig(config);

    console.log('handleConfigChange', config);
    console.log('dataInstance', dataInstance);
    // Get current data from the data worksheet
    if (dataInstance && typeof dataInstance.getData === 'function') {
      const freshData = dataInstance.getData() as unknown;
      const normalized = Array.isArray(freshData)
        ? (freshData as (string | number)[][])
        : [];
      setCurrentData(normalized);
    }
  };

  const handleDataInstanceReady = (instance: jspreadsheet.worksheetInstance) => {
    setDataInstance(instance);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>React + Vite Pivot Table Challenge</h1>
        <p>Interactive pivot table using Jspreadsheet</p>
      </header>

      <main className="app-main">
        <section className="controls-section">
          <PivotControls onConfigChange={handleConfigChange} />
        </section>

        <div className="worksheets-container">
          {/* <section className="worksheet-section"> */}
          <DataWorksheet
            onInstanceReady={handleDataInstanceReady}
            onDataChange={setCurrentData}
          />
          {/* </section> */}

          {/* <section className="worksheet-section"> */}
          <PivotTableWorksheet
            key={JSON.stringify(pivotConfig)}
            sourceData={currentData}
            config={pivotConfig}
          />
          {/* </section> */}
        </div>
      </main>
    </div>
  );
}

export default App;
