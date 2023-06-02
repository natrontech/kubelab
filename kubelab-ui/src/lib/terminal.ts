import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

export const terminal = new Terminal({
    convertEol: true,
    disableStdin: false,
    cursorBlink: true,
    fontFamily: "monospace",
    fontSize: 14,
    theme: {
        background: "#000000",
        foreground: "#FFFFFF",
        cursor: "#FFFFFF"
    }
});

const socket = new WebSocket("ws://localhost:8080/ws");

export const fitAddon = new FitAddon();
terminal.loadAddon(fitAddon);
terminal.focus();
// Display the initial prompt
terminal.write("$ ");

let commandBuffer = "";
const commandHistory: any = [];
let historyIndex = -1;

terminal.onKey((e) => {
    // prevent default keydown action
    e.domEvent.preventDefault();
});

socket.onopen = () => {
    terminal.onData((data) => {
        // Write the user's input to the terminal
        if (data.charCodeAt(0) === 127) {
            // Handle backspace
            terminal.write('\b \b');
            if (commandBuffer.length > 0) {
                commandBuffer = commandBuffer.slice(0, -1);
            }
        } else {
            terminal.write(data);
        }

        if (data.charCodeAt(0) === 3) {
            // Handle Ctrl+C
            terminal.write('^C\r\n$ ');
            commandBuffer = '';
            return;
        }

        // arrow keys should not go up and down
        if (data === "\x1b[A" || data === "\x1b[B") {
            return;
        }

        // Handle enter
        if (data.charCodeAt(0) === 13) {
            console.log(commandBuffer);

            // Execute the command
            socket.send(commandBuffer);

            // Add the command to the history
            commandHistory.push(commandBuffer);

            // Reset the command buffer and history index
            commandBuffer = "";
            historyIndex = -1;

            // Display the prompt
            terminal.write("$ ");
        }
        // Handle up arrow
        else if (data === "\x1b[A") {
            if (historyIndex < commandHistory.length - 1) {
                // Go back in the history
                historyIndex++;

                // Display the command from the history
                terminal.write(commandHistory[historyIndex]);
            }
        }
        // Handle down arrow
        else if (data === "\x1b[B") {
            if (historyIndex > 0) {
                // Go forward in the history
                historyIndex--;

                // Display the command from the history
                terminal.write(commandHistory[historyIndex]);
            }
        }
        // Handle other input
        else {
            commandBuffer += data;
        }
    });
};

socket.onmessage = (message) => {
    // Display the command output and a new prompt
    terminal.write("\r\n" + message.data + "\r\n$ ");
};
