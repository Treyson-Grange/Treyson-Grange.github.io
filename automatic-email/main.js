function handleSubmit(event) {
    
    event.preventDefault(); // Prevent the form from actually submitting
    const name = document.getElementById('name').value.toString();
    const page = document.getElementById('page').value;
    const task = document.getElementById('task').value;
    
    console.log("Name: " + name);
    console.log("Website: " + page);
    
    let outputBox = document.getElementById("output");
    const email = "Good morning, " + name + "<br><br>" + "I have " + task + " on the " + page + " page. Please let us know if you have any questions! <br><br> Best"
    outputBox.innerHTML = email;
}


async function chatCall(event) {
    event.preventDefault();
    let chatbox = document.getElementById('chat-output');
    chatbox.innerHTML = "Loading..."
    let taskInfo = document.getElementById('task-info').value.toString();
    let taskName = document.getElementById('chat-name').value.toString();
    let pageName = document.getElementById('page-name')
    let API = "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"//I don't hide it because I want it to get stolen!!!
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API}`,
            'Content-Type': 'application/json',

        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: `Write a simple email responding to this request: ${taskInfo} and have the email reach out to ${taskName} and say that the changes are made and live on the ${pageName}`}],
            max_tokens: 100
        })
    }
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', options)
        const data = await response.json()
        console.log(data);
        
        chatbox.innerHTML = data.choices[0].message.content;
    }
    catch (error) {
        
        chatbox.innerHTML = error;
        console.log(error);
    }
}


// 