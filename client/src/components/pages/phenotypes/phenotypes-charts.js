import React from 'react';
import { PlotlyWrapper as Plot } from '../../plots/plotly/plotly-wrapper';
import { systemFont } from '../../plots/custom/text';

export const hoverLayout = {
  hoverlabel: {
    bgcolor: '#fff',
    bordercolor: '#bbb',
    font: {
      size: 14,
      color: '#212529',
      family: systemFont
    }
  }
};

let margin = {
  l: 50,
  r: 50,
  b: 50,
  t: 50,
  pad: 4
};

export const opaqueColors = [
  `rgba(23, 118, 182, 1)`,
  `rgba(255, 127, 0, 1)`,
  `rgba(36, 162, 33, 1)`,
  `rgba(216, 36, 31, 1)`,
  `rgba(149, 100, 191, 1)`,
  `rgba(141, 86, 73, 1)`,
  `rgba(229, 116, 195, 1)`,
  `rgba(127, 127, 127, 1)`,
  `rgba(188, 191, 0, 1)`,
  `rgba(0, 190, 209, 1)`
];

export const colors = [
  `rgba(23, 118, 182, 0.2)`,
  `rgba(255, 127, 0, 0.2)`,
  `rgba(36, 162, 33, 0.2)`,
  `rgba(216, 36, 31, 0.2)`,
  `rgba(149, 100, 191, 0.2)`,
  `rgba(141, 86, 73, 0.2)`,
  `rgba(229, 116, 195, 0.2)`,
  `rgba(127, 127, 127, 0.2)`,
  `rgba(188, 191, 0, 0.2)`,
  `rgba(0, 190, 209, 0.2)`
];

const percentFormatter = (value, decimals = 2) => {
  let percent = value.toFixed(decimals).toLocaleString();
  let cutoff = Math.pow(10, -decimals);
  let label = value >= cutoff ? percent : `<${cutoff}`;
  return `${label}%`;
};

export const BarChart = ({
  data,
  categories,
  distributionCategories,
  xTitle,
  yTitle,
  yMax,
  formatPercent,
  categoryPrefix,
  type
}) => (
  <Plot
    className="w-100 disable-x-axis-tooltip override-cursor"
    style={{ minHeight: '600px', width: '600px', minWidth: '500px' }}
    data={categories.map((name, i) => {
      let x = [];
      let y = [];
      for (let key in data) {
        x.push(key);
        y.push(data[key][i]);
      }
      // console.log(name, i, x, y);
      let plotData = {
        x,
        y,
        name,
        type: 'bar',
        marker: {
          color: opaqueColors[i % opaqueColors.length]
        },
        hoverlabel: {
          bgcolor: '#fff',
          bordercolor: opaqueColors[i % opaqueColors.length],
          font: {
            size: 14,
            color: '#444',
            family: systemFont
          }
        },
        // hoverinfo: 'all',
        hovertemplate: formatPercent
          ? [
              type === 'binary'
                ? ``
                : `<b>${categoryPrefix || ''}:</b> ${name}`,
              `<b>${type === 'binary' ? categoryPrefix : xTitle}:</b> %{x}`,
              `<b>Participants:</b> %{y:.3f%}%<extra></extra>`
            ].join('<br>')
          : [
              type === 'binary'
                ? ``
                : `<b>${categoryPrefix || ''}:</b> ${name}`,
              `<b>${type === 'binary' ? categoryPrefix : xTitle}:</b> %{x}`,
              `<b>Participants:</b> %{y}<extra></extra>`
            ].join('<br>')

        // hoverinfo: i === 0 ? 'y' : 'skip',
        // hovertemplate: i === 0 ? '%{text}<extra></extra>' : null,
        // text: i > 0 ? '' : Object.entries(data).map(([key, value]) => {
        //   return [
        //     `<b>${xTitle}</b>: ${key}`,
        //     categories.map((name, i) =>  `<b>${name}</b>: ${
        //       formatPercent ? percentFormatter(value[i]) : value[i].toLocaleString()
        //     }`).join('<br>')
        //   ].join('<br>');
        // })
      };

      if (x.length <= 2 && categories.length <= 2) {
        plotData.width = x.map(e => 0.2);
      }

      return plotData;
    })}
    layout={{
      margin,
      // ...hoverLayout,
      hovermode: 'closest',
      xaxis: {
        fixedrange: true,
        automargin: true,
        title: xTitle,
        separatethousands: true,
        type: 'category',
        categoryorder: 'array',
        categoryarray: distributionCategories
      },
      yaxis: {
        [yMax ? 'range' : '']: [0, yMax],
        fixedrange: true,
        automargin: true,
        title: {
          text: yTitle,
          standoff: 20
        },
        zeroline: true,
        showline: true,
        separatethousands: true
      },
      autosize: true
    }}
    config={{
      displayModeBar: false,
      responsive: true
    }}
  />
);

