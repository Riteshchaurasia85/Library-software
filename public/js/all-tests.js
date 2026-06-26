function editTest(testId) {
    alert('Edit functionality coming soon for test: ' + testId);
    // window.location.href = `/edit-test/${testId}`;
}

function viewTest(testId) {
    alert('View functionality coming soon for test: ' + testId);
    // window.location.href = `/view-test/${testId}`;
}

function getAppOrigin() {
    const origin = window.location.origin;
    if (!origin || origin.startsWith('chrome-error://') || origin === 'null' || origin === 'undefined') {
        return 'http://localhost:3000';
    }
    return origin;
}

function publishTest(testId) {
    if (confirm('Publish this test?')) {
        fetch(`/tests/${testId}/publish`, { method: 'POST' })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Test published successfully!');
                    location.reload();
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(err => alert('Error publishing test'));
    }
}

function shareTest(publicLink) {
    const shareUrl = `${getAppOrigin()}/take-test/${publicLink}`;
    if (navigator.share) {
        navigator.share({
            title: 'Take Test',
            url: shareUrl
        });
    } else {
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert('Link copied to clipboard: ' + shareUrl);
    }
}

function deleteTest(testId) {
    if (confirm('Are you sure you want to delete this test? This cannot be undone.')) {
        fetch(`/tests/${testId}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Test deleted successfully!');
                    location.reload();
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(err => alert('Error deleting test'));
    }
}

function copyLink(publicLink) {
    const shareUrl = `${getAppOrigin()}/take-test/${publicLink}`;
    
    // Copy to clipboard
    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl).then(() => {
            // Show feedback
            const btn = event.target.closest('.btn-copy');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="ri-check-line"></i>';
            btn.style.background = '#28a745';
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
            }, 2000);
        }).catch(err => {
            // Fallback method
            const textArea = document.createElement("textarea");
            textArea.value = shareUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            alert('Link copied to clipboard!');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert('Link copied to clipboard!');
    }
}