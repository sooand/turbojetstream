<script>
    import route from 'ziggy-js'
    import { useForm } from '@inertiajs/inertia-svelte'
    import JetAuthenticationCard from '@/Components/AuthenticationCard.svelte'
    import JetAuthenticationCardLogo from '@/Components/AuthenticationCardLogo.svelte'
    import JetButton from '@/Components/Button.svelte'
    import JetInput from '@/Components/Input.svelte'
    import JetInputError from '@/Components/InputError.svelte'
    import JetLabel from '@/Components/Label.svelte'

    export let status = ""

    const form = useForm({
        email: '',
    })

    const submit = () => {
        $form.post(route('password.email'))
    }
</script>

<svelte:head>
    <title>Forgot password</title>
</svelte:head>

<JetAuthenticationCard>
    <svelte:fragment slot="logo">
        <JetAuthenticationCardLogo />
    </svelte:fragment>

    <div class="mb-4 text-sm text-gray-600">
        Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.
    </div>

    {#if status}
        <div class="mb-4 font-medium text-sm text-green-600">
            { status }
        </div>
    {/if}

    <form on:submit|preventDefault={submit}>
        <div>
            <JetLabel for="email" value="Email" />
            <JetInput
                id="email"
                bind:value={$form.email}
                type="email"
                class="mt-1 block w-full"
                required
                autofocus />
            <JetInputError class="mt-2" message={$form.errors.email} />
        </div>

        <div class="flex items-center justify-end mt-4">
            <JetButton class="{ $form.processing ? 'opacity-25' : ''}" disabled={$form.processing}>
                Email Password Reset Link
            </JetButton>
        </div>
    </form>
</JetAuthenticationCard>
