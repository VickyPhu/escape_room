window.addEventListener('DOMContentLoaded', main);

//Global variables
let inventoryBox;
/** Stores the inventory items - notes and keys */
const inventory = [];

function main() {
    loadStartScene();
    createInventoryBox();
}
/** Creates an inventory box next to the sceneContainer */
function createInventoryBox() {
    const displayInventoryBox = document.getElementById('displayInventoryBox');
  }

/** Adds collectible items to the end of the inventory in the array and runs updateInventoryDisplay() */
function addItemToInventory(item) {
    inventory.push(item);
    updateInventoryDisplay();
}

/** Updates the DOM for the inventory when a collectible item gets added, clickable note to read the text */
function updateInventoryDisplay() {
    const displayInventoryBox = document.getElementById('displayInventoryBox');
    displayInventoryBox.innerHTML = '';

    inventory.forEach(item => {
        const inventoryItem = document.createElement('div');
        inventoryItem.classList.add('inventory_item')

        if (item.type === 'note') {
            const inventoryNote = document.createElement('img');
            inventoryNote.src = item.src;
            inventoryNote.classList.add('inventory_note');

            inventoryNote.onclick = () => {
                const noteOverlay = document.createElement('div');
                noteOverlay.classList.add('note_overlay');

                const largeNote = document.createElement('img');
                largeNote.src = item.src;
                largeNote.classList.add('large_note');

                const noteContent = document.createElement('p');
                noteContent.classList.add('note_text');
                noteContent.innerHTML = item.text;

                const closeButton = document.createElement('button');
                closeButton.classList.add('close_button');
                closeButton.innerHTML = '<i class="fa-solid fa-x"></i>';
                closeButton.onclick = () => {
                    noteOverlay.remove();
                };

                noteOverlay.append(largeNote, noteContent, closeButton);
                sceneContainer.append(noteOverlay);
            }
                displayInventoryBox.append(inventoryNote);

            } else if (item.type === 'key') {
                const inventoryKey = document.createElement('img');
                inventoryKey.src = item.src;
                inventoryKey.classList.add('inventory_key');
                displayInventoryBox.append(inventoryKey);
            }
                displayInventoryBox.append(inventoryItem);
        });
};

function useKey(item) {
    const index = inventory.indexOf(item);
    if (index !== -1) {
        inventory.splice(index, 1);
        updateInventoryDisplay();
    }
}

/** Creates the small note and the larger note for viewing and closing */
function createNote(noteSrc, noteText, position, isCollectible = false) {
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

    // some notes will be saved to inventory, only add if it's collectible
    note.addEventListener('click', () => {
        noteOverlay.style.display = 'flex';

        if (isCollectible) {
            addItemToInventory({
                 type: 'note', 
                 src: noteSrc, 
                 text: noteText});
            note.remove();
        }
    });

    sceneContainer.append(note, noteOverlay);

    if (isCollectible) {
        const inventoryNote = document.createElement('img');
        inventoryNote.src = noteSrc;
        inventoryNote.classList.add('inventory_note');
        inventoryNote.onclick = () => {
            noteOverlay.style.display = 'flex';
        }

        return inventoryNote;
    }
}

/** Creates a key that gets added to inventory on click and removed from scene */
function createKey(keySrc, position) {
    const key = document.createElement('img');
    key.src = 'images/gold_key.webp';
    key.classList.add('gold_key');

    Object.assign(key.style, position);
    key.style.position = 'absolute';
    //The key gets added to the inventory on click
    key.onclick = () => {
        addItemToInventory({ type: 'key', src: keySrc });
        key.remove();
    };

    sceneContainer.append(key);
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

    createNote('images/note.webp', 'Today, I began another experiment. <br><br>Youth is slipping away, but I am certain I’m close to finding it. <br><br>The books here speak of ancient rites, powerful rituals.<br><br> If I’m right, the final ingredient is… well, that I’ll keep to myself. They wouldn’t understand my determination.', {bottom: '25%', right: '50%' }
    );

    createNote('images/note.webp', 'I can’t shake the feeling I’m here for a reason. She’s always watching, always hiding, waiting for me to <strong>find</strong> her secrets.', {bottom: '58%', left: '15%'}, true
    );
}

/** Creates the Dining room scene(3) with function createNote and createKey */
function loadDiningRoomScene() {
    sceneContainer.innerHTML = '';
    const diningRoomScene = document.createElement('img');
    diningRoomScene.src = 'images/dining_room.webp';
    diningRoomScene.classList.add('background_image');

    const leftButton = document.createElement('button');
    leftButton.textContent = 'Entrance hall';
    leftButton.onclick = loadEntranceHall;
    leftButton.classList.add('left_button');

    const rightButton = document.createElement('button');
    rightButton.textContent = 'Kitchen';
    rightButton.onclick = loadKitchenScene;
    rightButton.classList.add('right_button');

    sceneContainer.append(diningRoomScene, leftButton, rightButton);

    createNote('images/note.webp', 'At the last ball, they all marveled at my beauty. None of them know what I’ve done, what I’ve given up to maintain this facade. They wouldn’t admire me if they knew the cost. Still, appearances must be kept, and the ritual must continue.', {top: '10%', right: '30%' }
    );

    createKey('images/gold_key.webp', { bottom: '35%', left: '23%'}
    );
}

function loadStaircaseLandingScene() {

}

/** Creates kitchen scene(4) with two notes, one collectible */
function loadKitchenScene() {
    sceneContainer.innerHTML = '';
    const kitchenScene = document.createElement('img');
    kitchenScene.src = 'images/kitchen.webp';
    kitchenScene.classList.add('background_image');

    sceneContainer.append(kitchenScene);

    createNote('images/note.webp', 'The air here is thick, like it’s holding its breath. There are moments I swear I can feel her woven into the very walls. <br><br>Those symbols on the walls… they’re warnings, or maybe invitations. They tell of rituals older than memory, sacrifices made under moonlight. <br><br>The ones who served her knew the truth, and they knew the price she was willing to pay. Some tried to warn others, whispering tales of the restless woman who would stop at nothing. I can feel it here. She won’t ever leave. And neither will anyone who discovers her secret', {top: '35%', right: '15%' }
    );

    createNote('images/note.webp', 'There’s no warmth here, just a hollow shell. I wish she’d just let me <strong>rest</strong>.', {bottom: '44%', left: '17%'}, true
    );
}