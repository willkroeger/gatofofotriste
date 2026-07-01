let gameLoop;
let movementLoop;

let time = 60;
let happy = 30;

let isMoving = false;
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

let imgScaleX = 1;

let isChanging = false;
let selecionado = false;

let typewriterTimeout;
let isTyping = false;
const mensagemJanela = [
    "O dia parece... rosa?", 
    "Não há muito a se fazer na vida de um gato fofo triste.", 
    "Apesar de tudo, as coisas ainda são as mesmas."
]

const imgGatoFofoTriste = '../imgs/gatofofotriste.png';
const imgChapeuBobo = '../imgs/gato_chapeu_bobo.png';
const ChapeuBobo = '../imgs/chapeu_bobo.png';

const canvas = document.getElementById("canvas");
const startScreen = document.getElementById("start-screen");
const container = document.getElementById('container');
const UI = document.getElementById("UI");

const timer = document.getElementById("timer");
const happiness = document.getElementById("happiness");
const statusSpan = document.getElementById("status-span");

const tamagotchi = document.getElementById("tamagotchi");

const armario = document.getElementById("armario");

const janela = document.getElementById("janela");
const caixaTexto = document.getElementById('caixa-texto');
const caixaArmario = document.getElementById('caixa-armario');

function iniciar() {
    startScreen.style.display = 'none';
    container.style.display = 'flex';

    UI.style.display = tamagotchi.style.display = armario.style.display = janela.style.display = 'flex';

    tamagotchi.addEventListener('click', alisarPelo);
    tamagotchi.addEventListener('mousedown', inicioArrastar);
    document.addEventListener('mousemove', arrastar);
    document.addEventListener('mouseup', fimArrastar);

    gameLoop = setInterval(() => {
        if (time > 0 && happy > 0) {
            time--;
            happy -= 3;
            if (time < 0) time = 0;
            if (happy < 0) happy = 0;
            updateUI();
        } else {
            gameOver();
        }
    }, 1000);

    movementLoop = setInterval(dancaGatinho, 4000);
    
    updateUI();
};

function gameOver() {
    if (happy <= 0) alert('gato fofo triste morreu de tristeza :(');
    if (time <= 0) alert('gato fofo triste cresceu! Agora, ele se tornou um gato velho chato e não quer mais brincar...');
    window.location.reload();
    tamagotchi.style.animation = 'none';
    tamagotchi.style.cursor = armario.style.cursor = janela.style.cursor =  'auto';
    clearInterval(gameLoop);
}

function comoJogar() {
    alert('Neste pequeno quarto, você deve manter feliz um pequeno gato fofo triste. Para isso, dê carinho a ele pressionando o botão esquerdo do mouse, carregando-o por seu quarto e trocando suas roupas até que o tempo se encerre!'); 
}

function updateUI() {
    timer.innerText = 'tempo: ' + time + 's';
    happiness.style.width = (happy/1.15) + '%';

    if (happy > 75) {
        happiness.style.backgroundColor = '#D9BC8B';
        statusSpan.innerText = '😹';
    } else if (happy > 30) {
        happiness.style.backgroundColor = '#8BC9D9';
        statusSpan.innerText = '😺';
    } else {
        happiness.style.backgroundColor = '#8B98D9';
        statusSpan.innerText = '😿';
    }
};

function dancaGatinho() {
    if (!isChanging && !isDragging && happy > 0 && time > 0) {
        isMoving = true;
        tamagotchi.style.cursor = 'not-allowed';
        tamagotchi.style.transition = 'left 1.5s ease-in-out, top 1.5s ease-in-out, transform 0.1s ease';

        const maxX = canvas.clientWidth - tamagotchi.offsetWidth;
        const maxY = canvas.clientHeight - tamagotchi.offsetHeight;

        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.max(230, Math.floor(Math.random() * maxY));

        const currentX = tamagotchi.offsetLeft;

        if (randomX > currentX) {
            imgScaleX = -1;
        } else {
            imgScaleX = 1;
        };

        tamagotchi.style.transform = `scaleX(${imgScaleX})`;
        tamagotchi.style.setProperty('--flip',`scaleX(${imgScaleX})`);

        tamagotchi.style.left = randomX + 'px';
        tamagotchi.style.top = randomY + 'px';

        setTimeout(() => {
            isMoving = false;
            tamagotchi.style.cursor = 'grab';
        }, 1500);
    }
}

