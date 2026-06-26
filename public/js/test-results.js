function switchResultsTab(status) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Show/hide questions based on status
    document.querySelectorAll('.question-result').forEach(result => {
        result.classList.remove('show');
        if (status === 'all' || result.dataset.status === status) {
            result.classList.add('show');
        }
    });
}

// Initialize results view
document.addEventListener('DOMContentLoaded', function() {
    // Show all results initially
    document.querySelectorAll('.question-result').forEach(result => {
        result.classList.add('show');
    });
});

function downloadResults() {
    let content = 'TEST RESULTS\n';
    content += '='.repeat(50) + '\n\n';
    content += 'Candidate: <%= response.studentName %>\n';
    content += 'Email: <%= response.studentEmail %>\n';
    content += 'Phone: <%= response.studentPhone %>\n';
    content += 'Score: <%= response.obtainedMarks %>/<%= response.totalMarks %> (<%= response.percentage %>%)\n';
    content += 'Status: <%= response.isPassed ? "PASSED" : "FAILED" %>\n';
    content += 'Submitted: <%= new Date(response.submittedAt).toLocaleString() %>\n\n';

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', 'test-results-<%= response._id %>.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function goHome() {
    window.location.href = '/';\n}