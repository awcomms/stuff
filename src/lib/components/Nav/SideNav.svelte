<script>
	import {
		SideNav,
		SideNavItems,
		SideNavMenu
	} from 'carbon-components-svelte';
	import SideNavLink from './SideNavLink.svelte';

	import { isSideNavOpen } from './store';

	import A2HsLink from './A2HSLink.svelte';
</script>

<SideNav
	bind:isOpen={$isSideNavOpen}
>
	<SideNavItems>
		<A2HsLink />
		<SideNavMenu text="AI Chat">
			<SideNavLink
				menuItem
				text="AI Assistant"
				href="/chat/assistant"
			/>
			<SideNavLink
				menuItem
				text="Custom Character"
				href="/chat/character"
			/>
			<!-- <SideNavLink menuItem text="Completions" href="/openai/completions" /> -->
		</SideNavMenu>
		<!-- <SideNavMenu text="Images"> -->
		
		<!-- </SideNavMenu> -->
		<SideNavLink
			menuItem
			text="DALLE2"
			href="/openai/dalle2"
		/>
		<SideNavLink
			menuItem
			text="Rescale Images"
			href="/images/scale"
		/>
		<!-- <SideNavLink text="Entries" /> -->
	</SideNavItems>
</SideNav>
