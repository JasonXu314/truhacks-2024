<script lang="ts">
	export let fields: FullField[];
</script>

<form action="/api/fields" method="post">
	<label>
		Name
		<input type="text" name="name" />
	</label>

	<button type="submit">Create</button>
</form>

<table>
	<thead>
		<tr>
			<th scope="col">ID</th>
			<th scope="col">Name</th>
		</tr>
	</thead>
	<tbody>
		{#each fields as field}
			<tr>
				<td><a href="/fields/{field.id}">{field.id}</a></td>
				<td>{field.name}</td>
			</tr>
		{/each}
	</tbody>
</table>
