import React, { forwardRef, useState, useEffect, useImperativeHandle } from 'react';
import { Spinner } from 'react-bootstrap';

export const TreeSelect = forwardRef(({
    onChange,
    data,
    value,
    singleSelect,
    submitted
  }, ref) => {

  useImperativeHandle(ref, () => ({
    resetSearchFilter() {
      clearSearchFilter();
      collapseAllParents();
    },
    expandSelectedPhenotype(displayTreeParent) {
      collapseAllParents();
      expandParents(displayTreeParent)
    }
  }));

  const [expandAll, setExpandAll] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [listType, setListType] = useState('categorical');

  const clearSearchFilter = () => {
    setSearchInput('');
    setListType('categorical');
  };

  const containsVal = (arr, val) => {
    let result = false;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].value === val) {
        result = true;
      }
    }
    return result;
  };

  const containsAllVals = (arr, vals) => {
    let result = true;
    for (var i = 0; i < vals.length; i++) {
      if (!containsVal(arr, vals[i].value)) {
        result = false;
      }
    }
    return result;
  };

  const removeVal = (arr, val) => {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].value === val) {
        arr.splice(i, 1);
      }
    }
    return arr;
  };

  const removeAllVals = (arr, vals) => {
    for (var i = 0; i < vals.length; i++) {
      removeVal(arr, vals[i].value);
    }
    return arr;
  };

  const expandParents = (displayTreeParent) => {
    var parents = getParents(displayTreeParent.data);
    parents.push(displayTreeParent.data);
    parents.map((item) => {
      if (document.getElementsByClassName('collapse-button-text-' + item.value)[0]) {
        document.getElementsByClassName('collapse-button-text-' + item.value)[0].click();
      }
    });
  }

  const getParents = (node, parents = []) => {
    data && data.categories.map((item) => {
      item.children.map((child) => {
        if (child.title === node.title && child.value === node.value) {
          parents.push(item)
          getParents(item, parents);
        }
      })
    });
    return parents;
  }

  const getLeafs = (item, node, allLeafs = []) => {
    if (!node.children || node.children.length === 0) {
      allLeafs.push(node);
    } else {
      if (document.getElementsByClassName('parent-checkbox-' + node.value)[0]) {
        document.getElementsByClassName(
          'parent-checkbox-' + node.value
        )[0].checked = true;
      }
      for (var i = 0; i < node.children.length; i++) {
        allLeafs = getLeafs(item, node.children[i], allLeafs);
      }
    }
    return allLeafs;
  };

  const getAllLeafs = item => {
    let allLeafs = [];
    if (item.children && item.children.length > 0) {
      // check if item is parent
      for (var i = 0; i < item.children.length; i++) {
        let child = item.children[i];
        allLeafs = allLeafs.concat(getLeafs(item, child));
      }
    } else {
      // if (!item.parent) {
      // check if item is not parent
      allLeafs.push(item);
      // }
    }
    return allLeafs;
  };

  const toggleExpandAllParents = () => {
    if (!expandAll) {
      for (let i = 0; i < data.categories.length; i++) {
        const className = 'children-of-' + data.categories[i].value;
        if (
          document.getElementsByClassName(className)[0].style.display &&
          document.getElementsByClassName(className)[0].style.display === 'none'
        ) {
          document.getElementsByClassName(className)[0].style.display = 'block';
          const collapseButton = document.getElementsByClassName(
            'collapse-button-text-' + data.categories[i].value
          )[0];
          collapseButton.classList.toggle('fa-plus-square', false);
          collapseButton.classList.toggle('fa-minus-square', true);
        }
      }
      setExpandAll(true);
    } else {
      for (let i = 0; i < data.categories.length; i++) {
        const className = 'children-of-' + data.categories[i].value;
        if (
          document.getElementsByClassName(className)[0].style.display &&
          document.getElementsByClassName(className)[0].style.display ===
            'block'
        ) {
          document.getElementsByClassName(className)[0].style.display = 'none';
          const collapseButton = document.getElementsByClassName(
            'collapse-button-text-' + data.categories[i].value
          )[0];
          collapseButton.classList.toggle('fa-plus-square', true);
          collapseButton.classList.toggle('fa-minus-square', false);
        }
      }
      setExpandAll(false);
    }
  };

  const collapseAllParents = () => {
    if (!data) return;
    for (let i = 0; i < data.categories.length; i++) {
      const className = 'children-of-' + data.categories[i].value;
      if (
        document.getElementsByClassName(className)[0].style.display &&
        document.getElementsByClassName(className)[0].style.display ===
          'block'
      ) {
        document.getElementsByClassName(className)[0].style.display = 'none';
        const collapseButton = document.getElementsByClassName(
          'collapse-button-text-' + data.categories[i].value
        )[0];
        collapseButton.classList.toggle('fa-plus-square', true);
        collapseButton.classList.toggle('fa-minus-square', false);
      }
    }
    setExpandAll(false);
  };

  const toggleHideChildren = name => {
    const className = 'children-of-' + name;
    let node =  document.getElementsByClassName(className)[0];
    if (!node) return true;
    if (
      document.getElementsByClassName(className)[0].style.display &&
      document.getElementsByClassName(className)[0].style.display === 'none'
    ) {
      document.getElementsByClassName(className)[0].style.display = 'block';
      const collapseButton = document.getElementsByClassName(
        'collapse-button-text-' + name
      )[0];
      collapseButton.classList.toggle('fa-plus-square', false);
      collapseButton.classList.toggle('fa-minus-square', true);
    } else {
      document.getElementsByClassName(className)[0].style.display = 'none';
      // return true;
      const collapseButton = document.getElementsByClassName(
        'collapse-button-text-' + name
      )[0];
      collapseButton.classList.toggle('fa-plus-square', true);
      collapseButton.classList.toggle('fa-minus-square', false);
    }
  };

  const checkAllChildrenLeafsSelected = (leafs, selectedValues) => {
    for (var i = 0; i < leafs.length; i++) {
      if (selectedValues.indexOf(leafs[i]) === -1) return false;
    }
    return true;
  };

  const checkSomeChildrenLeafsSelected = (leafs, selectedValues) => {
    return leafs.some(r => selectedValues.indexOf(r) >= 0);
  };

  const checkParents = item => {
    const itemAllLeafs = getAllLeafs(item);
    if (!singleSelect) {
      // multi-select
      const checkAllLeafsSelectedResult = checkAllChildrenLeafsSelected(
        itemAllLeafs.map(obj => obj.value),
        value.map(obj => obj.value)
      );
      if (checkAllLeafsSelectedResult) {
        let checkbox = document.getElementsByClassName(
          'parent-checkbox-' + item.value
        )[0];
        if (checkbox) {
          checkbox.indeterminate = false;
        }
        return true;
      } else {
        const checkSomeLeafsSelectedResult = checkSomeChildrenLeafsSelected(
          itemAllLeafs.map(obj => obj.value),
          value.map(obj => obj.value)
        );
        if (checkSomeLeafsSelectedResult) {
          // show indeterminate checkbox if some (at least one) leaf is selected
          let checkbox = document.getElementsByClassName(
            'parent-checkbox-' + item.value
          )[0];
          if (checkbox) {
            checkbox.indeterminate = true;
          }
          return true;
        } else {
          let checkbox = document.getElementsByClassName(
            'parent-checkbox-' + item.value
          )[0];
          if (checkbox) {
            checkbox.indeterminate = false;
          }
          return false;
        }
      }
    } else {
      // single-select
      if (itemAllLeafs && value) {
        const checkSomeLeafsSelectedResult = checkSomeChildrenLeafsSelected(
          itemAllLeafs.map(obj => obj.value),
          [value].map(obj => obj.value)
        );
        if (checkSomeLeafsSelectedResult) {
          // show indeterminate checkbox if some (at least one) leaf is selected
          let checkbox = document.getElementsByClassName(
            'parent-checkbox-' + item.value
          )[0];
          if (checkbox) {
            checkbox.indeterminate = true;
          }
          return false;
        } else {
          let checkbox = document.getElementsByClassName(
            'parent-checkbox-' + item.value
          )[0];
          if (checkbox) {
            checkbox.indeterminate = false;
          }
          return false;
        }
      } else {
        let checkbox = document.getElementsByClassName(
          'parent-checkbox-' + item.value
        )[0];
        if (checkbox) {
          checkbox.indeterminate = false;
        }
        return false;
      }
    }
  };

  const handleSelect = item => {
    if (singleSelect) {
      onChange([item]);
    } else {
      const parentCheckboxClassName = 'parent-checkbox-' + item.value;
      // const leafCheckboxClassName = "leaf-checkbox-" + item.value;
      let values = [...value];
      let newValues = getAllLeafs(item);
      if (containsAllVals(values, newValues)) {
        // remove all leafs if parent is clicked and all leafs were already selected
        values = removeAllVals(values, newValues);
        if (document.getElementsByClassName(parentCheckboxClassName)[0]) {
          // console.log(document.getElementsByClassName(parentCheckboxClassName));
          document.getElementsByClassName(
            parentCheckboxClassName
          )[0].checked = false;
        }
        for (let i = 0; i < newValues.length; i++) {
          if (
            document.getElementsByClassName(
              'leaf-checkbox-' + newValues[i].value
            )[0]
          ) {
            document.getElementsByClassName(
              'leaf-checkbox-' + newValues[i].value
            )[0].checked = false;
          }
        }
      } else {
        if (
          document.getElementsByClassName('children-of-' + item.value) &&
          document.getElementsByClassName('children-of-' + item.value)[0] &&
          document.getElementsByClassName('children-of-' + item.value)[0].style.display &&
          document.getElementsByClassName('children-of-' + item.value)[0].style.display === 'none'
        ) {
          toggleHideChildren(item.value);
        }
        for (let i = 0; i < newValues.length; i++) {
          if (!containsVal(values, newValues[i].value)) {
            // only add if value did not exist before
            values.push(newValues[i]);
            if (document.getElementsByClassName(parentCheckboxClassName)[0]) {
              // console.log(document.getElementsByClassName(parentCheckboxClassName));
              document.getElementsByClassName(
                parentCheckboxClassName
              )[0].checked = true;
            }
            if (
              document.getElementsByClassName(
                'leaf-checkbox-' + newValues[i].value
              )[0]
            ) {
              document.getElementsByClassName(
                'leaf-checkbox-' + newValues[i].value
              )[0].checked = true;
            }
          } else {
            // remove if new selected leaf was already selected
            if (newValues.length === 1) {
              values = removeVal(values, newValues[i].value);
            }
          }
        }
      }

      onChange(values);
    }
  };

  const selectTreeCategorical = data =>
    data.map(item => {
      if (item.children && item.children.length > 0) {
        return (
          // PARENT
          <div key={'categorical-parent-' + item.value}>
            <li className="my-1" style={{ display: 'block' }}>
              <div className="d-flex align-items-center">
                <button
                  title={"Show/hide " + item.title + " phenotypes"}
                  style={{ all: 'unset' }}
                  className="collapse-button text-secondary"
                  onClick={e => toggleHideChildren(item.value)}
                  // disabled={submitted}
                  >
                  <i className={"fa fa-plus-square collapse-button-text-" + item.value}></i>
                </button>

                <div
                  className="mx-1"
                  style={{
                    display: 'inline-block',
                    borderLeft: '1px solid white',
                    height: '10px'
                  }}
                />

                <input
                  title={
                    singleSelect
                      ? 'Only one phenotype can be selected'
                      : 'Select/deselect all ' + item.title + ' phenotypes'
                  }
                  style={{
                    verticalAlign: 'middle',
                    alignSelf: 'center',
                    cursor: submitted || singleSelect ? 'not-allowed' : 'pointer'
                  }}
                  className={'parent-checkbox-' + item.value}
                  name={'parent-checkbox-' + item.value}
                  type="checkbox"
                  // checked={ !singleSelect && value && value.length > 0 && containsAllVals(getAllLeafs(item), value)}
                  checked={checkParents(item)}
                  onChange={e => handleSelect(item)}
                  disabled={submitted || singleSelect ? true : false}
                />

                <div
                  className="ml-1"
                  style={{
                    display: 'inline-block',
                    borderLeft: '1px solid white',
                    height: '10px'
                  }}
                />

                <button
                  title={singleSelect? "Show/hide " + item.title + " phenotypes" : 'Select/deselect all ' + item.title + ' phenotypes'}
                  className="ml-1"
                  style={{
                    all: 'unset',
                    cursor: submitted ? 'not-allowed' : 'pointer',
                    // cursor: singleSelect ? 'not-allowed' : 'pointer',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
                  }}
                  onClick={e => singleSelect ? toggleHideChildren(item.value) : handleSelect(item)}
                  // disabled={singleSelect}
                  disabled={submitted}
                  >
                  {item.title}
                </button>
              </div>

              <ul
                className={'ml-3 pl-1 children-of-' + item.value}
                style={{ listStyleType: 'none', display: 'none' }}>
                {selectTreeCategorical(item.children)}
              </ul>
            </li>
          </div>
        );
      } else {
        return (
          // LEAF
          <li
            key={'categorical-leaf-' + item.value}
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden'
            }}>
            <div
              className="ml-3"
              style={{
                display: 'inline-block',
                borderLeft: '1px solid white',
                height: '10px'
              }}
            />
            <input
              title={singleSelect ? "Select phenotype" : "Select/deselect phenotype"}
              style={{ cursor: submitted ? 'not-allowed' : 'pointer' }}
              className={'ml-1 leaf-checkbox-' + item.value}
              name={'leaf-checkbox-' + item.value}
              type="checkbox"
              // type={singleSelect ? 'radio' : 'checkbox'}
              checked={
                (singleSelect && value && value.value === item.value) ||
                (!singleSelect &&
                  value.map(item => item.value).includes(item.value))
              }
              onChange={e => handleSelect(item)}
              disabled={submitted}
            />

            <div
              className="ml-1"
              style={{
                display: 'inline-block',
                borderLeft: '1px solid white',
                height: '10px'
              }}
            />

            <button
              title={item.title}
              className="ml-1"
              style={{
                all: 'unset',
                cursor: submitted ? 'not-allowed' : 'pointer',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                width: '65%'
              }}
              onClick={e => handleSelect(item)}
              disabled={submitted}>
              {item.title}
            </button>
          </li>
        );
      }
    });

  const selectTreeAlphabetical = () => {
    const stringMatch = item => {
      // console.log("searchInput", searchInput);
      let re1 = new RegExp(/[()~`!#$%\^&*+=\[\]\\;,/{}|\\":<>\?]/, 'gi');
      if (!re1.test(searchInput)) {
        let re2 = new RegExp(searchInput, 'gi');
        return item.title.match(re2);
      }
    };
    const dataAlphabeticalFiltered = data.flat.filter(stringMatch);
    if (dataAlphabeticalFiltered && dataAlphabeticalFiltered.length > 0) {
      return dataAlphabeticalFiltered.map(item => (
        <div
          key={'alpha-' + item.value}
          className="my-1"
          style={{
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
          }}>
          <input
            title="Select phenotype"
            style={{ cursor: 'pointer' }}
            className={'ml-0 leaf-checkbox-' + item.value}
            name={'leaf-checkbox-' + item.value}
            type="checkbox"
            checked={
              (singleSelect && value && value.value === item.value) ||
              (!singleSelect &&
                value.map(item => item.value).includes(item.value))
            }
            onChange={e => handleSelect(item)}
            disabled={submitted}
          />

          <button
            title={item.title}
            className="ml-2"
            style={{
              all: 'unset',
              cursor: 'pointer',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden'
            }}
            onClick={e => handleSelect(item)}
            disabled={submitted}>
            {/* {item.title.replace(searchInput, '[' + searchInput + ']')} */}
            {item.title.slice(
              0,
              item.title.toLowerCase().indexOf(searchInput.toLowerCase())
            )}
            <b>
              {item.title.slice(
                item.title.toLowerCase().indexOf(searchInput.toLowerCase()),
                item.title.toLowerCase().indexOf(searchInput.toLowerCase()) +
                  searchInput.length
              )}
            </b>
            {item.title.slice(
              item.title.toLowerCase().indexOf(searchInput.toLowerCase()) +
                searchInput.length,
              item.title.length
            )}
          </button>
        </div>
      ));
    } else {
      return <div className="p-2">No phenotypes found.</div>;
    }
  };

  const selectAll = () => {
    if (!data) return;
    if (checkAllLeafsSelected()) {
      onChange([]);
    } else {
      const allLeafs = [];
      data.tree.map(item => allLeafs.push(getAllLeafs(item)));
      onChange(allLeafs.flat());
    }
  };

  const checkAllLeafsSelected = () => {
    if (!data) return;
    let allLeafs = [];
    data.tree.map(item => allLeafs.push(getAllLeafs(item)));
    allLeafs = allLeafs.flat().map(item => item.value);
    for (var i = 0; i < allLeafs.length; i++) {
      if (value.map(item => item.value).indexOf(allLeafs[i]) === -1)
        return false;
    }
    return true;
  };

  return (
    <>
      <div
        className="border"
        style={{
          // textOverflow: 'ellipsis',
          // overflowY: 'auto',
          // overflowX: 'hidden',
          // whiteSpace: 'nowrap',
          // maxHeight: '250px',
          borderColor: '#dee2e6',
          fontSize: '10pt'
        }}>
        <div className="bg-secondary border-bottom d-flex align-items-center py-1">
          {listType === 'categorical' && (
            <>
              <button
                title={expandAll ? "Hide all phenotypes" : "Show all phenotypes"}
                style={{ all: 'unset' }}
                className="ml-1 collapse-button-all text-secondary"
                onClick={e => toggleExpandAllParents()}
                disabled={!data}>
                {expandAll && (
                  <i className="fa fa-minus-square" style={{cursor: !data ? 'not-allowed' : 'pointer'}}></i>
                )}
                {!expandAll && (
                  <i className="fa fa-plus-square" style={{cursor: !data ? 'not-allowed' : 'pointer'}}></i>
                )}
              </button>

              <div
                className="mx-1"
                style={{
                  display: 'inline-block',
                  borderLeft: '1px solid #c7cbcf',
                  height: '25px'
                }}
              />
            </>
          )}

          <input
            title={singleSelect ? 'Only one phenotype can be selected' : 'Select/deselect all'}
            style={{ cursor: singleSelect || !data ? 'not-allowed' : 'pointer' }}
            className={listType === 'alphabetical' ? 'ml-1' : ''}
            name=""
            type="checkbox"
            disabled={submitted || singleSelect || !data ? true : false}
            checked={!singleSelect && checkAllLeafsSelected()}
            onChange={e => !singleSelect && selectAll()}
          />

          <div
            className="ml-1"
            style={{
              display: 'inline-block',
              borderLeft: '1px solid #c7cbcf',
              height: '25px'
            }}
          />

          <div className="px-2 input-group" style={{ width: '100%' }}>
            <input
              className="form-control py-1 h-100 border-right-0"
              style={{ display: 'block' }}
              title="Search Phenotype"
              placeholder="Search Phenotype"
              aria-label="Search Phenotype"
              value={searchInput}
              onChange={e => {
                setSearchInput(e.target.value);
                if (e.target.value && e.target.value.length > 0) {
                  setListType('alphabetical');
                } else {
                  setListType('categorical');
                }
              }}
              type="text"
              disabled={!data || submitted}
            />
            <div className="input-group-append">
              {searchInput.length > 0 ? (
                <button
                  className="input-group-text bg-white"
                  title="Clear to go back to categorical view"
                  onClick={e => {
                    clearSearchFilter();
                  }}
                  // disabled={submitted}
                  >
                  <i className="fa fa-times" style={{fontSize: '14px'}}></i>
                </button>
              ) : (
                <button className="input-group-text bg-white" disabled>
                  <i className="fa fa-search" style={{fontSize: '14px'}}></i>
                </button>
              )}
            </div>
          </div>
        </div>
        {
          !data &&
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ 
              // display: !data ? 'block' : 'none',
              minHeight: '250px',
              maxHeight: '500px'
            }}>
            {!data && 
              <Spinner animation="border" variant="primary" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            }
          </div>
        }

        <ul
          className="pl-0 ml-1 mr-0 my-0"
          style={{
            display: data ? 'block' : 'none',
            listStyleType: 'none',
            textOverflow: 'ellipsis',
            overflowY: 'auto',
            overflowX: 'hidden',
            whiteSpace: 'nowrap',
            minHeight: '250px',
            maxHeight: '500px',
            fontSize: '10pt'
          }}>
          <span
            style={{ display: listType === 'categorical' ? 'block' : 'none' }}>
            {data && selectTreeCategorical(data.tree)}
          </span>
          <span
            style={{ display: listType === 'categorical' ? 'none' : 'block' }}>
            {data && selectTreeAlphabetical()}
          </span>
          
        </ul>
      </div>
    </>
  );
});
