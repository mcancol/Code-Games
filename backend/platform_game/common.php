<?php
	function compare_timestamps($t1, $t2)
	{
		if($t1 < $t2)
			return -1;
		elseif($t1 > $t2)
			return 1;
		
		return 0;
	}
	

	function find_datasets($directory)
	{
		// List files
		$did = opendir($directory);
		$entries = [];
		while($dentry = readdir($did)) {
			if($dentry[0] == '.')
				continue;
			
			$timestamp = strtok($dentry, "_");
			$player = strtok("_");
			
			$entries[] = array(
					'timestamp' => $timestamp, 
					'player' => $player,
					'filename' => $dentry
			);
		}
		
		// Sort by timestamp
		usort($entries, compare_timestamps);
		
		return $entries;		
	}

	
	function append_data_to_file($request, $get_filename, $write_header, $write_data)
	{
		header("Access-Control-Allow-Origin: *");
			
		// Get level and game ids
		if(!array_key_exists('level', $_GET)) {
			echo(json_encode(array("error" => "No level specified")));
			return;
		}
	
		if(!array_key_exists('game', $_GET)) {
			echo(json_encode(array("error" => "No game specified")));
			return;
		}
	
		$info['level_id'] = intval($_GET['level']);
		$info['game_id'] = intval($_GET['game']);

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
