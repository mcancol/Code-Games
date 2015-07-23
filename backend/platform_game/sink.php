<?php
	error_reporting(E_ALL);
	require_once('common.php');
	
	function get_filename($info)
	{
		return sprintf('datasets/%s_%s_%s_%s_%s.log', $info['game_id'], $info['session_id'], $info['user_id'], $info['level_name'], $info['debug'] == 'true'?'1':'0');
	}
	
	
	function write_header($fid, $info) 
	{
		fprintf($fid, 
				"# Alien girl game\n" .
				"# Game: %s\n" .
				"# Session: %s\n" .
				"# User: %s\n" .
				"# Level: %s\n" .
				"# Debug: %s\n" .
				"# Timestamp: %s\n" . 
				"# Source: %s\n\n",
			$info['game_id'],
			$info['session_id'],
			$info['user_id'],
			$info['level_name'],
			$info['debug'],
			date("c"),
			$_SERVER['REMOTE_ADDR']
		);
		
		fprintf($fid, "Move, Timestamp, X, Y, Event\n");
	}
	
	
	function write_data($fid, $info, $item) 
	{
		// Extract milliseconds
		$milli = ($item['timestamp'] - floor($item['timestamp'])) * 1000;
		$timestamp = date('Y-m-d\TH:i:s.', $item['timestamp']) .
			floor($milli) .
			date('P', $item['timestamp']);
		
		
		fprintf($fid, "%d, %s, %.2f, %.2f, %s\n", 
			$item['id'], $timestamp, 
			$item['x'], $item['y'], $item['event']);		
	}


	$data = json_decode(file_get_contents('php://input'), true);
	append_data_to_file($data, get_filename, write_header, write_data);
