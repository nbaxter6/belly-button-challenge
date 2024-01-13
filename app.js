// This code will read in the json file containing the data bacteria samples, create a functional dropdown menu to toggle between different samples, create a bar graph, and a buttle chart. 

//this section initiates the init() function
function init() {
  let selector = d3.select("#selDataset"); //selecting the dropdown menu from the html
//reading in the json file
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    let sampleNames = data.names;
//populating the dropdown menu with each sample's ID with the property of each sampleID being the sample values. 
    for (let i = 0; i < sampleNames.length; i++){
      selector
        .append("option")
        .text(sampleNames[i])
        .property("value", sampleNames[i]);
    };
//when the page is first loaded, the demographics panel, bar graph, and bubble chart will load with the first sample in the dropdown menu list.
    let firstSample = sampleNames[0];
    buildPlots(firstSample);
    demoInfo(firstSample);
  });
}

//this section will build and stylize the demophraghics panel
function demoInfo(sample) {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    let metadata = data.metadata;
    
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];
    
    let PANEL = d3.select("#sample-metadata"); //selecting the sample metadata from the html to populate the demo panel
    PANEL.html(""); //clearing any standard formatting

    PANEL.style("border-color", "2px solid #5aaefa"); //placing this line outside the loop will create a boarder around all the data instead of around each value.
//for loop to stylize the text color, font, and font size, as well as set to uppercase.
    for (key in result){
      PANEL.append("h6")
          .style("color","black")
          .style("font-family", "'Raleway', sans-serif")
          .style("font-size", "14px")
          .text(`${key.toUpperCase()}: ${result[key]}`);
    };

    let heading = d3.select(".panel-heading"); //selecting the panel heading of the demo panel to apply styles to the entire panel.
    heading.html(""); //clearing pre-existing formatting
    heading.style("border", "2px solid #5aaefa");
    heading.style("background-color", "#5aaefa");
    heading.append("h4")
          .style("color","while")
          .style("font-family", "'Raleway', sans-serif")
          .style("font-size", "20px")
          .style("text-align", "center")
          .text(`Demographics`);
  });
}

//this section will build and populate the bar graph and bubble chart for each sample.
//code for the bar graph was integrated from Plotly Graphing Libraries sample code; https://plotly.com/javascript/bar-charts/
//code for the bubble chart was integrated from Plotly Graphing Libraries sample code; https://plotly.com/javascript/bubble-charts/
function buildPlots(sample) {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    let samples = data.samples;
    let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];

    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;

////BAR GRAPPH////
  var barData = {
    x: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
    y: sample_values.slice(0, 10).reverse(),
    type: 'bar',
    text: otu_labels.slice(0, 10).reverse(),
    marker: {
      color: 'rgb(122,86,224)'
    }
  };

  var data = [barData];

  var barLayout = {
    title: 'Top 10 Bacteria Cultures Found',
    margin: { t: 30, l: 150 },
    font:{
      family: 'Raleway, sans-serif'
    },
    showlegend: false,
    xaxis: {
      tickangle: -45
    },
    yaxis: {
      zeroline: false,
      gridwidth: 2
    },
    bargap :0.05,
    width: 800,
    height: 400
  };

  Plotly.newPlot('bar', data, barLayout);

//////BUBBLE GRAPH//////

  var bubbleData = {
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: 'markers',
    marker: {
      color: otu_ids,
      size: sample_values,
      colorscale: [[0.0 ,'#7a56e0'],
        [0.25,'#3f2685'],
        [0.5,'#5aaefa'],
        [0.75,'#0d6b79'],
        [1.0,'#5ebbc9']],
      type: 'heatmap'
    }
  };

  var data = [bubbleData];

  var bubbleLayout = {
    title: 'Bacteria Cultures Per Sample',
    margin:  { t: 0 },
    showlegend: false,
    hovermode: "closest",
    xaxis: { title: "OTU ID" },
    margin:  { t: 30 }
  
  };

  Plotly.newPlot('bubble', data, bubbleLayout);
    });
}

function optionChanged(newSample) {
  buildPlots(newSample);
  demoInfo(newSample);
}

// Initialize
init();