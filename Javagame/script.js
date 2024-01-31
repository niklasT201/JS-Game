var player = document.getElementById("player");
var game = document.getElementById("game");
var timer = document.getElementById("timer");
var moveLeft = 230;
var animationId; // Declare animationId globally
var startTime; 
var pauseTime;
var timerInterval; // Interval for the timer
var gameInProgress = true; 
var playerdead = false;


function movePlayer(direction) {
    if (!gameInProgress) return;
    var movespeed = 20;
    const elapsedTime = Math.floor((new Date().getTime() - startTime) / 1000);


// Movement Speed
    if (elapsedTime >= 10) {
        movespeed = 30; 
    }

    if (elapsedTime >= 25) {
        movespeed = 35; 
    }

    if (elapsedTime >= 40) {
        movespeed = 40; 
    }

    if (elapsedTime >= 70) {
        movespeed = 50; 
    }

    const step = movespeed; 

    let newLeft;

    if (direction === 'left') {
        newLeft = Math.max(moveLeft - step, 0);
    } else if (direction === 'right') {
        newLeft = Math.min(moveLeft + step, 450);
    }

    moveLeft = newLeft;
    player.style.left = moveLeft + "px";
}


function jump() {
    if (!gameInProgress) return;
    if (player.classList.contains("animate")) {
        return;
    }
    player.classList.add("animate");
    setTimeout(function () {
        player.classList.remove("animate");
    }, 300);
}

document.addEventListener("keydown", function (e) {
    if (e.key === "a" || e.key === "A") {
        movePlayer('left');
    }

    if (e.key === "d" || e.key === "D") {
        movePlayer('right');
    }

    if (e.key === "w" || e.key === "W") {
        jump();
    }
});

function update() {
    moveLeft = 230;
    player.style.left = moveLeft + "px";

    // Remove all existing blocks
    var blocks = document.querySelectorAll('.block');
    blocks.forEach(function (block) {
        game.removeChild(block);
    });

    clearInterval(animationId);
    clearInterval(timerInterval);

    document.getElementById('timer').innerHTML = "Survived Time: <br> 0 Seconds";
    gameInProgress = true;
    playerdead = false;

    blockGeneration();
    startTimer()
    
}



function showContinueButton(){
    var coninueButton = document.createElement('button');
    coninueButton.innerText = 'Continue Game';
    coninueButton.style.top = "200px";
    coninueButton.addEventListener('click', function() {
        gameInProgress = true;
        playerdead = false;
        game.style.backgroundImage ="url('Sky.png')";
        blockGeneration();
        removeButtons(); // Remove all close buttons as well
        resumeTimer();
    });
    game.appendChild(coninueButton); // Append the button to the game div
}

function showRestartButton(){
    var restartButton = document.createElement('button');
    restartButton.innerText = 'Restart Game';
    restartButton.style.top = "250px";
    restartButton.style.width ="157px";
    restartButton.addEventListener('click', function() {
        update(); 
        removeButtons();
        game.style.backgroundImage ="url('Sky.png')";
    });
    game.appendChild(restartButton); 
}

function showCloseButton(){
    var closeButton = document.createElement('button');
    closeButton.innerText = 'Close Game';
    closeButton.style.top = "300px";
    closeButton.style.width ="157px";
    closeButton.addEventListener('click', function() {
        window.close();
    });
    game.appendChild(closeButton); 
}

function removeButtons() {
    var buttons = document.querySelectorAll('button');
    buttons.forEach(function(button) {
        button.remove();
    });
}






function checkCollision() {
    if (!gameInProgress) return;
    var playerRect = player.getBoundingClientRect();
    var blocks = document.querySelectorAll('.block');

    blocks.forEach(function(block) {
        var blockRect = block.getBoundingClientRect();

        if (
            playerRect.top < blockRect.bottom &&
            playerRect.bottom > blockRect.top &&
            playerRect.left < blockRect.right &&
            playerRect.right > blockRect.left
        ) {
            // Collision 
            playerdead = true;
            clearInterval(animationId);
            clearInterval(timerInterval);
            showRestartButton();
            showCloseButton();
            gameInProgress = false;
        }
    });
}


function startTimer() {
    if (!gameInProgress) return;
    startTime = new Date().getTime(); 
    timerInterval = setInterval(function() {
        var currentTime = new Date().getTime();
        var elapsedTime = currentTime - startTime; // Calculate elapsed time in milliseconds
        var seconds = Math.floor(elapsedTime / 1000); // Convert milliseconds to seconds
        document.getElementById('timer').innerHTML = "Survived Time: <br>" + seconds + " Seconds"; 
    }, 1000); 
}

