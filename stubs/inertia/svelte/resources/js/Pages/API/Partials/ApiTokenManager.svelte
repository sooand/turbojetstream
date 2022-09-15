<script>
    import route from 'ziggy-js';
    import { useForm, page } from '@inertiajs/inertia-svelte'
    import JetActionMessage from '@/Components/ActionMessage.svelte'
    import JetActionSection from '@/Components/ActionSection.svelte'
    import JetButton from '@/Components/Button.svelte'
    import JetConfirmationModal from '@/Components/ConfirmationModal.svelte'
    import JetDangerButton from '@/Components/DangerButton.svelte'
    import JetDialogModal from '@/Components/DialogModal.svelte'
    import JetFormSection from '@/Components/FormSection.svelte'
    import JetInput from '@/Components/Input.svelte'
    import JetCheckbox from '@/Components/Checkbox.svelte'
    import JetInputError from '@/Components/InputError.svelte'
    import JetLabel from '@/Components/Label.svelte'
    import JetSecondaryButton from '@/Components/SecondaryButton.svelte'
    import JetSectionBorder from '@/Components/SectionBorder.svelte'

    export let tokens = []
    export let availablePermissions = []
    export let defaultPermissions = []

    let displayingToken = false
    let managingPermissionsFor
    let apiTokenBeingDeleted

    const createApiTokenForm = useForm({
        name: '',
        permissions: defaultPermissions,
    })


    const updateApiTokenForm = useForm({
        permissions: [],
    })

    const deleteApiTokenForm = useForm()

    const createApiToken = () => {
        $createApiTokenForm.post(route('api-tokens.store'), {
            preserveScroll: true,
            onSuccess: () => {
                displayingToken = true
                $createApiTokenForm.reset()
            },
        });
    };

    const manageApiTokenPermissions = (token) => {
        $updateApiTokenForm.permissions = token.abilities
        managingPermissionsFor = token
    };

    const updateApiToken = () => {
        $updateApiTokenForm.put(route('api-tokens.update', managingPermissionsFor), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => (managingPermissionsFor = null),
        })
    };

    const confirmApiTokenDeletion = (token) => {
        apiTokenBeingDeleted = token
    };

    const deleteApiToken = () => {
        $deleteApiTokenForm.delete(route('api-tokens.destroy', apiTokenBeingDeleted), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => (apiTokenBeingDeleted = null),
        })
    }
</script>

