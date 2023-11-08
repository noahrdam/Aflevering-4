const w = 1200;
const h = 600;
const padding = 20;
const axisPadding = 70;

const dataset = [
    [4.5, 1000, "Greatest hits"],
    [4.2, 800, "Wild Cherry"],
    [4.6, 1200, "Meteora"],
    [4.4, 950, "Top Gun - Motion Picture Soundtrack"],
    [4.3, 980, "Hjertestarter - Bonus Edition"],
    [4.2, 900, "USADSB"],
    [4.5, 1100, "Joyride"],
    [4.6, 1180, "Slippery When Wet"],
    [4.4, 1020, "Crazy World"],
    [4.8, 1350, "The Razors Edge"],
    [4.2, 1200, "Electric Dreams"],
    [4.5, 1500, "Epic Jams"],
    [4.7, 2800, "Electric Symphony"],
    [4.9, 2600, "Lost in Time"],
    [4.6, 2200, "Summer Vibes"]
]

const svg = d3.select("body").append("svg").attr("width", w).attr("height", h);

let yScale = null;
let xScale = null;

let xAxis = null;
let yAxis = null;

init(dataset, false);

d3.selectAll("#sortByRating, #sortByName, #sortByFavorites").on(
  "click",
  function (e) {
    let id = e.target.id;
    console.log(id);
    let isFastest = false;
    if (id === "sortByFavorites") {
      isFastest = true;
    }
    sortData(id);
    console.log("Sorted data by " + id + " : ", dataset);
    animateData(dataset, isFastest);
  }
);

function init(dataset, isFastest) {
  setUp(dataset, isFastest);
  createDefaultChart(dataset);
  addAxes();
}

function setUp(dataset, isFastest) {
  yScale = createScaleY(dataset);
  xScale = createScaleX(dataset);
  xAxis = createAxisX(xScale, isFastest);
  yAxis = createAxisY(yScale);
}

function createDefaultChart(dataset) {
  svg
    .selectAll("rect")
    .data(dataset, function (d) {
      return d[2];
    })
    .enter()
    .append("rect")
    .attr("x", function (d, i) {
      console.log(d);
      return i * dataset.length;
    })
    .attr("x", function (d, i) {
      return xScale(i) + padding;
    })
    .attr("y", function (d) {
      return yScale(d[1]);
    })
    .attr(
      "width",
      w / dataset.length - 2 * padding - (2 * axisPadding) / dataset.length
    )
    .attr("height", function (d) {
      console.log("height: " + (yScale(d[1]) - axisPadding));
      return h - padding - axisPadding - yScale(d[1]);
    })
    .attr("fill", function (d) {
      return "rgb(0, 0, " + (256 - d[0]) + ")";
    });
}

function createScaleX(dataset) {
  return (
    d3
      .scaleBand()
      .range([padding + axisPadding, w - padding - axisPadding])
      .domain(
        dataset.map(function (d, i) {
          return i;
        })
      )
  );
}

function createScaleY(dataset) {
  return d3
    .scaleLinear()
    .domain([
      0,
      d3.max(dataset, function (d) {
        return d[1];
      }),
    ])
    .range([h - padding - axisPadding, padding + axisPadding])
    .nice();
}

function createAxisY(yScale) {
  return d3.axisLeft().scale(yScale).ticks(5);
}

function createAxisX(xScale, isFastest) {
  return (
    d3
      .axisBottom()
      .scale(xScale)
      .tickFormat(function (d) {
        while (d < dataset.length) {
          if (isFastest) {
            return dataset[d][2];
          } else {
            return dataset[d][1];
          }
        }
      })
  );
}

function addAxes() {
  svg
    .append("g")
    .attr("transform", "translate(0," + (h - padding - axisPadding) + ")")
    .attr("id", "xAxis");

  svg
    .append("g")
    .attr("transform", "translate(" + (padding + axisPadding) + ",0)")
    .attr("id", "yAxis")
    .call(yAxis);
  formatAxisX();
}

function formatAxisX() {
  svg
    .select("#xAxis")
    .call(xAxis)
    .call(xAxis.tickSize(0))
    .selectAll("text")
    .attr("transform", "translate(-10,5)rotate(-45)")
    .style("text-anchor", "end");
}

function animateData(data, isFastest) {
  setUp(data, isFastest);
  formatAxisX();
  svg
    .selectAll("rect")
    .data(data, function (d) {
      return d[2];
    })
    .transition()
    .duration(2000)
    .attr("x", function (d, i) {
      return xScale(i) + padding;
    });

}


function sortData(by) {
  if (by === "sortByRating") {
    dataset.sort(function (a, b) {
      return a[0] - b[0];
    });
  } else if (by === "sortByName") {
    dataset.sort(function (a, b) {
      return new Date(a[2]) - new Date(b[2]);
    });
  } else {
    dataset.sort(function (a, b) {
      return a[1] - b[1];
    });
  }
}

