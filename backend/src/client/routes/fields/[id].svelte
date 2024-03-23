<script lang="ts">
	export let field: FullField;
</script>

<h1>{field.name}</h1>

<form action="/api/fields/{field.id}/subjects" method="post">
	<label>
		Name
		<input type="text" name="name" />
	</label>

	<button type="submit">Create</button>
</form>

<h2>Subjects</h2>
<table>
	<thead>
		<tr>
			<th scope="col">ID</th>
			<th scope="col">Name</th>
		</tr>
	</thead>
	<tbody>
		{#each field.subjects as subject}
			<tr>
				<td>{subject.id}</td>
				<td>{subject.name}</td>
			</tr>
		{/each}
	</tbody>
</table>
