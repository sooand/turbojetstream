<script>
    import route from 'ziggy-js'
    import { useForm } from '@inertiajs/inertia-svelte'
    import JetAuthenticationCard from '@/Components/AuthenticationCard.svelte'
    import JetAuthenticationCardLogo from '@/Components/AuthenticationCardLogo.svelte'
    import JetButton from '@/Components/Button.svelte'
    import JetInput from '@/Components/Input.svelte'
    import JetInputError from '@/Components/InputError.svelte'
    import JetLabel from '@/Components/Label.svelte'

    export let email = ""
    export let token = ""

    const form = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    })

    const submit = () => {
        $form.post(route('password.update'), {
            onFinish: () => $form.reset('password', 'password_confirmation'),
        })
    }
</script>

<svelte:head>
    <title>Reset Password</title>
</svelte:head>

<JetAuthenticationCard>
    <svelte:fragment slot="logo">
        <JetAuthenticationCardLogo />
    </svelte:fragment>

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

        <div class="mt-4">
            <JetLabel for="password" value="Password" />
            <JetInput
                id="password"
                bind:value={$form.password}
                type="password"
                class="mt-1 block w-full"
                required
                autocomplete="new-password" />
            <JetInputError class="mt-2" message={$form.errors.password} />
        </div>

        <div class="mt-4">
            <JetLabel for="password_confirmation" value="Confirm Password" />
            <JetInput
                id="password_confirmation"
                bind:value={$form.password_confirmation}
                type="password"
                class="mt-1 block w-full"
                required
                autocomplete="new-password" />
            <JetInputError class="mt-2" message={$form.errors.password_confirmation} />
        </div>

        <div class="flex items-center justify-end mt-4">
            <JetButton class="{ $form.processing ? 'opacity-25' : ''}" disabled={$form.processing}>
                Reset Password
            </JetButton>
        </div>
    </form>
</JetAuthenticationCard>
