const URL = "https://teachablemachine.withgoogle.com/models/llV6YyKl7/";
let model, labelContainer, maxPredictions;


async function loadModel() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        const div = document.createElement("div");
        div.classList.add("prediction-item");
     
        div.addEventListener('click', () => {
            alert(`You clicked on: ${div.innerHTML}`);
        });
        labelContainer.appendChild(div);
    }
}


async function predictImage(file) {
    const imgElement = document.getElementById("uploadedImage");

    const reader = new FileReader();
    reader.onload = async function (event) {
        imgElement.src = event.target.result; // แสดงรูปที่นำเข้าใน `<img>`
        const img = new Image();
        img.src = event.target.result;

        img.onload = async () => {
            // ใช้รูปที่โหลดเข้าไปในโมเดลเพื่อทำการทำนาย
            const prediction = await model.predict(img);
            
            // เรียงลำดับผลการทำนายจากความน่าจะเป็นสูงสุด
            prediction.sort((a, b) => b.probability - a.probability);

            // เคลียร์ผลการทำนายก่อนหน้า
            labelContainer.innerHTML = '';

            // แสดงผลการทำนายใหม่และไฮไลท์ค่าที่มีความน่าจะเป็นสูงสุด
            prediction.forEach((pred, index) => {
                const classPrediction = `${pred.className}: ${pred.probability.toFixed(2)}`;
                const div = document.createElement("div");
                div.classList.add("prediction-item");

                // ไฮไลท์ค่าที่มีความน่าจะเป็นสูงสุด
                if (index === 0) {
                    div.classList.add("highlight");
                }

                div.innerHTML = classPrediction;

                // เพิ่ม event listener สำหรับการคลิกที่ผลการทำนาย
                div.addEventListener('click', () => {
                    alert(`You clicked on: ${div.innerHTML}`);
                });

                labelContainer.appendChild(div);
            });
        };
    };
    reader.readAsDataURL(file); // อ่านไฟล์เป็น Data URL
}

// ดักจับการอัปโหลดไฟล์
document.getElementById("imageInput").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        predictImage(file);
    }
});

// เรียกฟังก์ชันโหลดโมเดลตอนเริ่มต้น
loadModel();
