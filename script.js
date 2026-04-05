// ================= CHAT SEND =================
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

    try {
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message })
        });

        let data;
        try {
            data = await res.json();
        } catch {
            data = { reply: "⚠️ Invalid server response" };
        }

        clearInterval(interval);

        // ✅ Typing effect on SAME loader
        typeEffect(loader, data.reply);

        // ✅ Save bot reply
        saveMessage(data.reply, "bot");

    } catch (e) {
        clearInterval(interval);
        loader.innerText = "⚠️ Server error";
    }
}

// ================= ADD MESSAGE =================
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

    // ✅ Save user message
    saveMessage(text, type);

    return msg;
}

// ================= SAVE CHAT =================
function saveMessage(text, type) {
    let chats = JSON.parse(localStorage.getItem("chat")) || [];
    chats.push({ text, type });
    localStorage.setItem("chat", JSON.stringify(chats));
}

// ================= LOAD CHAT =================
function loadChat() {
    const saved = JSON.parse(localStorage.getItem("chat")) || [];
    const chat = document.getElementById("chat");

    chat.innerHTML = "";

    saved.forEach(msg => {
        addMessage(msg.text, msg.type);
    });
}

window.onload = loadChat;

// ================= ENTER KEY =================
document.getElementById("input").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});

// ================= CLEAR CHAT =================
function clearChat() {
    document.getElementById("chat").innerHTML = "";
    localStorage.removeItem("chat");
}

// ================= VOICE INPUT =================
function startVoice() {
    const recognition = new webkitSpeechRecognition();

    recognition.onresult = function(event) {
        const text = event.results[0][0].transcript;
        document.getElementById("input").value = text;
        sendMessage();
    };

    recognition.start();
}

// ================= TYPE EFFECT =================
function typeEffect(element, text) {
    if (!text) {
        element.innerText = "⚠️ No response";
        return;
    }

    let i = 0;
    element.innerText = "";

    const interval = setInterval(() => {
        element.innerText += text.charAt(i);
        i++;
        if (i >= text.length) clearInterval(interval);
    }, 20);
}