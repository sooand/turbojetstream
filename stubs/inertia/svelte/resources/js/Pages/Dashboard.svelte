<script>
    import AppLayout from '@/Layouts/AppLayout.svelte'
    import Welcome from '@/Components/Welcome.svelte'
</script>

<AppLayout title="Dashboard">
    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                <Welcome />
            </div>
        </div>
    </div>
</AppLayout>
