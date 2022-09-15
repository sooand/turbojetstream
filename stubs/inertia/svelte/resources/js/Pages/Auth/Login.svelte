<script>
    import route from 'ziggy-js'
    import { Link, useForm } from '@inertiajs/inertia-svelte'
    import JetAuthenticationCard from '@/Components/AuthenticationCard.svelte'
    import JetAuthenticationCardLogo from '@/Components/AuthenticationCardLogo.svelte'
    import JetButton from '@/Components/Button.svelte'
    import JetInput from '@/Components/Input.svelte'
    import JetInputError from '@/Components/InputError.svelte'
    import JetCheckbox from '@/Components/Checkbox.svelte'
    import JetLabel from '@/Components/Label.svelte'

    export let canResetPassword = false
    export let status = ""

    const form = useForm({
        email: '',
        password: '',
        remember: false,
    })

    const submit = () => {
        $form.transform(data => ({
            ...data,
            remember: $form.remember ? 'on' : '',
        })).post(route('login'), {
            onFinish: () => $form.reset('password'),
        })
    }
</script>

<svelte:head>
    <title>Log in</title>
</svelte:head>

<JetAuthenticationCard>
    <svelte:fragment slot="logo">
        <JetAuthenticationCardLogo />
    </svelte:fragment>

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

        <div class="mt-4">
            <JetLabel for="password" value="Password" />
            <JetInput
                id="password"
                bind:value={$form.password}
                type="password"
                class="mt-1 block w-full"
                required
                autocomplete="current-password" />
            <JetInputError class="mt-2" message={$form.errors.password} />
        </div>

        <div class="block mt-4">
            <label class="flex items-center" for="remember">
                <JetCheckbox id="remember" bind:checked={$form.remember} name="remember" />
                <span class="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
        </div>

        <div class="flex items-center justify-end mt-4">
            {#if canResetPassword}
                <Link href={route('password.request')} class="underline text-sm text-gray-600 hover:text-gray-900">
                    Forgot your password?
                </Link>
            {/if}

            <JetButton class="ml-4 { $form.processing ? 'opacity-25' : '' }" disabled={$form.processing}>
                Log in
            </JetButton>
        </div>
    </form>
</JetAuthenticationCard>
