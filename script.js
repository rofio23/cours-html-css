
// =====================================
// MENU RESPONSIVE
// =====================================

const menuBtn = document.getElementById("menuBtn");
const navigation = document.getElementById("navigation");

menuBtn.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");

  menuBtn.textContent = isOpen ? "✕" : "☰";
  menuBtn.setAttribute("aria-expanded", String(isOpen));
  menuBtn.setAttribute(
    "aria-label",
    isOpen ? "Fermer le menu" : "Ouvrir le menu"
  );
});

// Fermer le menu après un clic sur un lien
document.querySelectorAll("#navigation a").forEach(link => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuBtn.textContent = "☰";
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Ouvrir le menu");
  });
});

// =====================================
// THÈME CLAIR / SOMBRE
// =====================================

const themeBtn = document.getElementById("themeBtn");

function updateThemeButton() {
  const isLight = document.body.classList.contains("light");
  themeBtn.textContent = isLight ? "🌙" : "☀️";
  themeBtn.setAttribute(
    "aria-label",
    isLight ? "Activer le thème sombre" : "Activer le thème clair"
  );
}

try {
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
  }
} catch (error) {
  // Le site reste utilisable sans stockage local.
}

updateThemeButton();

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  updateThemeButton();

  try {
    localStorage.setItem(
      "theme",
      document.body.classList.contains("light")
        ? "light"
        : "dark"
    );
  } catch (error) {
    // Le changement de thème fonctionne quand même.
  }
});

// =====================================
// QUESTIONS DU QUIZ
// =====================================

const questions = [
  {
    question: "À quoi sert le HTML ?",
    answers: [
      "À modifier les couleurs",
      "À structurer une page web",
      "À créer une base de données"
    ],
    correct: 1,
    explanation: "HTML organise les éléments d'une page."
  },
  {
    question: "Quelle balise crée un paragraphe ?",
    answers: [
      "<h1>",
      "<div>",
      "<p>"
    ],
    correct: 2,
    explanation: "La balise <p> représente un paragraphe."
  },
  {
    question: "Quelle balise permet de créer un lien ?",
    answers: [
      "<a>",
      "<img>",
      "<link>"
    ],
    correct: 0,
    explanation: "La balise <a> crée un lien hypertexte."
  },
  {
    question: "À quoi sert le CSS ?",
    answers: [
      "À styliser les pages web",
      "À stocker des utilisateurs",
      "À créer un serveur"
    ],
    correct: 0,
    explanation: "CSS contrôle l'apparence des éléments HTML."
  },
  {
    question: "Quelle propriété change la couleur du texte ?",
    answers: [
      "background",
      "color",
      "font-size"
    ],
    correct: 1,
    explanation: "La propriété color change la couleur du texte."
  },
  {
    question: "Quelle propriété active Flexbox ?",
    answers: [
      "position: flex",
      "flex: true",
      "display: flex"
    ],
    correct: 2,
    explanation: "display: flex active la disposition Flexbox."
  }
];

// =====================================
// FONCTIONNEMENT DU QUIZ
// =====================================

let currentQuestion = 0;
let score = 0;
let answered = false;

const questionCount = document.getElementById("questionCount");
const scoreElement = document.getElementById("score");
const progressBar = document.getElementById("progressBar");
const questionText = document.getElementById("questionText");
const answersContainer = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");

function showQuestion() {
  answered = false;

  const q = questions[currentQuestion];

  questionCount.textContent =
    `Question ${currentQuestion + 1} / ${questions.length}`;

  scoreElement.textContent = `Score : ${score}`;

  progressBar.style.width =
    `${(currentQuestion / questions.length) * 100}%`;

  questionText.textContent = q.question;
  answersContainer.innerHTML = "";
  feedback.textContent = "";

  nextBtn.hidden = true;
  restartBtn.hidden = true;

  q.answers.forEach((answer, index) => {
    const button = document.createElement("button");

    button.className = "answer";
    button.textContent = answer;
    button.type = "button";

    button.addEventListener("click", () => {
      checkAnswer(index);
    });

    answersContainer.appendChild(button);
  });
}

function checkAnswer(selectedIndex) {
  if (answered) return;

  answered = true;

  const q = questions[currentQuestion];
  const buttons = answersContainer.querySelectorAll("button");

  buttons.forEach((button, index) => {
    button.disabled = true;

    if (index === q.correct) {
      button.classList.add("correct");
    }

    if (index === selectedIndex && index !== q.correct) {
      button.classList.add("wrong");
    }
  });

  if (selectedIndex === q.correct) {
    score++;
    feedback.textContent = "✅ Bonne réponse ! " + q.explanation;
  } else {
    feedback.textContent = "❌ Pas tout à fait. " + q.explanation;
  }

  scoreElement.textContent = `Score : ${score}`;
  nextBtn.textContent =
    currentQuestion === questions.length - 1
      ? "Voir mon résultat →"
      : "Question suivante →";

  nextBtn.hidden = false;
}

nextBtn.addEventListener("click", () => {
  currentQuestion++;

  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showResults();
  }
});

function showResults() {
  progressBar.style.width = "100%";
  questionCount.textContent = "Quiz terminé";
  questionText.textContent =
    `Ton résultat : ${score} / ${questions.length}`;

  answersContainer.innerHTML = "";
  feedback.textContent =
    score === questions.length
      ? "🏆 Excellent ! Toutes les réponses sont correctes."
      : score >= 4
      ? "🎉 Très bien ! Continue à pratiquer."
      : "💪 Relis les cours et réessaie !";

  nextBtn.hidden = true;
  restartBtn.hidden = false;
}

restartBtn.addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  showQuestion();
});

// Démarrer le quiz
showQuestion();

