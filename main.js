window.addEventListener('DOMContentLoaded', initGame);

//Global variables
/** Stores the inventory items - notes and keys */
let inventory = [];
/**
 * @typedef {Object} gameData
 * @property {string} currentScene
 * @property {Array<string>} collectedItems
 */

/**
 * Stores state of the game, including current scene and collected items
 * @type {gameData}
 */
const gameData = {
    currentScene: 'startScene',
    collectedItems: [],
};

/** Initializes the game by loading saved data in localStorage then loads current scene and any collected items 
* If no saved data is found, loads the start scene 
*/
function initGame() {
    loadInventoryFromLocalStorage();
    const savedData = localStorage.getItem('gameData');
    if (!savedData) {
        loadStartScene();
    } else {
        loadGameData();
        loadScene(gameData.currentScene);
    }
}

/**
 * Loads a specific scene based on the given scene name
 * Handles restoring locked button states (locked/unlocked) and removing the collected items from he scene
 * @param {string} sceneName 
 */
function loadScene(sceneName) {
    switch (sceneName) {
        case 'premiseScene':
            loadPremiseScene();
            break;
        case 'entranceHallScene':
            loadEntranceHallScene();
            break;
        case 'libraryScene':
            loadLibraryScene();
            break;
        case 'diningRoomScene':
            loadDiningRoomScene();
            break;
        case 'staircaseLandingScene':
            loadStaircaseLandingScene();
            break;
        case 'kitchenScene':
            loadKitchenScene();
            break;
        case 'livingRoomScene':
            loadLivingRoomScene();
            break;
        case 'masterBedroomScene':
            loadMasterBedroomScene();
            break;
        case 'studyScene':
            loadStudyScene();
            break;
        case 'bathroomScene':
            loadBathroomScene();
            break;
        case 'basementScene':
            loadBasementScene();
            break;
        case 'winningScene':
            loadWinningScene();
            break;
        case 'gameOverScene':
            loadGameOverScene();            
    }

    // Retrieve the locked button state from localStorage
    const lockedButtonState = localStorage.getItem('lockedButtonState');
    const lockedButton = document.getElementById('lockedButton_room');

    // If the button is unlocked, apply the unlocked state
    if (lockedButton && lockedButtonState === 'unlocked') {
        unlockRoomButton(lockedButton);
    }

    // Check if the key has been collected, and remove it from the scene
    const keyId = 'key_1';
    if (hasKey(keyId)) {
        const keyElement = document.getElementById(keyId);
        if (keyElement) {
            keyElement.remove();
        }
    }
}

/** Converts the gameData (current scene and collected notes and keys) to a JSON string and stores it in localStorage */
function saveGameData() {
    const gameDataToSave = { 
        currentScene: gameData.currentScene,
        collectedItems: gameData.collectedItems
    };

    localStorage.setItem('gameData', JSON.stringify(gameDataToSave));
}    

/**
 * Saves gameData when player moves to a new scene and loads the new scene
 * @param {string} newScene 
 */
function changeScene(newScene) {
    gameData.currentScene = newScene;
    saveGameData();
    loadScene(newScene);
}

/**
 * Saves the gameData when a new item is picked up and updates the game state
 * If the item already exists, it will not be added again
 * @param {Object} item 
 */
function collectItem(item) {
    const alreadyExists = gameData.collectedItems.some(existingItem => existingItem.id === item.id);
    if (!alreadyExists) {
        gameData.collectedItems.push(item);
        inventory.push(item);
        saveGameData();  // Saves the updated game data (inventory and current scene)
    }
}
/** Retrieves the game data in localStorage and updates the game state by parse it back from JSON string to the object gameData 
* If no data is found, initializes default values
*/
function loadGameData() {
    const savedData = localStorage.getItem('gameData');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        gameData.currentScene = parsedData.currentScene;
        gameData.collectedItems = parsedData.collectedItems;
    } else {
        // Set default scene and empty inventory if no saved data
        gameData.currentScene = 'startScene';
        gameData.collectedItems = [];
    }
    loadScene(gameData.currentScene);
    updateInventoryDisplay(); 
}

