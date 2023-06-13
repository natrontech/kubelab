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
    },
});

// TODO: set agentUrl for labs as properties
export const agentUrl =
    "kubelab.prod.natron.k8s.natron.cloud/kubelab-3y9rfkf5fr09x4r-721eq17619ojn75";
export const socket = new WebSocket("ws://" + agentUrl + "/xterm.js");

socket.binaryType = "arraybuffer";

function ab2str(buf: any) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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

terminal.onResize((size) => {
    const terminal_size = {
        cols: size.cols,
        rows: size.rows,
        y: size.rows,
        x: size.cols,
    }
    socket.send(new TextEncoder().encode("\x01" + JSON.stringify(terminal_size)));
});

socket.onopen = () => {
    terminal.onData((data) => {
        socket.send(new TextEncoder().encode("\x00" + data));
    });

    terminal.onTitleChange((title) => {
        document.title = title;
    });
};

socket.onclose = () => {
    terminal.write("\r\nConnection closed. Try to refresh the tab.\r\n");
};

socket.onmessage = (message) => {
    if (message.data instanceof ArrayBuffer) {
        terminal.write(ab2str(message.data));
    }
};
