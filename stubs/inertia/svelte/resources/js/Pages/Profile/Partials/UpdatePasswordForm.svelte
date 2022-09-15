<script>
    import route from 'ziggy-js'
    import { useForm } from '@inertiajs/inertia-svelte'
    import JetActionMessage from '@/Components/ActionMessage.svelte'
    import JetButton from '@/Components/Button.svelte'
    import JetFormSection from '@/Components/FormSection.svelte'
    import JetInput from '@/Components/Input.svelte'
    import JetInputError from '@/Components/InputError.svelte'
    import JetLabel from '@/Components/Label.svelte'

    let passwordInput
    let currentPasswordInput

    const form = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    })

    const updatePassword = () => {
        $form.put(route('user-password.update'), {
            errorBag: 'updatePassword',
            preserveScroll: true,
            onSuccess: () => $form.reset(),
            onError: () => {
                if ($form.errors.password) {
                    $form.reset('password', 'password_confirmation')
                    passwordInput.focus()
                }

                if ($form.errors.current_password) {
                    $form.reset('current_password')
                    currentPasswordInput.focus()
                }
            },
        })
    }
</script>

<JetFormSection on:submitted={updatePassword}
    title="Update Password"
    description="Ensure your account is using a long, random password to stay secure.">

    <svelte:fragment slot="form">
        <div class="col-span-6 sm:col-span-4">
            <JetLabel for="current_password" value="Current Password" />
            <JetInput
                id="current_password"
                bind:this={currentPasswordInput}
                bind:value={$form.current_password}
                type="password"
                class="mt-1 block w-full"
                autocomplete="current-password" />
            <JetInputError message={$form.errors.current_password} class="mt-2" />
        </div>

        <div class="col-span-6 sm:col-span-4">
            <JetLabel for="password" value="New Password" />
            <JetInput
                id="password"
                bind:this={passwordInput}
                bind:value={$form.password}
                type="password"
                class="mt-1 block w-full"
                autocomplete="new-password" />
            <JetInputError message={$form.errors.password} class="mt-2" />
        </div>

        <div class="col-span-6 sm:col-span-4">
            <JetLabel for="password_confirmation" value="Confirm Password" />
            <JetInput
                id="password_confirmation"
                bind:value={$form.password_confirmation}
                type="password"
                class="mt-1 block w-full"
                autocomplete="new-password" />
            <JetInputError message={$form.errors.password_confirmation} class="mt-2" />
        </div>
    </svelte:fragment>

    <svelte:fragment slot="actions">
        <JetActionMessage on={$form.recentlySuccessful} class="mr-3">
            Saved.
        </JetActionMessage>

        <JetButton class="{ $form.processing ? 'opacity-25' : ''}" disabled={$form.processing}>
            Save
        </JetButton>
    </svelte:fragment>
</JetFormSection>
