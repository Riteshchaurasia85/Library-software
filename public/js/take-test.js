// Server data attributes definition injection mapping
let currentTest = <%- JSON.stringify(test) %>;
let currentQuestions = <%- JSON.stringify(questions) %>;
let currentQuestionIndex = 0;
let testStarted = false;
let testTimeRemaining = (currentTest.basics ? currentTest.basics.duration : currentTest.duration) * 60; // Safe backup fallback query tracking
let timerInterval = null;
let answers = {};

// Initialize answers object globally
if (currentQuestions && currentQuestions.length > 0) {
    currentQuestions.forEach((q) => {
        answers[q._id] = ''; // Null ki jagah blank string safe assignment
    });
}

function startTest() {
    testStarted = true;
    
    // Hide instructions sheet container UI block
    if (document.getElementById('instructionBlock')) {
        document.getElementById('instructionBlock').style.display = 'none';
    } else if (document.querySelector('.test-instructions')) {
        document.querySelector('.test-instructions').style.display = 'none';
    }
    
    document.getElementById('testContent').style.display = 'flex';
    
    // 🚀 SHUFFLE FIX: Advanced balanced Fisher-Yates array shuffler logic
    if (currentTest.settings && currentTest.settings.shuffleQuestions) {
        for (let i = currentQuestions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [currentQuestions[i], currentQuestions[j]] = [currentQuestions[j], currentQuestions[i]];
        }
    }
    
    renderQuestions();
    renderQuestionList();
    startTimer();
    showQuestion(0); // Trigger sequence active viewport loading
}

function renderQuestions() {
    const wrapper = document.getElementById('questionsWrapper');
    wrapper.innerHTML = '';
    
    currentQuestions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        questionDiv.id = 'question-' + index;
        questionDiv.setAttribute('data-question-id', question._id);
        
        let optionsHtml = '';
        
        if (question.type === 'MCQ' || question.type === 'TrueFalse') {
            const options = question.type === 'TrueFalse' 
                ? [{ optionText: 'True' }, { optionText: 'False' }]
                : question.options;
            
            optionsHtml = `
                <div class="options-list" style="margin-top:15px;">
                    ${options.map((opt, optIndex) => {
                        const textVal = typeof opt === 'string' ? opt : opt.optionText;
                        return `
                            <div class="option" style="margin: 8px 0;">
                                <input type="radio" name="answer-${question._id}" value="${textVal}" id="option-${question._id}-${optIndex}" onchange="recordAnswer('${question._id}', '${textVal}')">
                                <label style="margin-left:8px; cursor:pointer;" for="option-${question._id}-${optIndex}">${textVal}</label>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        } else if (question.type === 'Subjective') {
            // 🚀 DATA LOSS PROTECTION: Changed onchange to oninput
            optionsHtml = `
                <div class="text-answer" style="margin-top:15px;">
                    <textarea name="answer-${question._id}" placeholder="Enter your answer here..." rows="6" style="width:100%; padding:12px; border-radius:12px; border:1px solid #cbd5e1; outline:none;" oninput="recordAnswer('${question._id}', this.value)"></textarea>
                </div>
            `;
        } else if (question.type === 'Code Editor') {
            // 🚀 DATA LOSS PROTECTION: Changed onchange to oninput
            optionsHtml = `
                <div class="text-answer" style="margin-top:15px;">
                    <p style="color: #64748b; font-size: 13px; margin-bottom:6px;">Write your code here (JavaScript):</p>
                    <textarea name="answer-${question._id}" placeholder="Write your code here..." rows="10" style="width:100%; padding:12px; border-radius:12px; font-family: 'Courier New', monospace; border:1px solid #cbd5e1; outline:none;" oninput="recordAnswer('${question._id}', this.value)"></textarea>
                </div>
            `;
        }
        
        questionDiv.innerHTML = `
            <div class="question-number" style="font-weight:600; color:#475569; margin-bottom:10px;">Question ${index + 1} of ${currentQuestions.length}</div>
            <div class="question-text" style="font-size:18px; font-weight:500; color:#1e293b; margin-bottom:15px;">
                ${question.questionText}
                <span class="question-marks" style="float:right; font-size:14px; background:#e2e8f0; padding:2px 10px; border-radius:20px;">${question.marks} marks</span>
            </div>
            ${optionsHtml}
            <div class="question-navigation" style="display:flex; gap:12px; margin-top:25px;">
                <button type="button" class="btn btn-secondary" onclick="showQuestion(${index - 1})" ${index === 0 ? 'disabled' : ''}>← Previous</button>
                <button type="button" class="btn btn-primary" onclick="showQuestion(${index + 1})" ${index === currentQuestions.length - 1 ? 'disabled' : ''}>Next →</button>
            </div>
        `;
        
        wrapper.appendChild(questionDiv);
    });
}

