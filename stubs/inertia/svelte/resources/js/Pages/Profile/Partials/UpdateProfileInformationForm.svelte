<script>
    import route from 'ziggy-js'
    import { Inertia } from '@inertiajs/inertia'
    import { page, Link, useForm } from '@inertiajs/inertia-svelte'
    import JetButton from '@/Components/Button.svelte'
    import JetFormSection from '@/Components/FormSection.svelte'
    import JetInput from '@/Components/Input.svelte'
    import JetInputError from '@/Components/InputError.svelte'
    import JetLabel from '@/Components/Label.svelte'
    import JetActionMessage from '@/Components/ActionMessage.svelte'
    import JetSecondaryButton from '@/Components/SecondaryButton.svelte'

    export let user = {}

    let verificationLinkSent = false
    let photoPreview;
    let photoInput

    const form = useForm({
        _method: 'PUT',
        name: user.name,
        email: user.email,
        photo: null,
    })


    const updateProfileInformation = () => {
        if (photoInput) {
            $form.photo = photoInput.files[0]
        }

        $form.post(route('user-profile-information.update'), {
            errorBag: 'updateProfileInformation',
            preserveScroll: true,
            onSuccess: () => clearPhotoFileInput(),
        })
    }

    const sendEmailVerification = () => {
        verificationLinkSent = true
    }

    const selectNewPhoto = () => {
        photoInput.click()
    }

    const updatePhotoPreview = () => {
        const photo = photoInput.files[0]

        if (! photo) return

        const reader = new FileReader()

        reader.onload = (e) => {
            photoPreview = e.target.result
        }

        reader.readAsDataURL(photo)
    }

    const deletePhoto = () => {
        Inertia.delete(route('current-user-photo.destroy'), {
            preserveScroll: true,
            onSuccess: () => {
                photoPreview = null
                clearPhotoFileInput()
            },
        })
    }

    const clearPhotoFileInput = () => {
        if (photoInput?.value) {
            photoInput.value = null
        }
    }
</script>

<JetFormSection on:submitted={updateProfileInformation}
    title="Profile Information"
    description="Update your account's profile information and email address.">

    <svelte:fragment slot="form">
        <!-- Profile Photo -->
        {#if $page.props.jetstream.managesProfilePhotos}
            <div class="col-span-6 sm:col-span-4">
                <!-- Profile Photo File Input -->
                <input
                    bind:this={photoInput}
                    type="file"
                    class="hidden"
                    on:change={updatePhotoPreview}>

                <JetLabel for="photo" value="Photo" />

                <!-- Current Profile Photo -->
                {#if !photoPreview}
                    <div class="mt-2">
                        <img src={user.profile_photo_url} alt={user.name} class="rounded-full h-20 w-20 object-cover">
                    </div>

                {:else}
                    <!-- New Profile Photo Preview -->
                    <div class="mt-2">
                        <span
                            class="block rounded-full w-20 h-20 bg-cover bg-no-repeat bg-center"
                            style={'background-image: url(\'' + photoPreview + '\');'}/>
                    </div>
                {/if}

                <JetSecondaryButton class="mt-2 mr-2" type="button" on:click={selectNewPhoto}>
                    Select A New Photo
                </JetSecondaryButton>

                {#if user.profile_photo_path}
                    <JetSecondaryButton
                        type="button"
                        class="mt-2"
                        on:click={deletePhoto}>
                        Remove Photo
                    </JetSecondaryButton>
                {/if}

                <JetInputError message={$form.errors.photo} class="mt-2" />
            </div>
        {/if}

        <!-- Name -->
        <div class="col-span-6 sm:col-span-4">
            <JetLabel for="name" value="Name" />
            <JetInput
                id="name"
                bind:value={$form.name}
                type="text"
                class="mt-1 block w-full"
                autocomplete="name"/>
            <JetInputError message={$form.errors.name} class="mt-2" />
        </div>

        <!-- Email -->
        <div class="col-span-6 sm:col-span-4">
            <JetLabel for="email" value="Email" />
            <JetInput
                id="email"
                bind:value={$form.email}
                type="email"
                class="mt-1 block w-full"/>
            <JetInputError message={$form.errors.email} class="mt-2" />

            {#if $page.props.jetstream.hasEmailVerification && user.email_verified_at === null}
                <div>
                    <p class="text-sm mt-2">
                        Your email address is unverified.

                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            class="underline text-gray-600 hover:text-gray-900"
                            on:click={sendEmailVerification}>
                            Click here to re-send the verification email.
                        </Link>
                    </p>

                    {#if verificationLinkSent}
                        <div class="mt-2 font-medium text-sm text-green-600">
                            A new verification link has been sent to your email address.
                        </div>
                    {/if}
                </div>
            {/if}
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
