<script>
    import AppLayout from '@/Layouts/AppLayout.svelte'
    import DeleteTeamForm from '@/Pages/Teams/Partials/DeleteTeamForm.svelte'
    import JetSectionBorder from '@/Components/SectionBorder.svelte'
    import TeamMemberManager from '@/Pages/Teams/Partials/TeamMemberManager.svelte'
    import UpdateTeamNameForm from '@/Pages/Teams/Partials/UpdateTeamNameForm.svelte'

    export let team = {}
    export let availableRoles = []
    export let permissions = {}
</script>

<AppLayout title="Team Settings">
    <div class="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
        <UpdateTeamNameForm {team} {permissions} />

        <TeamMemberManager
            class="mt-10 sm:mt-0"
            {team}
            availableRoles={availableRoles}
            userPermissions={permissions} />

        {#if permissions.canDeleteTeam && ! team.personal_team}
            <JetSectionBorder />

            <DeleteTeamForm class="mt-10 sm:mt-0" team={team} />
        {/if}
    </div>
</AppLayout>
