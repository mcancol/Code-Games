<?php 
	require_once('common.php');
?>
<html>
	<head>
		<title>Datasets</title>
	</head>
	<body>
		<h1>Datasets</h1>
		
		<ul>
<?php
	$entries = find_datasets('datasets');

	if(count($entries) == 0)
		echo("<li>No datasets found</li>");
	
	foreach($entries as $entry)
	{
		$timestamp_str = date("F d Y", $entry['timestamp']) . " at " . date("H:i", $entry['timestamp']);
		if($player)
			echo("<li><a href='datasets/" . $entry['filename'] .  "'>" . $timestamp_str . ", player " . $entry['player'] . " </li>");
		else
			echo("<li><a href='datasets/" . $entry['filename'] .  "'>" . $timestamp_str . "</li>");
	}
?>
		</ul>
	</body>
</html>