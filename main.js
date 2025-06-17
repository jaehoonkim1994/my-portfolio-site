let quizData = [];
let currentQuestionIndex = 0;
let score = 0;

// 퀴즈 데이터 로드
async function loadQuizData() {
    try {
        const response = await fetch('quiz-data.json');
        const data = await response.json();
        quizData = data.quizzes;
        showQuestion();
    } catch (error) {
        console.error('퀴즈 데이터를 불러오는데 실패했습니다:', error);
    }
}

// 문제 표시
function showQuestion() {
    const questionData = quizData[currentQuestionIndex];
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options');
    const questionNumberElement = document.getElementById('question-number');
    const progressBar = document.getElementById('progress-bar');

    // 문제 번호와 진행바 업데이트
    questionNumberElement.textContent = `문제 ${currentQuestionIndex + 1}/${quizData.length}`;
    progressBar.style.width = `${((currentQuestionIndex + 1) / quizData.length) * 100}%`;

    // 문제 텍스트 설정
    questionElement.textContent = questionData.question;

    // 선택지 생성
    optionsContainer.innerHTML = '';
    questionData.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'w-full p-4 text-left bg-white border border-gray-200 rounded-lg hover:bg-teal-50 transition-colors';
        button.textContent = option;
        button.onclick = () => checkAnswer(index);
        optionsContainer.appendChild(button);
    });

    // 설명 숨기기
    document.getElementById('explanation').classList.add('hidden');
}

// 답안 체크
function checkAnswer(selectedIndex) {
    const questionData = quizData[currentQuestionIndex];
    const optionsContainer = document.getElementById('options');
    const explanationContainer = document.getElementById('explanation');
    const buttons = optionsContainer.getElementsByTagName('button');

    // 모든 버튼 비활성화
    Array.from(buttons).forEach(button => {
        button.disabled = true;
        if (buttons[questionData.correct] === button) {
            button.classList.add('bg-green-100', 'border-green-500');
        } else if (buttons[selectedIndex] === button && selectedIndex !== questionData.correct) {
            button.classList.add('bg-red-100', 'border-red-500');
        }
    });

    // 정답 체크 및 점수 업데이트
    if (selectedIndex === questionData.correct) {
        score += 20;
        document.getElementById('score').textContent = `점수: ${score}`;
    }

    // 설명 표시
    explanationContainer.classList.remove('hidden');
    explanationContainer.querySelector('p').textContent = questionData.explanation;

    // 다음 문제로 진행
    setTimeout(() => {
        if (currentQuestionIndex < quizData.length - 1) {
            currentQuestionIndex++;
            showQuestion();
        } else {
            showResult();
        }
    }, 2000);
}

// 결과 표시
function showResult() {
    document.getElementById('quiz-container').classList.add('hidden');
    document.getElementById('result-container').classList.remove('hidden');
    document.getElementById('final-score').textContent = score;
}

// 퀴즈 재시작
document.getElementById('restart-button').onclick = () => {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('score').textContent = '점수: 0';
    document.getElementById('quiz-container').classList.remove('hidden');
    document.getElementById('result-container').classList.add('hidden');
    showQuestion();
};

// 퀴즈 시작
loadQuizData();