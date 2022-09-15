<script>
    import route from 'ziggy-js'
    import { Inertia } from '@inertiajs/inertia'
    import { useForm, page } from '@inertiajs/inertia-svelte'
    import JetActionMessage from '@/Components/ActionMessage.svelte'
    import JetActionSection from '@/Components/ActionSection.svelte'
    import JetButton from '@/Components/Button.svelte'
    import JetConfirmationModal from '@/Components/ConfirmationModal.svelte'
    import JetDangerButton from '@/Components/DangerButton.svelte'
    import JetDialogModal from '@/Components/DialogModal.svelte'
    import JetFormSection from '@/Components/FormSection.svelte'
    import JetInput from '@/Components/Input.svelte'
    import JetInputError from '@/Components/InputError.svelte'
    import JetLabel from '@/Components/Label.svelte'
    import JetSecondaryButton from '@/Components/SecondaryButton.svelte'
    import JetSectionBorder from '@/Components/SectionBorder.svelte'

    export let team = {}
    export let availableRoles = []
    export let userPermissions = {}

    let currentlyManagingRole = false
    let managingRoleFor
    let confirmingLeavingTeam = false
    let teamMemberBeingRemoved

    const addTeamMemberForm = useForm({
        email: '',
        role: null,
    })

    const updateRoleForm = useForm({
        role: null,
    })

    const leaveTeamForm = useForm()
    const removeTeamMemberForm = useForm()

    const addTeamMember = () => {
        $addTeamMemberForm.post(route('team-members.store', team), {
            errorBag: 'addTeamMember',
            preserveScroll: true,
            onSuccess: () => $addTeamMemberForm.reset(),
        })
    }

    const cancelTeamInvitation = (invitation) => {
        Inertia.delete(route('team-invitations.destroy', invitation), {
            preserveScroll: true,
        })
    }

    const manageRole = (teamMember) => {
        managingRoleFor = teamMember
        $updateRoleForm.role = teamMember.membership.role
        currentlyManagingRole = true
    }

    const updateRole = () => {
        $updateRoleForm.put(route('team-members.update', [team, managingRoleFor]), {
            preserveScroll: true,
            onSuccess: () => currentlyManagingRole = false,
        })
    }

    const confirmLeavingTeam = () => {
        confirmingLeavingTeam = true
    }

    const leaveTeam = () => {
        $leaveTeamForm.delete(route('team-members.destroy', [team, $page.props.value.user]))
    }

    const confirmTeamMemberRemoval = (teamMember) => {
        teamMemberBeingRemoved = teamMember
    }

    const removeTeamMember = () => {
        $removeTeamMemberForm.delete(route('team-members.destroy', [team, teamMemberBeingRemoved]), {
            errorBag: 'removeTeamMember',
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => teamMemberBeingRemoved = null,
        })
    }

    const displayableRole = (role) => {
        return availableRoles.find(r => r.key === role).name;
    }
</script>