/** Loads the inventory from localStorage, parses it and updates the inventory display */
function loadInventoryFromLocalStorage() {
    const storedInventory = localStorage.getItem('inventory');
    if (storedInventory) {
        try {
            const parsedInventory = JSON.parse(storedInventory);
            inventory.length = 0; // Clear the inventory
            inventory.push(...parsedInventory); // Add stored items
            updateInventoryDisplay(parsedInventory);
        } catch (error) {
            console.error("Error parsing inventory from localStorage:", error);
        }
    } else {
        inventory.length = 0; // Initialize as an empty array if nothing is stored
        updateInventoryDisplay(inventory);
    }
}

 /**
 * Adds collectible notes and keys (items) to the end of the inventory if they don't already exist
 * Updates both the inventory array and gameData.collectedItems and synchronizes with localStorage
 * If item is a key, it will also be stored in collectedKeys array in localStorage
 * Updates the inventory display after adding the item
 * 
 * @param {Object} item
 * @param {String} item.id
 * @param {string} item.type
 */
function addItemToInventory(item) {
    const alreadyExists = inventory.some(existingItem => existingItem.id === item.id);
    if (!alreadyExists) {
        inventory.push(item);
        gameData.collectedItems.push(item);
        localStorage.setItem('inventory', JSON.stringify(inventory));
        localStorage.setItem('gameData', JSON.stringify(gameData));

        if (item.type === 'key') {
            const collectedKeys = JSON.parse(localStorage.getItem('collectedKeys') || '[]');
            if (!collectedKeys.includes(item.id)) {
                collectedKeys.push(item.id);
                localStorage.setItem('collectedKeys', JSON.stringify(collectedKeys));
            }
        }

        updateInventoryDisplay(); 
    }
}

/** Updates the DOM for the inventory when a collectible item (note or key) gets added, clickable note to read the text and key to open specific locked button */
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

                inventoryKey.onclick = () => {
                    const lockedButton = document.getElementById('lockedButton_room');

                    if (lockedButton && lockedButton.disabled) {
                        if (item.id === 'key_1') {
                            console.log('key is clicked, attempting to unlock room');
                            unlockRoomButton(lockedButton);
                            inventoryKey.remove();
                            
                            const itemIndex = inventory.indexOf(item);
                            if (itemIndex !== -1) {
                                inventory.splice(itemIndex, 1);
                                console.log('Item removed from inventory', item);
                            }

                            localStorage.setItem('inventory', JSON.stringify(inventory));

                            loadInventoryFromLocalStorage();
                        }
                    } else {
                        console.log('show message')
                        showMessage('You need to be in the correct room to use the key')
                    }
                }
            }
            
            displayInventoryBox.append(inventoryItem);
        })
};

/**
 * Creates a note in scene, can be viewed and some are added to the inventory
 * @param {string} noteSrc 
 * @param {string} noteText 
 * @param {Object} position 
 * @param {string} noteId 
 * @param {boolean} isCollectible 
 * @returns 
 */
function createNote(noteSrc, noteText, position, noteId, isCollectible = false) {
    const alreadyCollected = gameData.collectedItems.some(item => item.id === noteId);
    if (alreadyCollected) 
        return;

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
                text: noteText,
                id: noteId
            });
            
            note.remove();
        }
    });

    sceneContainer.append(note, noteOverlay);
    
}

/**
 * Creates a collectible key that will be added to the inventory and removed from scene
 * @param {string} keySrc 
 * @param {Object} position 
 * @param {string} keyId 
 * @returns 
 */
function createKey(keySrc, position, keyId) {
    const collectedKeys = JSON.parse(localStorage.getItem('collectedKeys') || '[]');
    if (collectedKeys.includes(keyId)) {
        return;
    }

    const key = document.createElement('img');
    key.src = keySrc;
    key.classList.add('gold_key');
    Object.assign(key.style, position);
    key.style.position = 'absolute';

    //The key gets added to the inventory on click
    key.onclick = () => {
        addItemToInventory({ type: 'key', id: keyId, src: keySrc });
        key.remove();
    };

    sceneContainer.append(key);
}
/**
 * Check if a specific is in the inventory
 * @param {string} keyId 
 * @returns {boolean}
 */
