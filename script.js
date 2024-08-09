document.addEventListener('DOMContentLoaded', () => {
    let isFirstColorSelected = true; // Flag to track which color picker to update
    let currentEyedropperButton = null;

    async function pickColorFromScreen() {
        if (!window.EyeDropper) {
            alert('Your browser does not support the EyeDropper API.');
            return;
        }

        const eyeDropper = new EyeDropper();
        try {
            const result = await eyeDropper.open();
            return result.sRGBHex;
        } catch (error) {
            console.error('Error picking color:', error);
        }
    }

    function hexToRgb(hex) {
        let bigint = parseInt(hex.slice(1), 16);
        let r = (bigint >> 16) & 255;
        let g = (bigint >> 8) & 255;
        let b = bigint & 255;
        return [r, g, b];
    }

    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }

    function mixColors() {
        let color1 = document.getElementById('color1').value;
        let color2 = document.getElementById('color2').value;

        let [r1, g1, b1] = hexToRgb(color1);
        let [r2, g2, b2] = hexToRgb(color2);

        let r = Math.round((r1 + r2) / 2);
        let g = Math.round((g1 + g2) / 2);
        let b = Math.round((b1 + b2) / 2);

        let mixedColor = rgbToHex(r, g, b);
        let colorName = getColorName(mixedColor); // Get the color name

        let resultDiv = document.getElementById('result');
        resultDiv.style.backgroundColor = mixedColor;
        resultDiv.textContent = `Result Color: ${colorName} (${mixedColor})`;
        resultDiv.style.color = (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000' : '#FFF';

        // Update the color name in the result-text span
        document.getElementById('colorName').textContent = colorName;

        generatePalette(r, g, b);
    }

    function generatePalette(r, g, b) {
        let paletteDiv = document.getElementById('palette');
        paletteDiv.innerHTML = ''; // Clear existing palette

        let palette = [];

        for (let i = 0; i < 12; i++) { // Generate 24 colors
            let factor = i / 11; // Use 23 to spread out colors evenly
            let lightR = Math.round(r + (255 - r) * (1 - factor));
            let lightG = Math.round(g + (255 - g) * (1 - factor));
            let lightB = Math.round(b + (255 - b) * (1 - factor));
            let darkR = Math.round(r * factor);
            let darkG = Math.round(g * factor);
            let darkB = Math.round(b * factor);

            let lightColor = rgbToHex(lightR, lightG, lightB);
            let darkColor = rgbToHex(darkR, darkG, darkB);

            palette.push(lightColor);
            palette.push(darkColor);
        }

        palette.sort((a, b) => {
            let [r1, g1, b1] = hexToRgb(a);
            let [r2, g2, b2] = hexToRgb(b);
            return ((r1 * 0.299 + g1 * 0.587 + b1 * 0.114) - (r2 * 0.299 + g2 * 0.587 + b2 * 0.114));
        });

        for (let color of palette) {
            let item = document.createElement('div');
            item.className = 'palette-item';

            let colorDiv = document.createElement('div');
            colorDiv.className = 'palette-color';
            colorDiv.style.backgroundColor = color;
            colorDiv.addEventListener('click', () => {
                if (isFirstColorSelected) {
                    document.getElementById('color1').value = color;
                    isFirstColorSelected = false; // Set flag to false for the next click
                } else {
                    document.getElementById('color2').value = color;
                    isFirstColorSelected = true; // Reset flag for the next click
                    mixColors(); // Optionally mix colors immediately after selection
                }
            });

            let colorCode = document.createElement('div');
            colorCode.className = 'color-code';
            colorCode.textContent = color;

            item.appendChild(colorDiv);
            item.appendChild(colorCode);

            paletteDiv.appendChild(item);
        }
    }

    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    function getColorName(hex) {
        // Convert hex to RGB
        const [r, g, b] = hexToRgb(hex);

        // Define a list of named colors with RGB values
        const colorNames = [
            // Existing colors
            { name: "White", rgb: [255, 255, 255] },
            { name: "Black", rgb: [0, 0, 0] },
            { name: "Red", rgb: [255, 0, 0] },
            { name: "Lime", rgb: [0, 255, 0] },
            { name: "Blue", rgb: [0, 0, 255] },
            { name: "Yellow", rgb: [255, 255, 0] },
            { name: "Fuchsia", rgb: [255, 0, 255] },
            { name: "Aqua", rgb: [0, 255, 255] },
            { name: "Silver", rgb: [192, 192, 192] },
            { name: "Gray", rgb: [128, 128, 128] },
            { name: "Maroon", rgb: [128, 0, 0] },
            { name: "Olive", rgb: [128, 128, 0] },
            { name: "Green", rgb: [0, 128, 0] },
            { name: "Purple", rgb: [128, 0, 128] },
            { name: "Teal", rgb: [0, 128, 128] },
            { name: "Navy", rgb: [0, 0, 128] },
            { name: "Dark Red", rgb: [139, 0, 0] },
            { name: "Dark Olive Green", rgb: [85, 107, 47] },
            { name: "Dark Green", rgb: [0, 100, 0] },
            { name: "Dark Slate Gray", rgb: [47, 79, 79] },
            { name: "Light Coral", rgb: [240, 128, 128] },
            { name: "Light Pink", rgb: [255, 182, 193] },
            { name: "Light Green", rgb: [144, 238, 144] },
            { name: "Light Sky Blue", rgb: [135, 206, 250] },
            { name: "Light Slate Gray", rgb: [119, 136, 153] },
            { name: "Light Steel Blue", rgb: [176, 196, 222] },
            { name: "Medium Slate Blue", rgb: [123, 104, 238] },
            { name: "Medium Turquoise", rgb: [72, 209, 204] },
            { name: "Medium Violet Red", rgb: [199, 21, 133] },
            { name: "Orange", rgb: [255, 165, 0] },
            { name: "Pale Green", rgb: [152, 251, 152] },
            { name: "Pale Turquoise", rgb: [175, 238, 238] },
            { name: "Pale Violet Red", rgb: [219, 112, 147] },
            { name: "Powder Blue", rgb: [176, 224, 230] },
            { name: "Rosy Brown", rgb: [188, 143, 143] },
            { name: "Sandy Brown", rgb: [244, 164, 96] },
            { name: "Sea Green", rgb: [46, 139, 87] },
            { name: "Slate Blue", rgb: [106, 90, 205] },
            { name: "Steel Blue", rgb: [70, 130, 180] },
            { name: "Tomato", rgb: [255, 99, 71] },
            { name: "Alice Blue", rgb: [240, 248, 255] },
            { name: "Antique White", rgb: [250, 235, 215] },
            { name: "Aqua Marine", rgb: [127, 255, 212] },
            { name: "Azure", rgb: [240, 255, 255] },
            { name: "Blanched Almond", rgb: [255, 235, 205] },
            { name: "Blue Violet", rgb: [138, 43, 226] },
            { name: "Burly Wood", rgb: [222, 184, 135] },
            { name: "Cadet Blue", rgb: [95, 158, 160] },
            { name: "Dark Blue", rgb: [0, 0, 139] },
            { name: "Dark Cyan", rgb: [0, 139, 139] },
            { name: "Dark Golden Rod", rgb: [184, 134, 11] },
            { name: "Dark Gray", rgb: [169, 169, 169] },
            { name: "Dark Khaki", rgb: [189, 183, 107] },
            { name: "Dark Magenta", rgb: [139, 0, 139] },
            { name: "Dark Orange", rgb: [255, 140, 0] },
            { name: "Dark Orchid", rgb: [153, 50, 204] },
            { name: "Dark Salmon", rgb: [233, 150, 122] },
            { name: "Dark Sea Green", rgb: [143, 188, 143] },
            { name: "Dark Slate Blue", rgb: [72, 61, 139] },
            { name: "Dark Slate Gray", rgb: [47, 79, 79] },
            { name: "Dark Turquoise", rgb: [0, 206, 209] },
            { name: "Dark Violet", rgb: [148, 0, 211] },
            { name: "Deep Pink", rgb: [255, 20, 147] },
            { name: "Deep Sky Blue", rgb: [0, 191, 255] },
            { name: "Dim Gray", rgb: [105, 105, 105] },
            { name: "Dodger Blue", rgb: [30, 144, 255] },
            { name: "Fire Brick", rgb: [178, 34, 34] },
            { name: "Floral White", rgb: [255, 250, 240] },
            { name: "Forest Green", rgb: [34, 139, 34] },
            { name: "Ghost White", rgb: [248, 248, 255] },
            { name: "Golden Rod", rgb: [218, 165, 32] },
            { name: "Green Yellow", rgb: [173, 255, 47] },
            { name: "Honey Dew", rgb: [240, 255, 240] },
            { name: "Hot Pink", rgb: [255, 105, 180] },
            { name: "Indian Red", rgb: [205, 92, 92] },
            { name: "Ivory", rgb: [255, 255, 240] },
            { name: "Lavender Blush", rgb: [255, 240, 245] },
            { name: "Lawn Green", rgb: [124, 252, 0] },
            { name: "Light Blue", rgb: [173, 216, 230] },
            { name: "Light Coral", rgb: [240, 128, 128] },
            { name: "Light Golden Rod Yellow", rgb: [250, 250, 210] },
            { name: "Light Gray", rgb: [211, 211, 211] },
            { name: "Light Green", rgb: [144, 238, 144] },
            { name: "Light Pink", rgb: [255, 182, 193] },
            { name: "Light Salmon", rgb: [255, 160, 122] },
            { name: "Light Sea Green", rgb: [32, 178, 170] },
            { name: "Light Sky Blue", rgb: [135, 206, 250] },
            { name: "Light Slate Gray", rgb: [119, 136, 153] },
            { name: "Light Steel Blue", rgb: [176, 196, 222] },
            { name: "Light Yellow", rgb: [255, 255, 224] },
            { name: "Lime Green", rgb: [50, 205, 50] },
            { name: "Medium Aqua Marine", rgb: [102, 205, 170] },
            { name: "Medium Blue", rgb: [0, 0, 205] },
            { name: "Medium Sea Green", rgb: [60, 179, 113] },
            { name: "Medium Slate Blue", rgb: [123, 104, 238] },
            { name: "Medium Spring Green", rgb: [0, 250, 154] },
            { name: "Medium Turquoise", rgb: [72, 209, 204] },
            { name: "Medium Violet Red", rgb: [199, 21, 133] },
            { name: "Midnight Blue", rgb: [25, 25, 112] },
            { name: "Mint Cream", rgb: [245, 255, 250] },
            { name: "Misty Rose", rgb: [255, 228, 225] },
            { name: "Moccasin", rgb: [255, 228, 181] },
            { name: "Navajo White", rgb: [255, 222, 173] },
            { name: "Old Lace", rgb: [253, 245, 230] },
            { name: "Olive Drab", rgb: [107, 142, 35] },
            { name: "Orange Red", rgb: [255, 69, 0] },
            { name: "Orchid", rgb: [218, 112, 214] },
            { name: "Pale Golden Rod", rgb: [238, 232, 170] },
            { name: "Papaya Whip", rgb: [255, 239, 213] },
            { name: "Peach Puff", rgb: [255, 218, 185] },
            { name: "Peru", rgb: [205, 133, 63] },
            { name: "Pink", rgb: [255, 192, 203] },
            { name: "Plum", rgb: [221, 160, 221] },
            { name: "Royal Blue", rgb: [65, 105, 225] },
            { name: "Saddle Brown", rgb: [139, 69, 19] },
            { name: "Salmon", rgb: [250, 128, 114] },
            { name: "Sea Shell", rgb: [255, 245, 238] },
            { name: "Sienna", rgb: [160, 82, 45] },
            { name: "Sky Blue", rgb: [135, 206, 235] },
            { name: "Slate Gray", rgb: [112, 128, 144] },
            { name: "Snow", rgb: [255, 250, 250] },
            { name: "Spring Green", rgb: [0, 255, 127] },
            { name: "Tan", rgb: [210, 180, 140] },
            { name: "Thistle", rgb: [216, 191, 216] },
            { name: "Turquoise", rgb: [64, 224, 208] },
            { name: "Violet", rgb: [238, 130, 238] },
            { name: "Wheat", rgb: [245, 222, 179] },
            { name: "White Smoke", rgb: [245, 245, 245] },
            { name: "Yellow Green", rgb: [154, 205, 50] },
            { name: "Almond", rgb: [239, 222, 205] },
            { name: "Amber", rgb: [255, 191, 0] },
            { name: "Amethyst", rgb: [153, 102, 204] },
            { name: "Apricot", rgb: [251, 206, 177] },
            { name: "Auburn", rgb: [165, 42, 42] },
            { name: "Beige", rgb: [245, 245, 220] },
            { name: "Burgundy", rgb: [128, 0, 32] },
            { name: "Cerulean", rgb: [0, 123, 167] },
            { name: "Chartreuse", rgb: [127, 255, 0] },
            { name: "Copper", rgb: [184, 115, 51] },
            { name: "Coral", rgb: [255, 127, 80] },
            { name: "Crimson", rgb: [220, 20, 60] },
            { name: "Cyan", rgb: [0, 255, 255] },
            { name: "Emerald", rgb: [80, 200, 120] },
            { name: "Garnet", rgb: [115, 59, 62] },
            { name: "Gold", rgb: [255, 215, 0] },
            { name: "Jade", rgb: [0, 168, 107] },
            { name: "Lavender", rgb: [230, 230, 250] },
            { name: "Lemon", rgb: [255, 250, 205] },
            { name: "Magenta", rgb: [255, 0, 255] },
            { name: "Mahogany", rgb: [192, 64, 0] },
            { name: "Mauve", rgb: [224, 176, 255] },
            { name: "Mulberry", rgb: [197, 75, 140] },
            { name: "Navy Blue", rgb: [0, 0, 128] },
            { name: "Onyx", rgb: [53, 56, 57] },
            { name: "Opal", rgb: [109, 139, 150] },
            { name: "Periwinkle", rgb: [204, 204, 255] },
            { name: "Pine Green", rgb: [1, 121, 111] },
            { name: "Raspberry", rgb: [227, 11, 92] },
            { name: "Ruby", rgb: [224, 17, 95] },
            { name: "Saffron", rgb: [255, 153, 51] },
            { name: "Sapphire", rgb: [15, 82, 186] },
            { name: "Sunset", rgb: [250, 128, 114] },
            { name: "Tangerine", rgb: [242, 133, 0] },
            { name: "Topaz", rgb: [255, 200, 124] },
            { name: "Zaffre", rgb: [0, 20, 168] },
            { name: "Dusty Rose Purple", rgb: [157, 106, 134] },
            { name: "Celeste", rgb: [178, 255, 255] },
            { name: "Cantaloupe", rgb: [255, 204, 178] },
            { name: "Celadon", rgb: [172, 225, 175] },
            { name: "Charcoal", rgb: [54, 69, 79] },
            { name: "Fawn", rgb: [229, 170, 112] },
            { name: "Grape", rgb: [111, 45, 168] },
            { name: "Jasmine", rgb: [255, 255, 153] },
            { name: "Lime Punch", rgb: [193, 255, 0] },
            { name: "Moss Green", rgb: [173, 223, 173] },
            { name: "Neon Pink", rgb: [255, 20, 147] },
            { name: "Ocean Blue", rgb: [3, 102, 204] },
            { name: "Pear", rgb: [226, 249, 138] },
            { name: "Raspberry Red", rgb: [198, 50, 114] },
            { name: "Sunflower", rgb: [255, 218, 51] },
            { name: "Teal Blue", rgb: [54, 117, 136] },
            { name: "Vanilla", rgb: [243, 229, 171] },
            { name: "Dusty Rose Purple ", rgb: [157, 106, 134] },
            { name: "Medium Sea Green ", rgb: [76, 160, 135] },

            // Continue adding more colors up to 1000
        ];


        // Function to calculate Euclidean distance
        function getDistance(rgb1, rgb2) {
            return Math.sqrt(
                Math.pow(rgb1[0] - rgb2[0], 2) +
                Math.pow(rgb1[1] - rgb2[1], 2) +
                Math.pow(rgb1[2] - rgb2[2], 2)
            );
        }

        // Find the closest color
        let closestColor = colorNames.reduce((prev, curr) => {
            const prevDistance = getDistance([r, g, b], prev.rgb);
            const currDistance = getDistance([r, g, b], curr.rgb);
            return currDistance < prevDistance ? curr : prev;
        });

        return closestColor.name;
    }

    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


    document.getElementById('mixColors').addEventListener('click', mixColors);

    document.getElementById('eyeDropper1').addEventListener('click', async () => {
        currentEyedropperButton = 'color1';
        const color = await pickColorFromScreen();
        if (color) {
            document.getElementById('color1').value = color;
            mixColors(); // Optionally mix colors immediately after selection
        }
    });

    document.getElementById('eyeDropper2').addEventListener('click', async () => {
        currentEyedropperButton = 'color2';
        const color = await pickColorFromScreen();
        if (color) {
            document.getElementById('color2').value = color;
            mixColors(); // Optionally mix colors immediately after selection
        }
    });
});
