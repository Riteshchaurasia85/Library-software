    let allTests = [];
    const testsBody = document.getElementById('testsBody');

    async function loadTests() {
        try {
            const response = await fetch('/api/tests/all');
            const data = await response.json();
            allTests = data.tests;
            renderTests(allTests);
        } catch (error) {
            console.error('Error loading tests:', error);
            testsBody.innerHTML = '<tr><td colspan="9" class="text-center text-danger">Error loading tests</td></tr>';
        }
    }

    function renderTests(tests) {
        if (tests.length === 0) {
            testsBody.innerHTML = '<tr><td colspan="9" class="text-center py-4 text-muted">No tests found</td></tr>';
            return;
        }

        testsBody.innerHTML = tests.map(test => `
            <tr>
                <td>
                    <strong>${test.title}</strong>
                    <br>
                    <small class="text-muted">${test.description ? test.description.substring(0, 50) : 'No description'}...</small>
                </td>
                <td><span class="badge bg-info">${test.category}</span></td>
                <td><span class="badge bg-secondary">${test.totalQuestions}</span></td>
                <td>
                    <span class="badge ${test.difficulty === 'Easy' ? 'bg-success' : test.difficulty === 'Hard' ? 'bg-danger' : 'bg-warning'}">
                        ${test.difficulty}
                    </span>
                </td>
                <td>${test.duration} min</td>
                <td>
                    <span class="badge ${test.isPublished ? 'bg-success' : 'bg-secondary'}">
                        ${test.isPublished ? 'Published' : 'Draft'}
                    </span>
                </td>
                <td>
                    <a href="#" class="btn btn-sm btn-link" onclick="viewAnalytics('${test._id}', event)">
                        View
                    </a>
                </td>
                <td>-</td>
                <td>
                    <div class="btn-group btn-group-sm" role="group">
                        <a href="/test-builder/${test._id}" class="btn btn-outline-primary" title="Edit">
                            <i class="fas fa-edit"></i>
                        </a>
                        ${test.isPublished ? `
                            <button class="btn btn-outline-success" onclick="showShareLink('${test.publicLink}', event)" title="Share">
                                <i class="fas fa-share-alt"></i>
                            </button>
                        ` : `
                            <button class="btn btn-outline-info" onclick="publishTest('${test._id}', event)" title="Publish">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        `}
                        <button class="btn btn-outline-danger" onclick="deleteTest('${test._id}', event)" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    function filterTests() {
        const search = document.getElementById('searchInput').value.toLowerCase();
        const category = document.getElementById('categoryFilter').value;
        const status = document.getElementById('statusFilter').value;

        const filtered = allTests.filter(test => {
            const matchSearch = test.title.toLowerCase().includes(search) || 
                               (test.description && test.description.toLowerCase().includes(search));
            const matchCategory = !category || test.category === category;
            const matchStatus = !status || (status === 'published' ? test.isPublished : !test.isPublished);

            return matchSearch && matchCategory && matchStatus;
        });

        renderTests(filtered);
    }

    async function publishTest(testId, event) {
        event.preventDefault();
        try {
            const response = await fetch(`/api/tests/${testId}/publish`, {
                method: 'POST'
            });
            const result = await response.json();

            if (result.success) {
                alert('Test published successfully!');
                loadTests();
            }
        } catch (error) {
            console.error('Error publishing test:', error);
        }
    }

    function getAppOrigin() {
        const origin = window.location.origin;
        if (!origin || origin.startsWith('chrome-error://') || origin === 'null' || origin === 'undefined') {
            return 'http://localhost:3000';
        }
        return origin;
    }

    function showShareLink(publicLink, event) {
        event.preventDefault();
        const shareUrl = `${getAppOrigin()}/take-test/${publicLink}`;
        document.getElementById('shareLinkInput').value = shareUrl;
        new bootstrap.Modal(document.getElementById('shareLinkModal')).show();
    }

    function copyShareLink() {
        const input = document.getElementById('shareLinkInput');
        input.select();
        document.execCommand('copy');
        alert('Link copied to clipboard!');
    }

    function shareVia(platform) {
        const link = document.getElementById('shareLinkInput').value;
        const title = 'Take our test!';

        if (platform === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + link)}`);
        } else if (platform === 'email') {
            window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(link)}`);
        }
    }

    async function viewAnalytics(testId, event) {
        event.preventDefault();
        try {
            const response = await fetch(`/api/tests/${testId}/results`);
            const data = await response.json();

            let analyticsHTML = `
                <div class="mb-3">
                    <h6>Test: ${data.test.title}</h6>
                </div>
                <div class="row mb-3">
                    <div class="col-md-6">
                        <small><strong>Total Attempts:</strong> ${data.stats.totalAttempts}</small><br>
                        <small><strong>Passed:</strong> ${data.stats.totalPassed}</small><br>
                        <small><strong>Pass Rate:</strong> ${data.stats.passPercentage}%</small>
                    </div>
                    <div class="col-md-6">
                        <small><strong>Average Score:</strong> ${data.stats.avgScore}%</small>
                    </div>
                </div>
                <h6 class="mt-3">Student Results:</h6>
                <div style="max-height: 400px; overflow-y: auto;">
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Score</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.results.map(r => `
                                <tr>
                                    <td>${r.studentName}</td>
                                    <td>${r.obtainedMarks}/${r.totalMarks}</td>
                                    <td><span class="badge ${r.isPassed ? 'bg-success' : 'bg-danger'}">${r.isPassed ? 'Passed' : 'Failed'}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;

            document.getElementById('testDetailsContent').innerHTML = analyticsHTML;
            new bootstrap.Modal(document.getElementById('testDetailsModal')).show();
        } catch (error) {
            console.error('Error loading analytics:', error);
        }
    }

    async function deleteTest(testId, event) {
        event.preventDefault();
        if (confirm('Are you sure you want to delete this test?')) {
            try {
                const response = await fetch(`/api/tests/${testId}`, {
                    method: 'DELETE'
                });
                const result = await response.json();

                if (result.success) {
                    alert('Test deleted successfully!');
                    loadTests();
                }
            } catch (error) {
                console.error('Error deleting test:', error);
            }
        }
    }

    loadTests();