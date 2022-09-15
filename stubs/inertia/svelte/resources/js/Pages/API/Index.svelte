<script>
    import ApiTokenManager from '@/Pages/API/Partials/ApiTokenManager.svelte'
    import AppLayout from '@/Layouts/AppLayout.svelte'

    export let tokens = []
    export let availablePermissions = []
    export let defaultPermissions = []
</script>

<AppLayout title="API Tokens">
    <div class="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
        <ApiTokenManager
            {tokens}
            {availablePermissions}
            {defaultPermissions}/>
    </div>
</AppLayout>
