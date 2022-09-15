<script>
    import route from 'ziggy-js';
    import { useForm } from '@inertiajs/inertia-svelte'
    import JetAuthenticationCard from '@/Components/AuthenticationCard.svelte'
    import JetAuthenticationCardLogo from '@/Components/AuthenticationCardLogo.svelte'
    import JetButton from '@/Components/Button.svelte'
    import JetInput from '@/Components/Input.svelte'
    import JetInputError from '@/Components/InputError.svelte'
    import JetLabel from '@/Components/Label.svelte'

    const form = useForm({
        password: '',
    })

    let passwordInput

    const submit = () => {
        $form.post(route('password.confirm'), {
            onError: () => {
                $form.reset()

                passwordInput.focus()
            },
        })
    }
</script>

<svelte:head>
    <title>Secure area</title>
</svelte:head>

<JetAuthenticationCard>
    <svelte:fragment slot="logo">
        <JetAuthenticationCardLogo />
    </svelte:fragment>

    <div class="mb-4 text-sm text-gray-600">
        This is a secure area of the application. Please confirm your password before continuing.
    </div>

    <form on:submit|preventDefault={submit}>
        <div>
            <JetLabel for="password" value="Password" />
            <JetInput
                id="password"
                bind:this={passwordInput}
                bind:value={$form.password}
                type="password"
                class="mt-1 block w-full"
                required
                autocomplete="current-password"
                autofocus />
            <JetInputError class="mt-2" message={$form.errors.password} />
        </div>

        <div class="flex justify-end mt-4">
            <JetButton class="ml-4 { $form.processing ? 'opacity-25' : ''}" disabled={$form.processing}>
                Confirm
            </JetButton>
        </div>
    </form>
</JetAuthenticationCard>