function hasKey(keyId) {
    return inventory.some(item => item.type === 'key' && item.id === keyId);
}
/**
 * Unlocks a locked button and enables access to new scene
 * @param {HTMLElement} lockedButton 
 */
function unlockRoomButton(lockedButton) {
    // Unlock the button
    lockedButton.disabled = false;
    lockedButton.classList.remove('locked_button');
    lockedButton.classList.add('third_button');
    lockedButton.textContent = 'Basement'; // Change button text
    lockedButton.onclick = loadBasementScene;

    // Save the unlocked state in localStorage
    localStorage.setItem('lockedButtonState', 'unlocked');
}
/**
 * Displays a temporary message to the player, used for when player tries to use the key in the wrong 
 * @param {string} textMessage 
 */
function showMessage(textMessage) {
    const messageBox = document.createElement('div');
    messageBox.classList.add('message_box');
    messageBox.textContent = textMessage;

    sceneContainer.append(messageBox);

    setTimeout(() => {
        messageBox.remove();
    }, 3000);
}

/**
 * Loads starts scene, displaying game name, start button that leads to premise scene
 */
function loadStartScene() {
    sceneContainer.innerHTML = '';
    const startScene = document.createElement('img');
    startScene.src ="images/haunted_house.webp";
    startScene.classList.add('background_image')

    const gameName = document.createElement('h1');
    gameName.textContent = 'Vanished in Silence';
    gameName.classList.add('game_name');

    const button = document.createElement('button');
    button.textContent = 'Start';
    button.onclick = loadPremiseScene;
    button.classList.add('startButton');

    sceneContainer.append(startScene, gameName, button);
}
/**
 * Loads premise scene, introduction text to the game's story and next button leads to Entrance hall scene
 */
function loadPremiseScene() {
    gameData.currentScene = 'premiseScene';
    saveGameData();
    
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
    button.onclick = loadEntranceHallScene;

    sceneContainer.append(premiseScene, premiseText, button);
}
/** Loads the entrance hall scene with image, room name, note and two buttons to navigate between scenes */
function loadEntranceHallScene() {
    gameData.currentScene = 'entranceHallScene';
    saveGameData();

    sceneContainer.innerHTML = '';
    const entranceHall = document.createElement('img');
    entranceHall.src = 'images/entrance_hall.webp';
    entranceHall.classList.add('background_image');

    const sceneTitle = document.createElement('h1');
    sceneTitle.textContent = 'Entrance Hall';

    const numberOfItemsText = document.createElement('p');
    numberOfItemsText.textContent = 'One note';
    numberOfItemsText.classList.add('number_of_items_text');
    
    const leftButton = document.createElement('button');
    leftButton.textContent = 'Library';
    leftButton.onclick = loadLibraryScene;
    leftButton.classList.add('left_button');

    const rightButton = document.createElement('button');
    rightButton.textContent = 'Dining Room';
    rightButton.onclick = loadDiningRoomScene;
    rightButton.classList.add('right_button');

    createNote(
        'images/note.webp', 'To whoever enters after me, I was foolish enough to believe I could find a way out…but the doors only open when the truth of Eleanor’s story is uncovered. <br><br>Look closely at what you find—each note has a purpose. There are whispers of a code to escape, something left behind by the ones who vanished before me. <br><br>Remember this: Eleanor’s ‘favorite four’ may hold the key. I’ve gathered that letters and fragments combine for freedom. But I must hurry… I hear footsteps, though no one should be here.', { top: '30%', left: '60%' }, 'note_1'
    );

    sceneContainer.append(entranceHall, sceneTitle, numberOfItemsText,leftButton, rightButton);

}
/** Loads library scene, image, room name, two notes, one collectible and two buttons to navigate between scenes */
function loadLibraryScene() {
    gameData.currentScene = 'libraryScene';
    saveGameData();

    sceneContainer.innerHTML = '';
    const libraryScene = document.createElement('img');
    libraryScene.src = 'images/library.webp'
    libraryScene.classList.add('background_image');

    const sceneTitle = document.createElement('h1');
    sceneTitle.textContent = 'Library';

    const numberOfItemsText = document.createElement('p');
    numberOfItemsText.textContent = 'Two notes';
    numberOfItemsText.classList.add('number_of_items_text');

    const leftButton = document.createElement('button');
    leftButton.textContent = 'Entrance hall';
    leftButton.onclick = loadEntranceHallScene;
    leftButton.classList.add('left_button');

    const rightButton = document.createElement('button');
    rightButton.textContent = 'Staircase landing';
    rightButton.onclick = loadStaircaseLandingScene;
    rightButton.classList.add('right_button');

    sceneContainer.append(libraryScene, sceneTitle, numberOfItemsText, leftButton, rightButton);

    createNote('images/note.webp', 'Today, I began another experiment. <br><br>Youth is slipping away, but I am certain I’m close to finding it. <br><br>The books here speak of ancient rites, powerful rituals.<br><br> If I’m right, the final ingredient is… well, that I’ll keep to myself. They wouldn’t understand my determination.', {bottom: '25%', right: '50%' }, 'note_2'
    );

    createNote('images/note.webp', 'I feel trapped within these walls, bound by an unseen force. There’s something here, and it won’t <strong>LET</strong> me go.', {bottom: '58%', left: '15%'}, 'note_3', true
    );
};

