// Link to your Teachable Machine model
const URL = "https://teachablemachine.withgoogle.com/models/llV6YyKl7/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // load the model and metadata
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Set up the webcam
  const flip = true; // Whether to flip the webcam
  webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
  await webcam.setup(); // request access to the webcam
  await webcam.play();
  window.requestAnimationFrame(loop);

  // Append webcam to the DOM
  document.getElementById("webcam-container").appendChild(webcam.canvas);
  
  // Set up label container for predictions
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    labelContainer.appendChild(document.createElement("div"));
  }
}

async function loop() {
  webcam.update(); // Update webcam frame
  await predict();
  window.requestAnimationFrame(loop);
}

// Run the webcam image through the image model
async function predict() {
  const prediction = await model.predict(webcam.canvas);
  
  // Sort predictions by probability in descending order
  prediction.sort((a, b) => b.probability - a.probability);

  labelContainer.innerHTML = ''; // Clear previous predictions

  // Display predictions and highlight the most probable one
  prediction.forEach((pred, index) => {
    const classPrediction = `${pred.className}: ${pred.probability.toFixed(2)}`;
    
    // Create a new div for each prediction
    const div = document.createElement("div");
    div.classList.add("prediction-item");
    
    // Highlight the highest probability
    if (index === 0) {
      div.classList.add("highlight");
    }

    div.innerHTML = classPrediction;

    // Add event listener for click action
    div.addEventListener('click', () => {
      alert(`You selected: ${pred.className}\nProbability: ${pred.probability.toFixed(2)}`);
    });

    labelContainer.appendChild(div);
  });
}
