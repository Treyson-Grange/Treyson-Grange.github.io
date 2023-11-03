async function bot() {
    // Get form values
    var color = document.getElementById("color").value;
    var coordinate = document.getElementById("coordinate").value;
    var letter = document.getElementById("letter").value;
    letter = letter.toUpperCase();
    var coordinates = coordinate.split(','); // Split the input at the comma
    var x = coordinates[0].trim(); // Get the X coordinate
    var y = coordinates[1].trim(); // Get the Y coordinate

    // Perform any desired actions with the form data
    const letterFunctions = {
        A: () => {
          // Perform action for letter A
          console.log('Letter A submitted');
        },
        B: () => {
          // Perform action for letter B
          console.log('Letter B submitted');
        },
        C: () => {
            // Perform action for letter B
            console.log('Letter B submitted');
          },
        D: () => {
          // Perform action for letter B
          console.log('Letter B submitted');
        },
        E: () => {
            // Perform action for letter B
            console.log('Letter B submitted');
          },
          F: () => {
            // Perform action for letter B
            console.log('Letter B submitted');
          },
          G: () => {
            // Perform action for letter B
            console.log('Letter B submitted');
          },
          H: () => {
            // Perform action for letter B
            console.log('Letter B submitted');
          },
          I: () => {
            // Perform action for letter B
            console.log('Letter B submitted');
          },
          J: () => {
            // Perform action for letter B
            console.log('Letter B submitted');
          },
          L: () => {
            // Perform action for letter B
            console.log('Letter B submitted');
          },
          M: () => {
            // Perform action for letter B
            console.log('Letter B submitted');
          },
          N: () => {
            // Perform action for letter B
            console.log('Letter B submitted');
          },
          O: () => {
            // Perform action for letter B
            console.log('Letter B submitted');
          },
          P: () => {
            // Perform action for letter B
            console.log('Letter B submitted');
          },
          Q: () => {
            // Perform action for letter B
            console.log('Letter B submitted');
          },
          R: () => {
            // Perform action for letter B
            console.log('Letter B submitted');
          },
          S: () => {
            // Perform action for letter B
            console.log('Letter B submitted');
          },
          T: () => {
            // Perform action for letter B
            console.log('Letter B submitted');
          },
          U: () => {
            // Perform action for letter B
            console.log('Letter B submitted');
          },
          V: () => {
            // Perform action for letter B
            console.log('Letter B submitted');
          },
          W: () => {
            // Perform action for letter B
            console.log('Letter B submitted');
          },
          X: () => {
            // Perform action for letter B
            console.log('Letter B submitted');
          },
          Y: () => {
            // Perform action for letter B
            console.log('Letter B submitted');
          },
          X: () => {
            // Perform action for letter B
            console.log('Letter B submitted');
          },
          
      };
      if (letterFunctions[letter]) {
        letterFunctions[letter]();
        const completeBox = document.getElementById('completeBox');
        completeBox.innerHTML = "Complete!";
        await sleep(4000);
        console.log("asdf");
      } else {
        // Handle other letters or invalid input
        console.log('Invalid letter submitted');
      }
      


    // Prevent the sform from actually submitting to a server
    return false;
}

async function t(x,y,color) {
    success=false;
    while (! success) {
        try {
            await postToAggieCanvas(reqFor(x, y, color));
            console.log('Success');
            success = true;
            } catch (e) {
                console.log('Retrying...');
                console.log(e);
            }
            await (() => new Promise(r => setTimeout(r, 2500)))();
    }
}

const reqFor = (x, y, color="#000000") => ({
    column: x,
    row: y,
    color,
  });
  
  const postToAggieCanvas = async (requestData) => {
    const url = "https://aggiecanvas.linux.usu.edu/api/update";
  
    const { ok } = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });
  
    if (ok) {
      console.log("POST request was successful.");
    } else {
      throw new Error("POST request failed");
    }
  };

  function sleep(milliseconds) {
    return new Promise(resolve => {
      setTimeout(resolve, milliseconds);
    });
  }