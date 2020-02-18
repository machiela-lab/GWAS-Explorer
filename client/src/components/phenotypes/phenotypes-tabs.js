import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tab, Tabs, Form } from 'react-bootstrap';
import Plot from 'react-plotly.js';
import { updateBrowsePhenotypes } from '../../services/actions';
import { PhenotypesRelated } from './phenotypes-related'
import { BarChart, PieChart, HorizontalBarChart } from './phenotypes-charts';

export function PhenotypesTabs() {
  const dispatch = useDispatch();
  const {
    selectedPhenotype,
    // submitted,
    selectedPlot,
    phenotypeType,
    phenotypeData,
  } = useSelector(state => state.browsePhenotypes);

  const [
    selectedDistribution,
    setSelectedDistribution
  ] = useState('age');

  const setSelectedPlot = selectedPlot => {
    dispatch(updateBrowsePhenotypes({ selectedPlot }));
  };

  const titleCase = str => str.split(/\s+/g)
    .map(word => word[0].toUpperCase() + word.substr(1).toLowerCase())
    .join(' ');

  return (
    <Tabs
      className="mt-2"
      defaultActiveKey={selectedPlot}
      onSelect={setSelectedPlot}>

      <Tab
        eventKey="frequency"
        title="Frequency"
        className="p-4 bg-white tab-pane-bordered rounded-0"
        style={{ minHeight: '600px', textAlign: 'center' }}>
        <PieChart
                data={phenotypeData.frequency}
                categories={phenotypeData.categories} />
      </Tab>

      <Tab
        eventKey="distribution"
        title="Distribution"
        className="p-4 bg-white tab-pane-bordered rounded-0"
        style={{ minHeight: '50vh' }}>
          <div className="m-2">{[
            {label: 'Age', value: 'age'},
            {label: 'Gender', value: 'gender'},
            {label: 'Ancestry', value: 'ancestry'},
          ].map((e, i) =>
            <Form.Check
              custom
              inline
              label={e.label}
              className="font-weight-normal cursor-pointer mr-4"
              onChange={e => setSelectedDistribution(e.target.value)}
              checked={selectedDistribution == e.value}
              value={e.value}
              type="radio"
              id={`select-distribution-${e.value}`}
            />
          )}</div>


          <BarChart
              data={phenotypeData.distribution[selectedDistribution]}
              categories={phenotypeData.distributionCategories}
              xTitle={titleCase(selectedDistribution)}
              yTitle="Number of Cases"
          />
      </Tab>
      <Tab
        eventKey="related-phenotypes"
        title="Related Phenotypes"
        className="p-4 bg-white tab-pane-bordered rounded-0"
        style={{ minHeight: '50vh' }}>
        <PhenotypesRelated
          selectedPhenotype={selectedPhenotype}
          phenotypeType={phenotypeType}
          relatedData={phenotypeData.related}
        />
      </Tab>

    </Tabs>
  );
}