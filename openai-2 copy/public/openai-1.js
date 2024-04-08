
(function() {
    const apiKey = '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';
    function init() {
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
        const prompt = `Generate 10 lines of hexadecimal color codes and names that best represent the theme: "${searchTerm}". Each line should only look like #000000 | Name.
        Do not output anything else. Order from most to least popular.`;
      
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
      
    function parseColorResponse(rawColors) {
        // Extract only the HEX codes from the response
        const hexColorRegex = /#([0-9A-F]{6})/gi;
        let match;
        const hexColors = [];
    
        while ((match = hexColorRegex.exec(rawColors)) !== null) {
            hexColors.push(match[0]);
        }
    
        return hexColors.slice(0, 10); // Return only the first 10 colors
    }
    
    
    
    function searchColors() {
        const searchInput = document.getElementById('searchInput');
        const searchTerm = searchInput.value.toLowerCase();
    
        const colorBoxes = document.querySelectorAll('.colorBox');
    
        colorBoxes.forEach((colorBox) => {
            const colorLabel = colorBox.nextElementSibling;
            const colorName = colorLabel.textContent.toLowerCase();
    
            if (colorName.includes(searchTerm)) {
                colorBox.style.display = 'inline-block';
            } else {
                colorBox.style.display = 'none';
            }
        });
    }
    
    
    function generateColorsFromPrompt() {
        const promptInput = document.getElementById('promptInput');
        const userPrompt = promptInput.value;
        generateColorsFromOpenAI(userPrompt);
    }
    
    function displayGeneratedColors(colors) {
        const colorListElement = document.getElementById('colorList');
        colorListElement.innerHTML = '';
    
        for (let i = 0; i < colors.length; i++) {
            // Extract the color from the array
            let colorGroup = colors[i].trim().split('|');
            let number = i
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
            colorLabel.innerHTML = number + "<br/> " + colorHex + "<br/> " + colorName;
            colorLabel.className = 'colorLabel';
    
            // Append the box and label to the container
            const container = document.createElement('div');
            container.appendChild(colorBox);
            container.appendChild(colorLabel);
    
            // Append the container to the color list element
            colorListElement.appendChild(container);
        }
    }
    
    function isValidColor(strColor) {
        const s = new Option().style;
        s.color = strColor;
        // Check if the browser recognizes the color
        return s.color !== '';
    }
    
    
    function isCSSColorName(name) {
        const s = new Option().style;
        s.color = name;
        return s.color !== '';
    }
    
    
    function displayColorPalette(colorPalette) {
        const colorListElement = document.getElementById('colorList');
        colorListElement.innerHTML = '';
    
        const colors = colorPalette.split('\n');
    
        for (let i = 0; i < colors.length; i++) {
            const color = colors[i].trim();
            
            const colorBox = document.createElement('div');
            colorBox.className = 'colorBox';
            colorBox.style.backgroundColor = color;
    
            const colorLabel = document.createElement('div');
            colorLabel.textContent = color;
            colorLabel.className = 'colorLabel';
    
            const container = document.createElement('div');
            container.appendChild(colorBox);
            container.appendChild(colorLabel);
    
            colorListElement.appendChild(container);
        }
    }
    
    function displayColorPalette(colorPalette) {
        const colorListElement = document.getElementById('colorList');
        colorListElement.innerHTML = '';
    
        const colors = colorPalette.split('\n');
    
        for (let i = 0; i < colors.length; i++) {
            const color = colors[i].trim();
            
            const colorBox = document.createElement('div');
            colorBox.className = 'colorBox';
            colorBox.style.backgroundColor = color;
    
            const colorLabel = document.createElement('div');
            colorLabel.textContent = color;
            colorLabel.className = 'colorLabel';
    
            const container = document.createElement('div');
            container.appendChild(colorBox);
            container.appendChild(colorLabel);
    
            colorListElement.appendChild(container);
        }
    }
    
    
    function isColorRepeated(color, colorArray) {
        return colorArray.includes(color);
    }
    
    function modifyColor(baseColor, angle) {
        const radians = (angle * Math.PI) / 180;
        const sin = Math.sin(radians);
        const cos = Math.cos(radians);
    
        const modifiedColor = {
            r: baseColor.r,
            g: Math.round(baseColor.g * cos - baseColor.b * sin),
            b: Math.round(baseColor.g * sin + baseColor.b * cos),
        };
    
        return clampRGB(modifiedColor);
    }
    
    function hexToRGB(hexColor) {
        return {
            r: parseInt(hexColor.slice(1, 3), 16),
            g: parseInt(hexColor.slice(3, 5), 16),
            b: parseInt(hexColor.slice(5, 7), 16),
        };
    }
    
    function rgbToHex(rgbColor) {
        return `#${(1 << 24 | rgbColor.r << 16 | rgbColor.g << 8 | rgbColor.b).toString(16).slice(1)}`;
    }
    
    function clampRGB(color) {
        return {
            r: Math.min(255, Math.max(0, color.r)),
            g: Math.min(255, Math.max(0, color.g)),
            b: Math.min(255, Math.max(0, color.b)),
        };
    }

    init();
})();
