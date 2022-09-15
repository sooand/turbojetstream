<script>
    import route from 'ziggy-js'
    import { useForm } from '@inertiajs/inertia-svelte'
    import JetAuthenticationCard from '@/Components/AuthenticationCard.svelte'
    import JetAuthenticationCardLogo from '@/Components/AuthenticationCardLogo.svelte'
    import JetButton from '@/Components/Button.svelte'
    import JetInput from '@/Components/Input.svelte'
    import JetInputError from '@/Components/InputError.svelte'
    import JetLabel from '@/Components/Label.svelte'

    let recovery = false
    let codeInput
    let recoveryCodeInput

    const form = useForm({
        code: '',
        recovery_code: '',
    })

    const toggleRecovery = async () => {
        recovery = !recovery

        if (recovery) {
            recoveryCodeInput.focus()
            $form.code = ''
        } else {
            codeInput.focus()
            $form.recovery_code = ''
        }
    }

    const submit = () => {
        $form.post(route('two-factor.login'))
    }
</script>

<svelte:head>
    <title>Two-factor Confirmatino</title>
</svelte:head>

<JetAuthenticationCard>
    <svelte:fragment slot="logo">
        <JetAuthenticationCardLogo />
    </svelte:fragment>

    <div class="mb-4 text-sm text-gray-600">
        {#if ! recovery}
            Please confirm access to your account by entering the authentication code provided by your authenticator application.
        {:else}
            Please confirm access to your account by entering one of your emergency recovery codes.
        {/if}
    </div>

    <form on:submit|preventDefault={submit}>
        {#if ! recovery}
            <JetLabel for="code" value="Code" />
            <JetInput
                id="code"
                bind:this={codeInput}
                bind:value={$form.code}
                type="text"
                inputmode="numeric"
                class="mt-1 block w-full"
                autofocus
                autocomplete="one-time-code" />
            <JetInputError class="mt-2" message={$form.errors.code} />
        {:else}
            <JetLabel for="recovery_code" value="Recovery Code" />
            <JetInput
                id="recovery_code"
                bind:this={recoveryCodeInput}
                bind:value={$form.recovery_code}
                type="text"
                class="mt-1 block w-full"
                autocomplete="one-time-code" />
            <JetInputError class="mt-2" message={$form.errors.recovery_code} />
        {/if}

        <div class="flex items-center justify-end mt-4">
            <button type="button" class="text-sm text-gray-600 hover:text-gray-900 underline cursor-pointer" on:click|preventDefault={toggleRecovery}>
                {#if ! recovery}
                    Use a recovery code
                {:else}
                    Use an authentication code
                {/if}
            </button>

            <JetButton class="ml-4 { $form.processing ? 'opacity-25' : ''}" disabled={$form.processing}>
                Log in
            </JetButton>
        </div>
    </form>
</JetAuthenticationCard>
