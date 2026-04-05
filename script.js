async function sendMessage() {
    const input = document.getElementById("input");
    const message = input.value.trim();

    if (!message) return;

    addMessage(message, "user");

    input.value = "";

    // Typing loader
    const loader = addMessage("...", "bot");

let dots = 0;
const interval = setInterval(() => {
    loader.innerText = ".".repeat((dots % 3) + 1);
    dots++;
}, 500);

    const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
    });

    const data = await res.json();

    clearInterval(interval);
typeEffect(loader, data.reply);

    loader.remove(); // remove "Typing..."

    addMessage(data.reply, "bot");
}

function addMessage(text, type) {
    const chat = document.getElementById("chat");

    const wrapper = document.createElement("div");
    wrapper.className = "message-wrapper";

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.innerText = type === "user" ? "🧑" : "🤖";

    const msg = document.createElement("div");
    msg.className = `message ${type}`;
    msg.innerText = text;

    if (type === "user") {
        wrapper.appendChild(msg);
        wrapper.appendChild(avatar);
    } else {
        wrapper.appendChild(avatar);
        wrapper.appendChild(msg);
    }

    chat.appendChild(wrapper);
    chat.scrollTop = chat.scrollHeight;

    saveChat(); // 👈 important for step 6

    return msg;
}
document.getElementById("input").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});
function clearChat() {
    document.getElementById("chat").innerHTML = "";
    localStorage.removeItem("chat");
}
function saveChat() {
    const chat = document.getElementById("chat").innerHTML;
    localStorage.setItem("chat", chat);
}

function loadChat() {
    const saved = localStorage.getItem("chat");
    if (saved) {
        document.getElementById("chat").innerHTML = saved;
    }
}
window.onload = loadChat;
function startVoice() {
    const recognition = new webkitSpeechRecognition();

    recognition.onresult = function(event) {
        const text = event.results[0][0].transcript;
        document.getElementById("input").value = text;
        sendMessage();
    };

    recognition.start();
}
function typeEffect(element, text) {
    let i = 0;
    element.innerText = "";

    const interval = setInterval(() => {
        element.innerText += text.charAt(i);
        i++;
        if (i >= text.length) clearInterval(interval);
    }, 15);
}