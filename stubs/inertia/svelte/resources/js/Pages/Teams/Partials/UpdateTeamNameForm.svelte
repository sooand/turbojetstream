<script>
    import route from 'ziggy-js'
    import { useForm } from '@inertiajs/inertia-svelte'
    import JetActionMessage from '@/Components/ActionMessage.svelte'
    import JetButton from '@/Components/Button.svelte'
    import JetFormSection from '@/Components/FormSection.svelte'
    import JetInput from '@/Components/Input.svelte'
    import JetInputError from '@/Components/InputError.svelte'
    import JetLabel from '@/Components/Label.svelte'

    export let team = {}
    export let permissions = {}

    const form = useForm({
        name: team.name,
    })

    const updateTeamName = () => {
        $form.put(route('teams.update', team), {
            errorBag: 'updateTeamName',
            preserveScroll: true,
        })
    }
</script>

<JetFormSection on:submitted={updateTeamName}
    title="Team Name"
    description="The team's name and owner information.">

    <svelte:fragment slot="form">
        <!-- Team Owner Information -->
        <div class="col-span-6">
            <JetLabel value="Team Owner" />

            <div class="flex items-center mt-2">
                <img class="w-12 h-12 rounded-full object-cover" src={team.owner.profile_photo_url} alt={team.owner.name}>

                <div class="ml-4 leading-tight">
                    <div>{ team.owner.name }</div>
                    <div class="text-gray-700 text-sm">
                        { team.owner.email }
                    </div>
                </div>
            </div>
        </div>

        <!-- Team Name -->
        <div class="col-span-6 sm:col-span-4">
            <JetLabel for="name" value="Team Name" />

            <JetInput
                id="name"
                bind:value={$form.name}
                type="text"
                class="mt-1 block w-full"
                disabled={! permissions.canUpdateTeam} />

            <JetInputError message={$form.errors.name} class="mt-2" />
        </div>
    </svelte:fragment>

    <svelte:fragment slot="actions">
        {#if permissions.canUpdateTeam}
            <JetActionMessage on={$form.recentlySuccessful} class="mr-3">
                Saved.
            </JetActionMessage>

            <JetButton class="{ $form.processing ? 'opacity-25' : ''}" disabled={$form.processing}>
                Save
            </JetButton>
        {/if}
    </svelte:fragment>
</JetFormSection>
