const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");

async function sendMessage() {

    const message = userInput.value.trim();

    if (message === "") {
        return;
    }

    addMessage(message, "user");

    userInput.value = "";

    const loading = addMessage("Typing...", "bot");

    try {

        const response = await fetch("/get_response", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        if (!response.ok) {
            throw new Error("Server error");
        }

        const data = await response.json();

        loading.querySelector(".message-content").textContent = data.response;

    } catch (error) {

        loading.querySelector(".message-content").textContent =
            "Sorry! Something went wrong. Please try again.";

    }

    chatBox.scrollTop = chatBox.scrollHeight;
}

function addMessage(message, sender) {

    const messageDiv = document.createElement("div");

    messageDiv.className =
        sender === "user" ? "message user-message" : "message bot-message";

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = sender === "user" ? "👤" : "🤖";

    const content = document.createElement("div");
    content.className = "message-content";
    content.textContent = message;

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);

    chatBox.appendChild(messageDiv);

    chatBox.scrollTop = chatBox.scrollHeight;

    return messageDiv;
}

function clearChat() {

    chatBox.innerHTML = `
        <div class="message bot-message">
            <div class="avatar">🤖</div>
            <div class="message-content">
                Hello! Welcome to SmartBot. 👋<br>
                How can I help you today?
            </div>
        </div>
    `;

}

userInput.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        sendMessage();
    }

});