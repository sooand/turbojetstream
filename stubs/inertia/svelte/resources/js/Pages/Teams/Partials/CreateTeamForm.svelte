<script>
    import route from 'ziggy-js'
    import { useForm, page } from '@inertiajs/inertia-svelte'
    import JetButton from '@/Components/Button.svelte'
    import JetFormSection from '@/Components/FormSection.svelte'
    import JetInput from '@/Components/Input.svelte'
    import JetInputError from '@/Components/InputError.svelte'
    import JetLabel from '@/Components/Label.svelte'

    const form = useForm({
        name: '',
    })

    const createTeam = () => {
        $form.post(route('teams.store'), {
            errorBag: 'createTeam',
            preserveScroll: true,
        })
    }
</script>

<JetFormSection 
    on:submitted={createTeam}
    title="Team Details"
    description="Create a new team to collaborate with others on projects.">

    <svelte:fragment slot="form">
        <div class="col-span-6">
            <JetLabel value="Team Owner" />

            <div class="flex items-center mt-2">
                <img class="object-cover w-12 h-12 rounded-full" src={$page.props.user.profile_photo_url} alt={$page.props.user.name}>

                <div class="ml-4 leading-tight">
                    <div>{ $page.props.user.name }</div>
                    <div class="text-sm text-gray-700">
                        { $page.props.user.email }
                    </div>
                </div>
            </div>
        </div>

        <div class="col-span-6 sm:col-span-4">
            <JetLabel for="name" value="Team Name" />
            <JetInput
                id="name"
                bind:value={$form.name}
                type="text"
                class="block w-full mt-1"
                autofocus />
            <JetInputError message={$form.errors.name} class="mt-2" />
        </div>
    </svelte:fragment>

    <svelte:fragment slot="actions">
        <JetButton class="{ $form.processing ? 'opacity-25': ''}" disabled={$form.processing}>
            Create
        </JetButton>
    </svelte:fragment>
</JetFormSection>
