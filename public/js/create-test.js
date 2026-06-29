let questions = [];
let testData = {};

function switchStep(step) {
    // Hide all steps
    document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.step-item').forEach(el => el.classList.remove('active'));
    
    // Show selected step
    document.getElementById('step-' + step).classList.add('active');
    document.querySelectorAll('.step-item')[step - 1].classList.add('active');
    
    // Update summary when going to step 4
    if (step === 4) {
        updateTestSummary();
    }
}

function updateQuestionType() {
    const type = document.getElementById('questionType').value;
    document.getElementById('mcqOptions').style.display = type === 'MCQ' ? 'block' : 'none';
    document.getElementById('tfOptions').style.display = type === 'True/False' ? 'block' : 'none';
    document.getElementById('subjectiveOptions').style.display = type === 'Subjective' ? 'block' : 'none';
}

function formatText(format) {
    const textarea = document.getElementById('questionText');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let formattedText = selectedText;

    switch(format) {
        case 'bold':
            formattedText = '**' + selectedText + '**';
            break;
        case 'italic':
            formattedText = '*' + selectedText + '*';
            break;
        case 'underline':
            formattedText = '__' + selectedText + '__';
            break;
    }

    textarea.value = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
}

function addQuestion() {
    const type = document.getElementById('questionType').value;
    const questionText = document.getElementById('questionText').value;
    const marks = parseFloat(document.getElementById('questionMarks').value) || 1;
    const difficulty = document.getElementById('questionDifficulty').value;

    if (!type || !questionText) {
        alert('Please fill in all required fields');
        return;
    }

    let question = {
        id: questions.length + 1,
        type,
        text: questionText,
        marks,
        difficulty,
        options: []
    };

    if (type === 'MCQ') {
        const optionA = document.getElementById('optionA').value;
        const optionB = document.getElementById('optionB').value;
        const optionC = document.getElementById('optionC').value;
        const optionD = document.getElementById('optionD').value;
        const correctAnswer = document.getElementById('correctAnswer').value;

        if (!optionA || !optionB || !optionC || !optionD || !correctAnswer) {
            alert('Please fill in all MCQ options and select correct answer');
            return;
        }

        question.options = [
            { label: 'A', text: optionA },
            { label: 'B', text: optionB },
            { label: 'C', text: optionC },
            { label: 'D', text: optionD }
        ];
        question.correctAnswer = correctAnswer;
    } else if (type === 'True/False') {
        const tfAnswer = document.querySelector('input[name="tfAnswer"]:checked');
        if (!tfAnswer) {
            alert('Please select correct answer');
            return;
        }
        question.correctAnswer = tfAnswer.value;
    } else if (type === 'Subjective') {
        question.keywords = document.getElementById('keywordAnswer').value;
    }

    questions.push(question);
    displayQuestions();
    resetQuestionForm();
    document.getElementById('questionCount').textContent = questions.length;
}

function displayQuestions() {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = questions.map(q => `
        <div class="question-item">
            <div class="question-item-header">
                <div class="question-number">Q${q.id}: ${q.type}</div>
                <div class="question-actions">
                    <button onclick="editQuestion(${q.id - 1})">Edit</button>
                    <button onclick="deleteQuestion(${q.id - 1})">Delete</button>
                </div>
            </div>
            <div class="question-text">${q.text}</div>
            <div class="question-meta">
                <span>Marks: ${q.marks}</span>
                <span>Difficulty: ${q.difficulty}</span>
            </div>
        </div>
    `).join('');
}

function deleteQuestion(index) {
    if (confirm('Delete this question?')) {
        questions.splice(index, 1);
        questions.forEach((q, i) => q.id = i + 1);
        displayQuestions();
        document.getElementById('questionCount').textContent = questions.length;
    }
}

function resetQuestionForm() {
    document.getElementById('questionType').value = '';
    document.getElementById('questionText').value = '';
    document.getElementById('questionMarks').value = '1';
    document.getElementById('questionDifficulty').value = 'Medium';
    document.getElementById('optionA').value = '';
    document.getElementById('optionB').value = '';
    document.getElementById('optionC').value = '';
    document.getElementById('optionD').value = '';
    document.getElementById('correctAnswer').value = '';
    document.getElementById('mcqOptions').style.display = 'none';
    document.getElementById('tfOptions').style.display = 'none';
    document.getElementById('subjectiveOptions').style.display = 'none';
}

