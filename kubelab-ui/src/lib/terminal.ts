import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

export const terminal = new Terminal({
    convertEol: true,
    disableStdin: false,
    cursorBlink: true,
    fontFamily: "monospace",
    fontSize: 14,
    theme: {
        background: "#282C34",
        foreground: "#FFFFFF",
        cursor: "#FFFFFF"
    }
});

const socket = new WebSocket("ws://localhost:8080/ws");

socket.onclose = () => {
    terminal.write("\r\nConnection closed.\r\n");
    terminal.dispose();
};

socket.onerror = (error) => {
    terminal.write(`\r\nWebSocket error: ${error}\r\n`);
};

export const fitAddon = new FitAddon();
terminal.loadAddon(fitAddon);
terminal.focus();
// Display the initial prompt
terminal.write("$ ");

let commandBuffer = "";
const commandHistory: any = [];
let historyIndex = -1;
let autoCompleteIndex = -1;
let autoCompleteList: any = [];

terminal.onKey((e) => {
    // prevent default keydown action
    e.domEvent.preventDefault();
});

socket.onopen = () => {
    terminal.onData((data) => {
        const code = data.charCodeAt(0);

        if (code === 127) {
            // backspace
            terminal.write("\b \b");
            commandBuffer = commandBuffer.slice(0, -1);
        } else if (code === 3) {
            // Ctrl+C
            terminal.write("^C\r\n$ ");
            commandBuffer = "";
        } else if (code === 13) {
            // enter
            console.log(commandBuffer);
            socket.send(commandBuffer);
            commandHistory.push(commandBuffer);
            commandBuffer = "";
            historyIndex = -1;
            autoCompleteList = [];
            autoCompleteIndex = -1;
        } else if (data === "\x1b[A") {
            // up arrow
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                terminal.write("\x1b[2K\r"); // clear line before displaying history
                terminal.write("$ " + commandHistory[historyIndex]);
                commandBuffer = commandHistory[historyIndex];
            }
        } else if (data === "\x1b[B") {
            // down arrow
            if (historyIndex > 0) {
                historyIndex--;
                terminal.write("\x1b[2K\r"); // clear line before displaying history
                terminal.write("$ " + commandHistory[historyIndex]);
                commandBuffer = commandHistory[historyIndex];
            }
        } else if (code === 4) {
            // Ctrl+D
            socket.close();
        } else if (code === 9) {
            // Tab
            // send auto-complete request to the server but don't clear the line
            socket.send("\t" + commandBuffer);
        } else if (data.startsWith("less ")) {
            socket.send("less " + data.slice(5));
        } else {
            terminal.write(data);
            commandBuffer += data;
        }
    });
};

socket.onmessage = (message) => {
    // check if the message is for auto-completion
    if (message.data.startsWith("\t")) {
        autoCompleteList = message.data.slice(1).split(",");
        if (autoCompleteList.length > 0) {
            autoCompleteIndex = 0;
            terminal.write("\x1b[2K\r"); // clear line before displaying history
            terminal.write("$ " + autoCompleteList[autoCompleteIndex]);
            commandBuffer = autoCompleteList[autoCompleteIndex];
        }
    } else {
        // Check if this is the output of the 'pwd' command
        if (message.data.startsWith("/")) {
            // Update the prompt with the current path
            terminal.write("\r\n" + message.data + " $ ");
        } else {
            terminal.write("\r\n" + message.data + "\r\n$ ");
        }
    }
};
