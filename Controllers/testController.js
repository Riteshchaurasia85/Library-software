const Test = require("../models/Test");
const Question = require("../models/Question");
const TestResponse = require("../models/TestResponse");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

// Create new test with questions
exports.createTest = async (req, res) => {
    try {
        const { basics, questions, settings, publish } = req.body;
        
        const testId = uuidv4();
        const newTest = new Test({
            testId,
            title: basics.title,
            description: basics.description,
            category: basics.category || "Custom",
            subject: basics.subject,
            totalQuestions: parseInt(basics.totalQuestions) || questions.length,
            passingPercentage: parseInt(basics.passingPercentage) || 40,
            duration: parseInt(basics.duration) || 60,
            difficulty: basics.difficulty || "Medium",
            createdBy: basics.createdBy || "Admin",
            isPublished: publish.publishType !== 'private',
            publishType: publish.publishType,
            tags: publish.tags ? publish.tags.split(',').map(t => t.trim()) : [],
            settings: {
                showAnswerAfter: settings.showAnswer,
                shuffleQuestions: settings.shuffleQuestions,
                shuffleOptions: settings.shuffleOptions,
                allowReview: settings.allowReview,
                negativeMarking: settings.negativeMarking,
                negativeMarkValue: settings.negativeMarkValue || 0,
                instructions: settings.instructions
            },
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        await newTest.save();
        
        // Save questions
        if (questions && questions.length > 0) {
            const savedQuestions = await Promise.all(
                questions.map((q, index) => {
                    const newQuestion = new Question({
                        testId: newTest._id,
                        questionNumber: index + 1,
                        type: q.type,
                        questionText: q.text,
                        options: q.type === "MCQ" ? q.options : [],
                        expectedAnswer: q.correctAnswer,
                        sampleAnswer: q.keywords || "",
                        difficulty: q.difficulty || "Medium",
                        marks: parseFloat(q.marks) || 1,
                        programmingLanguage: q.type === "Code Editor" ? "JavaScript" : "None",
                        testCases: [],
                        createdAt: new Date()
                    });
                    return newQuestion.save();
                })
            );
        }
        
        res.status(201).json({ 
            success: true, 
            message: "Test created successfully with " + questions.length + " questions", 
            test: newTest,
            testId: newTest._id
        });
    } catch (error) {
        console.error("Error creating test:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all tests
exports.getAllTests = async (req, res) => {
    try {
        const tests = await Test.find();
        res.status(200).json({ success: true, tests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get test by ID
exports.getTestById = async (req, res) => {
    try {
        const { testId } = req.params;
        const test = await Test.findById(testId);
        if (!test) return res.status(404).json({ success: false, message: "Test not found" });
        
        const questions = await Question.find({ testId });
        res.status(200).json({ success: true, test, questions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get test by public link
exports.getTestByPublicLink = async (req, res) => {
    try {
        const { publicLink } = req.params;
        const test = await Test.findOne({ publicLink, isPublished: true });
        if (!test) return res.status(404).json({ success: false, message: "Test not found or not published" });
        
        const questions = await Question.find({ testId: test._id });
        res.status(200).json({ success: true, test, questions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add question to test
exports.addQuestion = async (req, res) => {
    try {
        const { testId } = req.params;
        const { type, questionText, options, expectedAnswer, difficulty, marks, explanation, imageUrl, sampleAnswer, programmingLanguage, testCases } = req.body;
        
        const test = await Test.findById(testId);
        if (!test) return res.status(404).json({ success: false, message: "Test not found" });
        
        const questionCount = await Question.countDocuments({ testId });
        
        const newQuestion = new Question({
            testId,
            questionNumber: questionCount + 1,
            type,
            questionText,
            options: type === "MCQ" || type === "TrueFalse" ? options : [],
            expectedAnswer,
            sampleAnswer,
            difficulty: difficulty || "Medium",
            marks: parseInt(marks) || 1,
            explanation,
            imageUrl,
            programmingLanguage: type === "CodeEditor" ? programmingLanguage : "None",
            testCases: type === "CodeEditor" ? testCases : []
        });
        
        await newQuestion.save();
        res.status(201).json({ success: true, message: "Question added successfully", question: newQuestion });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update question
exports.updateQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const updates = req.body;
        
        const question = await Question.findByIdAndUpdate(questionId, updates, { new: true });
        if (!question) return res.status(404).json({ success: false, message: "Question not found" });
        
        res.status(200).json({ success: true, message: "Question updated successfully", question });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete question
exports.deleteQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        
        const question = await Question.findByIdAndDelete(questionId);
        if (!question) return res.status(404).json({ success: false, message: "Question not found" });
        
        res.status(200).json({ success: true, message: "Question deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
 
// Publish test and generate public link
exports.publishTest = async (req, res) => {
    try {
        const { testId } = req.params;
        const baseUrl = `${req.protocol}://${req.get("host")}`;

        const test = await Test.findById(testId);
        if (!test) return res.status(404).json({ success: false, message: "Test not found" });
        
        const questions = await Question.countDocuments({ testId });
        if (questions === 0) {
            return res.status(400).json({ success: false, message: "Test must have at least one question" });
        }
        
        const publicLink = `test-${uuidv4().substring(0, 8)}`;
        test.isPublished = true;
        test.publicLink = publicLink;
        await test.save();
        
        res.status(200).json({
        success: true,
        message: "Test published successfully",
        publicLink,
        shareUrl: `${baseUrl}/take-test/${publicLink}`
    });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update test
exports.updateTest = async (req, res) => {
    try {
        const { testId } = req.params;
        const updates = req.body;
        
        const test = await Test.findByIdAndUpdate(testId, updates, { new: true });
        if (!test) return res.status(404).json({ success: false, message: "Test not found" });
        
        res.status(200).json({ success: true, message: "Test updated successfully", test });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete test
exports.deleteTest = async (req, res) => {
    try {
        const { testId } = req.params;
        
        await Question.deleteMany({ testId });
        await TestResponse.deleteMany({ testId });
        
        const test = await Test.findByIdAndDelete(testId);
        if (!test) return res.status(404).json({ success: false, message: "Test not found" });
        
        res.status(200).json({ success: true, message: "Test deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Submit test response
exports.submitTestResponse = async (req, res) => {
    try {
        const { testId } = req.params;
        const { studentName, studentEmail, studentPhone, answers } = req.body;
        
        const test = await Test.findById(testId);
        if (!test) return res.status(404).json({ success: false, message: "Test not found" });
        
        const questions = await Question.find({ testId });
        let totalMarks = 0;
        let obtainedMarks = 0;
        const processedAnswers = [];
        
        // Calculate marks
        for (let answer of answers) {
            const question = questions.find(q => q._id.toString() === answer.questionId);
            if (question) {
                totalMarks += question.marks;
                
                let isCorrect = false;
                if (question.type === "MCQ" || question.type === "TrueFalse") {
                    const correctOption = question.options.find(opt => opt.isCorrect);
                    isCorrect = correctOption && correctOption.optionText === answer.selectedAnswer;
                } else {
                    // For subjective and code editor, manual evaluation required
                    isCorrect = null;
                }
                
                processedAnswers.push({
                    questionId: answer.questionId,
                    selectedAnswer: answer.selectedAnswer,
                    userInput: answer.userInput,
                    isCorrect,
                    marksObtained: isCorrect ? question.marks : 0
                });
                
                if (isCorrect) obtainedMarks += question.marks;
            }
        }
        
        const percentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;
        const isPassed = percentage >= test.passingPercentage;
        
        const testResponse = new TestResponse({
            testId,
            studentName,
            studentEmail,
            studentPhone,
            answers: processedAnswers,
            totalMarks,
            obtainedMarks,
            percentage: Math.round(percentage),
            isPassed,
            status: "Submitted",
            submittedAt: new Date()
        });
        
        await testResponse.save();
        
        res.status(201).json({ 
            success: true, 
            message: "Test submitted successfully",
            result: {
                totalMarks,
                obtainedMarks,
                percentage: Math.round(percentage),
                isPassed,
                responseId: testResponse._id
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get test results
exports.getTestResults = async (req, res) => {
    try {
        const { testId } = req.params;
        
        const results = await TestResponse.find({ testId }).sort({ createdAt: -1 });
        const test = await Test.findById(testId);
        
        let totalAttempts = results.length;
        let totalPassed = results.filter(r => r.isPassed).length;
        let avgScore = results.length > 0 ? results.reduce((sum, r) => sum + r.percentage, 0) / results.length : 0;
        
        res.status(200).json({ 
            success: true, 
            test,
            results,
            stats: {
                totalAttempts,
                totalPassed,
                passPercentage: totalAttempts > 0 ? (totalPassed / totalAttempts * 100).toFixed(2) : 0,
                avgScore: avgScore.toFixed(2)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Evaluate subjective answers
exports.evaluateAnswer = async (req, res) => {
    try {
        const { responseId, answerId } = req.params;
        const { isCorrect, marks, evaluationNotes } = req.body;
        
        const testResponse = await TestResponse.findById(responseId);
        if (!testResponse) return res.status(404).json({ success: false, message: "Response not found" });
        
        const answerIndex = testResponse.answers.findIndex(a => a._id.toString() === answerId);
        if (answerIndex === -1) return res.status(404).json({ success: false, message: "Answer not found" });
        
        testResponse.answers[answerIndex].isCorrect = isCorrect;
        testResponse.answers[answerIndex].marksObtained = isCorrect ? marks : 0;
        testResponse.answers[answerIndex].evaluationNotes = evaluationNotes;
        
        // Recalculate total
        testResponse.obtainedMarks = testResponse.answers.reduce((sum, ans) => sum + (ans.marksObtained || 0), 0);
        testResponse.percentage = Math.round((testResponse.obtainedMarks / testResponse.totalMarks) * 100);
        testResponse.isPassed = testResponse.percentage >= (await Test.findById(testResponse.testId)).passingPercentage;
        testResponse.status = "Evaluated";
        
        await testResponse.save();
        
        res.status(200).json({ success: true, message: "Answer evaluated successfully", testResponse });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Generate AI questions (mock implementation)
exports.generateAIQuestions = async (req, res) => {
    try {
        const { testId, topic, questionCount, difficulty, questionType } = req.body;
        
        const test = await Test.findById(testId);
        if (!test) return res.status(404).json({ success: false, message: "Test not found" });
        
        // Mock AI questions - In production, integrate with OpenAI or similar API
        const mockQuestions = [
            {
                type: questionType || "MCQ",
                questionText: `Generated Question 1: What is the importance of ${topic}?`,
                options: [
                    { optionText: "Option A", isCorrect: true },
                    { optionText: "Option B", isCorrect: false },
                    { optionText: "Option C", isCorrect: false },
                    { optionText: "Option D", isCorrect: false }
                ],
                difficulty: difficulty || "Medium",
                explanation: "This is an auto-generated question explanation."
            }
        ];
        
        res.status(200).json({ 
            success: true, 
            message: "AI questions generated (mock)",
            questions: mockQuestions
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get test categories
exports.getCategories = (req, res) => {
    const categories = ["Programming", "General Knowledge", "Aptitude", "Science", "Math", "Language", "Custom"];
    res.status(200).json({ success: true, categories });
};

exports.takeTest = async (req, res) => {
    try {
        const test = await Test.findOne({
            publicLink: req.params.publicLink,
            isPublished: true
        });

        if (!test) {
            return res.status(404).send("Test not found or not published");
        }

        const questions = await Question.find({
            testId: test._id
        }).sort({ questionNumber: 1 });

       res.render("pages/take-test", {
         pageTitle: test.title,
         test,
         questions
     });

    } catch (error) {
        console.error("Failed to load test:", error);
        res.status(404).send("Test not found");
    }
};

// Render Test Results Page
exports.renderTestResultsPage = async (req, res) => {
    try {
        const response = await TestResponse.findById(req.params.responseId);

        if (!response) {
            return res.status(404).send("Response not found");
        }

        const test = await Test.findById(response.testId);

        const questions = await Question.find({
            testId: response.testId
        });

        res.render("index", {
            activePage: "test-results",
            content: "pages/test-results",
            pageTitle: "Test Results",
            response: {
                ...response.toObject(),
                test
            },
            questions
        });

    } catch (error) {
        console.error("Failed to load results:", error);
        res.status(500).send("Failed to load results");
    }
};

// Render Test Builder Page
exports.renderTestBuilderPage = async (req, res) => {
    try {
        const test = await Test.findById(req.params.testId);

        if (!test) {
            return res.status(404).send("Test not found");
        }

        const questions = await Question.find({
            testId: req.params.testId
        }).sort({ questionNumber: 1 });

        res.render("index", {
            activePage: "create-tests",
            content: "pages/test-builder",
            pageTitle: `Edit Test: ${test.title}`,
            test,
            questions
        });

    } catch (error) {
        console.error("Failed to load test:", error);
        res.status(500).send("Failed to load test");
    }
};