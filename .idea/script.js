class QuestionListStorage {
    constructor() {
        this.storageKey = 'savedQuizzes';
    }

    saveQuiz(name, questions) {
        let savedQuizzes = this.getSavedQuizzes();
        savedQuizzes[name] = questions;
        localStorage.setItem(this.storageKey, JSON.stringify(savedQuizzes));
    }

    getSavedQuizzes() {
        const savedQuizzes = localStorage.getItem(this.storageKey);
        return savedQuizzes ? JSON.parse(savedQuizzes) : {};
    }

    loadQuiz(name) {
        const savedQuizzes = this.getSavedQuizzes();
        return savedQuizzes[name];
    }

    deleteQuiz(name) {
        let savedQuizzes = this.getSavedQuizzes();
        delete savedQuizzes[name];
        localStorage.setItem(this.storageKey, JSON.stringify(savedQuizzes));
    }

    displaySavedQuizzes() {
        const savedQuizzes = this.getSavedQuizzes();
        const container = document.getElementById('savedQuizzesList');
        container.innerHTML = '';
        for (const [name, questions] of Object.entries(savedQuizzes)) {
            const quizItem = document.createElement('div');
            quizItem.className = 'saved-quiz-item';
            quizItem.innerHTML = `
                <span>${name}</span>
                <div class="button-group">
                    <button class="icon-btn load-btn" title="Load Quiz"><i class="fas fa-upload"></i></button>
                    <button class="icon-btn edit-btn" title="Edit Quiz Name"><i class="fas fa-edit"></i></button>
                    <button class="icon-btn delete-btn" title="Delete Quiz"><i class="fas fa-trash"></i></button>
                </div>
            `;
            quizItem.querySelector('.load-btn').addEventListener('click', () => this.loadSavedQuiz(name));
            quizItem.querySelector('.edit-btn').addEventListener('click', () => this.editQuizName(name));
            quizItem.querySelector('.delete-btn').addEventListener('click', () => this.deleteQuizWithConfirmation(name));
            container.appendChild(quizItem);
        }
    }

    loadSavedQuiz(name) {
        const questions = this.loadQuiz(name);
        quiz.questions = questions;
        quiz.quizInput.value = quiz.questionsToString(questions);
        quiz.displayQuestionList();
    }

    editQuizName(oldName) {
        const newName = prompt("Enter new name for the quiz:", oldName);
        if (newName && newName !== oldName) {
            const savedQuizzes = this.getSavedQuizzes();
            savedQuizzes[newName] = savedQuizzes[oldName];
            delete savedQuizzes[oldName];
            localStorage.setItem(this.storageKey, JSON.stringify(savedQuizzes));
            this.displaySavedQuizzes();
        }
    }

    deleteQuizWithConfirmation(name) {
        if (confirm(`Are you sure you want to delete the quiz "${name}"?`)) {
            this.deleteQuiz(name);
            this.displaySavedQuizzes();
        }
    }
}

class Quiz {
    constructor() {
        this.questions = [];
        this.currentQuestion = 0;
        this.score = 0;
        this.answers = [];
        this.selectedAnswers = [];
        this.incorrectQuestions = [];
        this.storage = new QuestionListStorage();

        this.initializeElements();
        this.addEventListeners();
        this.storage.displaySavedQuizzes();

        // Initialize audio elements
        this.correctSound = new Audio('correct.mp3');
        this.errorSound = new Audio('error.mp3');
        this.mouseSound = new Audio('mouse.mp3');
    }

    initializeElements() {
        this.quizInput = document.getElementById('quizInput');
        this.createQuizBtn = document.getElementById('createQuizBtn');
        this.saveQuizBtn = document.getElementById('saveQuizBtn');
        this.quizCreator = document.getElementById('quizCreator');
        this.quizContainer = document.getElementById('quizContainer');
        this.quizPhase = document.getElementById('quizPhase');
        this.questionText = document.getElementById('questionText');
        this.quizText = document.getElementById('quizText');
        this.optionsContainer = document.getElementById('optionsContainer');
        this.submitAnswerBtn = document.getElementById('submitAnswerBtn');
        this.progressFill = document.getElementById('progressFill');
        this.finalResult = document.getElementById('finalResult');
        this.scoreDisplay = document.getElementById('scoreDisplay');
        this.quizSummary = document.getElementById('quizSummary');
        this.restartQuizBtn = document.getElementById('restartQuizBtn');
        this.retryIncorrectBtn = document.getElementById('retryIncorrectBtn');
        this.questionList = document.getElementById('questionList');
        this.motivationContainer = document.getElementById('motivationContainer');
    }