function renderQuestionList() {
    const list = document.getElementById('questionList');
    list.innerHTML = '';
    
    currentQuestions.forEach((question, index) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'question-btn';
        btn.textContent = index + 1;
        btn.setAttribute('data-index', index);
        
        // Dynamic color coding for tracking responses
        if (answers[question._id] !== undefined && answers[question._id] !== '') {
            btn.classList.add('answered');
            btn.style.background = '#10b981'; // Premium Green tracking color asset
            btn.style.color = 'white';
        } else {
            btn.classList.add('not-answered');
        }
        
        if (index === currentQuestionIndex) {
            btn.classList.add('active');
            btn.style.border = '2px solid #788eff'; // Highlight selected active node tracking box
        }
        
        btn.onclick = (e) => {
            e.preventDefault();
            showQuestion(index);
        };
        
        list.appendChild(btn);
    });
}

function showQuestion(index) {
    if (index < 0 || index >= currentQuestions.length) return;
    
    // Hide all items securely
    document.querySelectorAll('.question-item').forEach(q => {
        q.classList.remove('active');
        q.style.display = 'none';
    });
    
    // Show selected item slot container targets
    const activeCard = document.getElementById('question-' + index);
    if(activeCard) {
        activeCard.classList.add('active');
        activeCard.style.display = 'block';
    }
    
    currentQuestionIndex = index;
    renderQuestionList();
    
    // State backup restore values mapping calculations
    const question = currentQuestions[index];
    const savedAnswer = answers[question._id];
    
    if (savedAnswer !== undefined && savedAnswer !== '') {
        if (question.type === 'MCQ' || question.type === 'TrueFalse') {
            const radio = document.querySelector(`input[name="answer-${question._id}"][value="${savedAnswer}"]`);
            if (radio) radio.checked = true;
        } else {
            const textarea = document.querySelector(`textarea[name="answer-${question._id}"]`);
            if (textarea) textarea.value = savedAnswer;
        }
    }
}

function recordAnswer(questionId, answer) {
    answers[questionId] = answer;
    // Debounced layout tracking call mapping structure logic
    renderQuestionList();
}

function startTimer() {
    const timerElement = document.getElementById('timer');
    
    timerInterval = setInterval(() => {
        if (testTimeRemaining <= 0) {
            clearInterval(timerInterval);
            alert('Time is up! Submitting your test sheet auto-save mode triggered.');
            forceAutoSubmit();
            return;
        }
        
        testTimeRemaining--;
        
        const minutes = Math.floor(testTimeRemaining / 60);
        const seconds = testTimeRemaining % 60;
        
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Critical alerts coloring trigger systems if remaining scale is lower than 5 minutes
        if (testTimeRemaining <= 300) {
            const displayBox = document.querySelector('.timer-display');
            if(displayBox) displayBox.style.color = '#ef4444';
        }
    }, 1000);
}

// Separate helper for auto-submitting sheet securely when time ends
function forceAutoSubmit() {
    const submissionAnswers = Object.keys(answers).map(questionId => ({
        questionId: questionId,
        selectedAnswer: answers[questionId] || ''
    }));

    executeServerPostRequest('AutoTimeout Student', 'timeout@system.com', 'N/A', submissionAnswers);
}

function submitTest() {
    if (!testStarted) return;
    
    if (!confirm('Are you sure you want to submit the test? You cannot change your answers after submission.')) {
        return;
    }
    
    clearInterval(timerInterval);
    
    const submissionAnswers = Object.keys(answers).map(questionId => ({
        questionId: questionId,
        selectedAnswer: answers[questionId] || ''
    }));
    
    const sName = prompt('Enter your full name to proceed with grading:') || 'Anonymous';
    const sEmail = prompt('Enter your email id:') || 'not@provided.com';
    const sPhone = prompt('Enter your active contact number:') || 'not provided';

    executeServerPostRequest(sName, sEmail, sPhone, submissionAnswers);
}

// Isolated fetch function to avoid boilerplate copies inside routes
function executeServerPostRequest(name, email, phone, answersArray) {
    fetch(`/tests/${currentTest._id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            studentName: name,
            studentEmail: email,
            studentPhone: phone,
            answers: answersArray
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Test submitted successfully! Redirecting to reports sheet.');
            window.location.href = `/test-results/${data.result.responseId}`;
        } else {
            alert('Error submitting test: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Critical server sync failure managed:', error);
        alert('Connection error occurred while saving sheet.');
    });
}

function goBack() {
    window.history.back();
}