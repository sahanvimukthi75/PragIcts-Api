// frontend/app.js

async function fetchData(searchQuery = '') {
    const searchStatus = document.getElementById('search-status');
    searchStatus.style.display = 'inline'; // Show "Searching" message

    try {
        const response = await fetch(`http://localhost:3000/data?search=${encodeURIComponent(searchQuery)}`);
        
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        
        const data = await response.json();
        populateTable(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        document.querySelector('#dataTable tbody').innerHTML = '<tr><td colspan="8">Error loading data</td></tr>';
    } finally {
        // Ensure the "Searching" message is hidden after data is processed or an error occurs
        searchStatus.style.display = 'none';
    }
}

function populateTable(data) {
    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = '';

    if (!Array.isArray(data) || data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8">No data available</td></tr>';
        return;
    }

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.no || ''}</td>
            <td>${item.description || ''}</td>
            <td>${item.type || ''}</td>
            <td>${item.baseUnitMeasure || ''}</td>
            <td>${item.inventory || ''}</td>
            <td>${item.salesUnitMeasure || ''}</td>
            <td>${item.purchUnitMeasure || ''}</td>
            <td>${item.availableInventory || ''}</td>
        `;
        tableBody.appendChild(row);
    });
}

document.getElementById('search').addEventListener('input', (event) => {
    const searchQuery = event.target.value;
    fetchData(searchQuery);
});

// Fetch initial data
fetchData();
