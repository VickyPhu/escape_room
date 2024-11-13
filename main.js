window.addEventListener('DOMContentLoaded', main);

//Global variables
let inventoryBox;
/** Stores the inventory items - notes and keys */
const inventory = [];

function main() {
    loadStartScene();
    // createInventoryBox();
}
/** Creates an inventory box next to the sceneContainer */
// function createInventoryBox() {
//     const displayInventoryBox = document.getElementById('displayInventoryBox');
//   }

 /**
 * Adds collectible items to the end of the inventory in the array and runs updateInventoryDisplay()
 * @param {String} item 
 */
function addItemToInventory(item) {
    inventory.push(item);
    console.log('Picked up item:', item);
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

                inventoryKey.onclick = () => {
                    const lockedButton = document.getElementById('lockedButton_room');

                    if (lockedButton && lockedButton.disabled) {
                        if (item.id === '1') {
                            console.log('key is clicked, attempting to unlock room');
                            unlockRoomButton(lockedButton);
                            inventoryKey.remove();
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
    
//duplicated code as the one in displayUpdateInventory?
    // if (isCollectible) {
    //     const inventoryNote = document.createElement('img');
    //     inventoryNote.src = noteSrc;
    //     inventoryNote.classList.add('inventory_note');
    //     inventoryNote.onclick = () => {
    //         noteOverlay.style.display = 'flex';
    //     }

    //     return inventoryNote;
    // }
}

/** Creates a key that gets added to inventory on click and removed from scene */
function createKey(keySrc, position, keyId) {
    // if (hasKey(keyId)) {
    //     console.log('Key is already collected:', keyId);
    //     return;
    // }

    const key = document.createElement('img');
    key.src = keySrc;
    key.classList.add('gold_key');
    Object.assign(key.style, position);
    key.style.position = 'absolute';

    //The key gets added to the inventory on click
    key.onclick = () => {
        console.log(`Key Clicked: ${keyId}`); //debugging
        addItemToInventory({ type: 'key', id: keyId, src: keySrc });
        key.remove();
    };

    sceneContainer.append(key);
}

function hasKey(keyId) {
    console.log(`Checking if we have key with id: ${keyId}`);
    return inventory.some(item => item.type === 'key' && item.id === keyId);
}

function unlockRoomButton(lockedButton) {
    lockedButton.disabled = false;
    lockedButton.classList.remove('locked_button');
    lockedButton.classList.add('right_button');
    lockedButton.textContent = 'Staircase landing';
    lockedButton.onclick = loadStaircaseLandingScene;
}

function showMessage(textMessage) {
    const messageBox = document.createElement('div');
    messageBox.classList.add('message_box');
    messageBox.textContent = textMessage;

    sceneContainer.append(messageBox);

    setTimeout(() => {
        messageBox.remove();
    }, 3000);
}

/** Creates the start / first scene to start playing */
function loadStartScene() {
    sceneContainer.innerHTML = '';
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

    // const lockedButton = document.createElement('button');
    // lockedButton.innerHTML = 'Staircase landing <i class="fa-solid fa-lock"></i>';
    // lockedButton.classList.add('locked_button');
    // lockedButton.id = 'lockedButton_room'
    // lockedButton.disabled = true;

    // lockedButton.onclick = () => {
    //     console.log('Locked button clicked');
    //     if (hasKey('1')) {
    //         unlockRoomButton(lockedButton);
    //     } else {
    //         showMessage('You need a key to unlock this room')
    //     }
    // };

    sceneContainer.append(libraryScene, leftButton, rightButton);

    createNote('images/note.webp', 'Today, I began another experiment. <br><br>Youth is slipping away, but I am certain I’m close to finding it. <br><br>The books here speak of ancient rites, powerful rituals.<br><br> If I’m right, the final ingredient is… well, that I’ll keep to myself. They wouldn’t understand my determination.', {bottom: '25%', right: '50%' }
    );

    createNote('images/note.webp', 'I feel trapped within these walls, bound by an unseen force. There’s something here, and it won’t <strong>let me go</strong>.', {bottom: '58%', left: '15%'}, true
    );
};

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

    createKey('images/gold_key.webp', { bottom: '35%', left: '23%'}, '1'
    );
}

function loadStaircaseLandingScene() {
    sceneContainer.innerHTML = '';
    const staircaseLandingScene = document.createElement('img');
    staircaseLandingScene.src = 'images/staircase_landing.webp';
    staircaseLandingScene.classList.add('background_image');

    const leftButton = document.createElement('button');
    leftButton.textContent = 'Library';
    leftButton.onclick = loadLibraryScene;
    leftButton.classList.add('left_button');

    const rightButton = document.createElement('button');
    rightButton.textContent = 'Master Bedroom';
    rightButton.onclick = loadMasterBedroomScene;
    rightButton.classList.add('right_button');

    sceneContainer.append(staircaseLandingScene, leftButton, rightButton);

    createNote('images/note.webp', 'Those who seek the truth shall see their own face disappear.', {top: '30%', left: '27%'}
    );

}

/** Creates kitchen scene(4) with two notes, one collectible */
function loadKitchenScene() {
    sceneContainer.innerHTML = '';
    const kitchenScene = document.createElement('img');
    kitchenScene.src = 'images/kitchen.webp';
    kitchenScene.classList.add('background_image');

    const leftButton = document.createElement('button');
    leftButton.textContent = 'Dining room';
    leftButton.onclick = loadDiningRoomScene;
    leftButton.classList.add('left_button');

    const rightButton = document.createElement('button');
    rightButton.textContent = 'Living room';
    rightButton.onclick = loadLivingRoomScene;
    rightButton.classList.add('right_button');

    sceneContainer.append(kitchenScene, leftButton, rightButton);

    createNote('images/note.webp', 'The air here is thick, like it’s holding its breath. There are moments I swear I can feel her woven into the very walls. <br><br>Those symbols on the walls… they’re warnings, or maybe invitations. They tell of rituals older than memory, sacrifices made under moonlight. <br><br>The ones who served her knew the truth, and they knew the price she was willing to pay. Some tried to warn others, whispering tales of the restless woman who would stop at nothing. I can feel it here. She won’t ever leave. And neither will anyone who discovers her secret', {top: '35%', right: '15%' }
    );

    createNote('images/note.webp', 'There’s no comfort here, no warmth. I long to <strong>escape</strong>, to find a place where I can rest..', {bottom: '44%', left: '17%'}, true
    );
}

function loadLivingRoomScene() {
    sceneContainer.innerHTML = '';
    const livingRoomScene = document.createElement('img');
    livingRoomScene.src = 'images/living_room.webp';
    livingRoomScene.classList.add('background_image');

    const leftButton = document.createElement('button');
    leftButton.textContent = 'Kitchen';
    leftButton.onclick = loadKitchenScene
    leftButton.classList.add('left_button');

    const rightButton = document.createElement('button');
    rightButton.textContent = 'Study';
    rightButton.onclick = loadStudyScene;
    rightButton.classList.add('right_button');

    sceneContainer.append(livingRoomScene, leftButton, rightButton);

    createNote('images/note.webp', 'I can’t stay here any longer.<br><br> The whispers at night, the shadows that move when no one else should be here—this house is a prison. Eleanor has changed; her eyes, once full of warmth, are now cold as stone. She speaks to herself, murmuring secrets about a life everlasting. She’s trapped herself in something, and I fear she means to do the same to anyone left here. This place is no longer a home; it’s a tomb waiting to seal us in.', {bottom: '30%', left: '45%' }
    );

    createNote('images/note.webp', 'Eleanor was different from the others; she never wanted to be like them. She wanted to be more, something beyond human. Her eyes could burn through you, as if she could see right through your very mind', {top: '27%', right: '16%' }
    );
}

function loadMasterBedroomScene() {
    sceneContainer.innerHTML = '';
    const masterBedroomScene = document.createElement('img');
    masterBedroomScene.src = 'images/master_bedroom.webp';
    masterBedroomScene.classList.add('background_image');

    const leftButton = document.createElement('button');
    leftButton.textContent = 'Staircase landing'
    leftButton.onclick = loadStaircaseLandingScene;
    leftButton.classList.add('left_button');

    const rightButton = document.createElement('button');
    rightButton.textContent = 'Bathroom';
    rightButton.onclick = loadBathroomScene;
    rightButton.classList.add('right_button');

    const thirdButton = document.createElement('button');
    thirdButton.textContent = 'Basement';
    thirdButton.onclick = loadBasementScene;
    thirdButton.classList.add('third_button');

    sceneContainer.append(masterBedroomScene, leftButton, rightButton, thirdButton);

    createNote('images/note.webp', 'Every time I look in the mirror, I see her. The one I sacrificed.<br><br>Her face is in mine, her voice lingers in these walls. They think I am Eleanor. They don’t know my real name, and soon, they won’t even remember her.<br><br>All I need is more time', {bottom: '38%', left: '30%' }
    );

    createNote('images/note.webp', 'She watches from every shadow. The house is alive with her <strong>anger</strong>.', {bottom: '15%', right: '38%' }, true
    );

}

function loadStudyScene() {
    sceneContainer.innerHTML = '';
    const studyScene = document.createElement('img');
    studyScene.src = 'images/study.webp'
    studyScene.classList.add('background_image');

    const leftButton = document.createElement('button');
    leftButton.textContent = 'Living room';
    leftButton.onclick = loadLivingRoomScene;
    leftButton.classList.add('left_button');

    const rightButton = document.createElement('button');
    rightButton.textContent = 'Bathroom';
    rightButton.onclick = loadBathroomScene;
    rightButton.classList.add('right_button');

    sceneContainer.append(studyScene, leftButton, rightButton);

    createNote('images/note.webp', 'I found it!<br><br>The perfect ritual to bind life to a place, to stave off decay. It’s simple enough, but it requires power. They may never return if they enter here, yet it matters not. I’ll do whatever it takes to preserve myself.', {bottom: '36%', right: '45%' }
    );

    createNote('images/note.webp', 'In every room, I hear whispers, echoes of those who came before. I need to <strong>end</strong> this cycle, break free from this place.”', {bottom: '55%', left: '23%' }, true
    );

}

function loadBathroomScene() {
    sceneContainer.innerHTML = '';
    const bathroomScene = document.createElement('img');
    bathroomScene.src = 'images/bathroom.webp';
    bathroomScene.classList.add('background_image');

    const leftButton = document.createElement('button');
    leftButton.textContent = 'Master Bedroom';
    leftButton.onclick = loadMasterBedroomScene;
    leftButton.classList.add('left_button');

    const rightButton = document.createElement('button')
    rightButton.textContent = 'Study';
    rightButton.onclick = loadStudyScene;
    rightButton.classList.add('right_button');

    sceneContainer.append(bathroomScene, leftButton, rightButton);

    createNote('images/note.webp', 'The elixir is wearing thin. Every day, a little more slips away. I’ve bound myself to this place, a cage of my own making.<br><br>Yet, I cannot leave. To do so would be to surrender everything I’ve worked for.<br><br>No, I must finish it—complete the ritual, restore what I’ve lost.', {bottom: '15%', left: '37%' }
    );

    createKey('images/gold_key.webp', { bottom: '43%', right: '37%'}, 'key2'
    );

}

function loadBasementScene() {
    sceneContainer.innerHTML = '';
    const basementScene = document.createElement('img');
    basementScene.src = 'images/basement.webp';
    basementScene.classList.add('background_image');

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

        let attempts = 0;
        const validPasswords = ['LEAVE', 'Leave', 'leave'];

        submitPasswordButton.onclick = () => {
            const playerInput = passwordInput.value;

            if (validPasswords.includes(playerInput)) {
                loadWinningScene();
            } else {
                attempts++;
                if (attempts === 1) {
                    hintText.textContent = 'Hint: The password consists of a five-letter word'
                } else if (attempts === 2) {
                    hintText.textContent = 'Hint: The first letter is L';
                } else {
                    loadGameOverScene();
                }
            }

        }
        sceneContainer.append(basementScene, passwordButton, passwordContainer);
    }


function loadWinningScene() {
    sceneContainer.innerHTML = '';
    const winningScene = document.createElement('img');
    winningScene.src = 'images/soul_is_freed.webp';
    winningScene.classList.add('background_image');

    const winningText = document.createElement('p');
    winningText.classList.add('winning_text');
    winningText.innerHTML = 'As the password unlocks, a chill sweeps through the room, and Eleanor’s story reveals itself. Driven by a twisted desire for eternal youth, Eleanor performed dark rituals, draining the blood of those lured into her home. Each visitor became a sacrifice, feeding her beauty at the cost of their own lives.<br><br>With the spell broken, Eleanor’s spirit is freed, releasing a final anguished cry. The mansion, no longer bound by her dark magic, begins to fade. You step outside as the cursed house collapses into dust, its tragic secrets buried at last. But as you look back, you wonder if, somewhere, her story lingers, waiting to be told once more...'

    const playAgainButton = document.createElement('button');
    playAgainButton.textContent = 'Play again';
    playAgainButton.classList.add('right_button');
    playAgainButton.onclick = loadStartScene;

    sceneContainer.append(winningScene, winningText, playAgainButton);

}

function loadGameOverScene() {

}