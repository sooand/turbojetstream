<script>
    import route from 'ziggy-js'
    import { Link, useForm, page } from '@inertiajs/inertia-svelte'
    import JetAuthenticationCard from '@/Components/AuthenticationCard.svelte'
    import JetAuthenticationCardLogo from '@/Components/AuthenticationCardLogo.svelte'
    import JetButton from '@/Components/Button.svelte'
    import JetInput from '@/Components/Input.svelte'
    import JetInputError from '@/Components/InputError.svelte'
    import JetCheckbox from '@/Components/Checkbox.svelte'
    import JetLabel from '@/Components/Label.svelte'

    const form = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        terms: false,
    })

    const submit = () => {
        $form.post(route('register'), {
            onFinish: () => $form.reset('password', 'password_confirmation'),
        })
    }
</script>

<svelte:head>
    <title>Register</title>
</svelte:head>

<JetAuthenticationCard>
    <svelte:fragment slot="logo">
        <JetAuthenticationCardLogo />
    </svelte:fragment>

    <form on:submit|preventDefault={submit}>
        <div>
            <JetLabel for="name" value="Name" />
            <JetInput
                id="name"
                bind:value={$form.name}
                type="text"
                class="mt-1 block w-full"
                required
                autofocus
                autocomplete="name" />
            <JetInputError class="mt-2" message={$form.errors.name} />
        </div>

        <div class="mt-4">
            <JetLabel for="email" value="Email" />
            <JetInput
                id="email"
                bind:value={$form.email}
                type="email"
                class="mt-1 block w-full"
                required />
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

        {#if $page.props.jetstream.hasTermsAndPrivacyPolicyFeature}
            <div class="mt-4">
                <JetLabel for="terms">
                    <div class="flex items-center">
                        <JetCheckbox id="terms" bind:checked={$form.terms} name="terms" required />

                        <div class="ml-2">
                            I agree to the <a target="_blank" href={route('terms.show')} class="underline text-sm text-gray-600 hover:text-gray-900">Terms of Service</a> and <a target="_blank" href={route('policy.show')} class="underline text-sm text-gray-600 hover:text-gray-900">Privacy Policy</a>
                        </div>
                    </div>
                    <JetInputError class="mt-2" message={$form.errors.terms} />
                </JetLabel>
            </div>
        {/if}

        <div class="flex items-center justify-end mt-4">
            <Link href={route('login')} class="underline text-sm text-gray-600 hover:text-gray-900">
                Already registered?
            </Link>

            <JetButton class="ml-4 { $form.processing ? 'opacity-25' : '' }" disabled={$form.processing}>
                Register
            </JetButton>
        </div>
    </form>
</JetAuthenticationCard>
