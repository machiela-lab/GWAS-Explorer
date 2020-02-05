import React from 'react';
import Plot from 'react-plotly.js';

export function PhenotypesAge({
  selectedPhenotype,
  phenotypeType,
  option,
  ageData,
}) {
  let x = [];
  let y = [];

  for (let key in ageData) {
    x.push(key);
    y.push(ageData[key]);
  }

  const data = [{
    x: x,
    y: y,
    type: 'bar'
  }];

  const layout = {
    title: `Distribution of ${selectedPhenotype.title} by Age`,
  };

  const config = {
    // responsive: true,
  }

  return (
    <div className="m-2  text-center">
        <Plot
          // className="w-100"
          data={data}
          layout={layout}
          config={config}
          onLegendClick={_ => false}
        />
    </div>
  );
}