    addEventListeners() {
        this.createQuizBtn.addEventListener('click', () => this.createQuiz());
        this.saveQuizBtn.addEventListener('click', () => this.saveCurrentQuiz());
        this.submitAnswerBtn.addEventListener('click', () => this.checkAnswer());
        this.restartQuizBtn.addEventListener('click', () => this.restartQuiz());
        this.retryIncorrectBtn.addEventListener('click', () => this.retryIncorrectQuestions());
    }

    createQuiz() {
        const input = this.quizInput.value.trim();
        this.questions = this.parseInput(input);
        if (this.questions.length > 0) {
            this.displayQuestionList();
            this.startQuiz();
        } else {
            this.showNotification('Please enter valid questions and answers', 'error');
        }
    }

    saveCurrentQuiz() {
        const name = prompt("Enter a name for this quiz:");
        if (name) {
            this.storage.saveQuiz(name, this.questions);
            this.showNotification('Quiz saved successfully!', 'success');
            this.storage.displaySavedQuizzes();
        }
    }

    parseInput(input) {
        const questionBlocks = input.split(/(?=Câu hỏi:)/);
        return questionBlocks.map(questionBlock => {
            const lines = questionBlock.trim().split('\n');
            const questionText = lines[0].replace('Câu hỏi: ', '');
            const answerText = lines.slice(1).join(' ');
            const blanks = answerText.match(/\[([^\]]+)\]/g) || [];
            const options = blanks.map(blank => blank.slice(1, -1));

            return {
                questionText: questionText,
                answerText: answerText,
                blanks: blanks.map(blank => blank.slice(1, -1)),
                options: options
            };
        }).filter(q => q.questionText && q.answerText);
    }

    questionsToString(questions) {
        return questions.map(q =>
            `Câu hỏi: ${q.questionText}\n${q.answerText}`
        ).join('\n\n');
    }

    displayQuestionList() {
        this.questionList.innerHTML = '<h3>Entered Questions:</h3>';
        this.questions.forEach((q, index) => {
            const li = document.createElement('li');
            li.textContent = `Question ${index + 1}: ${q.questionText}`;
            this.questionList.appendChild(li);
        });
    }

    startQuiz() {
        this.quizCreator.classList.add('hidden');
        this.quizContainer.classList.remove('hidden');
        this.currentQuestion = 0;
        this.score = 0;
        this.answers = [];
        this.incorrectQuestions = [];
        this.showQuestion();
    }

    showQuestion() {
        const question = this.questions[this.currentQuestion];
        this.questionText.textContent = question.questionText;
        this.selectedAnswers = new Array(question.blanks.length).fill(null);

        let quizText = question.answerText;
        question.blanks.forEach((blank, index) => {
            quizText = quizText.replace(`[${blank}]`, `<span class="blank" data-index="${index}">_____</span>`);
        });

        this.quizText.innerHTML = quizText;

        this.updateProgressBar();

        this.optionsContainer.innerHTML = '';
        this.shuffleArray([...question.options]).forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('option-button');
            button.style.background = this.getRandomGradient();
            button.addEventListener('click', (e) => {
                this.mouseSound.play();
                this.selectAnswer(e, index, option);
            });
            this.optionsContainer.appendChild(button);
        });

        this.changeBackgroundColor();

        const blanks = this.quizText.querySelectorAll('.blank');
        blanks.forEach(blank => {
            blank.addEventListener('click', () => {
                this.mouseSound.play();
                this.removeAnswer(parseInt(blank.dataset.index));
            });
        });
    }

    selectAnswer(event, index, answer) {
        const emptyIndex = this.selectedAnswers.indexOf(null);
        if (emptyIndex !== -1) {
            this.mouseSound.play();
            this.selectedAnswers[emptyIndex] = answer;
            const blank = this.quizText.querySelector(`.blank[data-index="${emptyIndex}"]`);
            const button = event.target;

            const buttonRect = button.getBoundingClientRect();
            const blankRect = blank.getBoundingClientRect();

            const clone = button.cloneNode(true);
            clone.style.position = 'fixed';
            clone.style.left = `${buttonRect.left}px`;
            clone.style.top = `${buttonRect.top}px`;
            clone.style.width = `${buttonRect.width}px`;
            clone.style.height = `${buttonRect.height}px`;
            clone.style.margin = '0';
            clone.style.transition = 'all 0.5s ease';
            clone.style.zIndex = '1000';

            document.body.appendChild(clone);

            setTimeout(() => {
                clone.style.left = `${blankRect.left}px`;
                clone.style.top = `${blankRect.top}px`;
                clone.style.width = `${blankRect.width}px`;
                clone.style.height = `${blankRect.height}px`;
            }, 0);

            setTimeout(() => {
                blank.textContent = answer;
                blank.classList.add('filled');
                blank.style.background = button.style.background;
                button.disabled = true;
                button.style.opacity = '0.5';
                clone.remove();

                // Check if the answer is correct immediately
                const question = this.questions[this.currentQuestion];
                if (answer !== question.blanks[emptyIndex]) {
                    this.applyBuzzEffect(blank);
                    this.errorSound.play();
                }
            }, 500);

            // Check if all blanks are filled
            if (this.selectedAnswers.every(answer => answer !== null)) {
                this.checkAnswer();
            }
        }
    }

    removeAnswer(index) {
        if (this.selectedAnswers[index] !== null) {
            this.mouseSound.play();
            const answer = this.selectedAnswers[index];
            this.selectedAnswers[index] = null;
            const blank = this.quizText.querySelector(`.blank[data-index="${index}"]`);
            blank.textContent = '_____';
            blank.classList.remove('filled');
            blank.style.background = '';
            const button = Array.from(this.optionsContainer.children).find(btn => btn.textContent === answer);
            if (button) {
                button.disabled = false;
                button.style.opacity = '1';
            }

            blank.animate([
                { transform: 'scale(0.9)', opacity: 0.7 },
                { transform: 'scale(1)', opacity: 1 }
            ], {
                duration: 300,
                easing: 'ease-out'
            });
        }
    }

    checkAnswer() {
        const question = this.questions[this.currentQuestion];
        const isCorrect = JSON.stringify(this.selectedAnswers) === JSON.stringify(question.blanks);

        this.answers.push({
            question: question.questionText,
            isCorrect: isCorrect,
            userAnswers: this.selectedAnswers,
            correctAnswers: question.blanks
        });

        if (isCorrect) {
            this.score++;
            this.correctSound.play();
            this.showMotivation('success');
        } else {
            this.incorrectQuestions.push(this.currentQuestion);
            this.errorSound.play();
            this.showMotivation('error');
            this.applyBuzzEffectToAllIncorrect();
        }

        this.showResult(isCorrect);

        // Chuyển sang câu hỏi tiếp theo sau một khoảng thời gian ngắn
        setTimeout(() => {
            this.nextQuestion();
        }, 2000);
    }

    showResult(isCorrect) {
        const question = this.questions[this.currentQuestion];
        let resultText = question.answerText;
        question.blanks.forEach((blank, index) => {
            const userAnswer = this.selectedAnswers[index];
            const isCorrectAnswer = userAnswer === blank;
            resultText = resultText.replace(`[${blank}]`, `<span class="blank ${isCorrectAnswer ? 'correct' : 'incorrect'}">${blank}</span>`);
        });

        this.quizText.innerHTML = resultText;

        if (!isCorrect) {
            this.resetIncorrectAnswers();
        }
    }

    resetIncorrectAnswers() {
        const question = this.questions[this.currentQuestion];
        this.selectedAnswers.forEach((answer, index) => {
            if (answer !== question.blanks[index]) {
                this.removeAnswer(index);
            }
        });
    }

    applyBuzzEffect(element) {
        element.animate([
            { transform: 'translateX(-5px)' },
            { transform: 'translateX(5px)' },
            { transform: 'translateX(-5px)' },
            { transform: 'translateX(5px)' },
            { transform: 'translateX(0)' }
        ], {
            duration: 300,
            iterations: 2
        });
    }

    applyBuzzEffectToAllIncorrect() {
        const question = this.questions[this.currentQuestion];
        this.selectedAnswers.forEach((answer, index) => {
            if (answer !== question.blanks[index]) {
                const blank = this.quizText.querySelector(`.blank[data-index="${index}"]`);
                this.applyBuzzEffect(blank);
            }
        });
    }

    nextQuestion() {
        this.currentQuestion++;
        if (this.currentQuestion < this.questions.length) {
            this.showQuestion();
        } else {
            this.showFinalResult();
        }
    }


    updateProgressBar() {
        const progress = (this.currentQuestion / this.questions.length) * 100;
        this.progressFill.style.width = `${progress}%`;
    }

    showFinalResult() {
        this.quizContainer.classList.add('hidden');
        this.finalResult.classList.remove('hidden');

        const percentage = (this.score / this.questions.length) * 100;
        this.scoreDisplay.textContent = `You got ${this.score} out of ${this.questions.length} questions correct (${percentage.toFixed(2)}%).`;

        this.quizSummary.innerHTML = '';
        this.answers.forEach((answer, index) => {
            const questionSummary = document.createElement('div');
            questionSummary.innerHTML = `
                <p><strong>Question ${index + 1}:</strong> ${answer.question}</p>
                <p>Your answers: ${answer.userAnswers.join(', ')}</p>
                <p>Correct answers: ${answer.correctAnswers.join(', ')}</p>
                <p>Result: ${answer.isCorrect ? 'Correct' : 'Incorrect'}</p>
            `;
            this.quizSummary.appendChild(questionSummary);
        });

        if (this.incorrectQuestions.length > 0) {
            this.retryIncorrectBtn.classList.remove('hidden');
        } else {
            this.retryIncorrectBtn.classList.add('hidden');
        }
    }

    retryIncorrectQuestions() {
        this.questions = this.incorrectQuestions.map(index => this.questions[index]);
        this.incorrectQuestions = [];
        this.displayQuestionList();
        this.startQuiz();
    }

    restartQuiz() {
        this.quizInput.value = '';
        this.finalResult.classList.add('hidden');
        this.quizCreator.classList.remove('hidden');
        this.currentQuestion = 0;
        this.score = 0;
        this.answers = [];
        this.incorrectQuestions = [];
        this.updateProgressBar();
        this.questionList.innerHTML = '';
        this.storage.displaySavedQuizzes();
    }

    showNotification(message, type) {
        const notificationContainer = document.getElementById('notificationContainer');
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notificationContainer.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }

    showMotivation(type) {
        const motivations = {
            success: [
                "Great job! 🎉",
                "You're on fire! 🔥",
                "Keep up the good work! 💪",
                "Awesome! 👏",
                "You're nailing it! 🔨"
            ],
            error: [
                "Don't give up! 💪",
                "Keep trying! 🌟",
                "You're learning! 📚",
                "Mistakes help us grow! 🌱",
                "You've got this! 👊"
            ]
        };

        const message = this.getRandomItem(motivations[type]);
        const motivationContainer = document.getElementById('motivationContainer');
        motivationContainer.textContent = message;
        motivationContainer.className = `motivation ${type}`;
        motivationContainer.style.display = 'block';

        setTimeout(() => {
            motivationContainer.classList.add('fade-out');
            setTimeout(() => {
                motivationContainer.style.display = 'none';
                motivationContainer.classList.remove('fade-out');
            }, 500);
        }, 2500);
    }

    getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    getRandomGradient() {
        const color1 = this.getRandomColor();
        const color2 = this.getRandomColor();
        return `linear-gradient(135deg, ${color1}, ${color2})`;
    }

    getRandomColor() {
        const hue = Math.floor(Math.random() * 360);
        return `hsl(${hue}, 70%, 80%)`;
    }

    changeBackgroundColor() {
        document.body.style.backgroundColor = this.getRandomColor();
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Quiz();
});
