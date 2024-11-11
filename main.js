window.addEventListener('DOMContentLoaded', main);

function main() {
    loadStartScene();
}
/** Creates the small note and the larger note for viewing and closing */
function createNote(noteSrc, noteText, position) {
    const note = document.createElement('img');
    note.src = noteSrc;
    note.classList.add('small_note');

    //Position
    Object.assign(note.style, position);
    note.style.position = 'absolute';

    const noteOverlay = document.createElement('div');
    noteOverlay.classList.add('note_overlay');
    noteOverlay.style.display = 'none';

    const largeNote = document.createElement('img');
    largeNote.src = noteSrc;
    largeNote.classList.add('large_note');

    const noteContent = document.createElement('p');
    noteContent.classList.add('note_text');
    noteContent.innerHTML = noteText;

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '<i class="fa-solid fa-x"></i>';
    closeButton.classList.add('close_button');
    closeButton.onclick = () => { 
        noteOverlay.style.display = 'none';
    };

    noteOverlay.append(largeNote, noteContent, closeButton);

    note.addEventListener('click', () => {
        noteOverlay.style.display = 'flex';
    });

    sceneContainer.append(note, noteOverlay);
}
/** Creates the start / first scene to start playing */
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
/** Created the premise scene / intro to the game */
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
/** Creates the Entrance hall scene(1), also using the function createNote */
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

    createNote(
        'images/note.webp', 'To whoever enters after me, I was foolish enough to believe I could find a way out…but the doors only open when the truth of Eleanor’s story is uncovered. <br><br>Look closely at what you find—each note has a purpose. There are whispers of a code to escape, something left behind by the ones who vanished before me. <br><br>Remember this: Eleanor’s ‘favorite four’ may hold the key. I’ve gathered that letters and fragments combine for freedom. But I must hurry… I hear footsteps, though no one should be here.', { top: '30%', left: '60%' }
    );

    sceneContainer.append(entranceHall, leftButton, rightButton);

}

function loadLibraryScene() {
    sceneContainer.innerHTML = '';
    const libraryScene = document.createElement('img');
    libraryScene.src = 'images/library.webp'
    libraryScene.classList.add('background_image');

    const leftButton = document.createElement('button');
    leftButton.textContent = 'Entrance hall';
    leftButton.onclick = loadEntranceHall;
    leftButton.classList.add('left_button');

    const rightButton = document.createElement('button');
    rightButton.textContent = 'Staircase landing';
    rightButton.onclick = loadStaircaseLandingScene;
    rightButton.classList.add('right_button');

    sceneContainer.append(libraryScene, leftButton, rightButton);

    const note = createNote('images/note.webp', 'Today, I began another experiment. <br><br>Youth is slipping away, but I am certain I’m close to finding it. <br><br>The books here speak of ancient rites, powerful rituals.<br><br> If I’m right, the final ingredient is… well, that I’ll keep to myself. They wouldn’t understand my determination.', {bottom: '25%', right: '50%' });

    const saveNote = createNote('images/note.webp', 'I can’t shake the feeling I’m here for a reason. She’s always watching, always hiding, waiting for me to <strong>find</strong> her secrets.', {bottom: '58%', left: '15%'});

    sceneContainer.append(note, saveNote);
}

function loadDiningRoomScene() {

}

function loadStaircaseLandingScene() {

}