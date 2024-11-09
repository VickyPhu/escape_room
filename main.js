window.addEventListener('DOMContentLoaded', main);

function main() {
    loadStartScene();
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

function loadPremiseScene() {
    sceneContainer.innerHTML = '';
    const premiseScene = document.createElement('img');
    premiseScene.src = 'images/premise.webp';

    const premiseText = document.createElement('p');
    premiseText.innerHTML = 'You’re a detective investigating the mysterious disappearance of Lady Eleanor, the wealthy owner of a mansion who vanished twenty years ago. Since then, countless visitors have entered the mansion, only to disappear without a trace, leaving behind cryptic notes and elusive clues.<br><br>Now, you’ve entered the mansion, only to find yourself trapped. The only way out is to solve the passcode hidden within its walls. As the detective, it’s your mission to uncover what happened within this haunted estate two decades ago and unravel the truth behind the vanishings. Search for hidden notes and keys to unlock rooms and secrets that reveal the mansion’s chilling past.'
    premiseText.classList.add('premise_text');

    const button = document.createElement('button');
    button.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
    button.classList.add('next_button');
    button.onclick = loadEntranceHall;

    sceneContainer.append(premiseScene, premiseText, button)
}

function loadEntranceHall() {
    
}