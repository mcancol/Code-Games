<?php 
	error_reporting(E_ALL);
	require_once('common.php');
?>
<html>
	<head>
		<title>Datasets</title>
		
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap-theme.min.css">
		
		<style>
			.debug { color: gray; }
			.debug > td > a:link { color: gray; }
			.debug > td > a:visited { color: gray; }
		</style>
	</head>
	<body>
		<div class="container">
		<div class="row"><div class="col-xs-8">
		<h1>Datasets</h1>
		
		<table class="table">
			<tr>
				<th>Date</th>
				<th>Time</th>
				<th>Game</th>
				<th>Session</th>
				<th>Participant</th>
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
		echo("<td>" . $entry['game'] . "</td>");
		echo("<td><a href=\"datasets/" . $entry['filename'] . "\">" . $entry['session'] . "</td>");	
		echo("<td>" . $entry['user'] . "</td>");
		echo("<td>" . $entry['level'] . "</td>");
		echo("<td>" . format_size($entry['size']) . "</td>");		
		echo("<td>" . ($entry['debug']?"Yes":"No") . "</td>");
		echo("</tr>");
		
	}
?>
		</table>
		</div></div></div>
	</body>
</html>