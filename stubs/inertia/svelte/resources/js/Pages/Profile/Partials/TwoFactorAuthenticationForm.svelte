<script>
    import { Inertia } from '@inertiajs/inertia'
    import { useForm, page } from '@inertiajs/inertia-svelte'
    import JetActionSection from '@/Components/ActionSection.svelte'
    import JetButton from '@/Components/Button.svelte'
    import JetConfirmsPassword from '@/Components/ConfirmsPassword.svelte'
    import JetDangerButton from '@/Components/DangerButton.svelte'
    import JetInput from '@/Components/Input.svelte'
    import JetInputError from '@/Components/InputError.svelte'
    import JetLabel from '@/Components/Label.svelte'
    import JetSecondaryButton from '@/Components/SecondaryButton.svelte'

    export let requiresConfirmation = false

    let enabling = false
    let confirming = false
    let disabling = false
    let qrCode
    let setupKey
    let recoveryCodes = []

    const confirmationForm = useForm({
        code: '',
    })

    $: twoFactorEnabled = !enabling && $page.props.user?.two_factor_enabled
    $: twoFactorEnabled, () => {
        if (! twoFactorEnabled) {
            $confirmationForm.reset()
            $confirmationForm.clearErrors()
        }
    }

    const enableTwoFactorAuthentication = () => {
        enabling = true

        Inertia.post('/user/two-factor-authentication', {}, {
            preserveScroll: true,
            onSuccess: () => Promise.all([
                showQrCode(),
                showSetupKey(),
                showRecoveryCodes(),
            ]),
            onFinish: () => {
                enabling = false;
                confirming = requiresConfirmation;
            },
        })
    }

    const showQrCode = () => {
        return axios.get('/user/two-factor-qr-code').then(response => {
            qrCode = response.data.svg;
        })
    }

    const showSetupKey = () => {
        return axios.get('/user/two-factor-secret-key').then(response => {
            setupKey = response.data.secretKey
        })
    }

    const showRecoveryCodes = () => {
        return axios.get('/user/two-factor-recovery-codes').then(response => {
            recoveryCodes = response.data;
        })
    }

    const confirmTwoFactorAuthentication = () => {
        $confirmationForm.post('/user/confirmed-two-factor-authentication', {
            errorBag: "confirmTwoFactorAuthentication",
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                confirming = false
                qrCode = null
                setupKey = null
            },
        })
    }

    const regenerateRecoveryCodes = () => {
        axios
            .post('/user/two-factor-recovery-codes')
            .then(() => showRecoveryCodes());
    }

    const disableTwoFactorAuthentication = () => {
        disabling = true

        Inertia.delete('/user/two-factor-authentication', {
            preserveScroll: true,
            onSuccess: () => {
                disabling = false
                confirming = false
            },
        })
    }
</script>

<JetActionSection
    title="Two Factor Authentication"
    description="Add additional security to your account using two factor authentication.">

    <svelte:fragment slot="content">
        {#if twoFactorEnabled && ! confirming}
            <h3 class="text-lg font-medium text-gray-900">
                You have enabled two factor authentication.
            </h3>
        {:else if twoFactorEnabled && confirming}
            <h3 class="text-lg font-medium text-gray-900">
                Finish enabling two factor authentication.
            </h3>
        {:else}
            <h3 class="text-lg font-medium text-gray-900">
                You have not enabled two factor authentication.
            </h3>
        {/if}

        <div class="mt-3 max-w-xl text-sm text-gray-600">
            <p>
                When two factor authentication is enabled, you will be prompted for a secure, random token during authentication. You may retrieve this token from your phone's Google Authenticator application.
            </p>
        </div>

        {#if twoFactorEnabled}
            {#if qrCode}
                <div class="mt-4 max-w-xl text-sm text-gray-600">
                    {#if confirming}
                        <p class="font-semibold">
                            To finish enabling two factor authentication, scan the following QR code using your phone's authenticator application or enter the setup key and provide the generated OTP code.
                        </p>
                    {:else}
                        <p>
                            Two factor authentication is now enabled. Scan the following QR code using your phone's authenticator application or enter the setup key.
                        </p>
                    {/if}
                </div>

                <div class="mt-4">{@html qrCode}</div>

                {#if setupKey}
                    <div class="mt-4 max-w-xl text-sm text-gray-600">
                        <p class="font-semibold">
                            Setup Key: <span>{@html setupKey}</span>
                        </p>
                    </div>
                {/if}

                {#if confirming}
                    <div class="mt-4">
                        <JetLabel for="code" value="Code" />

                        <JetInput
                            id="code"
                            bind:value={$confirmationForm.code}
                            type="text"
                            name="code"
                            class="block mt-1 w-1/2"
                            inputmode="numeric"
                            autofocus
                            autocomplete="one-time-code"
                            on:keyup={(e) => e.key === 'Enter' && confirmTwoFactorAuthentication()}/>

                        <JetInputError message={$confirmationForm.errors.code} class="mt-2" />
                    </div>
                {/if}
            {/if}

            {#if recoveryCodes.length > 0 && ! confirming}
                <div class="mt-4 max-w-xl text-sm text-gray-600">
                    <p class="font-semibold">
                        Store these recovery codes in a secure password manager. They can be used to recover access to your account if your two factor authentication device is lost.
                    </p>
                </div>

                <div class="grid gap-1 max-w-xl mt-4 px-4 py-4 font-mono text-sm bg-gray-100 rounded-lg">
                    {#each recoveryCodes as code}
                        <div>
                            { code }
                        </div>
                    {/each}
                </div>
            {/if}
        {/if}

        <div class="mt-5">
            {#if ! twoFactorEnabled}
                <JetConfirmsPassword on:confirmed={enableTwoFactorAuthentication}>
                    <JetButton type="button" class="{ enabling ? 'opacity-25' : ''}" disabled={enabling}>
                        Enable
                    </JetButton>
                </JetConfirmsPassword>
           {:else}
                <JetConfirmsPassword on:confirmed={confirmTwoFactorAuthentication}>
                    {#if confirming}
                        <JetButton
                            type="button"
                            class="mr-3 { enabling ? 'opacity-25' : ''}"
                            disabled={enabling}>
                            Confirm
                        </JetButton>
                    {/if}
                </JetConfirmsPassword>

                <JetConfirmsPassword on:confirmed={regenerateRecoveryCodes}>
                    {#if recoveryCodes.length > 0 && ! confirming}
                        <JetSecondaryButton class="mr-3">
                            Regenerate Recovery Codes
                        </JetSecondaryButton>
                    {/if}
                </JetConfirmsPassword>

                <JetConfirmsPassword on:confirmed={showRecoveryCodes}>
                    {#if recoveryCodes.length === 0 && ! confirming}
                        <JetSecondaryButton class="mr-3">
                            Show Recovery Codes
                        </JetSecondaryButton>
                    {/if}
                </JetConfirmsPassword>

                <JetConfirmsPassword on:confirmed={disableTwoFactorAuthentication}>
                    {#if confirming}
                        <JetSecondaryButton
                            class="{ disabling ? 'opacity-25' : ''}"
                            disabled={disabling}>
                            Cancel
                        </JetSecondaryButton>
                    {/if}
                </JetConfirmsPassword>

                <JetConfirmsPassword on:confirmed={disableTwoFactorAuthentication}>
                    {#if ! confirming}
                        <JetDangerButton
                            class="{ disabling ? 'opacity-25' : ''}"
                            :disabled="disabling">
                            Disable
                        </JetDangerButton>
                    {/if}
                </JetConfirmsPassword>
            {/if}
        </div>
    </svelte:fragment>
</JetActionSection>