export const HorizontalBarChart = ({ data, categories }) => (
  <Plot
    className="w-100  disable-x-axis-tooltip"
    style={{ minHeight: '600px', minWidth: '500px' }}
    data={categories.map((name, i) => {
      let x = [],
        y = [];
      for (let key in data) {
        x.push(data[key][i]);
        y.push(key);
      }
      return { x, y, name, type: 'bar', orientation: 'h' };
    })}
    layout={{
      xaxis: { automargin: true },
      yaxis: { automargin: true, zeroline: true },
      // barmode: 'stack',
      autosize: true
    }}
    config={{
      displayModeBar: false,
      responsive: true
    }}
    // onLegendClick={_ => false}
  />
);

export const AreaChart = ({
  data,
  categories,
  xTitle,
  yTitle,
  formatPercent
}) => {
  /*
  let items = categories.map((name, i) => {
    let x = [];
    let y = [];
    for (let key in data) {
        x.push(key);
        y.push(data[key][i]);
    }
    return {x, y}
  })
  */
  //  console.log('drawing area chart', {data, categories, xTitle, yTitle, formatPercent});

  return (
    <Plot
      className="w-100 disable-x-axis-tooltip override-cursor"
      style={{ minHeight: '600px', minWidth: '500px' }}
      data={[
        {
          x: categories, //data.map((e, i) => i + 1),
          y: data,
          hovertemplate: '%{text}<extra></extra>',
          text: categories.map((name, i) => {
            let label = formatPercent
              ? percentFormatter(data[i])
              : data[i].toLocaleString();
            return [
              `<b>${xTitle}</b>: ${name}`,
              `<b>${yTitle}</b>: ${label}`
            ].join('<br>');
          }),
          type: 'scatter',
          fill: 'tonexty',
          line: { shape: 'spline' }
        }
      ]}
      layout={{
        ...hoverLayout,
        margin,
        xaxis: {
          fixedrange: true,
          automargin: true,
          title: xTitle
        },
        yaxis: {
          fixedrange: true,
          automargin: true,
          title: {
            text: yTitle,
            standoff: 20
          },
          zeroline: true,
          showline: true
        },
        autosize: true
      }}
      config={{
        displayModeBar: false,
        responsive: true
      }}
    />
  );
};

