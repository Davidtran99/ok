let questions = [];
let currentQuestion = 0;
let score = 0;
let contextTimer;
let questionTimer;

const quizCreator = document.getElementById('quizCreator');
const quizContainer = document.getElementById('quizContainer');
const topicInput = document.getElementById('topicInput');
const contextInput = document.getElementById('contextInput');
const questionInput = document.getElementById('questionInput');
const optionsContainer = document.getElementById('optionsContainer');
const correctAnswersContainer = document.getElementById('correctAnswersContainer');
const addOptionBtn = document.getElementById('addOptionBtn');
const addQuestionBtn = document.getElementById('addQuestionBtn');
const startQuizBtn = document.getElementById('startQuizBtn');

const contextDisplay = document.getElementById('contextDisplay');
const questionDisplay = document.getElementById('questionDisplay');
const resultDisplay = document.getElementById('resultDisplay');
const contextText = document.getElementById('contextText');
const contextTimer = document.getElementById('contextTimer');
const questionText = document.getElementById('questionText');
const optionsDisplay = document.getElementById('optionsDisplay');
const questionTimer = document.getElementById('questionTimer');
const scoreDisplay = document.getElementById('score');
const nextBtn = document.getElementById('nextBtn');

addOptionBtn.addEventListener('click', addOption);
addQuestionBtn.addEventListener('click', addQuestion);
startQuizBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);

function addOption() {
    const newOption = document.createElement('input');
    newOption.type = 'text';
    newOption.className = 'optionInput';
    newOption.placeholder = `Đáp án ${optionsContainer.children.length + 1}`;
    optionsContainer.appendChild(newOption);

    const newCheckbox = document.createElement('input');
    newCheckbox.type = 'checkbox';
    newCheckbox.name = 'correctAnswer';
    newCheckbox.value = optionsContainer.children.length - 1;
    const label = document.createElement('label');
    label.appendChild(newCheckbox);
    label.appendChild(document.createTextNode(` Đáp án ${optionsContainer.children.length}`));
    correctAnswersContainer.appendChild(label);
}

function addQuestion() {
    const topic = topicInput.value;
    const context = contextInput.value;
    const questionText = questionInput.value;
    const options = Array.from(optionsContainer.children).map(input => input.value);
    const correctAnswers = Array.from(correctAnswersContainer.querySelectorAll('input:checked')).map(checkbox => parseInt(checkbox.value));

    if (topic && context && questionText && options.length >= 2 && correctAnswers.length > 0) {
        questions.push({topic, context, question: questionText, options, correctAnswers});
        resetInputs();
        alert('Câu hỏi đã được thêm!');
    } else {
        alert('Vui lòng điền đầy đủ thông tin!');
    }
}

function resetInputs() {
    topicInput.value = '';
    contextInput.value = '';
    questionInput.value = '';
    optionsContainer.innerHTML = '';
    correctAnswersContainer.innerHTML = '<p>Chọn đáp án đúng:</p>';
    addOption();
    addOption();
}

function startQuiz() {
    if (questions.length === 0) {
        alert('Vui lòng thêm ít nhất một câu hỏi trước khi bắt đầu quiz!');
        return;
    }
    quizCreator.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    showContext();
}

function showContext() {
    contextDisplay.classList.remove('hidden');
    questionDisplay.classList.add('hidden');
    nextBtn.classList.add('hidden');

    const currentQ = questions[currentQuestion];
    contextText.textContent = currentQ.context;

    let timeLeft = 10;
    contextTimer.textContent = `Thời gian còn lại: ${timeLeft}s`;

    contextTimer = setInterval(() => {
        timeLeft--;
        contextTimer.textContent = `Thời gian còn lại: ${timeLeft}s`;
        if (timeLeft === 0) {
            clearInterval(contextTimer);
            showQuestion();
        }
    }, 1000);
}

function showQuestion() {
    contextDisplay.classList.add('hidden');
    questionDisplay.classList.remove('hidden');
    nextBtn.classList.add('hidden');

    const currentQ = questions[currentQuestion];
    questionText.textContent = currentQ.question;

    optionsDisplay.innerHTML = '';
    currentQ.options.forEach((option, index) => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `option${index}`;
        checkbox.value = index;

        const label = document.createElement('label');
        label.htmlFor = `option${index}`;
        label.textContent = option;

        const div = document.createElement('div');
        div.classList.add('option');
        div.appendChild(checkbox);
        div.appendChild(label);

        optionsDisplay.appendChild(div);
    });

    let timeLeft = 30;
    questionTimer.textContent = `Thời gian còn lại: ${timeLeft}s`;

    questionTimer = setInterval(() => {
        timeLeft--;
        questionTimer.textContent = `Thời gian còn lại: ${timeLeft}s`;
        if (timeLeft === 0) {
            clearInterval(questionTimer);
            checkAnswer();
        }
    }, 1000);
}

function checkAnswer() {
    clearInterval(questionTimer);

    const selectedAnswers = Array.from(optionsDisplay.querySelectorAll('input:checked')).map(input => parseInt(input.value));
    const correctAnswers = questions[currentQuestion].correctAnswers;

    if (JSON.stringify(selectedAnswers.sort()) === JSON.stringify(correctAnswers.sort())) {
        score++;
    }

    nextBtn.classList.remove('hidden');
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        showContext();
    } else {
        showResult();
    }
}

function showResult() {
    contextDisplay.classList.add('hidden');
    questionDisplay.classList.add('hidden');
    nextBtn.classList.add('hidden');
    resultDisplay.classList.remove('hidden');

    scoreDisplay.textContent = `Bạn đã trả lời đúng ${score} trên ${questions.length} câu hỏi.`;
}

// Khởi tạo với 2 đáp án
addOption();
addOption();