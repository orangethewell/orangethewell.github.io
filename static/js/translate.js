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
    document.getElementById("language").value = Language;
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

window.onload = function () {
    translatePage(Translations, Language);
    document.getElementById("language").value = Language;
};