/** Loads dining room scene, image, room name, one note and one collectible key, two buttons to navigate between scenes */
function loadDiningRoomScene() {
    gameData.currentScene = 'diningRoomScene';
    saveGameData();

    sceneContainer.innerHTML = '';
    const diningRoomScene = document.createElement('img');
    diningRoomScene.src = 'images/dining_room.webp';
    diningRoomScene.classList.add('background_image');

    const sceneTitle = document.createElement('h1');
    sceneTitle.textContent = 'Dining room';

    const numberOfItemsText = document.createElement('p');
    numberOfItemsText.textContent = 'One note & one key';
    numberOfItemsText.classList.add('number_of_items_text');

    const leftButton = document.createElement('button');
    leftButton.textContent = 'Entrance hall';
    leftButton.onclick = loadEntranceHallScene;
    leftButton.classList.add('left_button');

    const rightButton = document.createElement('button');
    rightButton.textContent = 'Kitchen';
    rightButton.onclick = loadKitchenScene;
    rightButton.classList.add('right_button');

    sceneContainer.append(diningRoomScene, sceneTitle, numberOfItemsText,leftButton, rightButton);

    createNote('images/note.webp', 'At the last ball, they all marveled at my beauty. None of them know what I’ve done, what I’ve given up to maintain this facade. They wouldn’t admire me if they knew the cost. Still, appearances must be kept, and the ritual must continue.', {top: '10%', right: '30%' }, 'note_4'
    );

    createKey('images/gold_key.webp', { bottom: '35%', left: '23%'}, 'key_1'
    );
}
/** Loads staircase landing, image, room name, two notes - one collectible, two buttons to navigate between scenes */
function loadStaircaseLandingScene() {
    gameData.currentScene = 'staircaseLandingScene';
    saveGameData();

    sceneContainer.innerHTML = '';
    const staircaseLandingScene = document.createElement('img');
    staircaseLandingScene.src = 'images/staircase_landing.webp';
    staircaseLandingScene.classList.add('background_image');

    const sceneTitle = document.createElement('h1');
    sceneTitle.textContent = 'Staircase landing';

    const numberOfItemsText = document.createElement('p');
    numberOfItemsText.textContent = 'Two notes';
    numberOfItemsText.classList.add('number_of_items_text');

    const leftButton = document.createElement('button');
    leftButton.textContent = 'Library';
    leftButton.onclick = loadLibraryScene;
    leftButton.classList.add('left_button');

    const rightButton = document.createElement('button');
    rightButton.textContent = 'Master Bedroom';
    rightButton.onclick = loadMasterBedroomScene;
    rightButton.classList.add('right_button');

    sceneContainer.append(staircaseLandingScene, sceneTitle, numberOfItemsText,leftButton, rightButton);

    createNote('images/note.webp', 'Those who seek the truth shall see their own face disappear.', {top: '30%', left: '27%'}, 'note_5'
    );

    createNote('images/note.webp', 'No matter where I turn, she finds me. Her gaze is a constant, as if she doesn’t want me to <strong>VANISH</strong>.', {top: '57%', right: '28%'}, 'note_6', true
    );

}

