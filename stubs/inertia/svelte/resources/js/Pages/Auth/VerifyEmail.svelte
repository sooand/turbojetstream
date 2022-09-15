<script>
    import route from 'ziggy-js'
    import { Link, useForm } from '@inertiajs/inertia-svelte'
    import JetAuthenticationCard from '@/Components/AuthenticationCard.svelte'
    import JetAuthenticationCardLogo from '@/Components/AuthenticationCardLogo.svelte'
    import JetButton from '@/Components/Button.svelte'

    export let status = ""

    const form = useForm()

    const submit = () => {
        $form.post(route('verification.send'))
    }

    $: verificationLinkSent = status === 'verification-link-sent'
</script>

<svelte:head>
    <title>Email Verification</title>
</svelte:head>
<JetAuthenticationCard>
    <svelte:fragment slot="logo">
        <JetAuthenticationCardLogo />
    </svelte:fragment>

    <div class="mb-4 text-sm text-gray-600">
        Before continuing, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another.
    </div>

    {#if verificationLinkSent}
        <div class="mb-4 font-medium text-sm text-green-600">
            A new verification link has been sent to the email address you provided in your profile settings.
        </div>
    {/if}

    <form on:submit|preventDefault={submit}>
        <div class="mt-4 flex items-center justify-between">
            <JetButton class="{ $form.processing ? 'opacity-25' : ''}" disabled={$form.processing}>
                Resend Verification Email
            </JetButton>

            <div>
                <Link
                    href={route('profile.show')}
                    class="underline text-sm text-gray-600 hover:text-gray-900">
                    Edit Profile
                </Link>

                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    class="underline text-sm text-gray-600 hover:text-gray-900 ml-2">
                    Log Out
                </Link>
            </div>
        </div>
    </form>
</JetAuthenticationCard>
