import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PhenotypeCorrelationsForm } from '../forms/phenotype-correlations-form';
import { Heatmap } from '../plots/heatmap-plot';
import { Alert, Tabs, Tab, Button } from 'react-bootstrap';
import { PhenotypeCorrelationsSearchCriteria } from '../controls/phenotype-correlations-search-criteria';
import {
  updatePhenotypeCorrelations,
  drawHeatmap
} from '../../services/actions';


export function PhenotypeCorrelations() {
  const dispatch = useDispatch();
  const phenotypeCorrelations = useSelector(
    state => state.phenotypeCorrelations
  );
  const { selectedPhenotypes, selectedGender } = phenotypeCorrelations;

  const { submitted, messages } = phenotypeCorrelations;

  const setSubmitted = submitted => {
    dispatch(updatePhenotypeCorrelations({ submitted }));
  };

  const setMessages = messages => {
    dispatch(updatePhenotypeCorrelations({ messages }));
  };

  const setPopupTooltipData = popupTooltipData => {
    dispatch(updatePhenotypeCorrelations({ popupTooltipData }));
  };

  const clearMessages = e => {
    setMessages([]);
  };

  const setSearchCriteriaPhenotypeCorrelations = searchCriteriaPhenotypeCorrelations => {
    dispatch(
      updatePhenotypeCorrelations({ searchCriteriaPhenotypeCorrelations })
    );
  };

  const placeholder = (
    <div style={{ display: submitted ? 'none' : 'block' }}>
      <p className="h4 text-center text-secondary my-5">
        Please select phenotypes to view this plot
      </p>
    </div>
  );

  const handleChange = () => {
    clearMessages();
    // setSubmitted(null);
  };

  const handleSubmit = params => {
    if (params.length < 2) {
      setMessages([
        {
          type: 'danger',
          content: 'Please select two or more phenotypes.'
        }
      ]);
      return;
    }
    // close sidebar on submit
    // setOpenSidebar(false);
    setSearchCriteriaPhenotypeCorrelations({
      phenotypes: selectedPhenotypes.map(item =>
        item.title ? item.title : item.label
      ),
      gender: selectedGender,
      totalPhenotypes: selectedPhenotypes.length
    });

    setSubmitted(new Date());
    setPopupTooltipData(null);
    console.log('submit');

    dispatch(drawHeatmap(params));
  };

  const handleReset = params => {
    dispatch(
      updatePhenotypeCorrelations({
        selectedListType: 'categorical',
        selectedPhenotypes: [],
        selectedGender: 'combined',
        heatmapData: [],
        heatmapLayout: {},
        results: [],
        loading: false,
        submitted: null,
        messages: [],
        popupTooltipStyle: { display: 'none' },
        popupTooltipData: null,
        searchCriteriaPhenotypeCorrelations: {},
        collapseCriteria: true
      })
    );
  };

  const [openSidebar, setOpenSidebar] = useState(true);

  return (
    <div style={{ position: 'relative' }}>
      <h1 className="d-none">Explore GWAS data - Visualize phenotype correlations</h1>
      <div className={openSidebar ? 'row mx-3' : 'mx-3'}>
        <div className="col-lg-3">
        {/* {openSidebar && ( */}
          <Tabs defaultActiveKey="phenotype-correlations-form"
            style={{display: openSidebar ? 'block' : 'none'}}>
            <Tab
              eventKey="phenotype-correlations-form"
              className="p-2 bg-white tab-pane-bordered rounded-0"
              style={{ minHeight: '100%', display: openSidebar ? 'block' : 'none' }}>
              <PhenotypeCorrelationsForm
                onSubmit={handleSubmit}
                onChange={handleChange}
                onReset={handleReset}
                style={{display: openSidebar ? 'block' : 'none'}}
              />
              {messages &&
                messages.map(({ type, content }) => (
                  <Alert className="mt-3" variant={type} onClose={clearMessages} dismissible>
                    {content}
                  </Alert>
                ))}
            </Tab>
          </Tabs>
          {/* )} */}
          <Button
            className="pt-0 border-0"
            title={openSidebar ? "Hide search panel" : "Show search panel"}
            variant="link"
            style={{
              color: '#008CBA',
              position: 'absolute',
              zIndex: 100,
              top: '0px',
              [openSidebar ? 'right' : 'left']: '-15px'
            }}
            onClick={() => setOpenSidebar(!openSidebar)}
            aria-controls="phenotype-correlations-collapse-input-panel"
            aria-expanded={openSidebar}>
            {openSidebar ? (
              <i className="fas fa-caret-left fa-lg"></i>
            ) : (
              <i className="fas fa-caret-right fa-lg"></i>
            )}
          </Button>
        </div>

        <div className="d-lg-none p-2"></div>

        <div className={openSidebar ? 'col-lg-9' : 'col-lg-12'}>
          <PhenotypeCorrelationsSearchCriteria />

          <Tabs defaultActiveKey="phenotype-correlations">
            <Tab
              eventKey="phenotype-correlations"
              // title="Heatmap"
              className="p-2 bg-white tab-pane-bordered rounded-0"
              style={{ minHeight: '50vh' }}>
              <div
                className="mw-100 my-4"
                style={{ display: submitted ? 'block' : 'none' }}>
                <Heatmap />
              </div>
              {placeholder}
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