/** Loads kitchen scene, image, room name, two notes - one collectible, two buttons to navigate between scenes */
function loadKitchenScene() {
    gameData.currentScene = 'kitchenScene';
    saveGameData();

    sceneContainer.innerHTML = '';
    const kitchenScene = document.createElement('img');
    kitchenScene.src = 'images/kitchen.webp';
    kitchenScene.classList.add('background_image');

    const sceneTitle = document.createElement('h1');
    sceneTitle.textContent = 'Kitchen';

    const numberOfItemsText = document.createElement('p');
    numberOfItemsText.textContent = 'Two notes';
    numberOfItemsText.classList.add('number_of_items_text');

    const leftButton = document.createElement('button');
    leftButton.textContent = 'Dining room';
    leftButton.onclick = loadDiningRoomScene;
    leftButton.classList.add('left_button');

    const rightButton = document.createElement('button');
    rightButton.textContent = 'Living room';
    rightButton.onclick = loadLivingRoomScene;
    rightButton.classList.add('right_button');

    sceneContainer.append(kitchenScene, sceneTitle, numberOfItemsText, leftButton, rightButton);

    createNote('images/note.webp', 'The air here is thick, like it’s holding its breath. There are moments I swear I can feel her woven into the very walls. <br><br>Those symbols on the walls… they’re warnings, or maybe invitations. They tell of rituals older than memory, sacrifices made under moonlight. <br><br>The ones who served her knew the truth, and they knew the price she was willing to pay. Some tried to warn others, whispering tales of the restless woman who would stop at nothing. I can feel it here. She won’t ever leave. And neither will anyone who discovers her secret', {top: '35%', right: '15%' }, 'note_7'
    );

    createNote('images/note.webp', 'There’s no comfort here, no warmth. I long to <strong>ESCAPE</strong>, to find a place where I can rest..', {bottom: '44%', left: '17%'}, 'note_8', true
    );
}
/** Loads living room scene, image, room name, two notes, two buttons to navigate between scenes */
function loadLivingRoomScene() {
    gameData.currentScene = 'livingRoomScene';
    saveGameData();

    sceneContainer.innerHTML = '';
    const livingRoomScene = document.createElement('img');
    livingRoomScene.src = 'images/living_room.webp';
    livingRoomScene.classList.add('background_image');

    const sceneTitle = document.createElement('h1');
    sceneTitle.textContent = 'Living room';

    const numberOfItemsText = document.createElement('p');
    numberOfItemsText.textContent = 'Two notes';
    numberOfItemsText.classList.add('number_of_items_text');

    const leftButton = document.createElement('button');
    leftButton.textContent = 'Kitchen';
    leftButton.onclick = loadKitchenScene
    leftButton.classList.add('left_button');

    const rightButton = document.createElement('button');
    rightButton.textContent = 'Study';
    rightButton.onclick = loadStudyScene;
    rightButton.classList.add('right_button');

    sceneContainer.append(livingRoomScene, sceneTitle, numberOfItemsText, leftButton, rightButton);

    createNote('images/note.webp', 'I can’t stay here any longer.<br><br> The whispers at night, the shadows that move when no one else should be here—this house is a prison. Eleanor has changed; her eyes, once full of warmth, are now cold as stone. She speaks to herself, murmuring secrets about a life everlasting. She’s trapped herself in something, and I fear she means to do the same to anyone left here. This place is no longer a home; it’s a tomb waiting to seal us in.', {bottom: '30%', left: '45%' }, 'note_9'
    );

    createNote('images/note.webp', 'Eleanor was different from the others; she never wanted to be like them. She wanted to be more, something beyond human. Her eyes could burn through you, as if she could see right through your very mind', {top: '27%', right: '16%' }, 'note_10'
    );
}
/** Loads master bedroom scene, image, room name, two notes - one collectible, three buttons - one locked, gets unlocked with the key */
function loadMasterBedroomScene() {
    gameData.currentScene = 'masterBedroomScene';
    saveGameData();

    sceneContainer.innerHTML = '';
    const masterBedroomScene = document.createElement('img');
    masterBedroomScene.src = 'images/master_bedroom.webp';
    masterBedroomScene.classList.add('background_image');

    const sceneTitle = document.createElement('h1');
    sceneTitle.textContent = 'Master bedroom';

    const numberOfItemsText = document.createElement('p');
    numberOfItemsText.textContent = 'Two notes';
    numberOfItemsText.classList.add('number_of_items_text');

    const leftButton = document.createElement('button');
    leftButton.textContent = 'Bathroom'
    leftButton.onclick = loadBathroomScene;
    leftButton.classList.add('left_button');

    const lockedButton = document.createElement('button');
    lockedButton.innerHTML = 'Basement <i class="fa-solid fa-lock"></i>';
    lockedButton.classList.add('locked_button');
    lockedButton.id = 'lockedButton_room'
    lockedButton.disabled = true;

    const lockedButtonState = localStorage.getItem('lockedButtonState');
    if (lockedButtonState === 'unlocked') {
        unlockRoomButton(lockedButton);  // Unlock the button if it was unlocked before
    }

    const rightButton = document.createElement('button');
    rightButton.textContent = 'Staircase landing';
    rightButton.onclick = loadStaircaseLandingScene;
    rightButton.classList.add('right_button');

    sceneContainer.append(masterBedroomScene, sceneTitle, numberOfItemsText, leftButton, lockedButton, rightButton);

    createNote('images/note.webp', 'Every time I look in the mirror, I see her. The one I sacrificed.<br><br>Her face is in mine, her voice lingers in these walls. They think I am Eleanor. They don’t know my real name, and soon, they won’t even remember her.<br><br>All I need is more time', {bottom: '38%', left: '30%' }, 'note_11'
    );

    createNote('images/note.webp', 'She watches from every shadow. The house is alive with her <strong>ANGER</strong>.', {bottom: '15%', right: '38%' }, 'note_12', true
    );

}
/** Loads study scene, image, room name, two notes - one collectible, two buttons to navigate between scenes */
function loadStudyScene() {
    gameData.currentScene = 'studyScene';
    saveGameData();

    sceneContainer.innerHTML = '';
    const studyScene = document.createElement('img');
    studyScene.src = 'images/study.webp'
    studyScene.classList.add('background_image');

    const sceneTitle = document.createElement('h1');
    sceneTitle.textContent = 'Study';

    const numberOfItemsText = document.createElement('p');
    numberOfItemsText.textContent = 'Two notes';
    numberOfItemsText.classList.add('number_of_items_text');

    const leftButton = document.createElement('button');
    leftButton.textContent = 'Living room';
    leftButton.onclick = loadLivingRoomScene;
    leftButton.classList.add('left_button');

    const rightButton = document.createElement('button');
    rightButton.textContent = 'Bathroom';
    rightButton.onclick = loadBathroomScene;
    rightButton.classList.add('right_button');

    sceneContainer.append(studyScene, sceneTitle, numberOfItemsText, leftButton, rightButton);

    createNote('images/note.webp', 'I found it!<br><br>The perfect ritual to bind life to a place, to stave off decay. It’s simple enough, but it requires power. They may never return if they enter here, yet it matters not. I’ll do whatever it takes to preserve myself.', {bottom: '36%', right: '45%' }, 'note_13'
    );

    createNote('images/note.webp', 'In every room, I hear whispers, echoes of those who came before. I need to <strong>END</strong> this cycle, break free from this place.”', {bottom: '55%', left: '23%' }, 'note_14', true
    );

}
/** Loads bathroom scene, image, room name, two notes, two buttons to navigate between scenes */
function loadBathroomScene() {
    gameData.currentScene = 'bathroomScene';
    saveGameData();

    sceneContainer.innerHTML = '';
    const bathroomScene = document.createElement('img');
    bathroomScene.src = 'images/bathroom.webp';
    bathroomScene.classList.add('background_image');

    const sceneTitle = document.createElement('h1');
    sceneTitle.textContent = 'Bathroom';

    const numberOfItemsText = document.createElement('p');
    numberOfItemsText.textContent = 'Two notes';
    numberOfItemsText.classList.add('number_of_items_text');

    const leftButton = document.createElement('button');
    leftButton.textContent = 'Master Bedroom';
    leftButton.onclick = loadMasterBedroomScene;
    leftButton.classList.add('left_button');

    const rightButton = document.createElement('button')
    rightButton.textContent = 'Study';
    rightButton.onclick = loadStudyScene;
    rightButton.classList.add('right_button');

    sceneContainer.append(bathroomScene, sceneTitle, numberOfItemsText, leftButton, rightButton);

    createNote('images/note.webp', 'The elixir is wearing thin. Every day, a little more slips away. I’ve bound myself to this place, a cage of my own making.<br><br>Yet, I cannot leave. To do so would be to surrender everything I’ve worked for.<br><br>No, I must finish it—complete the ritual, restore what I’ve lost.', {bottom: '15%', left: '37%' }, 'note_15'
    );

    createNote('images/note.webp', 'Eleanor always loved secrets, especially the ones hidden in plain sight. Her favorite word was etched on the cover of her journal, and it wasn’t just a word—it was her mantra. She used to say, ‘If you look closely enough, the truth will reveal itself.', { bottom: '43%', right: '37%'},
    );

}
/** Load basement scene, image, room name, button that opens the password form, player gets three attempts and for every attempt there is a hint */
function loadBasementScene() {
    gameData.currentScene = 'basementScene';
    saveGameData();

    sceneContainer.innerHTML = '';
    const basementScene = document.createElement('img');
    basementScene.src = 'images/basement.webp';
    basementScene.classList.add('background_image');

    const sceneTitle = document.createElement('h1');
    sceneTitle.textContent = 'Basement';

    const leftButton = document.createElement('button');
    leftButton. textContent = 'Master bedroom';
    leftButton.onclick = loadMasterBedroomScene;
    leftButton.classList.add('left_button');

    const passwordButton = document.createElement('button');
    passwordButton.classList.add('password_button');
    passwordButton.onclick = () => {
        if (passwordContainer.style.display === 'none') {
            passwordContainer.style.display = 'flex';
        } else {
            passwordContainer.style.display = 'none';
        }
    };

        const passwordContainer = document.createElement('div');
        passwordContainer.classList.add('password_container');

        const passwordInput = document.createElement('input');
        passwordInput.type = 'text';
        passwordInput.placeholder = 'Enter the password';
        passwordInput.classList.add('password_input');

        const submitPasswordButton = document.createElement('button');
        submitPasswordButton.textContent = 'Submit';
        submitPasswordButton.classList.add('submit_password_button');

        const hintText = document.createElement('p');
        hintText.classList.add('hint_text');
        hintText.textContent = '';

        const closeButton = document.createElement('button');
        closeButton.innerHTML = '<i class="fa-solid fa-x"></i>';
        closeButton.classList.add('close_button');
        closeButton.onclick = () => { 
            passwordContainer.style.display = 'none';
        };

        passwordContainer.append(passwordInput, submitPasswordButton, hintText, closeButton);

        let attempts = parseInt(localStorage.getItem('attempts')) || 0;
        let hintTextContent = localStorage.getItem('hintText') || '';
        
        if (hintTextContent) {
            hintText.textContent = hintTextContent;
        }

        const validPasswords = ['LEAVE', 'Leave', 'leave'];

        submitPasswordButton.onclick = () => {
            const playerInput = passwordInput.value;

            if (validPasswords.includes(playerInput)) {
                loadWinningScene();
                localStorage.removeItem('attempts');
                localStorage.removeItem('hintText');
            } else {
                attempts++;
                localStorage.setItem('attempts', attempts);
                if (attempts === 1) {
                    hintTextContent = 'Hint: The password consists of a five-letter word'
                } else if (attempts === 2) {
                    hintTextContent = 'Hint: The second and last letter is E. This is the last attempt';
                } else {
                    loadGameOverScene();
                    localStorage.removeItem('attempts');
                    localStorage.removeItem('hintText');
                    return;
                }

                hintText.textContent = hintTextContent;
                localStorage.setItem('hintText', hintTextContent);
            }
            console.log("Hint Text:", hintTextContent);
        }
        sceneContainer.append(basementScene, sceneTitle, leftButton, passwordButton, passwordContainer);
    }
