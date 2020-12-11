/**
 * Modified to my liking.
 *
 * Huge credit to Jarom Vogel's awesome tutorial
 * https://www.skillshare.com/classes/Art-Code-Create-and-Code-an-Interactive-Parallax-Illustration/1862124549/projects
 */

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

function getImageElement(url) {
  const image = new Image();
  image.src = url;
  return image;
}

const CANVAS_LAYERS = [
  {
    image: getImageElement("./img/layer_1_planet.png"),
    zIndex: -3.5,
    blend: "normal",
    opacity: 1
  },
  {
    image: getImageElement("./img/layer_2_rocket.png"),
    zIndex: -2,
    blend: "normal",
    opacity: 1
  },
  {
    image: getImageElement("./img/layer_3_stripe.png"),
    zIndex: -2.5,
    blend: "normal",
    opacity: 0.6
  },
  {
    image: getImageElement("./img/layer_4_monster_shadow.png"),
    zIndex: -1.5,
    blend: "multiply",
    opacity: 0.75
  },
  {
    image: getImageElement("./img/layer_5_planet2.png"),
    zIndex: -1.2,
    blend: "normal",
    opacity: 1
  },
  {
    image: getImageElement("./img/layer_6_monster.png"),
    zIndex: -1,
    blend: "normal",
    opacity: 1
  },
  {
    image: getImageElement("./img/layer_7_monster_cheeks.png"),
    zIndex: -0.8,
    blend: "normal",
    opacity: 1
  },
  {
    image: getImageElement("./img/layer_8_monster_hands.png"),
    zIndex: -0.3,
    blend: "normal",
    opacity: 1
  },
  {
    image: getImageElement("./img/layer_9_mask.png"),
    zIndex: 0,
    blend: "normal",
    opacity: 1
  },
  {
    image: getImageElement("./img/layer_10_float.png"),
    zIndex: 1.5,
    blend: "normal",
    opacity: 1
  }
];

const blackColor = "rgb(32,32,32)";

// Draw canvas only after all the canvas layer images have been loaded
let countImages = 0;
CANVAS_LAYERS.forEach(layer => {
  layer.image.onload = () => {
    if (countImages === CANVAS_LAYERS.length - 1) {
      requestAnimationFrame(drawCanvas);
    }
    ++countImages;
  };
});

function drawCanvas() {
  // Clear canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // This is needed for the animation to snap back to center when you release mouse or touch
  TWEEN.update();

  rotateCanvasBasedOnDistanceFromInitialPosition();

  // Add background color
  context.fillStyle = blackColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Loop through each layer in the list and draw it to the canvas
  CANVAS_LAYERS.forEach(layer => {
    context.globalCompositeOperation = layer.blend;
    context.globalAlpha = layer.opacity;
    const { x, y } = getLayerOffset(layer.zIndex);
    context.drawImage(layer.image, x, y);
  });

  // Loop this function! requestAnimationFrame is a special built in function that can draw to the canvas at 60 frames per second
  // NOTE: do not call drawCanvas() without using requestAnimationFrame here—things will crash!
  requestAnimationFrame(drawCanvas);
}

// Calculate how much the canvas should be rotated by the user's movement from the initial position
// The further the mouse/touch from the initial position, the higher the degree of rotation
function rotateCanvasBasedOnDistanceFromInitialPosition() {
  const POINTER_ROTATION_MUTIPLIER = 0.1;
  const MOTION_ROTATION_MUTIPLIER = 1;

  const xDegree =
    pointer.y * -POINTER_ROTATION_MUTIPLIER +
    motion.y * MOTION_ROTATION_MUTIPLIER;
  const yDegree =
    pointer.x * POINTER_ROTATION_MUTIPLIER +
    motion.x * MOTION_ROTATION_MUTIPLIER;

  canvas.style.transform = `rotateX(${xDegree}deg) rotateY(${yDegree}deg)`;
}

const TOUCH_MUTIPLIER = 0.35;
const MOTION_MULTIPLIER = 2.5;

function getLayerOffset(zIndex) {
  // Calculate the amount you want the layers to move based on touch or mouse input.
  const touchOffsetX = pointer.x * zIndex * TOUCH_MUTIPLIER;
  const touchOffsetY = pointer.y * zIndex * TOUCH_MUTIPLIER;

  // Calculate the amount you want the layers to move based on the gyroscope
  const motionOffsetX = motion.x * zIndex * MOTION_MULTIPLIER;
  const motionOffsetY = motion.y * zIndex * MOTION_MULTIPLIER;

  const offset = {
    x: touchOffsetX + motionOffsetX,
    y: touchOffsetY + motionOffsetY
  };

  return offset;
}

//// TOUCH AND MOUSE CONTROLS ////

// Initialize variables for touch and mouse-based parallax

// This is a variable we're using to only move things when you're touching the screen, or holding the mouse button down.
let moving = false;

