<script>
    import { page } from '@inertiajs/inertia-svelte'
    import AppLayout from '@/Layouts/AppLayout.svelte'
    import DeleteUserForm from '@/Pages/Profile/Partials/DeleteUserForm.svelte'
    import JetSectionBorder from '@/Components/SectionBorder.svelte'
    import LogoutOtherBrowserSessionsForm from '@/Pages/Profile/Partials/LogoutOtherBrowserSessionsForm.svelte'
    import TwoFactorAuthenticationForm from '@/Pages/Profile/Partials/TwoFactorAuthenticationForm.svelte'
    import UpdatePasswordForm from '@/Pages/Profile/Partials/UpdatePasswordForm.svelte'
    import UpdateProfileInformationForm from '@/Pages/Profile/Partials/UpdateProfileInformationForm.svelte'

    export let confirmsTwoFactorAuthentication = false
    export let sessions = []
</script>

<AppLayout title="Profile">
    <div class="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
        {#if $page.props.jetstream.canUpdateProfileInformation}
            <UpdateProfileInformationForm user={$page.props.user} />
            <JetSectionBorder />
        {/if}

        {#if $page.props.jetstream.canUpdatePassword}
            <div class="mt-10 sm:mt-0">
                <UpdatePasswordForm />
                <JetSectionBorder />
            </div>
        {/if}

        {#if $page.props.jetstream.canManageTwoFactorAuthentication}
            <div class="mt-10 sm:mt-0">
                <TwoFactorAuthenticationForm 
                    requiresConfirmation={confirmsTwoFactorAuthentication} />
            </div>
            <JetSectionBorder />
        {/if}

        <div class="mt-10 sm:mt-0">
            <LogoutOtherBrowserSessionsForm {sessions} />
        </div>

        {#if $page.props.jetstream.hasAccountDeletionFeatures}
            <JetSectionBorder />
            <div class="mt-10 sm:mt-0">
                <DeleteUserForm />
            </div>
        {/if}
    </div>
</AppLayout>
