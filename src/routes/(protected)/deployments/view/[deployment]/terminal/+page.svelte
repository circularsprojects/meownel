<script lang="ts">
    import { fetchLogs } from '$lib/fetch';
	import { Xterm, XtermAddon } from '@battlefieldduck/xterm-svelte';
	import type {
		ITerminalOptions,
		ITerminalInitOnlyOptions,
		Terminal
	} from '@battlefieldduck/xterm-svelte';
    import { TriangleAlert } from 'lucide-svelte';

	let terminal = $state<Terminal>();

	const options: ITerminalOptions & ITerminalInitOnlyOptions = {
		fontFamily: 'Fira Code, monospace'
	};

    const { data } = $props();
    const { deployment, pods } = data;

    let ws: WebSocket
    let wsError = $state("");
    let wsErrorShown = $derived(() => wsError !== "");

	async function onLoad() {
		console.log('Child component has loaded');
        const pod = pods[0];
        if (!pod) {
            wsError = "No running pod found for this deployment.";
            return;
        }
        ws = new WebSocket(`/api/ws/terminal?podName=${pod.metadata?.name}&containerName=${deployment.metadata?.name}`);
		// FitAddon Usage
		const fitAddon = new (await XtermAddon.FitAddon()).FitAddon();
		terminal?.loadAddon(fitAddon);
        fitAddon.fit();
        
        const handleResize = () => fitAddon.fit();
        window.addEventListener('resize', handleResize);

        const searchAddon = new (await XtermAddon.SearchAddon()).SearchAddon();
        terminal?.loadAddon(searchAddon);

        fetchLogs(pods[0].metadata?.name!, deployment.metadata?.name, 250).then(async (logs) => {
            terminal?.write(logs);
        });

        ws.onopen = () => {
            console.log('WebSocket connection opened');
        };

        ws.onmessage = async (event) => {
            console.log('WebSocket message received:', event.data);
            if (event.data instanceof Blob) {
                console.log('Wrote blob data')
                terminal?.write(await event.data.bytes());
            } else if (typeof event.data === 'string') {
                console.log('Wrote string data')
                terminal?.write(event.data);
            } else {
                console.warn('Unknown data type received from WebSocket');
            }
        };

        ws.onclose = () => {
            terminal?.write('\r\n\x1b[31m*** Disconnected from websocket ***\x1b[0m\r\n');
            wsError = "An error occurred trying to connect to the websocket service.";
        }
	}

	function onData(data: string) {
		console.log('onData()', data);
        ws.send(data);
	}

	function onKey(data: { key: string; domEvent: KeyboardEvent }) {
		console.log('onKey()', data);
	}
</script>

<div class="relative border border-zinc-900 p-1 w-full h-full">
    <Xterm bind:terminal {options} {onLoad} {onData} {onKey} class="h-full" />
    {#if wsErrorShown()}
    <div class="absolute flex h-full w-full top-0 left-0 bg-zinc-900/50 items-center justify-center">
        <div class="flex flex-col gap-4 items-center">
            <TriangleAlert class="size-16" />
            <p>{wsError}</p>
        </div>
    </div>
    {/if}
</div>
