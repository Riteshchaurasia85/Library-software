    function deleteStudent(studentId, studentName) {
        const confirmDelete = confirm(`Are you sure you want to delete ${studentName}? This action cannot be undone.`);
        
        if (confirmDelete) {
            fetch(`/api/students/${studentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    alert(`${studentName} has been deleted successfully.`);
                    window.location.reload();
                } else {
                    alert('Error deleting student. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while deleting the student.');
            });
        }
    }