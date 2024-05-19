
(function() {
    "use strict";

    const apiKey1 = 'sk-PyI1l9Ag1u7yPrJkhewnT3Blbk'
    const apiKey = apiKey1 + 'FJK9pdj0YyGs7owBwvmOAM';
    function init() {
        document.getElementById("generate-btn").addEventListener("click", generateColorsFromPrompt);
        var promptInput = document.getElementById("promptInput");
        promptInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                generateColorsFromPrompt();
            }
        });
    }

    function generateColorsFromOpenAI(searchTerm) {
        const apiUrl = "https://api.openai.com/v1/completions";
        const modelId = "gpt-3.5-turbo-instruct";
        const prompt = `Generate 10 lines of hexadecimal color codes and names without numbered list that best represent the theme: "${searchTerm}". Each line should only look like #000000 | Name.
        Do not output anything else.`;
      
        const requestBody = {
          model: modelId,
          prompt: prompt,
          max_tokens: 100,
          temperature: 0.7,
          n: 1,
        };
      
        fetch(apiUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data.choices[0].text.trim())
          if (data.choices && data.choices.length > 0) {
            const rawColors = data.choices[0].text.trim();
            //const colorArray = parseColorResponse(rawColors);
            const newColorArray = rawColors.split("\n")
            // displayGeneratedColors(colorArray);
            displayGeneratedColors(newColorArray);
          } else {
            console.error("Invalid API response structure.");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      }
      

    function generateColorsFromPrompt() {
        const promptInput = document.getElementById('promptInput');
        const userPrompt = promptInput.value;
        console.log(`generating colors with prompt "${userPrompt}"`);
        generateColorsFromOpenAI(userPrompt);
    }


    function displayGeneratedColors(colors) {
        const colorListElement = document.getElementById('colorList');
        colorListElement.innerHTML = '';
    
        for (let i = 0; i < colors.length; i++) {
            // Extract the color from the array
            let colorGroup = colors[i].trim().split('|');
            let colorHex = colorGroup[0]
            let colorName = colorGroup[1]
    
            console.log(colorHex)
    
            // Validate if the color is in a proper format
            if (!isValidColor(colorHex)) {
                console.error("Invalid color format:", colorHex);
                continue; // Skip this color if it's not valid
            }
    
            // Create the color box and label elements
            const colorBox = document.createElement('div');
            colorBox.className = 'colorBox';
            colorBox.style.backgroundColor = colorHex;


            const colorLabel = document.createElement('div');
            const colorHexTag = document.createElement('p');
            colorHexTag.textContent = colorHex;
            colorHexTag.id = 'colorHexTag'; // Set ID for colorHexTag
            const colorNameTag = document.createElement('p');
            colorNameTag.textContent = colorName;
            colorNameTag.id = 'colorNameTag'; // Set ID for colorNameTag
            colorLabel.className = 'colorLabel';
    


            // Append the box and label to the container
            const container = document.createElement('div');
            const clipContainer = document.createElement('div');
            const clipBoard = document.createElement('img');
            clipBoard.src = `../public/clip.svg`;
            clipBoard.alt = "clip";
            const checkMark = document.createElement('img');
            checkMark.src = `../public/checkmark.svg`;
            checkMark.alt = "checkmark";


            clipContainer.className = 'clipContainer';
            container.className = 'container';
            container.appendChild(colorNameTag);
            container.appendChild(colorLabel);
            container.appendChild(colorBox);
            container.appendChild(clipContainer);
            clipContainer.appendChild(colorHexTag);
            clipContainer.appendChild(clipBoard);
    
            // Append the container to the color list element
            colorListElement.appendChild(container);
            
            // Click function to copy hexcolor
            clipContainer.addEventListener("click", () => {
                navigator.clipboard.writeText(colorHex);
                // Change the icon to a check mark when copied
                clipBoard.src = `../public/checkmark.svg`;
                setTimeout(() => {
                    clipBoard.src = `../public/clip.svg`;
                }, 1000);
            });
        }
    }
    
    function isValidColor(strColor) {
        const s = new Option().style;
        s.color = strColor;
        // Check if the browser recognizes the color
        return s.color !== '';
    }

    init();
})();

// Source: OpenAI