/** Loads the winning scene, image, story conclusion, play again button that restart the game and clears the storage */
function loadWinningScene() {
    gameData.currentScene = 'winningScene';
    saveGameData();

    sceneContainer.innerHTML = '';
    const winningScene = document.createElement('img');
    winningScene.src = 'images/soul_is_freed.webp';
    winningScene.classList.add('background_image');

    const winningText = document.createElement('p');
    winningText.classList.add('end_text');
    winningText.innerHTML = 'As the password unlocks, a chill sweeps through the room, and Eleanor’s story reveals itself. Driven by a twisted desire for eternal youth, Eleanor performed dark rituals, draining the blood of those lured into her home. Each visitor became a sacrifice, feeding her beauty at the cost of their own lives.<br><br>With the spell broken, Eleanor’s spirit is freed, releasing a final anguished cry. The mansion, no longer bound by her dark magic, begins to fade. You step outside as the cursed house collapses into dust, its tragic secrets buried at last. But as you look back, you wonder if, somewhere, her story lingers, waiting to be told once more...'

    const playAgainButton = document.createElement('button');
    playAgainButton.textContent = 'Play again';
    playAgainButton.classList.add('right_button');
    playAgainButton.onclick = () => {
        localStorage.clear();
    
        // The local storage didn't get cleared? Reset in-memory variables
        inventory.length = 0;  // Clear the inventory array
        gameData.currentScene = 'startScene';
        gameData.collectedItems = [];  // Clear collected items

        displayInventoryBox.innerHTML = '';
        loadStartScene();
    };

    sceneContainer.append(winningScene, winningText, playAgainButton);

}
/** Loads game over scene, image, losing story conclusion, try again button that restarts the game and clears the storage */
function loadGameOverScene() {
    gameData.currentScene = 'gameOverScene';
    saveGameData();

    sceneContainer.innerHTML = '';
    const gameOverScene = document.createElement('img');
    gameOverScene.src = 'images/woman_starting_ritual.webp'; //Add fitting image here
    gameOverScene.classList.add('background_image');

    const gameOverText = document.createElement('p');
    gameOverText.classList.add('end_text');
    gameOverText.innerHTML = 'As the password eludes you, Eleanor’s ritual begins to take shape in the shadows. The air grows thick with darkness as a chilling whisper fills the room, her ancient words weaving a spell of eternal youth. You try to escape, but it’s too late. Her cold hands grip your arm as she draws near, her eyes glowing with hunger. Slowly, your strength fades away as she drains your life force, just like she did to all the others before you.<br><br>In an instant, you vanish, your body nothing more than a forgotten echo. Eleanor smiles, her spirit forever renewed by the sacrifice of those who dared to uncover her secret. You were just another lost soul, trapped in her web of eternal youth.';

    const tryAgainButton = document.createElement('button');
    tryAgainButton.textContent = 'Try again';
    tryAgainButton.classList.add('right_button');
    tryAgainButton.onclick = () => {
        localStorage.clear();
    
        // The local storage didn't get cleared? Reset in-memory variables
        inventory.length = 0;  // Clear the inventory array
        gameData.currentScene = 'startScene';
        gameData.collectedItems = [];  // Clear collected items

        displayInventoryBox.innerHTML = '';
        loadStartScene();
    };

    sceneContainer.append(gameOverScene, gameOverText, tryAgainButton);

}