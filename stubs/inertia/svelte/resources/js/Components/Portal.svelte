<script>
    import { onMount, onDestroy } from 'svelte'
  
    export let target = document?.body
  
    let ref
  
    onMount(() => {
      if (target) {
        target.appendChild(ref)
      }
    })
  
    // this block is almost needless/useless (if not totally) as, on destroy, the ref will no longer exist/be in the DOM anyways
    onDestroy(() => {
      setTimeout(() => {
        if (ref?.parentNode) {
          ref.parentNode?.removeChild(ref)
        }
      })
    })
  </script>
  
  <div bind:this={ref}>
    <slot />
  </div>