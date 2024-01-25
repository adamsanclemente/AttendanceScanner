<script>
    import Header from "$lib/components/Header.svelte";
    import { page } from "$app/stores";

</script>

<Header user={$page.data.user}/>
<slot />