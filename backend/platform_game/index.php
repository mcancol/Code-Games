<?php 
	error_reporting(E_ALL);
	require_once('common.php');
?>
<html>
	<head>
		<title>Datasets</title>
		
		<style>
			.debug { color: gray; }
			.debug > td > a:link { color: gray; }
			.debug > td > a:visited { color: gray; }
		</style>
	</head>
	<body>
		<h1>Datasets</h1>
		
		<table>
			<tr>
				<th>Date</th>
				<th>Time</th>
				<th>Game</th>
				<th>User</th>
				<th>Level</th>
				<th>Size</th>
				<th>Debug</th>
			</tr>
				
<?php
	$entries = find_datasets('datasets');

	if(count($entries) == 0)
		echo("<li>No datasets found</li>");

	foreach($entries as $entry)
	{	
		if($entry['debug'])
			echo("<tr class=\"debug\">");
		else
			echo("<tr>");
		echo("<td>" . date("F d Y", $entry['timestamp']) . "</td>");
		echo("<td>" . date("H:i", $entry['timestamp']) . "</td>");
		
		echo("<td><a href=\"datasets/" . $entry['filename'] . "\">" . $entry['game'] . "</td>");	
		echo("<td>" . $entry['user'] . "</td>");
		echo("<td>" . $entry['level'] . "</td>");
		echo("<td align=\"right\">" . format_size($entry['size']) . "</td>");		
		echo("<td>" . ($entry['debug']?"Yes":"No") . "</td>");
		echo("</tr>");
		
	}
?>
		</table>
	</body>
</html>