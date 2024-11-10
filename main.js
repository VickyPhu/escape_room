window.addEventListener('DOMContentLoaded', main);

function main() {
    loadStartScene();
}

function loadStartScene() {
    const startScene = document.createElement('img');
    startScene.src ="images/haunted_house.webp";
    startScene.classList.add('background_image')

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
    premiseScene.classList.add('background_image');

    const premiseText = document.createElement('p');
    premiseText.innerHTML = 'You’re a detective investigating the mysterious disappearance of Lady Eleanor, the wealthy owner of a mansion who vanished twenty years ago. Since then, countless visitors have entered the mansion, only to disappear without a trace, leaving behind cryptic notes and elusive clues.<br><br>Now, you’ve entered the mansion, only to find yourself trapped. The only way out is to solve the passcode hidden within its walls. As the detective, it’s your mission to uncover what happened within this haunted estate two decades ago and unravel the truth behind the vanishings. Search for hidden notes and keys to unlock rooms and secrets that reveal the mansion’s chilling past.'
    premiseText.classList.add('premise_text');

    const button = document.createElement('button');
    button.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
    button.classList.add('next_button');
    button.onclick = loadEntranceHall;

    sceneContainer.append(premiseScene, premiseText, button);
}

function loadEntranceHall() {
    sceneContainer.innerHTML = '';
    const entranceHall = document.createElement('img');
    entranceHall.src = 'images/entrance_hall.webp';
    entranceHall.classList.add('background_image');
    
    const leftButton = document.createElement('button');
    leftButton.textContent = 'Library';
    leftButton.onclick = loadLibraryScene;
    leftButton.classList.add('left_button');

    const rightButton = document.createElement('button');
    rightButton.textContent = 'Dining Room';
    rightButton.onclick = loadDiningRoomScene;
    rightButton.classList.add('right_button');

    const entranceHallNote = document.createElement('img');
    entranceHallNote.src = 'images/note.webp';
    entranceHallNote.classList.add('entrance_hall_note');

    sceneContainer.append(entranceHall, leftButton, rightButton, entranceHallNote);

    //View the text on the note and close it
    const noteOverlay = document.createElement('div');
    noteOverlay.classList.add('note_overlay');
    //hide the note at first
    noteOverlay.style.display = 'none'

    const largeNote = document.createElement('img');
    largeNote.src = 'images/note.webp';
    largeNote.classList.add('large_note');

    const noteText = document.createElement('p');
    noteText.classList.add('note_text');
    noteText.innerHTML = 'To whoever enters after me, I was foolish enough to believe I could find a way out…but the doors only open when the truth of Eleanor’s story is uncovered. <br><br>Look closely at what you find—each note has a purpose. There are whispers of a code to escape, something left behind by the ones who vanished before me. <br><br>Remember this: Eleanor’s ‘favorite four’ may hold the key. I’ve gathered that letters and fragments combine for freedom. But I must hurry… I hear footsteps, though no one should be here.'

    //close button for the note
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '<i class="fa-solid fa-x"></i>';
    closeButton.classList.add('close_button');
    closeButton.onclick = () => {
        noteOverlay.style.display = 'none';
    };
    
    noteOverlay.append(largeNote, noteText, closeButton);
    sceneContainer.appendChild(noteOverlay);

    entranceHallNote.addEventListener('click', () => {
        noteOverlay.style.display = 'flex';
    });
}

function loadLibraryScene() {

}

function loadDiningRoomScene() {

}