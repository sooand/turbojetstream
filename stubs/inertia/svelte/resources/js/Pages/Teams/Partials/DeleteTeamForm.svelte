<script>
    import route from 'ziggy-js'
    import { useForm } from '@inertiajs/inertia-svelte'
    import JetActionSection from '@/Components/ActionSection.svelte'
    import JetConfirmationModal from '@/Components/ConfirmationModal.svelte'
    import JetDangerButton from '@/Components/DangerButton.svelte'
    import JetSecondaryButton from '@/Components/SecondaryButton.svelte'

    export let team = {}

    let confirmingTeamDeletion = false
    const form = useForm()

    const confirmTeamDeletion = () => {
        confirmingTeamDeletion = true
    }

    const deleteTeam = () => {
        $form.delete(route('teams.destroy', team), {
            errorBag: 'deleteTeam',
        })
    }
</script>

<JetActionSection
    title="Delete Team"
    description="Permanently delete this team.">

    <svelte:fragment slot="content">
        <div class="max-w-xl text-sm text-gray-600">
            Once a team is deleted, all of its resources and data will be permanently deleted. Before deleting this team, please download any data or information regarding this team that you wish to retain.
        </div>

        <div class="mt-5">
            <JetDangerButton on:click={confirmTeamDeletion}>
                Delete Team
            </JetDangerButton>
        </div>

        <!-- Delete Team Confirmation Modal -->
        <JetConfirmationModal show={confirmingTeamDeletion} on:close={() => confirmingTeamDeletion = false}>
            <svelte:fragment slot="title">
                Delete Team
            </svelte:fragment>

            <svelte:fragment slot="content">
                Are you sure you want to delete this team? Once a team is deleted, all of its resources and data will be permanently deleted.
            </svelte:fragment>

            <svelte:fragment slot="footer">
                <JetSecondaryButton on:click={() => confirmingTeamDeletion = false}>
                    Cancel
                </JetSecondaryButton>

                <JetDangerButton
                    class="ml-3 { $form.processing ? 'opacity-25' : ''}"
                    disabled={$form.processing}
                    on:click={deleteTeam}>
                    Delete Team
                </JetDangerButton>
            </svelte:fragment>
        </JetConfirmationModal>
    </svelte:fragment>
</JetActionSection>
