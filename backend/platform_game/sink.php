<?php
	error_reporting(E_ALL);
	require_once('common.php');
	
	function get_filename($info)
	{
		return sprintf('datasets/%d_%d.log', $info['game_id'], $info['level_id']);		
	}
	
	
	function write_header($fid, $info) 
	{
		fprintf($fid, 
				"# Alien girl game\n" .
				"# Level: %s\n" .
				"# Timestamp: %s\n" . 
				"# Source: %s\n\n", 
			$_GET['level'], 
			date("c", $info['game_id']),
			$_SERVER['REMOTE_ADDR']
		);
		
		fprintf($fid, "Move, Timestamp, X, Y, Event\n");
	}
	
	
	function write_data($fid, $info, $item) 
	{
		fprintf($fid, "%d, %.2f, %.2f, %.2f, %s\n", $item['id'], $item['timestamp'], $item['x'], $item['y'], $item['event']);		
	}


	$data = json_decode(file_get_contents('php://input'), true);
	append_data_to_file($data, get_filename, write_header, write_data);