function toggleAddQuestion() {
    const form = document.getElementById('questionForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function generateAIQuestions() {
    const subject = document.getElementById('aiSubject').value;
    if (!subject) {
        alert('Please enter a subject');
        return;
    }
    alert('AI question generation coming soon for: ' + subject);
}

function triggerBulkUpload() {
    document.getElementById('bulkUploadFile').click();
}

function handleBulkUpload(event) {
    alert('Bulk upload feature coming soon');
}

function updateTestSummary() {
    const title = document.getElementById('testTitle').value || 'Not Set';
    const duration = document.getElementById('duration').value || '0';
    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
    const passingPercentage = document.getElementById('passingPercentage').value || '0';

    document.getElementById('summaryQuestions').textContent = questions.length;
    document.getElementById('summaryDuration').textContent = duration;
    document.getElementById('summaryMarks').textContent = totalMarks;
    document.getElementById('summaryPassing').textContent = passingPercentage;
}

 function publishTest(e) {
    // 1. Form submission aur page auto-reload ko lock karna
    if (e) e.preventDefault();

    if (questions.length === 0) {
        alert('Please add at least one question to the test');
        return;
    }

    // Helper: Agar step-1, step-2 ke inputs is screen par na ho to crash hone se bachayega
    const getVal = (id, isInt = false) => {
        const el = document.getElementById(id);
        if (!el) return isInt ? 0 : "";
        return isInt ? (parseInt(el.value) || 0) : el.value;
    };

    const getBool = (id) => {
        const el = document.getElementById(id);
        return el ? el.value === 'yes' : false;
    };

    testData = {
        basics: {
            title: getVal('testTitle'),
            subject: getVal('testSubject'),
            description: getVal('testDescription'),
            totalQuestions: getVal('totalQuestions', true),
            duration: getVal('duration', true),
            passingPercentage: getVal('passingPercentage', true),
            difficulty: getVal('difficulty'),
            category: getVal('category')
        },
        questions: questions,
        settings: {
            showAnswer: getVal('showAnswer'),
            shuffleQuestions: getBool('shuffleQuestions'),
            shuffleOptions: getBool('shuffleOptions'),
            allowReview: getBool('allowReview'),
            negativeMarking: getBool('negativeMarking'),
            negativeMarkValue: parseFloat(getVal('negativeMarkValue')) || 0,
            instructions: getVal('instructions')
        },
        publish: {
            publishType: getVal('publishType'),
            tags: getVal('tags')
        }
    };

    // Api operations
    fetch('/tests/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            return fetch(`/tests/${data.test._id}/publish`, { method: 'POST' });
        } else {
            throw new Error(data.message);
        }
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            // 🎉 Ab bina page load huye modal active ho jayega!
            showShareableLink(data.shareUrl, testData.basics);
        } else {
            alert('Test created but link failed: ' + data.message);
        }
    })
    .catch(err => {
        console.error('Error:', err);
        alert('Failed to publish test: ' + err.message);
    });
}

function showShareableLink(shareUrl, testBasics) {
    document.getElementById('shareLink').value = shareUrl;
    
    const detailsList = `
        <li><strong>Title:</strong> ${testBasics.title || 'Untitled Test'}</li>
        <li><strong>Subject:</strong> ${testBasics.subject || 'General'}</li>
        <li><strong>Duration:</strong> ${testBasics.duration || 0} minutes</li>
        <li><strong>Questions:</strong> ${questions.length}</li>
        <li><strong>Passing %:</strong> ${testBasics.passingPercentage || 0}%</li>
    `;
    document.getElementById('publishedTestDetails').innerHTML = detailsList;
    
    // Modal toggle target style
    document.getElementById('shareableLinkModal').style.display = 'flex';
}

function copyToClipboard(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('shareLink');
    input.select();
    
    navigator.clipboard.writeText(input.value).then(() => {
        const btn = e.target.closest('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="ri-check-line"></i> Copied!';
        btn.style.backgroundColor = '#10b981';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.backgroundColor = '';
        }, 2000);
    });
}

function shareVia(platform, e) {
    if (e) e.preventDefault();
    const shareUrl = document.getElementById('shareLink').value;
    const titleEl = document.getElementById('testTitle');
    const testTitle = titleEl ? titleEl.value : 'Quiz Test';
    
    const message = `Hey! Check out this test: "${testTitle}". Link: ${shareUrl}`;
    let url = '';
    
    if (platform === 'whatsapp') {
        url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    } else if (platform === 'email') {
        url = `mailto:?subject=New Test&body=${encodeURIComponent(message)}`;
    } else if (platform === 'facebook') {
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    }
    
    if (url) window.open(url, '_blank');
}

function closeShareModal() {
    document.getElementById('shareableLinkModal').style.display = 'none';
}

// function redirectToTests() {
//     window.location.href = '/dashboard';
// }
function redirectToTests() {
    window.location.href = '/tests/all';
}

function closeTestCreator() {
    window.history.back();
}