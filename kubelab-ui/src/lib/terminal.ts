import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

export const terminal = new Terminal({
    convertEol: true,
    disableStdin: false,
    cursorBlink: true,
    fontFamily: "monospace",
    fontSize: 14,
    theme: {
        foreground: "#d2d2d2",
        background: "#282C34",
        cursor: "#adadad",
        black: "#000000",
        red: "#d81e00",
        green: "#5ea702",
        yellow: "#cfae00",
        blue: "#427ab3",
        magenta: "#89658e",
        cyan: "#00a7aa",
        white: "#dbded8",
        brightBlack: "#686a66",
        brightRed: "#f54235",
        brightGreen: "#99e343",
        brightYellow: "#fdeb61",
        brightBlue: "#84b0d8",
        brightMagenta: "#bc94b7",
        brightCyan: "#37e6e8",
        brightWhite: "#f1f1f0"
    }
});

const socket = new WebSocket("ws://localhost:8376/xterm.js");

socket.binaryType = "arraybuffer";

function ab2str(buf: any) {
    // @ts-ignore
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

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



socket.onopen = () => {
    terminal.onData((data) => {
        socket.send(new TextEncoder().encode("\x00" + data))
    });

    terminal.onTitleChange((title) => {
        document.title = title;
    });
};

socket.onclose = () => {
    terminal.write("\r\nConnection closed.\r\n");
    terminal.dispose();
};

socket.onmessage = (message) => {
    if (message.data instanceof ArrayBuffer) {
        terminal.write(ab2str(message.data));
    }
};