export const GroupedAreaChart = ({
  data,
  categories,
  xTitle,
  yTitle,
  fill,
  yMax,
  formatPercent,
  categoryPrefix,
  type
}) => {
  /*
  let items = categories.map((name, i) => {
    let x = [];
    let y = [];
    for (let key in data) {
        x.push(key);
        y.push(data[key][i]);
    }
    return {x, y}
  });
  */
  // console.log('drawing grouped chart', {
  //   data,
  //   categories,
  //   xTitle,
  //   yTitle,
  //   fill,
  //   yMax,
  //   formatPercent,
  //   categoryPrefix,
  //   type
  // });

  if (!yMax) {
    for (let key in data) {
      yMax = Math.max(
        yMax,
        data[key].reduce((acc, curr) => (acc > curr ? acc : curr))
      );
    }
  }

  return (
    <Plot
      className="w-100 disable-x-axis-tooltip override-cursor"
      style={{ minHeight: '600px', width: '600px', minWidth: '500px' }}
      data={categories.map((name, i) => {
        let x = [];
        let y = [];
        for (let key in data) {
          x.push(key);
          y.push(data[key][i]);
        }
        let plotData = {
          x,
          y,
          name,
          type: 'scatter',
          mode: 'none',
          fill: fill ? 'tozeroy' : '',
          fillcolor: colors[i],
          line: { shape: 'spline' },

          hoverlabel: {
            bgcolor: '#fff',
            bordercolor: 'black', //opaqueColors[i % opaqueColors.length],
            font: {
              size: 14,
              color: '#444',
              family: systemFont
            }
          },
          // // hoverinfo: 'all',
          // hovertemplate: formatPercent
          //   ? [
          //     type === 'binary' ? `` : `<b>${categoryPrefix || ''}:</b> ${name}`,
          //     `<b>${type === 'binary' ? categoryPrefix : xTitle}:</b> %{x}`,
          //     `<b>Participants:</b> %{y:.3f%}%<extra></extra>`
          //   ].join('<br>')
          //   : [
          //     type === 'binary'
          //       ? ``
          //       : `<b>${categoryPrefix || ''}:</b> ${name}`,
          //     `<b>${type === 'binary' ? categoryPrefix : xTitle}:</b> %{x}`,
          //     `<b>Participants:</b> %{y}<extra></extra>`
          //   ].join('<br>'),
          hoverinfo: i === 0 ? 'y' : 'skip',
          hovertemplate: i === 0 ? '%{text}<extra></extra>' : null,
          text:
            i > 0
              ? ''
              : Object.entries(data).map(([key, value]) => {
                  if (value.length === 1) {
                    return [
                      `<b>${categoryPrefix}</b>: ${key}`,
                      `<b>Participants</b>: ${
                        formatPercent
                          ? percentFormatter(value[0])
                          : value[0].toLocaleString()
                      }`
                    ].join('<br>');
                  }
                  return [
                    `<b>${xTitle}</b>: ${key}`,
                    categories.length === 1
                      ? `<b>${name}</b>: ${
                          formatPercent
                            ? percentFormatter(value[0])
                            : value[0].toLocaleString()
                        }`
                      : categories
                          .map(
                            (name, i) =>
                              `• <b>${(categoryPrefix === 'Age' &&
                                categoryPrefix) ||
                                ''} ${name}</b>: ${
                                formatPercent
                                  ? percentFormatter(value[i])
                                  : value[i].toLocaleString()
                              }`
                          )
                          .join('<br>')
                  ].join('<br>');
                })
        };

        return plotData;
      })}
      layout={{
        margin,
        ...hoverLayout,
        hovermode: 'x',
        xaxis: {
          type: 'linear',
          fixedrange: true,
          automargin: true,
          title: xTitle,
          separatethousands: true
        },
        yaxis: {
          range: [0, yMax],
          fixedrange: true,
          automargin: true,
          title: {
            text: yTitle,
            standoff: 20
          },
          zeroline: true,
          showline: true,
          separatethousands: true
        },
        autosize: true
      }}
      config={{
        displayModeBar: false,
        responsive: true
      }}
    />
  );
};

export const PieChart = ({ data, categories }) => (
  <Plot
    style={{ minHeight: '600px', maxWidth: '80%', margin: '0 auto' }}
    data={[
      {
        values: data,
        labels: categories,
        hoverinfo: 'label+value+percent',
        hovertemplate: `<b>%{label}</b><br>%{value} participants (%{percent})<extra></extra>`,
        hole: 0.4,
        type: 'pie',
        sort: false,
        direction: 'clockwise'
      }
    ]}
    layout={{
      margin,
      ...hoverLayout,
      showlegend: true,
      autosize: true
    }}
    config={{
      displayModeBar: false,
      responsive: true
    }}
  />
);

export function PhenotypesRelated({ title, relatedData, onClick }) {
  relatedData = relatedData.sort((a, b) => b.correlation - a.correlation);

  const data = [
    {
      x: relatedData.map((e, i) => i + 1),
      y: relatedData.map(e => e.correlation),
      text: relatedData.map(e =>
        [
          `<b>${e.display_name}</b>`,
          `<b>Correlation:</b> ${(+e.correlation || 0).toPrecision(5)}`,
          `<b>Sample Size:</b> ${e.participant_count.toLocaleString()}`
        ].join('<br>')
      ),
      customdata: relatedData,
      hoverinfo: 'text',
      mode: 'markers',
      marker: {
        size: relatedData.map(e => 10 * Math.log(e.participant_count)),
        color: opaqueColors
      },
      hoverlabel: {
        bgcolor: '#fff',
        bordercolor: opaqueColors,
        font: {
          size: 14,
          color: '#212529',
          family: systemFont
        }
      }
    }
  ];

  const layout = {
    // ...hoverLayout,
    title: { text: title },
    showlegend: false,
    xaxis: {
      showticklabels: false,
      zeroline: true,
      fixedrange: true,
      automargin: true
    },
    yaxis: {
      title: 'Correlation',
      showline: true,
      fixedrange: true
    },
    autosize: true
  };

  const config = {
    displayModeBar: false,
    responsive: true
  };

  return (
    <Plot
      onClick={onClick}
      style={{ width: '100%', height: '600px', minWidth: '500px' }}
      data={data}
      layout={layout}
      config={config}
      onLegendClick={_ => false}
    />
  );
}