<div>
    {#if userPermissions.canAddTeamMembers}
        <JetSectionBorder />

        <!-- Add Team Member -->
        <JetFormSection on:submitted={addTeamMember}
            title="Add Team Member"
            description="Add a new team mmber to your team, allowing them to collaborate with you.">

            <svelte:fragment slot="form">
                <div class="col-span-6">
                    <div class="max-w-xl text-sm text-gray-600">
                        Please provide the email address of the person you would like to add to this team.
                    </div>
                </div>

                <!-- Member Email -->
                <div class="col-span-6 sm:col-span-4">
                    <JetLabel for="email" value="Email" />
                    <JetInput
                        id="email"
                        bind:value={$addTeamMemberForm.email}
                        type="email"
                        class="mt-1 block w-full" />
                    <JetInputError message={$addTeamMemberForm.errors.email} class="mt-2" />
                </div>

                <!-- Role -->
                {#if availableRoles.length > 0}
                    <div class="col-span-6 lg:col-span-4">
                        <JetLabel for="roles" value="Role" />
                        <JetInputError message={$addTeamMemberForm.errors.role} class="mt-2" />

                        <div class="relative z-0 mt-1 border border-gray-200 rounded-lg cursor-pointer">
                            {#each availableRoles as role, i}
                                <button
                                    type="button"
                                    class="relative px-4 py-3 inline-flex w-full rounded-lg focus:z-10 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 {i > 0 ? 'border-t border-gray-200 rounded-t-none' : ''} {i != Object.keys(availableRoles).length - 1 ? 'rounded-b-none' : ''}"
                                    on:click={$addTeamMemberForm.role = role.key} >
                                    <div class="{$addTeamMemberForm.role && $addTeamMemberForm.role != role.key ? 'opacity-50' : ''}">
                                        <!-- Role Name -->
                                        <div class="flex items-center">
                                            <div class="text-sm text-gray-600 {$addTeamMemberForm.role == role.key ? 'font-semibold' : ''}">
                                                { role.name }
                                            </div>

                                            {#if $addTeamMemberForm.role == role.key}
                                                <svg
                                                    class="ml-2 h-5 w-5 text-green-400"
                                                    fill="none"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24" >
                                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            {/if}
                                        </div>

                                        <!-- Role Description -->
                                        <div class="mt-2 text-xs text-gray-600 text-left">
                                            { role.description }
                                        </div>
                                    </div>
                                </button>
                            {/each}
                        </div>
                    </div>
                {/if}
            </svelte:fragment>

            <svelte:fragment slot="actions">
                <JetActionMessage on={$addTeamMemberForm.recentlySuccessful} class="mr-3">
                    Added.
                </JetActionMessage>

                <JetButton class="{ $addTeamMemberForm.processing ? 'opacity-25' : ''}" disabled={$addTeamMemberForm.processing}>
                    Add
                </JetButton>
            </svelte:fragment>
        </JetFormSection>
    {/if}

    {#if team.team_invitations.length > 0 && userPermissions.canAddTeamMembers}
        <JetSectionBorder />

        <!-- Team Member Invitations -->
        <JetActionSection class="mt-10 sm:mt-0"
            title="Pending Team Invitations"
            description="These people have been invited to your team and have been sent an invitation email. They may join the team by accepting the email invitation.">

            <!-- Pending Team Member Invitation List -->
            <svelte:fragment slot="content">
                <div class="space-y-6">
                    {#each team.team_invitations as invitation}
                        <div class="flex items-center justify-between">
                            <div class="text-gray-600">
                                { invitation.email }
                            </div>

                            <div class="flex items-center">
                                <!-- Cancel Team Invitation -->
                                {#if userPermissions.canRemoveTeamMembers}
                                    <button
                                        class="cursor-pointer ml-6 text-sm text-red-500 focus:outline-none"
                                        on:click={() => cancelTeamInvitation(invitation)} >
                                        Cancel
                                    </button>
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            </svelte:fragment>
        </JetActionSection>
    {/if}

    {#if team.users.length > 0}
        <JetSectionBorder />

        <!-- Manage Team Members -->
        <JetActionSection class="mt-10 sm:mt-0"
            title="Team Members"
            description="All of the people that are part of this team.">

            <!-- Team Member List -->
            <svelte:fragment slot="content">
                <div class="space-y-6">
                    {#each team.users as user}
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <img class="w-8 h-8 rounded-full" src={user.profile_photo_url} alt={user.name}>
                                <div class="ml-4">
                                    { user.name }
                                </div>
                            </div>

                            <div class="flex items-center">
                                <!-- Manage Team Member Role -->
                                {#if userPermissions.canAddTeamMembers && availableRoles.length}
                                    <button
                                        class="ml-2 text-sm text-gray-400 underline"
                                        on:click={() => manageRole(user)}>
                                        { displayableRole(user.membership.role) }
                                    </button>
                                {:else if availableRoles.length}
                                    <div class="ml-2 text-sm text-gray-400">
                                        { displayableRole(user.membership.role) }
                                    </div>
                                {/if}

                                <!-- Leave Team -->
                                {#if $page.props.user.id === user.id}
                                    <button
                                        class="cursor-pointer ml-6 text-sm text-red-500"
                                        on:click={confirmLeavingTeam}>
                                        Leave
                                    </button>
                                {/if}

                                <!-- Remove Team Member -->
                                {#if userPermissions.canRemoveTeamMembers}
                                    <button
                                        class="cursor-pointer ml-6 text-sm text-red-500"
                                        on:click={() => confirmTeamMemberRemoval(user)}>
                                        Remove
                                    </button>
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            </svelte:fragment>
        </JetActionSection>
    {/if}

    <!-- Role Management Modal -->
    <JetDialogModal show={currentlyManagingRole} on:close={() => currentlyManagingRole = false}>
        <svelte:fragment slot="title">
            Manage Role
        </svelte:fragment>

        <svelte:fragment slot="content">
            {#if managingRoleFor}
                <div class="relative z-0 mt-1 border border-gray-200 rounded-lg cursor-pointer">
                    {#each availableRoles as role, i}
                        <button
                            type="button"
                            class="relative px-4 py-3 inline-flex w-full rounded-lg focus:z-10 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 {i > 0 ? 'border-t border-gray-200 rounded-t-none' : ''} {i !== Object.keys(availableRoles).length - 1 ? 'rounded-b-none' : ''}"
                            on:click={() => $updateRoleForm.role = role.key}>
                            <div class="{$updateRoleForm.role && $updateRoleForm.role !== role.key ? 'opacity-50' : ''}">
                                <!-- Role Name -->
                                <div class="flex items-center">
                                    <div class="text-sm text-gray-600 {$updateRoleForm.role === role.key ? 'font-semibold' : ''}">
                                        { role.name }
                                    </div>

                                    {#if $updateRoleForm.role === role.key}
                                        <svg
                                            class="ml-2 h-5 w-5 text-green-400"
                                            fill="none"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    {/if}
                                </div>

                                <!-- Role Description -->
                                <div class="mt-2 text-xs text-gray-600">
                                    { role.description }
                                </div>
                            </div>
                        </button>
                    {/each}
                </div>
            {/if}
        </svelte:fragment>

        <svelte:fragment slot="footer">
            <JetSecondaryButton on:click={() => currentlyManagingRole = false}>
                Cancel
            </JetSecondaryButton>

            <JetButton
                class="ml-3 { $updateRoleForm.processing ? 'opacity-25' : ''}"
                disabled={$updateRoleForm.processing}
                on:click={updateRole}>
                Save
            </JetButton>
        </svelte:fragment>
    </JetDialogModal>

    <!-- Leave Team Confirmation Modal -->
    <JetConfirmationModal show={confirmingLeavingTeam} on:close={() => confirmingLeavingTeam = false}>
        <svelte:fragment slot="title">
            Leave Team
        </svelte:fragment>

        <svelte:fragment slot="content">
            Are you sure you would like to leave this team?
        </svelte:fragment>

        <svelte:fragment slot="footer">
            <JetSecondaryButton on:click={() => confirmingLeavingTeam = false}>
                Cancel
            </JetSecondaryButton>

            <JetDangerButton
                class="ml-3 { $leaveTeamForm.processing ? 'opacity-25' : ''}"
                disabled={$leaveTeamForm.processing}
                on:click={leaveTeam}>
                Leave
            </JetDangerButton>
        </svelte:fragment>
    </JetConfirmationModal>

    <!-- Remove Team Member Confirmation Modal -->
    <JetConfirmationModal show={teamMemberBeingRemoved} on:close={() => teamMemberBeingRemoved = null}>
        <svelte:fragment slot="title">
            Remove Team Member
        </svelte:fragment>

        <svelte:fragment slot="content">
            Are you sure you would like to remove this person from the team?
        </svelte:fragment>

        <svelte:fragment slot="footer">
            <JetSecondaryButton on:click={() => teamMemberBeingRemoved = null}>
                Cancel
            </JetSecondaryButton>

            <JetDangerButton
                class="ml-3 { $removeTeamMemberForm.processing ? 'opacity-25' : ''}"
                disabled={$removeTeamMemberForm.processing}
                on:click={removeTeamMember}>
                Remove
            </JetDangerButton>
        </svelte:fragment>
    </JetConfirmationModal>
</div>
