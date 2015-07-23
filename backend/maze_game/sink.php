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
				"# Maze game\n" .
				"# Player: %d\n" .
				"# Timestamp: %s\n" . 
				"# Source: %s\n\n", 
			$info['level_id'], 
			date("c", $info['game_id']),
			$_SERVER['REMOTE_ADDR']
		);
		
		fprintf($fid, "Player, Move, Timestamp, X, Y\n");
	}
	
	
	function write_data($fid, $info, $item) 
	{
		fprintf($fid, "%d, %d, %.2f, %d, %d\n", $info['level_id'], $item['id'], $item['timestamp'], $item['x'], $item['y']);		
	}


	$data = json_decode(file_get_contents('php://input'), true);
	append_data_to_file($data, get_filename, write_header, write_data);
