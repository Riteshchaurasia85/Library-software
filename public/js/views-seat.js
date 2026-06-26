    // views-seat.js — pure client-side code (Chart.js included globally in layout)
    let seatChart = null;
    const AUTO_REFRESH_INTERVAL = 5000; // 5 seconds

    // Initialize Seat Distribution Chart
    function initializeChart(occupiedCount, availableCount, reservedCount, unreversedCount) {
        const ctx = document.getElementById('seatChart');
        if (!ctx) return;

        if (seatChart) {
            seatChart.destroy();
        }

        const chartContext = ctx.getContext('2d');
        seatChart = new Chart(chartContext, {
            type: 'doughnut',
            data: {
                labels: ['Occupied', 'Available', 'Reserved', 'Unreversed'],
                datasets: [{
                    data: [occupiedCount, availableCount, reservedCount, unreversedCount],
                    backgroundColor: [
                        '#10b981',  // Occupied - Green
                        '#f3f4f6',  // Available - Light Gray
                        '#a78bfa',  // Reserved - Purple
                        '#ef4444'   // Unreversed - Red
                    ],
                    borderColor: [
                        '#059669',
                        '#d1d5db',
                        '#8b5cf6',
                        '#dc2626'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = occupiedCount + availableCount + reservedCount + unreversedCount;
                                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                return label + ': ' + value + ' (' + percentage + '%)';
                            }
                        }
                    }
                }
            }
        });
    }

    // Update seat grid display
    function updateSeatGrid(seatRows) {
        const gridContainer = document.querySelector('.seat-board-grid');
        if (!gridContainer) return;

        // Clear existing rows (except header)
        const existingRows = gridContainer.querySelectorAll('.seat-grid-row');
        existingRows.forEach(row => row.remove());

        // Add updated rows
        seatRows.forEach(function(row) {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'seat-grid-row';

            const rowLabel = document.createElement('div');
            rowLabel.className = 'seat-grid-cell row-label';
            rowLabel.textContent = row.letter;
            rowDiv.appendChild(rowLabel);

            row.seats.forEach(function(seat) {
                const seatDiv = document.createElement('div');
                seatDiv.className = 'seat-box ' + seat.colorClass;
                seatDiv.title = seat.status;
                seatDiv.innerHTML = '<span class="seat-label">' + seat.label + '</span>';
                rowDiv.appendChild(seatDiv);
            });

            gridContainer.appendChild(rowDiv);
        });
    }

    // Update summary cards
    function updateSummaryCards(totalSeats, occupiedCount, availableCount, reservedCount) {
        const summaryCards = document.querySelectorAll('.seat-summary-card');
        if (summaryCards.length >= 4) {
            summaryCards[0].querySelector('p').textContent = totalSeats;
            summaryCards[1].querySelector('p').textContent = occupiedCount;
            summaryCards[2].querySelector('p').textContent = availableCount;
            summaryCards[3].querySelector('p').textContent = reservedCount;
        }
    }

    // Update legend counts
    function updateLegend(occupiedCount, availableCount, reservedCount, unreversedCount) {
        const o = document.getElementById('occupiedLabel');
        const a = document.getElementById('availableLabel');
        const r = document.getElementById('reservedLabel');
        const u = document.getElementById('unreversedLabel');
        if (o) o.textContent = occupiedCount;
        if (a) a.textContent = availableCount;
        if (r) r.textContent = reservedCount;
        if (u) u.textContent = unreversedCount;
    }

    // Fetch and update seat data
    async function updateSeatData() {
        try {
            const params = new URLSearchParams(window.location.search);
            const response = await fetch('/api/seats?' + params.toString());

            if (!response.ok) {
                console.error('Failed to fetch seat data');
                return;
            }

            const data = await response.json();

            // Update all components
            updateSummaryCards(data.totalSeats, data.occupiedCount, data.availableCount, data.reservedCount);
            updateSeatGrid(data.seatRows);
            updateLegend(data.occupiedCount, data.availableCount, data.reservedCount, data.unreversedCount);
            initializeChart(data.occupiedCount, data.availableCount, data.reservedCount, data.unreversedCount);

            console.log('Seat data updated:', data.timestamp);
        } catch (error) {
            console.error('Error updating seat data:', error);
        }
    }

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function() {
        // Read initial counts from DOM (rendered by server)
        const occupiedCount = parseInt(document.getElementById('occupiedLabel')?.textContent || '0', 10);
        const availableCount = parseInt(document.getElementById('availableLabel')?.textContent || '0', 10);
        const reservedCount = parseInt(document.getElementById('reservedLabel')?.textContent || '0', 10);
        const unreversedCount = parseInt(document.getElementById('unreversedLabel')?.textContent || '0', 10);

        initializeChart(occupiedCount, availableCount, reservedCount, unreversedCount);

        // Set up auto-refresh
        setInterval(updateSeatData, AUTO_REFRESH_INTERVAL);

        // Add refresh button listener
        const refreshBtn = document.querySelector('.btn-refresh');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function(e) {
                e.preventDefault();
                updateSeatData();
            });
        }
    });