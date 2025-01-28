import React from 'react';
import ReactDOM from 'react-dom/client';
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

var Translations = {
  "en": {
      "greeting": "Hello",
      "intro": "I'm Wellington Júnior, a web development student and programmer. Since <b class='text-body-emphasis'>2005</b> existing and since my <b class='text-body-emphasis'>14 years old</b> creating silly programs and odd tools. Most self-taught, with a lot of <b class='text-body-emphasis'>curiosity</b> and <b class='text-body-emphasis'>creativity</b> moving me to learn and create.",
      "notOrange": "And <b class='text-body-emphasis'>no</b>, I'm not a <b class='text-body-emphasis'>orange</b>.",
      "myProjects": "My Projects",
      "whoAmI": "Who am I?",
      "codeBtn": "Code",
      "WhoAmIBox": [
          "I'm Orangethewell",
          "I'm a web developer",
          "I'm a artist",
          "I'm a freelancer",
          "I'm a dog lover",
          "Orangethewell: <code>/Earth/Brazil/MG</code>"
      ],
      "projectDescription1": "A time management website when you need to turn your routine more productive.",
      "projectDescription2": "A weather website that requests information from OpenWeatherMap.",
      "projectDescription3": "A listing tool for fellow web surfers."
  },
  "pt": {
      "greeting": "Olá",
      "intro": "Eu sou Wellington Júnior, estudante de desenvolvimento web e programador. Existindo desde <b class='text-body-emphasis'>2005</b> e criando programas bobinhos e ferramentas estranhas desde os meus <b class='text-body-emphasis'>14 anos de idade</b>. Na maior parte autodidata, com um muita <b class='text-body-emphasis'>curiosidade</b> e <b class='text-body-emphasis'>criatividade</b> me movimentando a aprender e criar.",
      "notOrange": "E <b class='text-body-emphasis'>não</b>, eu não sou uma <b class='text-body-emphasis'>laranja</b>.",
      "myProjects": "Meus Projetos",
      "whoAmI": "Quem sou eu?",
      "codeBtn": "Código",
      "WhoAmIBox": [
          "Eu sou Orangethewell",
          "Eu sou um desenvolvedor web",
          "Eu sou um artista",
          "Eu sou um freelancer",
          "Eu sou um amante de cachorros",
          "Orangethewell: <code>/Terra/Brasil/MG</code>"
      ],
      "projectDescription1": "Um site de gerenciamento de tempo para tornar sua rotina mais produtiva.",
      "projectDescription2": "Um site de previsão do tempo que busca informações do OpenWeatherMap.",
      "projectDescription3": "Uma ferramenta para criar listas para alguns surfistas da internet."
  }
}
var Language = function () {
  const browserLanguage = navigator.language || navigator.userLanguage;
  return browserLanguage.startsWith("pt") ? "pt" : "en";
}()

function translatePage(translations, lang="") {    
  // Aplica as traduções aos elementos
  if (lang) Language = lang
  document.querySelectorAll("[class^='lang-']").forEach(element => {
      // Extrai o identificador de frase
      const phraseId = element.className.match(/lang-([^\s]+)/)[1];

      // Verifica se há uma tradução para o idioma e o identificador
      if (translations[Language] && translations[Language][phraseId]) {
          element.innerHTML = translations[Language][phraseId];
      }
  });
}

const defaultLanguage = "en";

const fetchLastCommit = async (username, repo, setCommitDate) => {
  try {
    const response = await fetch(`https://api.github.com/repos/${username}/${repo}/commits`);
    if (!response.ok) throw new Error("Error searching for commits.");

    const data = await response.json();
    const lastCommit = data[0];
    const commitDate = new Date(lastCommit.commit.author.date).toLocaleString();
    setCommitDate(commitDate);
  } catch (error) {
    setCommitDate("Something went wrong loading commit.");
    console.error(error);
  }
};

