import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateVariantLookup } from '../../services/actions';
import { Tab, Tabs, Button } from 'react-bootstrap';


export const VariantLookupSearchCriteria = props => {
  const dispatch = useDispatch();
  const { 
    searchCriteriaVariantLookup, 
    numResults,
    collapseCriteria
  } = useSelector(state => state.variantLookup);

  const setCollapseCriteria = collapseCriteria => {
    dispatch(updateVariantLookup({ collapseCriteria }));
  };

  const toggleCollapseCriteria = () => {
    if (collapseCriteria) {
      setCollapseCriteria(false);
    } else {
      setCollapseCriteria(true);
    }
  };

  const CollapseCaret = () => {
    if (!collapseCriteria && searchCriteriaVariantLookup.phenotypes) {
      return <i className="fa fa-caret-down fa-lg"></i>;
    } else {
      return <i className="fa fa-caret-right fa-lg"></i>;
    }
  };

  const displayGender = gender =>
    ({
      all: 'All',
      combined: 'All',
      stacked: 'Female/Male (Stacked)',
      female: 'Female',
      male: 'Male'
    }[gender]);

  return (
    <div className="mb-2">
      <Tabs 
        transition={false}
        className="" 
        defaultActiveKey="variant-lookup-search-criteria">
        <Tab
          eventKey="variant-lookup-search-criteria"
          className="d-flex justify-content-between px-3 py-2 bg-white tab-pane-bordered rounded-0">
          <div className="row left py-1">
            <div className="col-md-auto pr-0">
              <span className="mr-1">
                <Button
                  className="p-0"
                  title="Expand/collapse search criteria panel"
                  style={{
                    color: searchCriteriaVariantLookup.phenotypes
                      ? '#008CBA'
                      : ''
                  }}
                  variant="link"
                  onClick={e => toggleCollapseCriteria()}
                  aria-controls="search-criteria-collapse-panel"
                  aria-expanded={!collapseCriteria}
                  disabled={!searchCriteriaVariantLookup.phenotypes || searchCriteriaVariantLookup.phenotypes.length < 2}>
                  <CollapseCaret />
                </Button>
              </span>
              <span>
                {/* <b>Phenotypes(</b>
                {searchCriteriaVariantLookup.phenotypes
                  ? searchCriteriaVariantLookup.phenotypes.length
                  : 0}
                <b>)</b>: */}
                <b>Phenotypes:</b>
              </span>
            </div>
            <div
              className="col-md-auto ml-1 pl-0"
              // style={{ maxHeight: '300px', overflow: 'none' }}
              >
              {collapseCriteria && (
                <>
                  <span>
                    {searchCriteriaVariantLookup &&
                    searchCriteriaVariantLookup.phenotypes && searchCriteriaVariantLookup.phenotypes.length >= 1
                      ? searchCriteriaVariantLookup.phenotypes[0]
                      : 'None'}
                  </span>
                  <span className="ml-1">
                    {searchCriteriaVariantLookup &&
                    searchCriteriaVariantLookup.phenotypes &&
                    searchCriteriaVariantLookup.phenotypes.length > 1 ? (
                      <span>and</span>
                    ) : (
                      <></>
                    )}
                    <button
                      className="ml-1 p-0 text-primary"
                      style={{
                        all: 'unset',
                        textDecoration: 'underline',
                        cursor: 'pointer'
                      }}
                      title="Expand/collapse search criteria panel"
                      onClick={e => toggleCollapseCriteria()}
                      aria-controls="search-criteria-collapse-panel"
                      aria-expanded={!collapseCriteria}>
                      <span style={{ color: '#008CBA' }}>
                        {searchCriteriaVariantLookup &&
                        searchCriteriaVariantLookup.phenotypes &&
                        searchCriteriaVariantLookup.phenotypes.length > 1
                          ? searchCriteriaVariantLookup.phenotypes.length -
                            1 +
                            ` other${
                              searchCriteriaVariantLookup.phenotypes.length -
                                1 ===
                              1
                                ? ''
                                : 's'
                            }`
                          : ''}
                      </span>
                    </button>
                  </span>
                </>
              )}
              {!collapseCriteria &&
                searchCriteriaVariantLookup &&
                searchCriteriaVariantLookup.phenotypes &&
                searchCriteriaVariantLookup.phenotypes.map(phenotype => (
                  <div title={phenotype}>
                    {phenotype.length < 50 ? phenotype : phenotype.substring(0, 47) + "..." }
                  </div>
                ))}
            </div>

            <div className="col-md-auto border-left border-secondary">
              <span>
                <b>Variant</b>:{' '}
              </span>
              {searchCriteriaVariantLookup &&
              searchCriteriaVariantLookup.variant
                ? searchCriteriaVariantLookup.variant.includes('rs') 
                  ? <a 
                    href={'https://www.ncbi.nlm.nih.gov/snp/' + searchCriteriaVariantLookup.variant} 
                    target="_blank" 
                    style={{
                      textDecoration: 'underline',
                    }}>
                      {searchCriteriaVariantLookup.variant}
                    </a> 
                  : <span>{searchCriteriaVariantLookup.variant}</span>
                : 'None'}
            </div>
            <div className="col-md-auto border-left border-secondary">
              <span>
                <b>Sex</b>:{' '}
              </span>
              {searchCriteriaVariantLookup && searchCriteriaVariantLookup.gender
                ? displayGender(searchCriteriaVariantLookup.gender)
                : 'None'}
            </div>
          </div>

          <div className="right py-1">
            <b><span>Total Phenotypes: </span></b>
            {
              searchCriteriaVariantLookup.phenotypes
              ? searchCriteriaVariantLookup.phenotypes.length
              : "None"
            }

            <b><span className="ml-3">Total Results: </span></b>
            {searchCriteriaVariantLookup && numResults ? numResults : 'None'}
            
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};