function pauseTimer() {
    clearInterval(timerInterval);
    pauseTime = new Date().getTime(); // Stores the current time when pausing
}

// Resume the timer
function resumeTimer() {
    if (!gameInProgress) return;
    var currentTime = new Date().getTime();
    var elapsedTime = currentTime - pauseTime; 
    startTime += elapsedTime; 
    pauseTime = 0; 
    timerInterval = setInterval(updateTimer, 1000);
}


// Update the timer display
function updateTimer() {
    if (!gameInProgress) return; 
    var currentTime = new Date().getTime();
    var elapsedTime = currentTime - startTime;
    var seconds = Math.floor(elapsedTime / 1000);
    timer.innerHTML = "Survived Time: <br>" + seconds + " Seconds";
}





function blockGeneration() {
    if (!gameInProgress) return; 
    var block = document.createElement('div');
    block.className = 'block';
    game.appendChild(block);

    var blockLeft = Math.floor(Math.random() * (500 - 20));
    block.style.left = blockLeft + "px";

    animationId = setInterval(blockFalling, 10);

    function blockFalling() {
        var blockTop = parseInt(block.style.top) || 0; 
        var falltime = 3; // Default


        // Speed Increase
        if (Math.floor((new Date().getTime() - startTime) / 1000) >= 10) {
            falltime = 5; 
        }

        if (Math.floor((new Date().getTime() - startTime) / 1000) >= 20) {
            falltime = 6; 
        }

        if (Math.floor((new Date().getTime() - startTime) / 1000) >= 30) {
            falltime = 8; 
        }

        if (Math.floor((new Date().getTime() - startTime) / 1000) >= 50) {
            falltime = 10; 
        }

        if (Math.floor((new Date().getTime() - startTime) / 1000) >= 70) {
            falltime = 15; 
        }


        blockTop += falltime; 

        block.style.top = blockTop + "px";

        if (blockTop >= 580) {
            clearInterval(animationId);
            game.removeChild(block);
            blockGeneration();
        }

        // Check for collisions after each block movement
        checkCollision();
    }
}




// Function to handle visibility change
function handleVisibilityChange() {
    if (document.hidden) {
        gameInProgress = false; 
        pauseTimer();
        game.style.backgroundImage ="url('blurred Sky.png')";
        if (!playerdead) { 
            showContinueButton();
        }
            showRestartButton();
            showCloseButton();
    }
}

//event listener for visibility change
document.addEventListener("visibilitychange", handleVisibilityChange);
 

blockGeneration();
startTimer();



/*
function updateTimer() {
    if (!gameInProgress) return;
    var currentTime = new Date().getTime();
    var elapsedTime = currentTime - startTime;
    var seconds = Math.floor(elapsedTime / 1000);
    document.getElementById('timer').innerHTML = "Survived Time: <br>" + seconds + " Seconds";
  
    if (!playerdead) {
      // Restart the timer when game is resumed
      if (!startTime) {
        startTime = currentTime;
      }
  
      // Check if the tab is visible and adjust the timer accordingly
      if (document.hidden) {
        // Pause the timer when the tab is hidden
        pauseTimer();
        game.style.backgroundImage = 'url("blurred Sky.png")';
        if (!playerdead) {
          showContinueButton();
        }
        showRestartButton();
        showCloseButton();
      } else {
        // Resume the timer when the tab becomes visible
        resumeTimer();
        game.style.backgroundImage = 'url("Sky.png")';
        removeButtons();
      }
    }
  }
  
  function restartGame() {
    document.getElementById('timer').innerHTML = "Survived Time: <br>" + 0 + " Seconds";
    startTime = new Date().getTime();
    playerdead = false;
    blockGeneration();
    startTimer();
  }
  
  function pauseTimer() {
    clearInterval(timerInterval);
    pauseTime = new Date().getTime(); // Stores the current time when pausing
    pausedStartTime = startTime; // Save the current startTime
  }
  
  // Resume the timer
  function resumeTimer() {
    if (!gameInProgress) return;
    startTime = pausedStartTime; // Restore the paused startTime
    var currentTime = new Date().getTime();
    var elapsedTime = currentTime - pauseTime;
    pauseTime = 0;
    timerInterval = setInterval(updateTimer, 1000);
  }*/