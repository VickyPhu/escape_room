window.addEventListener('DOMContentLoaded', main);

function main() {
    loadStartScene()
}

function loadStartScene() {
    const startScene = document.createElement('img');
    startScene.src ="images/haunted_house.webp";

    const gameName = document.createElement('h1');
    gameName.textContent = 'Vanished in Silence';
    gameName.classList.add('h1');

    const button = document.createElement('button');
    button.textContent = 'Start';
    button.onclick = loadPremiseScene;
    button.classList.add('startButton');

    sceneContainer.append(startScene, gameName, button);
}