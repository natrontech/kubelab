<script lang="ts">
  import { page } from "$app/stores";
  import { client } from "$lib/pocketbase";
  import { layout_store } from "$lib/stores/layout_store";
  import { terminal_size } from "$lib/stores/terminal";
  import { onDestroy, onMount } from "svelte";

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

  let socket: WebSocket;
  let agentUrl: string;

  const initializeWebSocket = () => {
    const lab_session_id = window.location.pathname.split("/")[2];
    const exercise_id = window.location.pathname.split("/")[3];
    agentUrl =
      "kubelab.swisscom.k8s.natron.cloud/kubelab-" +
      lab_session_id +
      "-" +
      exercise_id +
      "-" +
      client.authStore.model?.id;

    // Close the socket only if it is opened
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
    terminal.reset();
    socket = new WebSocket("wss://" + agentUrl + "/xterm.js");

    socket.binaryType = "arraybuffer";

    socket.onerror = (error) => {
      terminal.write(`\r\nWebSocket error: ${error}\r\n`);
    };

    socket.onopen = () => {
      // Check that the socket is opened before interacting with it
      if (socket.readyState === WebSocket.OPEN) {
        terminal.onData((data) => {
          socket.send(new TextEncoder().encode("\x00" + data));
        });

        terminal.onTitleChange((title) => {
          document.title = title;
        });
      }
    };

    socket.onclose = () => {
      terminal.write("\r\nConnection closed. Try to refresh the tab.\r\n");
    };

    socket.onmessage = (message) => {
      if (message.data instanceof ArrayBuffer) {
        terminal.write(ab2str(message.data));
      }
    };
  };

  function ab2str(buf: any) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  }

  export const fitAddon = new FitAddon();
  terminal.loadAddon(fitAddon);
  terminal.focus();

  terminal.onResize((size) => {
    const terminal_size = {
      cols: size.cols,
      rows: size.rows,
      y: size.rows,
      x: size.cols
    };
    // Check that the socket is opened before interacting with it
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(new TextEncoder().encode("\x01" + JSON.stringify(terminal_size)));
    }
  });

  let div: HTMLDivElement;

  onMount(() => {
    initializeWebSocket();
    terminal.open(div);
    setTimeout(() => {
      update_height();
    }, 300);
  });

  export const update_height = () => {
    fitAddon.fit();
  };

  $: {
    $terminal_size;
    $layout_store.terminal;
    setTimeout(() => {
      update_height();
    }, 300);
  }

  onDestroy(() => {
    socket?.close();
    terminal.dispose();
  });
</script>

<div bind:this={div} />

<style>
  div {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  div :global(.xterm) {
    height: 100%;
  }
</style>
