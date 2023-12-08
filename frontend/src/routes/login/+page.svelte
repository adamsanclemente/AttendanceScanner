<script lang="ts">
	import { enhance } from "$app/forms";
</script>

<div class="flex justify-center items-center h-screen">
    <div class="w-full max-w-lg">
        <div class="bg-base-200 rounded-lg shadow-lg p-5 md:p-20 mx-2">
            <div class="text-center">
                <h2 class="text-3xl font-bold text-base-content">Log in</h2>
                <p class="text-base-content mt-2">Log in to your account.</p>
            </div>
            <div class="m-7">
                <form method="post" use:enhance>
                    <div class="mb-6">
                        <label for="username" class="block mb-2 text-sm text-gray-600 dark:text-gray-400">Username</label>
                        <input type="text" name="username" id="username" placeholder="Your username" required class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-100 focus:border-indigo-300" />
                    </div>
                    <div class="mb-6">
                        <label for="password" class="block mb-2 text-sm text-gray-600 dark:text-gray-400">Password</label>
                        <input type="password" name="password" id="password" placeholder="Your password" required class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-100 focus:border-indigo-300" />
                    </div>
                    <div class="mb-6">
                        <button type="submit" class="w-full px-3 py-4 text-white bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none">Sign in</button>
                    </div>
                </form>
                <p class="text-sm text-center text-gray-400">Don&#x27;t have an account yet? <a href="/signup" class="text-indigo-400 focus:outline-none focus:underline focus:text-indigo-500 dark:focus:border-indigo-800">Sign up</a>.</p>
            </div>
        </div>
    </div>
</div>