<div>
    <!-- Generate API Token -->
    <JetFormSection on:submitted={createApiToken}
        title="Create API Token"
        description="API tokens allow third-party services to authenticate with our application on your behalf.">

        <svelte:fragment slot="form">
            <!-- Token Name -->
            <div class="col-span-6 sm:col-span-4">
                <JetLabel for="name" value="Name" />
                <JetInput
                    id="name"
                    bind:value={$createApiTokenForm.name}
                    type="text"
                    class="mt-1 block w-full"
                    autofocus />
                <JetInputError message={$createApiTokenForm.errors.name} class="mt-2" />
            </div>

            <!-- Token Permissions -->
            {#if availablePermissions.length > 0}
                <div class="col-span-6">
                    <JetLabel for="permissions" value="Permissions" />

                    <div class="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {#each availablePermissions as permission}
                            <label class="flex items-center" for={permission}>
                                <JetCheckbox id={permission} bind:bindGroup={$createApiTokenForm.permissions} value={permission} />
                                <span class="ml-2 text-sm text-gray-600">{ permission }</span>
                            </label>
                        {/each}
                    </div>
                </div>
            {/if}
        </svelte:fragment>

        <svelte:fragment slot="actions">
            <JetActionMessage on={$createApiTokenForm.recentlySuccessful} class="mr-3">
                Created.
            </JetActionMessage>

            <JetButton class="{ $createApiTokenForm.processing ? 'opacity-25' : ''}" disabled={$createApiTokenForm.processing}>
                Create
            </JetButton>
        </svelte:fragment>
    </JetFormSection>

    {#if tokens.length > 0}
        <JetSectionBorder />

        <!-- Manage API Tokens -->
        <div class="mt-10 sm:mt-0">
            <JetActionSection title="Manage API Tokens" description="You may delete any of your existing tokens if they are no longer needed.">

                <!-- API Token List -->
                <svelte:fragment slot="content">
                    <div class="space-y-6">
                        {#each tokens as token}                            
                            <div class="flex items-center justify-between">
                                <div>
                                    { token.name }
                                </div>

                                <div class="flex items-center">
                                    {#if token.last_used_ago}
                                        <div class="text-sm text-gray-400">
                                            Last used { token.last_used_ago }
                                        </div>
                                    {/if}

                                    {#if availablePermissions.length > 0}
                                        <button
                                            class="cursor-pointer ml-6 text-sm text-gray-400 underline"
                                            on:click={() => manageApiTokenPermissions(token)}>
                                            Permissions
                                        </button>
                                    {/if}

                                    <button class="cursor-pointer ml-6 text-sm text-red-500" on:click={() => confirmApiTokenDeletion(token)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        {/each}
                    </div>
                </svelte:fragment>
            </JetActionSection>
        </div>
    {/if}

    <!-- Token Value Modal -->
    <JetDialogModal show={displayingToken} on:close={() => displayingToken = false}>
        <svelte:fragment slot="title">
            API Token
        </svelte:fragment>

        <svelte:fragment slot="content">
            <div>
                Please copy your new API token. For your security, it won't be shown again.
            </div>

            {#if $page.props.jetstream.flash.token}
                <div class="mt-4 bg-gray-100 px-4 py-2 rounded font-mono text-sm text-gray-500">
                    { $page.props.jetstream.flash.token }
                </div>
            {/if}
        </svelte:fragment>

        <svelte:fragment slot="footer">
            <JetSecondaryButton on:click={() => displayingToken = false}>
                Close
            </JetSecondaryButton>
        </svelte:fragment>
    </JetDialogModal>

    <!-- API Token Permissions Modal -->
    <JetDialogModal show={managingPermissionsFor != null} on:close={() => managingPermissionsFor = null}>
        <svelte:fragment slot="title">
            API Token Permissions
        </svelte:fragment>

        <svelte:fragment slot="content">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {#each availablePermissions as permission}
                    <label class="flex items-center" for={`${permission}-update`}>
                        <JetCheckbox id={`${permission}-update`} bind:bindGroup={$updateApiTokenForm.permissions} value={permission} />
                        <span class="ml-2 text-sm text-gray-600">{ permission }</span>
                    </label>
                {/each}
            </div>
        </svelte:fragment>

        <svelte:fragment slot="footer">
            <JetSecondaryButton on:click={() => managingPermissionsFor = null}>
                Cancel
            </JetSecondaryButton>

            <JetButton
                class="ml-3 { $updateApiTokenForm.processing ? 'opacity-25' : ''}"
                disabled={$updateApiTokenForm.processing}
                on:click={updateApiToken}>
                Save
            </JetButton>
        </svelte:fragment>
    </JetDialogModal>

    <!-- Delete Token Confirmation Modal -->
    <JetConfirmationModal show={apiTokenBeingDeleted != null} on:close={() => apiTokenBeingDeleted = null}>
        <svelte:fragment slot="title">
            Delete API Token
        </svelte:fragment>

        <svelte:fragment slot="content">
            Are you sure you would like to delete this API token?
        </svelte:fragment>

        <svelte:fragment slot="footer">
            <JetSecondaryButton on:click={() => apiTokenBeingDeleted = null}>
                Cancel
            </JetSecondaryButton>

            <JetDangerButton
                class="ml-3 { $deleteApiTokenForm.processing ? 'opacity-25' : ''}"
                disabled={$deleteApiTokenForm.processing}
                on:click={deleteApiToken}>
                Delete
            </JetDangerButton>
        </svelte:fragment>
    </JetConfirmationModal>
</div>
