<?php
	function compare_timestamps($t1, $t2)
	{
		if($t1 < $t2)
			return -1;
		elseif($t1 > $t2)
			return 1;
		
		return 0;
	}
	
	
	function format_size($size) {
		$units = array('B', 'KiB', 'MiB', 'GiB', 'TiB');
		
		$pow = floor(($size ? log($size) : 0) / log(1024));
		$pow = min($pow, count($units) - 1);
		
		$size /= pow(1024, $pow);
		
		return round($size, 2) . ' ' . $units[$pow];
	}
	

	function find_datasets($directory)
	{
		// List files
		$did = opendir($directory);
		$entries = [];
		while($dentry = readdir($did)) {
			if($dentry[0] == '.')
				continue;
						
			$game = strtok($dentry, "_");
			$user = strtok("_");
			$level = strtok("_");
			$debug = strtok(".");
			
			$timestamp = base_convert($game, 36, 10);
			
			$entries[] = array(
					'timestamp' => $timestamp, 
					'game' => $game,
					'user' => $user,
					'level' => $level,
					'debug' => $debug,
					'size' => filesize($directory . '/' . $dentry),
					'filename' => $dentry
			);
		}
		
		// Sort by timestamp
		usort($entries, 'compare_timestamps');
		
		return $entries;		
	}

	
	function append_data_to_file($request, $get_filename, $write_header, $write_data)
	{
		header("Access-Control-Allow-Origin: *");
			
		// Get IDs from server		
		$info['game_id']    = filter_input(INPUT_GET, 'game', FILTER_VALIDATE_REGEXP, array("options" => array('regexp' => '/^([A-Za-z0-9]+)$/')));
		$info['user_id']    = filter_input(INPUT_GET, 'user', FILTER_VALIDATE_REGEXP, array("options" => array('regexp' => '/^([A-Za-z0-9]+)$/')));
		$info['level_name'] = filter_input(INPUT_GET, 'level', FILTER_VALIDATE_REGEXP, array("options" => array('regexp' => '/^([A-Za-z0-9]+)$/')));
		$info['debug']      = filter_input(INPUT_GET, 'debug', FILTER_VALIDATE_REGEXP, array("options" => array('regexp' => '/^([A-Za-z]+)$/')));
		
		// Make sure correct values were passed
		if($info['game_id'] == null) {
			echo(json_encode(array("error" => "No or invalid game specified")));
			return;
		}

		if($info['user_id'] == null) {
			echo(json_encode(array("error" => "No or invalid user specified")));
			return;
		}
		
		if($info['level_name'] == null) {
			echo(json_encode(array("error" => "No or invalid level specified")));
			return;
		}		
		
		
		// Decode input			
		if($request == null) {
			echo(json_encode(array("error" => "Invalid JSON")));
			return;
		}
	
		// Write moves to log file
		$filename = $get_filename($info);
		
		if($filename == '') {
			echo(json_encode(array("error" => "Invalid filename")));
			return;
		}
					
		$reply = array();
	
		if(!file_exists($filename)) {
			$fid = fopen($filename, 'w');
			$write_header($fid, $info);
		}
	
		$fid = fopen($filename, 'a');
		
		if(!$fid) {
			echo(json_encode(array("error" => "Failed to open: " . $filename)));
			return;
		}
	
		foreach($request as $item) {
			$write_data($fid, $info, $item);
			$reply[] = $item['id'];
		}
	
		fclose($fid);
	
		echo(json_encode($reply));
	}