const Home = () => {
  const [language, setLanguage] = useState(defaultLanguage);
  const [name, setName] = useState("");
  const [commitDates, setCommitDates] = useState({
    watcherTime: "0 mins",
    weatherNow: "0 mins",
    listingTool: "0 mins",
  });

  const setTranslation = (lang) => {
    setLanguage(lang);
    translatePage(Translations, lang);
    typeWriter(Translations[lang]["WhoAmIBox"][0]);
  };

  const typeWriter = (text) => {
    let i = 0;
    const typing = setInterval(() => {
      if (i < text.length) {
        setName((prev) => prev + text[i]);
        i++;
      } else {
        clearInterval(typing);
      }
    }, 150);
  };

  const whoAmI = () => {
    const texts = Translations[language]["WhoAmIBox"];
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    typeWriter(randomText);
  };

  useEffect(() => {
    fetchLastCommit("orangethewell", "watcher-time", (date) =>
      setCommitDates((prev) => ({ ...prev, watcherTime: date }))
    );
    fetchLastCommit("orangethewell", "weather-now", (date) =>
      setCommitDates((prev) => ({ ...prev, weatherNow: date }))
    );
    fetchLastCommit("orangethewell", "listing-tool", (date) =>
      setCommitDates((prev) => ({ ...prev, listingTool: date }))
    );
    typeWriter(Translations[defaultLanguage]["WhoAmIBox"][0]);
  }, []);

  return (
    <div className="container">
      <div className="px-4 py-5 my-5 text-center">
        <div className="language-selector">
          <select onChange={(e) => setTranslation(e.target.value)} defaultValue={language}>
            <option value="en">English</option>
            <option value="pt">Português</option>
          </select>
        </div>

        <img
          style={{ imageRendering: "pixelated" }}
          className="d-block mx-auto mb-4"
          src="/icon-black.png"
          alt=""
          width="128"
          height="128"
        />

        <h1 className="display-5 fw-bold text-body-emphasis">
          <span>{name}</span>
          <span className="edit-cursor">_</span>
        </h1>

        <div className="col-lg-6 mx-auto">
          <p className="lead mb-4">
            <span>
              I&#39;m Wellington Júnior, a web development student and programmer. Since <b>2005</b>
              existing and since my <b>14 years old</b> creating silly programs and odd tools. Most
              self-taught, with a lot of <b>curiosity</b> and <b>creativity</b> moving me to learn
              and create.
            </span>
          </p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <a href="#projects" className="btn btn-primary btn-lg px-4 gap-3">
              My Projects
            </a>
            <button
              onClick={whoAmI}
              type="button"
              className="btn btn-outline-secondary btn-lg px-4"
            >
              Who am I?
            </button>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      <div id="projects" className="album py-5">
        <div className="container">
          <div className="row align-items-md-stretch row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            <ProjectCard
              id="project-watcher-time"
              image="/watcher-time.png"
              description="A time management website when you need to turn your routine more productive."
              githubUrl="https://github.com/orangethewell/watcher-time"
              liveUrl="https://orangethewell.github.io/watcher-time"
              commitDate={commitDates.watcherTime}
            />
            <ProjectCard
              id="project-weather-now"
              image="/weather-now.png"
              description="A weather website that requests information from OpenWeatherMap."
              githubUrl="https://github.com/orangethewell/weather-now"
              liveUrl="https://weather-now-bay-beta.vercel.app/"
              commitDate={commitDates.weatherNow}
            />
            <ProjectCard
              id="project-listing-tool"
              image="/listing-tool.png"
              description="A listing tool for fellow web surfers."
              githubUrl="https://github.com/orangethewell/listing-tool"
              liveUrl="https://orangethewell.github.io/listing-tool/"
              commitDate={commitDates.listingTool}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectCard = ({ id, image, description, githubUrl, liveUrl, commitDate }) => {
  return (
    <div id={id} className="col album-object">
      <div className="card shadow-sm h-100">
        <img className="project-thumb" src={image} alt="Project thumbnail" />
        <div className="card-body d-flex flex-column">
          <p className="card-text flex-grow-1">{description}</p>
          <div className="d-flex justify-content-between align-items-center">
            <div className="btn-group">
              <a
                href={githubUrl}
                type="button"
                className="btn btn-sm btn-outline-secondary"
              >
                <i className="bi bi-github"></i> Code
              </a>
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                type="button"
                className="btn btn-sm btn-outline-secondary"
              >
                <i className="bi bi-globe"></i> Web
              </a>
            </div>
            <small className="text-body-secondary commit-message ms-5 m-md-0">
              {commitDate}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Home />
);