// Initialize touch and mouse position
const pointer_initial = {
  x: 0,
  y: 0
};
const pointer = {
  x: 0,
  y: 0
};

canvas.addEventListener("touchstart", pointerStart);
canvas.addEventListener("mousedown", pointerStart);

// Runs when touch or mouse click starts
function pointerStart(event) {
  // Ok, you touched the screen or clicked, now things can move until you stop doing that
  moving = true;
  // Check if this is a touch event
  if (event.type === "touchstart") {
    // set initial touch position to the coordinates where you first touched the screen
    pointer_initial.x = event.touches[0].clientX;
    pointer_initial.y = event.touches[0].clientY;
    // Check if this is a mouse click event
  } else if (event.type === "mousedown") {
    // set initial mouse position to the coordinates where you first clicked
    pointer_initial.x = event.clientX;
    pointer_initial.y = event.clientY;
  }
}

window.addEventListener("mousemove", pointerMove);
window.addEventListener("touchmove", pointerMove);

function pointerMove(event) {
  // This is important to prevent scrolling the page instead of moving layers around
  event.preventDefault();
  // Only run this if touch or mouse click has started
  if (moving === true) {
    let current_x = 0;
    let current_y = 0;
    // Check if this is a touch event
    if (event.type === "touchmove") {
      // Current position of touch
      current_x = event.touches[0].clientX;
      current_y = event.touches[0].clientY;
      // Check if this is a mouse event
    } else if (event.type === "mousemove") {
      // Current position of mouse cursor
      current_x = event.clientX;
      current_y = event.clientY;
    }
    // Set pointer position to the difference between current position and initial position
    pointer.x = current_x - pointer_initial.x;
    pointer.y = current_y - pointer_initial.y;
  }
}

// Listen to any time you move your finger in the canvas element
canvas.addEventListener("touchmove", function(event) {
  // Don't scroll the screen
  event.preventDefault();
});
// Listen to any time you move your mouse in the canvas element
canvas.addEventListener("mousemove", function(event) {
  // Don't do whatever would normally happen when you click and drag
  event.preventDefault();
});

// Listen for when you stop touching the screen
window.addEventListener("touchend", function(event) {
  // Run the endGesture function (below)
  endGesture();
});
// Listen for when you release the mouse button anywhere on the screen
window.addEventListener("mouseup", function(event) {
  // Run the endGesture function (below)
  endGesture();
});

function endGesture() {
  // You aren't touching or clicking anymore, so set this back to false
  moving = false;

  // This removes any in progress tweens
  TWEEN.removeAll();
  // This starts the animation to reset the position of all layers when you stop moving them
  new TWEEN.Tween(pointer)
    .to({ x: 0, y: 0 }, 300)
    .easing(TWEEN.Easing.Back.Out)
    .start();
}

//// MOTION CONTROLS ////

// Initialize variables for motion-based parallax
const motion_initial = {
  x: null,
  y: null
};
const motion = {
  x: 0,
  y: 0
};

// This is where we listen to the gyroscope position
window.addEventListener("deviceorientation", function(event) {
  // If this is the first run through here, set the initial position of the gyroscope
  if (!motion_initial.x && !motion_initial.y) {
    motion_initial.x = event.beta;
    motion_initial.y = event.gamma;
  }

  // Depending on what orientation the device is in, you need to adjust what each gyroscope axis means
  // This can be a bit tricky
  if (window.orientation === 0) {
    // The device is right-side up in portrait orientation
    motion.x = event.gamma - motion_initial.y;
    motion.y = event.beta - motion_initial.x;
  } else if (window.orientation === 90) {
    // The device is in landscape laying on its left side
    motion.x = event.beta - motion_initial.x;
    motion.y = -event.gamma + motion_initial.y;
  } else if (window.orientation === -90) {
    // The device is in landscape laying on its right side
    motion.x = -event.beta + motion_initial.x;
    motion.y = event.gamma - motion_initial.y;
  } else {
    // The device is upside-down in portrait orientation
    motion.x = -event.gamma + motion_initial.y;
    motion.y = -event.beta + motion_initial.x;
  }

  // This is optional, but prevents things from moving too far (because these are 2d images it can look broken)
  const max_offset = 23;

  // Check if magnitude of motion offset along X axis is greater than your max setting
  if (Math.abs(motion.x) > max_offset) {
    // Check whether offset is positive or negative, and make sure to keep it that way
    if (motion.x < 0) {
      motion.x = -max_offset;
    } else {
      motion.x = max_offset;
    }
  }
  // Check if magnitude of motion offset along Y axis is greater than your max setting
  if (Math.abs(motion.y) > max_offset) {
    // Check whether offset is positive or negative, and make sure to keep it that way
    if (motion.y < 0) {
      motion.y = -max_offset;
    } else {
      motion.y = max_offset;
    }
  }
});

// Reset the position of motion controls when device changes between portrait and landscape, etc.
window.addEventListener("orientationchange", function(event) {
  motion_initial.x = 0;
  motion_initial.y = 0;
});
