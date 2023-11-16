/*
    Function handleSubmit()
    input: event (To prevent reload on form submit), name, page, and task (all from webpage)
    output: Genereated email given the name, page, and task.

*/
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


/*
    Function chatCall(event)
    input: event (To prevent reload on form submit), taskInfo, taskName, pageName, and key (all from the page)
    output: A email written with OpenAI 
*/
async function chatCall(event) {
    event.preventDefault();

    let chatbox = document.getElementById('chat-output');
    chatbox.innerHTML = "Loading..."

    let taskInfo = document.getElementById('task-info').value.toString();
    let taskName = document.getElementById('chat-name').value.toString();
    let pageName = document.getElementById('page-name').value.toString();
    const key = document.getElementById('key').value.toString();

    //Options is where we set our messages.
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',

        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: `Write a very short email responding to this request: ${taskInfo}. The email is for: ${taskName} and say that the changes are made and live on the ${pageName} If applicable, state that the changes made on the page are now live. Also say that they can ask any questions if necessary`}],
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
        chatbox.innerHTML = "There was an error:" +  error;
    }
}