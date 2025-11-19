<script lang="ts">
    import { Select } from 'bits-ui';
    import { Check, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-svelte';

    let { items, placeholder, value = $bindable('') }: { items: string[], placeholder: string, value: string } = $props();
    let selectItems = items.map(item => ({
        label: item,
        value: item
    }));
</script>

<Select.Root
    type="single"
    bind:value={value}
    items={selectItems}
    allowDeselect={true}
>
    <Select.Trigger
        class="w-64 border border-border p-2 rounded-xl text-foreground inline-flex touch-none select-none items-center transition-colors"
        aria-label={placeholder}
    >
        {value}
        <ChevronsUpDown class="ml-auto text-muted" />
    </Select.Trigger>
    <Select.Portal>
        <Select.Content
            class="focus-override border-border bg-background shadow-popover
            data-[state=open]:animate-in data-[state=closed]:animate-out
            data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
            data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
            data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2
            data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2
            outline-hidden z-50 h-auto max-h-(--bits-select-content-available-height) w-(--bits-select-anchor-width) min-w-(--bits-select-anchor-width) select-none rounded-xl border px-2 py-2 data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
            sideOffset={10}
        >
            <Select.ScrollUpButton class="flex w-full items-center justify-center">
                <ChevronUp />
            </Select.ScrollUpButton>
            <Select.Viewport class="p-1">
                {#each selectItems as item}
                    <Select.Item
                        class="focus-override data-highlighted:bg-primary
                        relative flex h-8 w-full cursor-pointer select-none items-center rounded-md
                        px-4 py-2 text-sm outline-none"
                        value={item.value}
                    >
                        {#snippet children({ selected })}
                            {item.value}
                            {#if selected}
                                <div class="ml-auto">
                                    <Check />
                                </div>
                            {/if}
                        {/snippet}
                    </Select.Item>
                {/each}
            </Select.Viewport>
            <Select.ScrollDownButton class="flex w-full items-center justify-center">
                <ChevronDown />
            </Select.ScrollDownButton>
        </Select.Content>
    </Select.Portal>
</Select.Root>