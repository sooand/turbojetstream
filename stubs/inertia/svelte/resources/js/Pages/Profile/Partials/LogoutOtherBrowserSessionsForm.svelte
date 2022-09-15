<script>
    import route from 'ziggy-js'
    import { useForm } from '@inertiajs/inertia-svelte'
    import JetActionMessage from '@/Components/ActionMessage.svelte'
    import JetActionSection from '@/Components/ActionSection.svelte'
    import JetButton from '@/Components/Button.svelte'
    import JetDialogModal from '@/Components/DialogModal.svelte'
    import JetInput from '@/Components/Input.svelte'
    import JetInputError from '@/Components/InputError.svelte'
    import JetSecondaryButton from '@/Components/SecondaryButton.svelte'

    export let sessions = []

    let confirmingLogout = false
    let passwordInput = null

    const form = useForm({
        password: '',
    })

    const confirmLogout = () => {
        confirmingLogout = true

        setTimeout(() => passwordInput.focus(), 250)
    }

    const logoutOtherBrowserSessions = () => {
        $form.delete(route('other-browser-sessions.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.focus(),
            onFinish: () => $form.reset(),
        })
    }

    const closeModal = () => {
        confirmingLogout = false

        $form.reset()
    }
</script>

<JetActionSection
    title="Browser Sessions"
    description="Manage and log out your active sessions on other browsers and devices.">

    <svelte:fragment slot="content">
        <div class="max-w-xl text-sm text-gray-600">
            If necessary, you may log out of all of your other browser sessions across all of your devices. Some of your recent sessions are listed below; however, this list may not be exhaustive. If you feel your account has been compromised, you should also update your password.
        </div>

        <!-- Other Browser Sessions -->
        {#if sessions.length > 0}
            <div class="mt-5 space-y-6">
                {#each sessions as session}
                    <div class="flex items-center">
                        <div>
                            {#if session.agent.is_desktop}
                                <svg
                                    fill="none"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    class="w-8 h-8 text-gray-500">
                                    <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            {:else}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    stroke-width="2"
                                    stroke="currentColor"
                                    fill="none"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    class="w-8 h-8 text-gray-500">
                                    <path d="M0 0h24v24H0z" stroke="none" />
                                    <rect
                                        x="7"
                                        y="4"
                                        width="10"
                                        height="16"
                                        rx="1"/>
                                        <path d="M11 5h2M12 17v.01" />
                                </svg>
                            {/if}
                        </div>

                        <div class="ml-3">
                            <div class="text-sm text-gray-600">
                                { session.agent.platform ? session.agent.platform : 'Unknown' } - { session.agent.browser ? session.agent.browser : 'Unknown' }
                            </div>

                            <div>
                                <div class="text-xs text-gray-500">
                                    { session.ip_address },

                                    {#if session.is_current_device}
                                    <span class="text-green-500 font-semibold">This device</span>
                                    {:else}
                                        <span>Last active { session.last_active }</span>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}

        <div class="flex items-center mt-5">
            <JetButton on:click={confirmLogout}>
                Log Out Other Browser Sessions
            </JetButton>

            <JetActionMessage on={$form.recentlySuccessful} class="ml-3">
                Done.
            </JetActionMessage>
        </div>

        <!-- Log Out Other Devices Confirmation Modal -->
        <JetDialogModal show={confirmingLogout} on:close={closeModal}>
            <svelte:fragment slot="title">
                Log Out Other Browser Sessions
            </svelte:fragment>

            <svelte:fragment slot="content">
                Please enter your password to confirm you would like to log out of your other browser sessions across all of your devices.

                <div class="mt-4">
                    <JetInput
                        bind:this={passwordInput}
                        bind:value={$form.password}
                        type="password"
                        class="mt-1 block w-3/4"
                        placeholder="Password"
                        on:keyup={(e) => e.key === 'Enter' && logoutOtherBrowserSessions()} />

                    <JetInputError message={$form.errors.password} class="mt-2" />
                </div>
            </svelte:fragment>

            <svelte:fragment slot="footer">
                <JetSecondaryButton on:click={closeModal}>
                    Cancel
                </JetSecondaryButton>

                <JetButton
                    class="ml-3 { $form.processing ? 'opacity-25' : ''}"
                    disabled={$form.processing}
                    on:click={logoutOtherBrowserSessions} >
                    Log Out Other Browser Sessions
                </JetButton>
            </svelte:fragment>
        </JetDialogModal>
    </svelte:fragment>
</JetActionSection>
