const INFINITY = Number.POSITIVE_INFINITY;
//
function runJohnsonAlgorithm() {
  // Read input matrix from HTML table
  const table = document.getElementById('matrix-input');
  const rows = table.rows;
  const numVertices = rows.length - 1;
  const graph = [];

  for (let i = 1; i <= numVertices; i++) {
    const vertex = [];
    for (let j = 1; j <= numVertices; j++) {
      const weight = parseInt(rows[i].cells[j].children[0].value);
      vertex.push(weight === 9999 ? INFINITY : weight);
    }
    graph.push(vertex);
  }

  const result = johnsonsAlgorithm(graph);

  // Display result in HTML table
  const resultContainer = document.getElementById('result-container');
  resultContainer.innerHTML = '';

  const distanceMatrix = result.distanceMatrix;
  const directedGraphMatrix = result.directedGraphMatrix;

  createMatrixTable(distanceMatrix, 'Shortest Paths Matrix', resultContainer);
  createMatrixTable(directedGraphMatrix, 'Directed Graph Matrix', resultContainer);

  drawGraph(graph);
}

function createMatrixTable(matrix, title, container) {
  const table = document.createElement('table');
  table.classList.add('result-table');
  const caption = document.createElement('caption');
  caption.classList.add('result-title');
  caption.textContent = title;
  table.appendChild(caption);

  for (let i = 0; i < matrix.length; i++) {
    const row = document.createElement('tr');

    for (let j = 0; j < matrix[i].length; j++) {
      const cell = document.createElement('td');
      cell.textContent = formatMatrixValue(matrix[i][j]);
      row.appendChild(cell);
    }

    table.appendChild(row);
  }

  container.appendChild(table);
}

function formatMatrixValue(value) {
  return value === INFINITY ? '∞' : value;
}




function johnsonsAlgorithm(graph) {
  const numVertices = graph.length;
  const distanceMatrix = Array.from({ length: numVertices }, () => Array(numVertices).fill(0));
  const directedGraphMatrix = Array.from({ length: numVertices }, () => Array(numVertices).fill(null));

  // Initialize distance matrix with the graph values
  for (let i = 0; i < numVertices; i++) {
    for (let j = 0; j < numVertices; j++) {
      distanceMatrix[i][j] = graph[i][j];
      directedGraphMatrix[i][j] = j + 1;
    }
  }

  // Compute shortest paths using Floyd-Warshall algorithm
  for (let k = 0; k < numVertices; k++) {
    for (let i = 0; i < numVertices; i++) {
      for (let j = 0; j < numVertices; j++) {
        if (distanceMatrix[i][k] + distanceMatrix[k][j] < distanceMatrix[i][j]) {
          distanceMatrix[i][j] = distanceMatrix[i][k] + distanceMatrix[k][j];
          directedGraphMatrix[i][j] = directedGraphMatrix[i][k];
        }
      }
    }
  }

  return { distanceMatrix, directedGraphMatrix };
}





function drawGraph(graph) {
  const svg = document.getElementById('graph-svg');
  svg.innerHTML = '';

  const numVertices = graph.length;
  const radius = 180; // Increase the radius for more distance between vertices
  const angleStep = (2 * Math.PI) / numVertices;
  const centerX = 250; // Adjust the center X coordinate
  const centerY = 200; // Adjust the center Y coordinate
  const vertexRadius = 20;
  

  // Create marker for arrowhead
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
  marker.setAttribute('id', 'arrowhead');
  marker.setAttribute('viewBox', '0 0 10 10');
  marker.setAttribute('refX', '8');
  marker.setAttribute('refY', '5');
  marker.setAttribute('markerUnits', 'strokeWidth');
  marker.setAttribute('markerWidth', '6');
  marker.setAttribute('markerHeight', '6');
  marker.setAttribute('orient', 'auto');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
  marker.appendChild(path);
  defs.appendChild(marker);
  svg.appendChild(defs);

  const vertices = [];

  for (let i = 0; i < numVertices; i++) {
    const x = centerX + radius * Math.cos(i * angleStep);
    const y = centerY + radius * Math.sin(i * angleStep);
    vertices.push({ x, y });

    const vertexCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    vertexCircle.setAttribute('cx', x);
    vertexCircle.setAttribute('cy', y);
    vertexCircle.setAttribute('r', vertexRadius);
    vertexCircle.setAttribute('fill', '#8fe28f');
    svg.appendChild(vertexCircle);

    const vertexText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    vertexText.setAttribute('x', x);
    vertexText.setAttribute('y', y);
    vertexText.setAttribute('text-anchor', 'middle');
    vertexText.setAttribute('dominant-baseline', 'middle');
    vertexText.setAttribute('font-size', '16px');
    vertexText.textContent = i + 1;
    svg.appendChild(vertexText);
  }

  for (let i = 0; i < numVertices; i++) {
    for (let j = 0; j < numVertices; j++) {
      if (graph[i][j] !== Infinity && i !== j) {
        const source = vertices[i];
        const target = vertices[j];

        const weight = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        const weightX = (source.x + target.x) / 2;
        const weightY = (source.y + target.y) / 2;
        weight.setAttribute('x', weightX);
        weight.setAttribute('y', weightY);
        weight.setAttribute('text-anchor', 'middle');
        weight.setAttribute('dominant-baseline', 'middle');
        weight.setAttribute('font-size', '12px');
        weight.textContent = graph[i][j];
        svg.appendChild(weight);

        const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const arrowHeadSize = 8;
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const angle = Math.atan2(dy, dx);
        const offsetX = vertexRadius * Math.cos(angle);
        const offsetY = vertexRadius * Math.sin(angle);
        const startX = source.x + offsetX;
        const startY = source.y + offsetY;
        const endX = target.x - offsetX;
        const endY = target.y - offsetY;
        const controlX = (startX + endX) / 2;
        const controlY = (startY + endY) / 2;

        arrow.setAttribute('d', `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`);
        arrow.setAttribute('fill', 'none');
        arrow.setAttribute('stroke', '#8fe28f');
        arrow.setAttribute('stroke-width', '2');
        arrow.setAttribute('marker-end', 'url(#arrowhead)');
        svg.appendChild(arrow);
      }
    }
  }
}





