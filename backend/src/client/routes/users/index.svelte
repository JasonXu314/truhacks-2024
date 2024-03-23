<script lang="ts">
	export let users: User[];
</script>

<table>
	<thead>
		<tr>
			<th scope="col">ID</th>
			<th scope="col">Name</th>
			<th scope="col">Email</th>
			<th scope="col">Phone</th>
			<th scope="col">Verified Tutor</th>
		</tr>
	</thead>
	<tbody>
		{#each users as user}
			<tr>
				<td>{user.id}</td>
				<td>{user.name}</td>
				<td>{user.email}</td>
				<td>{user.phone}</td>
				<td>{user.verifiedTutor ? '✅' : '❌'}</td>
			</tr>
		{/each}
	</tbody>
</table>