function inicioArrastar(e) {
    if (time > 0 && happy > 0 && !isTyping) {
        if (isMoving) return;
        isDragging = true;
        tamagotchi.style.cursor = 'grab';
        
        tamagotchi.style.transition = 'transform 0.1s ease';
        tamagotchi.style.transform = `scaleX(${imgScaleX})`;
        
        tamagotchi.style.animation = 'none';

        const rect = tamagotchi.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;
    }
};

function arrastar(e) {
    if (isDragging && time > 0 && happy > 0) {
        tamagotchi.style.cursor = 'grabbing';

        const canvasRect = canvas.getBoundingClientRect();
        
        let newX = e.clientX - canvasRect.left - canvas.clientLeft - dragOffsetX;
        let newY = e.clientY - canvasRect.top - canvas.clientTop - dragOffsetY;

        const maxX = canvas.clientWidth - tamagotchi.offsetWidth;
        const maxY = canvas.clientHeight - tamagotchi.offsetHeight;

        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(230, Math.min(newY, maxY));

        tamagotchi.style.left = newX + 'px';
        tamagotchi.style.top = newY + 'px';
    };
}; 

function fimArrastar() {
    if (isDragging && time > 0 && happy > 0) {
        isDragging = false;
        tamagotchi.style.cursor = 'grab';
        tamagotchi.style.transform = `scaleX(${imgScaleX})`;
        tamagotchi.style.animation = 'bounce 0.4s alternate infinite';
    };
};

function alisarPelo() {
    if (time > 0 && happy > 0 && !isDragging && !isMoving && !isTyping) {
        happy += 5;
        if (happy > 100) happy = 100;
        updateUI();

        tamagotchi.style.cursor = 'grabbing';
        tamagotchi.style.transform = `scaleX(${imgScaleX}) scale(1.2)`;
        setTimeout(() => {
            if (!isDragging) {
                tamagotchi.style.transform = `scaleX(${imgScaleX}) scale(1)`;
                tamagotchi.style.cursor = 'grab';
            }
        }, 100);
    };
};

function abrirArmario() {
    if (time <= 0 || happy <= 0 || isTyping == true) return;
    isChanging = true;
    tamagotchi.style.cursor = 'auto';
    
    tamagotchi.style.transition = "left 1s ease-in-out, top 1s ease-in-out, transform 0.2s";
    
    const centroX = (canvas.clientWidth - tamagotchi.offsetWidth) / 2;
    const centroY = (canvas.clientHeight - tamagotchi.offsetHeight) / 2 + 50;

    imgScaleX = 1;
    tamagotchi.style.transform = `scaleX(1)`;
    tamagotchi.style.setProperty(`--flip`, `scaleX(1)`);

    tamagotchi.style.left = centroX + 'px';
    tamagotchi.style.top = centroY + 'px';

    caixaArmario.style.display = 'block';
}

function fecharArmario() {
    isChanging = false;
    caixaArmario.style.display = 'none';
    tamagotchi.style.cursor = 'grab';
}

function mudarChapeu(chapeu) {
    selecionado = true;
    happy += 20;
    if (happy > 100) happy = 100;
    tamagotchi.src = chapeu;
}

function previewChapeu(chapeu) {
    if (!selecionado) {
        tamagotchi.src = chapeu;
    }
}

function endPreview() {
    if (selecionado == true) return;
    tamagotchi.src = imgGatoFofoTriste;
}

function abrirMensagem() {
    if (time <= 0 || happy <= 0) return;
    isTyping = true;
    const fraseSorteada = mensagemJanela[Math.floor(Math.random() * mensagemJanela.length)];

    caixaTexto.style.display = 'block';
    caixaTexto.innerHTML = "";

    clearTimeout(typewriterTimeout);

    let i = 0;
    function digitar() {
        if (i < fraseSorteada.length) {
            caixaTexto.innerHTML += fraseSorteada.charAt(i);
            i++;
            typewriterTimeout = setTimeout(digitar, 50);
        } else {
            caixaTexto.innerHTML += "<br><span style='color: #D98997; font-size:15px; float:right; cursor: pointer;'>[fechar]</span>"
        }
    }
    digitar();
}

function fecharMensagem() {
    isTyping = false;
    caixaTexto.style.display = 'none';
    clearTimeout(typewriterTimeout);
}